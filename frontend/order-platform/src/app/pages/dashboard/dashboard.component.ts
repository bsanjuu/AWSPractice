import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, User, Order } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p>Welcome back, {{ currentUser?.name }}!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #e3f2fd;">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="stat-content">
            <h3>Total Orders</h3>
            <p class="stat-value">{{ totalOrders }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #f3e5f5;">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>Completed</h3>
            <p class="stat-value">{{ completedOrders }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fff3e0;">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>Pending</h3>
            <p class="stat-value">{{ pendingOrders }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #e8f5e9;">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-content">
            <h3>Total Spent</h3>
            <p class="stat-value">\${{ totalSpent | number: '1.2-2' }}</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <button class="btn btn-primary" routerLink="/orders/create">
          <i class="fas fa-plus"></i> Create New Order
        </button>
        <button class="btn btn-secondary" routerLink="/orders">
          <i class="fas fa-list"></i> View All Orders
        </button>
        <button class="btn btn-secondary" routerLink="/analytics">
          <i class="fas fa-chart-bar"></i> View Analytics
        </button>
      </div>

      <div class="recent-orders">
        <h2><i class="fas fa-history"></i> Recent Orders</h2>

        <div *ngIf="isLoading" class="spinner"></div>

        <table *ngIf="!isLoading && recentOrders.length > 0">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders">
              <td>{{ order.order_number }}</td>
              <td>\${{ order.amount | number: '1.2-2' }}</td>
              <td>
                <span class="status" [ngClass]="'status-' + order.status">
                  {{ order.status | uppercase }}
                </span>
              </td>
              <td>{{ order.created_at | date: 'short' }}</td>
              <td>
                <a [routerLink]="['/orders', order.id]" class="link">View</a>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!isLoading && recentOrders.length === 0" class="empty-state">
          <p><i class="fas fa-inbox"></i> No orders yet. <a routerLink="/orders/create">Create one now!</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dashboard-header p {
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      gap: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #333;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
      font-weight: 600;
    }

    .stat-value {
      margin: 8px 0 0 0;
      font-size: 24px;
      font-weight: 700;
      color: #007bff;
    }

    .dashboard-actions {
      display: flex;
      gap: 15px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .recent-orders {
      background: white;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .recent-orders h2 {
      font-size: 22px;
      margin-bottom: 20px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
    }

    tr:hover {
      background: #f9f9f9;
    }

    .status {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
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

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .empty-state i {
      font-size: 48px;
      margin-bottom: 15px;
      color: #ddd;
    }

    .empty-state a {
      color: #007bff;
      font-weight: 600;
      text-decoration: none;
    }

    .empty-state a:hover {
      text-decoration: underline;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .dashboard-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentOrders: Order[] = [];
  isLoading = false;

  totalOrders = 0;
  completedOrders = 0;
  pendingOrders = 0;
  totalSpent = 0;

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
        this.recentOrders = orders.slice(0, 5);
        this.totalOrders = orders.length;
        this.completedOrders = orders.filter(o => o.status === 'completed').length;
        this.pendingOrders = orders.filter(o => o.status === 'pending').length;
        this.totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }
}
