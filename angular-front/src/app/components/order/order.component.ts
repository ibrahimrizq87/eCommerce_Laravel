import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-order',
    standalone: true,
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    imports: [CommonModule]  
})

export class OrderComponent implements OnInit {
    orders: any[] = [];

    constructor(private orderService: OrderService, private router: Router) { }

    ngOnInit(): void {
        this.fetchOrders();
    }

    fetchOrders(): void {
        this.orderService.getAllOrders().subscribe(
            (response) => {
                this.orders = response; 
            },
            (error) => {
                console.error('Error fetching orders:', error);
            }
        );
    }

    viewOrder(orderId: string): void {
        this.router.navigate(['/order-details', orderId]);
    }

    editOrder(orderId: string): void {
        this.router.navigate(['/edit-order', orderId]);
    }
    cancelOrder(orderId: string): void {
       
        const order = this.orders.find(order => order.id === orderId);
        if (order.payment_status === 'canceled' || order.payment_status === 'delivered') {
            alert('Cannot cancel this order as it is already canceled or delivered.');
            return;
        }
    
        this.orderService.cancelOrder(orderId).subscribe(
            () => {
                alert('Order canceled successfully!');
                this.fetchOrders(); // تحديث قائمة الطلبات بعد الإلغاء
            },
            (error) => {
                console.error('Error canceling order:', error);
                alert('Failed to cancel order: ' + (error.error.message || error.message));
            }
        );
    }
    
    
}
