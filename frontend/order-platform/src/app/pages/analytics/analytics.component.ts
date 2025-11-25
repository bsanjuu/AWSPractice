import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Order, User } from '../../services/api.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-chart-bar"></i> Analytics Dashboard</h1>
      </div>

      <div *ngIf="isLoading" class="spinner"></div>

      <div *ngIf="!isLoading" class="analytics-container">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Orders</h3>
            <p class="stat-value">{{ totalOrders }}</p>
            <small>All time</small>
          </div>

          <div class="stat-card">
            <h3>Total Spent</h3>
            <p class="stat-value">\${{ totalSpent | number: '1.2-2' }}</p>
            <small>Across all orders</small>
          </div>

          <div class="stat-card">
            <h3>Average Order</h3>
            <p class="stat-value">\${{ averageOrder | number: '1.2-2' }}</p>
            <small>Average amount</small>
          </div>

          <div class="stat-card">
            <h3>Completion Rate</h3>
            <p class="stat-value">{{ completionRate }}%</p>
            <small>Completed orders</small>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card">
            <h2><i class="fas fa-pie-chart"></i> Orders by Status</h2>
            <div class="status-breakdown">
              <div class="status-item" *ngFor="let item of statusBreakdown">
                <span class="status-name">{{ item.status | uppercase }}</span>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="item.percentage"></div>
                </div>
                <span class="status-count">{{ item.count }} ({{ item.percentage }}%)</span>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h2><i class="fas fa-list"></i> Order Summary</h2>
            <div class="summary-table">
              <div class="summary-row">
                <span>Pending</span>
                <span class="count">{{ pendingCount }}</span>
              </div>
              <div class="summary-row">
                <span>Completed</span>
                <span class="count">{{ completedCount }}</span>
              </div>
              <div class="summary-row">
                <span>Shipped</span>
                <span class="count">{{ shippedCount }}</span>
              </div>
              <div class="summary-row">
                <span>Failed</span>
                <span class="count">{{ failedCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h2><i class="fas fa-money-bill"></i> Spending Analysis</h2>
          <div class="spending-analysis">
            <div class="spending-item">
              <label>Highest Order:</label>
              <span>\${{ maxOrder | number: '1.2-2' }}</span>
            </div>
            <div class="spending-item">
              <label>Lowest Order:</label>
              <span>\${{ minOrder | number: '1.2-2' }}</span>
            </div>
            <div class="spending-item">
              <label>Total Orders:</label>
              <span>{{ totalOrders }}</span>
            </div>
            <div class="spending-item">
              <label>Average Spent Per Order:</label>
              <span>\${{ averageOrder | number: '1.2-2' }}</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="totalOrders === 0">
          <i class="fas fa-inbox"></i>
          <h3>No Analytics Yet</h3>
          <p>Create some orders to see analytics data</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .stat-value {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .stat-card small {
      font-size: 12px;
      opacity: 0.8;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-card {
      background: white;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-card h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-breakdown {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .status-name {
      min-width: 80px;
      font-weight: 600;
      color: #333;
      font-size: 13px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .status-count {
      min-width: 70px;
      text-align: right;
      font-size: 13px;
      color: #666;
      font-weight: 600;
    }

    .summary-table {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 5px;
    }

    .summary-row span:first-child {
      color: #666;
      font-weight: 600;
    }

    .count {
      color: #007bff;
      font-weight: 700;
      font-size: 18px;
    }

    .spending-analysis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .spending-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 5px;
      border-left: 4px solid #007bff;
    }

    .spending-item label {
      display: block;
      color: #666;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .spending-item span {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #28a745;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-top: 30px;
    }

    .empty-state i {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin: 0 0 10px 0;
    }

    .empty-state p {
      color: #666;
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
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .spending-analysis {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  currentUser: User | null = null;
  orders: Order[] = [];
  isLoading = false;

  totalOrders = 0;
  totalSpent = 0;
  averageOrder = 0;
  completionRate = 0;

  pendingCount = 0;
  completedCount = 0;
  shippedCount = 0;
  failedCount = 0;

  maxOrder = 0;
  minOrder = 0;

  statusBreakdown: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.id) {
        this.loadAnalytics(user.id);
      }
    });
  }

  loadAnalytics(userId: number): void {
    this.isLoading = true;
    this.apiService.getOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateMetrics();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.isLoading = false;
      }
    });
  }

  calculateMetrics(): void {
    this.totalOrders = this.orders.length;
    this.totalSpent = this.orders.reduce((sum, o) => sum + o.amount, 0);
    this.averageOrder = this.totalOrders > 0 ? this.totalSpent / this.totalOrders : 0;

    // Count by status
    this.pendingCount = this.orders.filter(o => o.status === 'pending').length;
    this.completedCount = this.orders.filter(o => o.status === 'completed').length;
    this.shippedCount = this.orders.filter(o => o.status === 'shipped').length;
    this.failedCount = this.orders.filter(o => o.status === 'failed').length;

    // Completion rate
    this.completionRate = this.totalOrders > 0 
      ? Math.round((this.completedCount / this.totalOrders) * 100)
      : 0;

    // Min and Max
    this.maxOrder = this.orders.length > 0 ? Math.max(...this.orders.map(o => o.amount)) : 0;
    this.minOrder = this.orders.length > 0 ? Math.min(...this.orders.map(o => o.amount)) : 0;

    // Status breakdown
    this.calculateStatusBreakdown();
  }

  calculateStatusBreakdown(): void {
    const statuses = ['pending', 'completed', 'shipped', 'failed'];
    this.statusBreakdown = statuses.map(status => {
      const count = this.orders.filter(o => o.status === status).length;
      const percentage = this.totalOrders > 0 ? Math.round((count / this.totalOrders) * 100) : 0;
      return { status, count, percentage };
    });
  }
}
