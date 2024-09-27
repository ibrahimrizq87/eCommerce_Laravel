import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListPartComponent } from './list-part/list-part.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomerOrdersHistoryComponent } from './customer-orders-history/customer-orders-history.component';
import { CustomerOverviewComponent } from './customer-account/customer-account.component';
import { MyWishlistPartComponent } from './my-wishlist-part/my-wishlist-part.component';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { WishlistComponent } from "../wishlist/wishlist.component";
import { MyCancellationsComponent } from './my-cancellations/my-cancellations.component';
import { MyReturnsComponent } from './my-returns/my-returns.component';
import { ViewOrderComponent } from "./view-order/view-order.component";


@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ListPartComponent, CustomerInfoComponent, CustomerOrdersComponent, CustomerOrdersHistoryComponent,
    CustomerOverviewComponent, MyWishlistPartComponent, CustomerHeaderComponent, EditProfileComponent,
    WishlistComponent, MyCancellationsComponent, MyReturnsComponent, ViewOrderComponent],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {
 activeComponent: string = ''

 showComponent(component: string) {
   this.activeComponent = component;
 }
}
