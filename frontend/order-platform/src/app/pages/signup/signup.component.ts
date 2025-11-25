import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <h2><i class="fas fa-user-plus"></i> Create New Account</h2>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert alert-success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="John Doe"
                required
              />
              <small *ngIf="form.get('name')?.invalid && form.get('name')?.touched" class="error">
                Name is required
              </small>
            </div>

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
                placeholder="At least 6 characters"
                required
              />
              <small *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="error">
                Password must be at least 6 characters
              </small>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                placeholder="Confirm your password"
                required
              />
              <small *ngIf="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched" class="error">
                Please confirm your password
              </small>
              <small *ngIf="form.errors?.['passwordMismatch'] && form.touched" class="error">
                Passwords do not match
              </small>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
              <i class="fas fa-user-plus"></i> Sign Up
            </button>
          </form>

          <div *ngIf="isLoading" class="spinner"></div>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Login here</a></p>
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
export class SignupComponent {
  form: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { name, email, password } = this.form.value;

    this.apiService.signup(email, password, name).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
