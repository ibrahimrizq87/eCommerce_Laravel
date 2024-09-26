import { Component } from '@angular/core';
import { SellerHeaderComponent } from "../seller-header/seller-header.component";
import { MyProductsComponent } from "../seller-profile/my-products/my-products.component";
import { AddProductComponent } from "../add-product/add-product.component";

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [SellerHeaderComponent, MyProductsComponent, AddProductComponent],
  templateUrl: './seller-page.component.html',
  styleUrl: './seller-page.component.css'
})
export class SellerPageComponent {

}
