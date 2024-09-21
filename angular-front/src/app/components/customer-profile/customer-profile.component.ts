import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ListPartComponent } from './list-part/list-part.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomerOrdersHistoryComponent } from './customer-orders-history/customer-orders-history.component';
import { CustomerOverviewComponent } from './customer-overview/customer-overview.component';
import { MyWishlistPartComponent } from './my-wishlist-part/my-wishlist-part.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ListPartComponent,CustomerInfoComponent, CustomerOrdersComponent, CustomerOrdersHistoryComponent, CustomerOverviewComponent , MyWishlistPartComponent],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {
 // Variable to store which component should be displayed
 activeComponent: string = ''; // Initialize with empty to hide all

 // This function is triggered when a link is clicked
 showComponent(component: string) {
   this.activeComponent = component;
 }
}
