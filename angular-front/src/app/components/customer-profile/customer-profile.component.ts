import { Component } from '@angular/core';
import { ListPartComponent } from "./list-part/list-part.component";
import { CustomerOverviewComponent } from "./customer-overview/customer-overview.component";
import { CustomerOrdersComponent } from "./customer-orders/customer-orders.component";
import { CustomerOrdersHistoryComponent } from "./customer-orders-history/customer-orders-history.component";
import { MyWishlistPartComponent } from "./my-wishlist-part/my-wishlist-part.component";
import { CustomerInfoComponent } from "./customer-info/customer-info.component";

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [ListPartComponent, CustomerOverviewComponent, CustomerOrdersComponent, CustomerOrdersHistoryComponent, MyWishlistPartComponent, CustomerInfoComponent],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {

}
