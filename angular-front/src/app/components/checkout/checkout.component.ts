import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LottieComponent } from 'ngx-lottie';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        LottieComponent,
    ],
})
export class CheckoutComponent {
    order = {
        phone: '',
        address: '',
        total: null
    };
    error: string | null = null;
    successMessage: string | null = null;

    constructor(private orderService: OrderService, private router: Router) {}

    addOrder() {
        if (!this.isValidOrder(this.order)) {
            this.error = 'Please fill in all fields correctly!';
            return;
        }

        console.log('Sending order:', this.order); // Debugging line
        this.orderService.addOrder(this.order).subscribe(
            response => {
                console.log('Response:', response); // Debugging line
                this.successMessage = 'Order added successfully!';
                this.error = null;
                this.order = { phone: '', address: '', total: null }; // Reset form
            },
            err => {
                console.error('Error occurred:', err); // Debugging line
                this.error = err.error.errors ? err.error.errors : 'Failed to add order';
                this.successMessage = null;
            }
        );
    }

    private isValidOrder(order: any): boolean {
        return order.phone.trim() !== '' && order.address.trim() !== '' && order.total !== null;
    }
}
