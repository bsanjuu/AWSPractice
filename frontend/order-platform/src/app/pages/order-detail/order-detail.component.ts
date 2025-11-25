import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Order } from '../../services/api.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <button routerLink="/orders" class="btn-back">
        <i class="fas fa-arrow-left"></i> Back to Orders
      </button>

      <div *ngIf="isLoading" class="spinner"></div>

      <div *ngIf="!isLoading && order" class="order-detail">
        <div class="detail-header">
          <div>
            <h1>{{ order.order_number }}</h1>
            <p>Created: {{ order.created_at | date: 'long' }}</p>
          </div>
          <span class="status" [ngClass]="'status-' + order.status">
            {{ order.status | uppercase }}
          </span>
        </div>

        <div class="detail-grid">
          <div class="detail-card">
            <h3><i class="fas fa-info-circle"></i> Order Information</h3>
            <div class="info-row">
              <label>Order Number:</label>
              <span>{{ order.order_number }}</span>
            </div>
            <div class="info-row">
              <label>Status:</label>
              <span>{{ order.status | uppercase }}</span>
            </div>
            <div class="info-row">
              <label>Amount:</label>
              <span class="amount">\${{ order.amount | number: '1.2-2' }}</span>
            </div>
            <div class="info-row">
              <label>Created Date:</label>
              <span>{{ order.created_at | date: 'medium' }}</span>
            </div>
            <div class="info-row">
              <label>Last Updated:</label>
              <span>{{ order.updated_at | date: 'medium' }}</span>
            </div>
          </div>

          <div class="detail-card">
            <h3><i class="fas fa-file-upload"></i> Documents</h3>
            <div *ngIf="documents.length > 0">
              <ul class="documents-list">
                <li *ngFor="let doc of documents">
                  <i class="fas fa-file"></i>
                  <span>{{ doc.file_name }}</span>
                  <small>{{ doc.uploaded_at | date: 'short' }}</small>
                </li>
              </ul>
            </div>
            <div *ngIf="documents.length === 0" class="empty">
              <p>No documents uploaded</p>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h3><i class="fas fa-clock"></i> Order Timeline</h3>
          <div class="timeline">
            <div class="timeline-item" [ngClass]="getTimelineStatus('pending')">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Order Created</h4>
                <p>{{ order.created_at | date: 'medium' }}</p>
              </div>
            </div>
            <div class="timeline-item" [ngClass]="getTimelineStatus('processing')">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Processing</h4>
                <p *ngIf="order.status !== 'pending'">Order is being processed</p>
                <p *ngIf="order.status === 'pending'">Waiting to be processed...</p>
              </div>
            </div>
            <div class="timeline-item" [ngClass]="getTimelineStatus('shipped')">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Shipped</h4>
                <p *ngIf="order.status === 'shipped' || order.status === 'completed'">Order has been shipped</p>
                <p *ngIf="order.status !== 'shipped' && order.status !== 'completed'">Waiting for shipment...</p>
              </div>
            </div>
            <div class="timeline-item" [ngClass]="getTimelineStatus('completed')">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h4>Completed</h4>
                <p *ngIf="order.status === 'completed'">Order completed</p>
                <p *ngIf="order.status !== 'completed'">Waiting for delivery...</p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn btn-secondary" routerLink="/orders">
            <i class="fas fa-list"></i> Back to Orders
          </button>
          <button class="btn btn-danger" (click)="deleteOrder()">
            <i class="fas fa-trash"></i> Delete Order
          </button>
        </div>
      </div>

      <div *ngIf="!isLoading && !order" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <h2>Order Not Found</h2>
        <button class="btn btn-primary" routerLink="/orders">
          <i class="fas fa-arrow-left"></i> Back to Orders
        </button>
      </div>
    </div>
  `,
  styles: [`
    .btn-back {
      background: none;
      border: none;
      color: #007bff;
      cursor: pointer;
      font-size: 14px;
      padding: 10px 0;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: color 0.3s ease;
    }

    .btn-back:hover {
      color: #0056b3;
    }

    .order-detail {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }

    .detail-header h1 {
      margin: 0;
      color: #333;
      font-size: 32px;
    }

    .detail-header p {
      margin: 8px 0 0 0;
      color: #666;
    }

    .status {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-completed {
      background: #d4edda;
      color: #155724;
    }

    .status-shipped {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-failed {
      background: #f8d7da;
      color: #721c24;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .detail-card {
      background: white;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .detail-card h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row label {
      color: #666;
      font-weight: 600;
    }

    .info-row span {
      color: #333;
      font-weight: 500;
    }

    .amount {
      color: #28a745;
      font-size: 18px;
      font-weight: 700;
    }

    .documents-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .documents-list li {
      padding: 12px;
      background: #f8f9fa;
      border-radius: 5px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .documents-list i {
      color: #007bff;
    }

    .documents-list small {
      color: #999;
      font-size: 12px;
      margin-left: auto;
    }

    .empty {
      text-align: center;
      padding: 20px;
      color: #999;
    }

    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ddd;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 25px;
    }

    .timeline-item.completed .timeline-marker {
      background: #28a745;
      border-color: #28a745;
    }

    .timeline-item.active .timeline-marker {
      background: #007bff;
      border-color: #007bff;
      box-shadow: 0 0 0 6px rgba(0, 123, 255, 0.1);
    }

    .timeline-item.pending .timeline-marker {
      background: #ddd;
      border-color: #ddd;
    }

    .timeline-marker {
      position: absolute;
      left: -26px;
      top: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid #ddd;
      background: white;
    }

    .timeline-content h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-weight: 600;
    }

    .timeline-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .detail-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      flex: 1;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      flex: 1;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .error-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .error-state i {
      font-size: 48px;
      color: #dc3545;
      margin-bottom: 20px;
    }

    .error-state h2 {
      color: #333;
      margin: 0 0 20px 0;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 40px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
        gap: 15px;
      }

      .detail-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  documents: any[] = [];
  isLoading = false;
  orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (this.orderId) {
        this.loadOrder(this.orderId);
        this.loadDocuments(this.orderId);
      }
    });
  }

  loadOrder(orderId: number): void {
    this.isLoading = true;
    this.apiService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.isLoading = false;
      }
    });
  }

  loadDocuments(orderId: number): void {
    this.apiService.getInvoices(orderId).subscribe({
      next: (docs) => {
        this.documents = docs;
      },
      error: (err) => {
        console.error('Error loading documents:', err);
      }
    });
  }

  getTimelineStatus(stage: string): string {
    if (!this.order) return 'pending';
    
    const statuses = ['pending', 'processing', 'shipped', 'completed'];
    const currentIndex = statuses.indexOf(this.order.status);
    const stageIndex = statuses.indexOf(stage);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  }

  deleteOrder(): void {
    if (!this.orderId || !confirm('Are you sure you want to delete this order?')) return;

    this.apiService.deleteOrder(this.orderId).subscribe({
      next: () => {
        alert('Order deleted successfully');
        window.history.back();
      },
      error: (err) => console.error('Error deleting order:', err)
    });
  }
}
