import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, User } from '../../services/api.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-plus-circle"></i> Create New Order</h1>
      </div>

      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <div class="alert alert-danger" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="form-container">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
          <div class="form-section">
            <h3><i class="fas fa-box"></i> Order Details</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="amount">Order Amount ($)</label>
                <input
                  id="amount"
                  type="number"
                  formControlName="amount"
                  placeholder="100.00"
                  step="0.01"
                  min="0"
                  required
                />
                <small *ngIf="form.get('amount')?.invalid && form.get('amount')?.touched" class="error">
                  Please enter a valid amount
                </small>
              </div>

              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" formControlName="category" required>
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food & Grocery</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Describe your order..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3><i class="fas fa-file-upload"></i> Upload Documents</h3>

            <div class="form-group">
              <label for="invoice">Invoice/Receipt (Optional)</label>
              <input
                id="invoice"
                type="file"
                formControlName="invoice"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <small>Accepted: PDF, JPG, PNG</small>
            </div>

            <div *ngIf="uploadedFiles.length > 0" class="uploaded-files">
              <h4>Uploaded Files:</h4>
              <ul>
                <li *ngFor="let file of uploadedFiles">
                  <i class="fas fa-check"></i> {{ file.name }}
                </li>
              </ul>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isSubmitting">
              <i class="fas fa-check"></i> Create Order
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              <i class="fas fa-redo"></i> Reset
            </button>
          </div>
        </form>

        <div *ngIf="isLoading" class="spinner"></div>
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
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 30px;
    }

    .form-section h3 {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    input, select, textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      font-family: inherit;
      transition: border 0.3s ease;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    small {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .error {
      color: #dc3545;
    }

    .uploaded-files {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
    }

    .uploaded-files h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .uploaded-files ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .uploaded-files li {
      padding: 8px 0;
      color: #666;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .uploaded-files i {
      color: #28a745;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CreateOrderComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  uploadedFiles: File[] = [];
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: [''],
      invoice: ['']
    });
  }

  ngOnInit(): void {
    this.apiService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.currentUser) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { amount, category, description } = this.form.value;

    const orderData = {
      user_id: this.currentUser.id || 0,
      amount: parseFloat(amount),
      status: 'pending'
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (order) => {
        this.successMessage = `Order #${order.order_number} created successfully!`;
        this.form.reset();
        this.uploadedFiles = [];

        setTimeout(() => {
          this.router.navigate(['/orders', order.id]);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create order. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.uploadedFiles = [];
    this.errorMessage = '';
    this.successMessage = '';
  }
}
