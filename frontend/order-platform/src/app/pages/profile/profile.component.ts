import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, User } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-user-circle"></i> My Profile</h1>
      </div>

      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <div class="alert alert-danger" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="profile-container" *ngIf="currentUser">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="user-info">
              <h2>{{ currentUser.name }}</h2>
              <p>{{ currentUser.email }}</p>
              <p class="member-since">Member since {{ currentUser.created_at | date: 'MMM yyyy' }}</p>
            </div>
          </div>

          <div class="profile-form">
            <h3><i class="fas fa-edit"></i> Edit Profile</h3>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="Your full name"
                />
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="your@email.com"
                />
                <small>Email cannot be changed</small>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
                  <i class="fas fa-save"></i> Save Changes
                </button>
                <button type="button" class="btn btn-secondary" (click)="resetForm()">
                  <i class="fas fa-undo"></i> Reset
                </button>
              </div>
            </form>

            <div *ngIf="isLoading" class="spinner"></div>
          </div>
        </div>

        <div class="account-card">
          <h3><i class="fas fa-lock"></i> Account Security</h3>
          <div class="security-section">
            <div class="security-item">
              <div class="security-info">
                <h4>Password</h4>
                <p>Last changed 6 months ago</p>
              </div>
              <button class="btn btn-secondary" [disabled]="true">
                <i class="fas fa-lock"></i> Change Password
              </button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <h4>Two-Factor Authentication</h4>
                <p>Not enabled</p>
              </div>
              <button class="btn btn-secondary" [disabled]="true">
                <i class="fas fa-shield-alt"></i> Enable 2FA
              </button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <h4>Active Sessions</h4>
                <p>1 session active</p>
              </div>
              <button class="btn btn-secondary" [disabled]="true">
                <i class="fas fa-sign-out-alt"></i> Manage Sessions
              </button>
            </div>
          </div>
        </div>

        <div class="account-card">
          <h3><i class="fas fa-info-circle"></i> Account Information</h3>
          <div class="info-section">
            <div class="info-item">
              <label>User ID:</label>
              <span>{{ currentUser.id }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ currentUser.email }}</span>
            </div>
            <div class="info-item">
              <label>Account Created:</label>
              <span>{{ currentUser.created_at | date: 'long' }}</span>
            </div>
            <div class="info-item">
              <label>Account Status:</label>
              <span class="status-active"><i class="fas fa-check-circle"></i> Active</span>
            </div>
          </div>
        </div>

        <div class="danger-zone">
          <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
          <div class="danger-actions">
            <div class="danger-item">
              <div class="danger-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
              </div>
              <button class="btn btn-danger" [disabled]="true">
                <i class="fas fa-trash"></i> Delete Account
              </button>
            </div>
          </div>
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

    .profile-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }

    .profile-card, .account-card, .danger-zone {
      background: white;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      grid-column: 1 / -1;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
      flex-shrink: 0;
    }

    .user-info h2 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 24px;
    }

    .user-info p {
      margin: 5px 0;
      color: #666;
    }

    .member-since {
      font-size: 12px;
      color: #999;
    }

    .profile-form, .security-section, .info-section, .danger-actions {
      margin-top: 20px;
    }

    .profile-form h3, .account-card h3, .danger-zone h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
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

    input:disabled {
      background: #f8f9fa;
      color: #999;
    }

    small {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 25px;
    }

    .btn {
      flex: 1;
      padding: 12px;
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

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .security-item, .danger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .security-item:last-child, .danger-item:last-child {
      border-bottom: none;
    }

    .security-info, .danger-info {
      flex: 1;
    }

    .security-info h4, .danger-info h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-weight: 600;
    }

    .security-info p, .danger-info p {
      margin: 0;
      color: #666;
      font-size: 13px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item label {
      color: #666;
      font-weight: 600;
    }

    .info-item span {
      color: #333;
    }

    .status-active {
      color: #28a745;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .danger-zone {
      border: 2px solid #f8d7da;
      background: #fff5f7;
    }

    .danger-zone h3 {
      color: #dc3545;
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
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .form-actions {
        flex-direction: column;
      }

      .security-item, .danger-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  form: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.apiService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.form.patchValue({
          name: user.name || '',
          email: user.email
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Simulate update (in real app, would call API)
    setTimeout(() => {
      this.successMessage = 'Profile updated successfully!';
      this.isLoading = false;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);
  }

  resetForm(): void {
    if (this.currentUser) {
      this.form.patchValue({
        name: this.currentUser.name || '',
        email: this.currentUser.email
      });
    }
  }
}
