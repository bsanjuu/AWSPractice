import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <h2><i class="fas fa-sign-in-alt"></i> Login to Your Account</h2>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                required
              />
              <small *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="error">
                Please enter a valid email
              </small>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Enter your password"
                required
              />
              <small *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="error">
                Password is required
              </small>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
          </form>

          <div *ngIf="isLoading" class="spinner"></div>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/signup">Sign up here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
      padding: 20px;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    .auth-card h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
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

    input {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      transition: border 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .btn {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }

    .auth-footer a {
      color: #007bff;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
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
  `]
})
export class LoginComponent {
  form: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.form.value;

    this.apiService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
