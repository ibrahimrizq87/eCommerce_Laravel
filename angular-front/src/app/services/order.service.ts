// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { OrderDetails } from '../order_items'; // Adjust the import path based on your structure

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }
  private currentOrder: any;

  setCurrentOrder(order: any) {
    this.currentOrder = order;

  }

  getCurrentOrder() {
    return this.currentOrder;
  }


  getOrder(id: string): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  getAllOrders(): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl, { headers });
  }

  getMyOrders(): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl + '/my-orders', { headers });
  }

  getOlddOrders(): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl + '/my-orders-old', { headers });
  }

  deleteOrder(id: string): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  addOrder(orderData: any): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl, orderData, { headers });
  }

  updateOrder(orderData: any, id: string): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.patch(`${this.apiUrl}/${id}`, orderData, { headers });
  }

  cancelOrder(id: string): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.patch(`${this.apiUrl}/${id}`, { payment_status: 'canceled' }, { headers });
  }


      getWaitingOrders(
        status: string,
        page: number,
        itemsPerPage: number,
        priceFrom: number,
        searchTerm: string,
        priceTo: number,
        searchCriteria: string,
        startDate: string,
        endDate: string
      ): Observable<any> {
        const authToken = sessionStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        let params = new HttpParams()
        .set('page', page.toString())

          .set('status', status.toString())
          .set('itemsPerPage', itemsPerPage.toString());
        if (searchCriteria && searchTerm) {
          params = params.set('searchCriteria', searchCriteria).set('searchTerm', searchTerm);
        }
        if (priceTo > 0) {
          params = params.set('priceFrom', priceFrom.toString()).set('priceTo', priceTo.toString());
        }
        if (startDate && endDate) {
          // console.log('start:',startDate  , 'end:' , endDate);

          params = params.set('startDate', startDate.toString()).set('endDate', endDate.toString());
        }
        // console.log('start:',startDate  , 'end:' , endDate);
        return this.http.get(`${this.apiUrl}/all`, { headers, params });
      }



}
