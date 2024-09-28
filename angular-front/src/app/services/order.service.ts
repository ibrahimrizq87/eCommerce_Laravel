// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { OrderDetails } from '../order_items'; // Adjust the import path based on your structure

@Injectable({
  providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getOrder(id: string): Observable<OrderDetails> {
        const authToken = sessionStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        return this.http.get<OrderDetails>(`${this.apiUrl}/${id}`, { headers });
    }

    getAllOrders(): Observable<OrderDetails[]> {
        const authToken = sessionStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        return this.http.get<OrderDetails[]>(this.apiUrl, { headers });
    }

    deleteOrder(id: string): Observable<any> {
        const authToken = sessionStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }

    addOrder(orderData: OrderDetails): Observable<OrderDetails> {
        const authToken = sessionStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });  
        return this.http.post<OrderDetails>(this.apiUrl, orderData, { headers });     
    }

    updateOrder(orderData: OrderDetails, id: string): Observable<OrderDetails> {
        const authToken = sessionStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        return this.http.patch<OrderDetails>(`${this.apiUrl}/${id}`, orderData, { headers });
    }

    cancelOrder(id: string): Observable<OrderDetails> {
      const authToken = sessionStorage.getItem('authToken');
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
      });
      return this.http.patch<OrderDetails>(`${this.apiUrl}/${id}`, { payment_status: 'canceled' }, { headers });
  }
}
