import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from '../../update-product/update-product.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterModule, UpdateProductComponent, CommonModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent {
  activeComponent: string = 'all-products'; // Default view is the product table

  updateProduct() {
    this.activeComponent = 'update-product'; // Swap to the update product view
  }
}
