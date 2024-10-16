import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 



@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = environment.apiUrl+'/deliveries';

  private selectedDelivery: any;

  setDelivery(delivery: any) {
    this.selectedDelivery= delivery;

  }

  getSelectedDelivery() {
    return this.selectedDelivery;
  }

  private allDeliverys: any [] = [];

  setAllDelivery(deliverys: any) {
    this.allDeliverys = deliverys;

  }

  getAllDelivery() {
    return this.allDeliverys;
  }


  constructor(private http: HttpClient) {

   }
   getDeliveries(): Observable<any> {
    const authToken = sessionStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return this.http.get(this.apiUrl, { headers });
  }
  

}