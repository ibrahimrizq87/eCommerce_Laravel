import { Component } from '@angular/core';
import { AcceptedProductsComponent } from './accepted-products/accepted-products.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { AllCustomersComponent } from './all-customers/all-customers.component';
import { AllOffersComponent } from './all-offers/all-offers.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { AllSellersComponent } from './all-sellers/all-sellers.component';
import { BannedCustomersComponent } from './banned-customers/banned-customers.component';
import { OfferedProductsComponent } from './offered-products/offered-products.component';
import { RejectedProductsComponent } from './rejected-products/rejected-products.component';
import { BannedSellersComponent } from './banned-sellers/banned-sellers.component';
import { CommonModule } from '@angular/common';
import { PendingProductsComponent } from './pending-products/pending-products.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    AcceptedProductsComponent,
    AdminHeaderComponent,
    AllCategoriesComponent,
    AllCustomersComponent,
    AllOffersComponent,
    AllOrdersComponent,
    AllProductsComponent,
    AllSellersComponent,
    BannedCustomersComponent,
    BannedSellersComponent,
    OfferedProductsComponent,
    RejectedProductsComponent,
    PendingProductsComponent,
    CommonModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  activeComponent: string = 'all-products';  // Default component to show

  showComponent(component: string) {
    console.log('Switching to component:', component);  // Debugging: log which component is being shown
    this.activeComponent = component;
  }
}
