import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderPaymentService } from '../../services/order-payment.service';
import { SharedService } from '../../services/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-order',
    standalone: true,
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    imports: [CommonModule]
})

export class OrderComponent implements OnInit {
    orders: any[] = [];
    currentLanguage: string = 'en';
    constructor(
        private sharedService: SharedService,
        private OrderPaymentService: OrderPaymentService,
        private orderService: OrderService,
         private router: Router,
        private toastr:ToastrService) {
        this.sharedService.language$.subscribe(language => {
            this.currentLanguage = language;
        });

    }

    ngOnInit(): void {
        this.fetchOrders();
    }

    fetchOrders(): void {
        this.orderService.getAllOrders().subscribe(
            (response) => {
                // console.log('my data ata:::..>>', response);
                this.orders = response;
            },
            (error) => {
                // console.error('Error fetching orders:', error);
                if (error.status === 401) {
                    sessionStorage.removeItem('authToken');
                    sessionStorage.setItem('loginSession', 'true');
                    this.router.navigate(['/login']);

                }
            }
        );
    }
    deleteOrder(order: any) {
        this.orderService.deleteOrder(order.id).subscribe(
            (response) => {
                this.fetchOrders();

                if (this.currentLanguage == 'en') {
                    this.toastr.success('deleted successfully');
                } else {
                    this.toastr.success('تمت العمليه بنجاح');
                }
            },
            (error) => {
                if (error.status === 401) {
                    sessionStorage.removeItem('authToken');
                    sessionStorage.setItem('loginSession', 'true');
                    this.router.navigate(['/login']);

                } else if (error.status === 403) {
                    alert('can not delete a payed order');

                } else {


                    if (this.currentLanguage == 'en') {
                        this.toastr.error('some error happend');
                    } else {
                        this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
                    }
                }
            }
        );
    }

    payForOrder(order: any) {

        const requestData = { 'id': order.id };
        this.OrderPaymentService.requestPayment(requestData).subscribe(
            response => {
                const url = response.url;
                window.open(url, '_blank');
            }
            , error => {
                if (error.status === 401) {
                    sessionStorage.removeItem('authToken');
                    sessionStorage.setItem('loginSession', 'true');
                    this.router.navigate(['/login']);
                } else if (error.status === 403) {
                    if (this.currentLanguage == 'en') {
                        this.toastr.warning('this order is already payed can not pay again');
                    } else {
                        this.toastr.warning('لقد تم دفع هذا الطلب لا يمكن دفعه مره اغرى');
                    }
                    

                } else {

                    if (this.currentLanguage == 'en'){
                        this.toastr.error('some error happend');
                      }else{
                        this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
                      }
                }
            }
        )

    }

    viewOrder(order: any): void {
        this.orderService.setCurrentOrder(order);
        this.router.navigate(['/order/view']);
    }




}
