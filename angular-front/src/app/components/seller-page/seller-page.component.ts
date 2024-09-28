import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { MyProductsComponent } from './my-products/my-products.component';
import { AddProductComponent } from "../add-product/add-product.component";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";
import { RegisterComponent } from "../register/register.component";
import { SellerHeaderComponent } from './seller-header/seller-header.component';
import { AddOfferComponent } from "./add-offer/add-offer.component";
import { ProductOffersComponent } from "./product-offers/product-offers.component";
import { AllSellerOffersComponent } from "./all-seller-offers/all-seller-offers.component";

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [CommonModule, SellerHeaderComponent, MyProductsComponent, AddProductComponent, EditProfileComponent, RegisterComponent, AddOfferComponent, ProductOffersComponent, AllSellerOffersComponent],
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']  
})
export class SellerPageComponent {
  activeComponent: string = 'my-products';

  showComponent(component: string) {
    this.activeComponent = component;
  }
  
}
