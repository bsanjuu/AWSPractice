import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <h1>
            <i class="fas fa-shopping-cart"></i>
            Order Platform
          </h1>
        </div>

        <ul class="nav-links" *ngIf="isAuthenticated$ | async">
          <li>
            <a routerLink="/dashboard" 
               routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: true }">
              <i class="fas fa-home"></i> Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/orders" 
               routerLinkActive="active">
              <i class="fas fa-list"></i> Orders
            </a>
          </li>
          <li>
            <a routerLink="/analytics" 
               routerLinkActive="active">
              <i class="fas fa-chart-bar"></i> Analytics
            </a>
          </li>
          <li>
            <a routerLink="/profile" 
               routerLinkActive="active">
              <i class="fas fa-user"></i> Profile
            </a>
          </li>
          <li>
            <button class="btn-logout" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>

        <ul class="nav-links" *ngIf="!(isAuthenticated$ | async)">
          <li>
            <a routerLink="/login" routerLinkActive="active">
              <i class="fas fa-sign-in-alt"></i> Login
            </a>
          </li>
          <li>
            <a routerLink="/signup" routerLinkActive="active">
              <i class="fas fa-user-plus"></i> Sign Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand h1 {
      font-size: 24px;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-links {
      list-style: none;
      display: flex;
      gap: 30px;
      align-items: center;
      margin: 0;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 5px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-links a:hover {
      background: rgba(255,255,255,0.2);
    }

    .nav-links a.active {
      background: rgba(255,255,255,0.3);
      border-bottom: 2px solid white;
    }

    .btn-logout {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid white;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-logout:hover {
      background: rgba(255,255,255,0.3);
    }

    @media (max-width: 768px) {
      .nav-links {
        gap: 15px;
        font-size: 13px;
      }

      .navbar-brand h1 {
        font-size: 18px;
      }
    }
  `]
})
export class NavigationComponent implements OnInit {
  isAuthenticated$ = this.apiService.isAuthenticated$;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  logout(): void {
    this.apiService.logout();
  }
}
