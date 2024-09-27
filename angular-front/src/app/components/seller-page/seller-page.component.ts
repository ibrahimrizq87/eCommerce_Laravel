import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { MyProductsComponent } from './my-products/my-products.component';
import { AddProductComponent } from "../add-product/add-product.component";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";
import { RegisterComponent } from "../register/register.component";
import { SellerHeaderComponent } from './seller-header/seller-header.component';
import { AddOfferComponent } from "./add-offer/add-offer.component";
import { AllOffersComponent } from "../admin-page/all-offers/all-offers.component";
import { OfferedProductsComponent } from "../admin-page/offered-products/offered-products.component";

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [CommonModule, SellerHeaderComponent, MyProductsComponent, AddProductComponent, EditProfileComponent, RegisterComponent, AddOfferComponent, AllOffersComponent, OfferedProductsComponent],
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']  
})
export class SellerPageComponent {
  activeComponent: string = 'my-products';

  showComponent(component: string) {
    this.activeComponent = component;
  }
  
}
