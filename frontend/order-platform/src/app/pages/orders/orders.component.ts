import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, User, Order } from '../../services/api.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-list"></i> My Orders</h1>
        <button class="btn btn-primary" routerLink="/orders/create">
          <i class="fas fa-plus"></i> Create New Order
        </button>
      </div>

      <div class="filters">
        <input
          type="text"
          placeholder="Search orders..."
          [(ngModel)]="searchTerm"
          (input)="filterOrders()"
          class="search-input"
        />
        <select [(ngModel)]="selectedStatus" (change)="filterOrders()" class="status-filter">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="shipped">Shipped</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div *ngIf="isLoading" class="spinner"></div>

      <div *ngIf="!isLoading && filteredOrders.length > 0" class="orders-list">
        <div class="order-card" *ngFor="let order of filteredOrders">
          <div class="order-header">
            <div>
              <h3>{{ order.order_number }}</h3>
              <p class="order-date">{{ order.created_at | date: 'medium' }}</p>
            </div>
            <span class="status" [ngClass]="'status-' + order.status">
              {{ order.status | uppercase }}
            </span>
          </div>

          <div class="order-details">
            <div class="detail-item">
              <label>Amount:</label>
              <span class="amount">\${{ order.amount | number: '1.2-2' }}</span>
            </div>
            <div class="detail-item">
              <label>Created:</label>
              <span>{{ order.created_at | date: 'short' }}</span>
            </div>
          </div>

          <div class="order-actions">
            <a [routerLink]="['/orders', order.id]" class="btn btn-primary">
              <i class="fas fa-eye"></i> View Details
            </a>
            <button (click)="deleteOrder(order.id)" class="btn btn-danger">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && filteredOrders.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No orders found</h3>
        <p *ngIf="orders.length === 0">You haven't created any orders yet.</p>
        <p *ngIf="orders.length > 0">No orders match your search criteria.</p>
        <a routerLink="/orders/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Create First Order
        </a>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      font-size: 28px;
      color: #333;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
    }

    .search-input, .status-filter {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      transition: border 0.3s ease;
    }

    .search-input {
      flex: 1;
      max-width: 300px;
    }

    .search-input:focus, .status-filter:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .orders-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .order-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .order-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      transform: translateY(-3px);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
    }

    .order-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .order-date {
      margin: 5px 0 0 0;
      font-size: 12px;
      color: #999;
    }

    .status {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
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

    .order-details {
      margin-bottom: 15px;
      flex: 1;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .detail-item label {
      color: #666;
      font-weight: 600;
    }

    .amount {
      color: #28a745;
      font-weight: 700;
      font-size: 18px;
    }

    .order-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-decoration: none;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .empty-state i {
      font-size: 64px;
      color: #ddd;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin: 0 0 10px 0;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 20px;
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
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .filters {
        flex-direction: column;
        width: 100%;
      }

      .search-input {
        max-width: none;
      }

      .order-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  searchTerm = '';
  selectedStatus = '';
  currentUser: User | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.id) {
        this.loadOrders(user.id);
      }
    });
  }

  loadOrders(userId: number): void {
    this.isLoading = true;
    this.apiService.getOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.order_number?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.id?.toString().includes(this.searchTerm);
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  deleteOrder(orderId: number | undefined): void {
    if (!orderId || !confirm('Are you sure you want to delete this order?')) return;

    this.apiService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.filterOrders();
      },
      error: (err) => console.error('Error deleting order:', err)
    });
  }
}
