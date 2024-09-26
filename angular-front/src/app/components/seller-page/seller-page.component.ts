import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { MyProductsComponent } from './my-products/my-products.component';
import { AddProductComponent } from "../add-product/add-product.component";
import { EditProfileComponent } from "../edit-profile/edit-profile.component";
import { RegisterComponent } from "../register/register.component";
import { SellerHeaderComponent } from './seller-header/seller-header.component';

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [CommonModule, SellerHeaderComponent, MyProductsComponent, AddProductComponent, EditProfileComponent, RegisterComponent],
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']  // Fixed typo to styleUrls
})
export class SellerPageComponent {
  activeComponent: string = 'my-products';

  showComponent(component: string) {
    console.log('Active Component:', component);  // Debugging: check what component is being set
    this.activeComponent = component;
  }
  
}
