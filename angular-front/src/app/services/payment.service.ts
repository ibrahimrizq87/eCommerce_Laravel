import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  private paymentUrl: any;

  setUrlPayment(order: any) {
    this.paymentUrl = order;

  }

  getPaymentUrl() {
    return this.paymentUrl;
  }
}
