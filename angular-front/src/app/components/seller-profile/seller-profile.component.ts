import { Component, NgModule } from '@angular/core';
import { SellerInfoComponent } from './seller-info/seller-info.component';
import { SellerListPartComponent } from './seller-list-part/seller-list-part.component';
import { MyProductsComponent } from "./my-products/my-products.component";
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [
    SellerInfoComponent,
    SellerListPartComponent,
    MyProductsComponent,
    CommonModule,

  
],
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})
export class SellerProfileComponent {
  activeComponent: string = 'my-products'

  showComponent(component: string) {
    this.activeComponent = component;
  }
}

