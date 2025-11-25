import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Order Processing Platform. All rights reserved.</p>
        <div class="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #333;
      color: #999;
      padding: 30px 0;
      text-align: center;
      margin-top: 50px;
      border-top: 1px solid #444;
    }

    .footer .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer p {
      margin: 0;
    }

    .footer-links {
      display: flex;
      gap: 20px;
    }

    .footer-links a {
      color: #999;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #fff;
    }

    @media (max-width: 768px) {
      .footer .container {
        flex-direction: column;
      }
    }
  `]
})
export class FooterComponent {}
