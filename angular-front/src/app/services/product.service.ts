import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) { }

  // الحصول على قائمة المنتجات
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // إضافة منتج جديد
  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  // الحصول على تفاصيل منتج معين
  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // تحديث منتج
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  // حذف منتج
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
