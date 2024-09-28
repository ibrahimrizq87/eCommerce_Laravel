import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListPartComponent } from './list-part/list-part.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomerOverviewComponent } from './customer-account/customer-account.component';
import { MyWishlistPartComponent } from './my-wishlist-part/my-wishlist-part.component';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { WishlistComponent } from "../wishlist/wishlist.component";
import { MyCancellationsComponent } from '../cutomer-profile/my-cancellations/my-cancellations.component';
import { ViewOrderComponent } from '../cutomer-profile/view-order/view-order.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ListPartComponent, CustomerInfoComponent, CustomerOrdersComponent,
    CustomerOverviewComponent, MyWishlistPartComponent, CustomerHeaderComponent, EditProfileComponent,
    WishlistComponent, MyCancellationsComponent, ViewOrderComponent],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'] // لاحظي اسم الخاصية الصحيح
})
export class CustomerProfileComponent {
 activeComponent: string = 'edit-profile'

  showComponent(component: string) {
    this.activeComponent = component;
  }
}
