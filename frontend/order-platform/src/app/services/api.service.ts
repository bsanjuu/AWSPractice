import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  created_at?: string;
}

export interface Order {
  id?: number;
  user_id: number;
  order_number?: string;
  status: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id?: number;
  order_id: number;
  file_path: string;
  file_name: string;
  uploaded_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ===== AUTH =====
  signup(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, {
      email,
      password,
      name
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      this.currentUserSubject.next(JSON.parse(userStr));
      this.isAuthenticatedSubject.next(true);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ===== ORDERS =====
  getOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`);
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/detail/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  updateOrder(orderId: number, order: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}`, order);
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${orderId}`);
  }

  // ===== INVOICES =====
  uploadInvoice(orderId: number, file: File): Observable<Invoice> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('order_id', orderId.toString());
    return this.http.post<Invoice>(`${this.apiUrl}/invoices/upload`, formData);
  }

  getInvoices(orderId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices/${orderId}`);
  }

  // ===== ANALYTICS =====
  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`);
  }

  getOrderStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/orders`);
  }

  getPaymentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/payments`);
  }
}
