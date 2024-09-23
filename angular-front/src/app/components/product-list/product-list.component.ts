import { Component, NgModule } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterModule} from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductDetailsComponent,
    CommonModule,
    RouterModule
  ],


  // providers: [ProductService ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any; 
  category :any;
  constructor(private productService: ProductService ,private categoryService: CategoryService,private router: Router) { }
  
  
  onCategoryClick(category: any): void {
    this.categoryService.setCategory(category);
    this.router.navigate(['/products']);
  }
  
  onProductClick (product:any)
  {
    this.productService.setProduct(product);
    this.router.navigate(['/products/'+product.id]);

  }
  
  ngOnInit(): void {
    this.category =this.categoryService.getSelectedCategory();
console.log('category: ',this.category);
    this.productService.getAllProducts().subscribe(
      response => {
        this.products = response.data; 
        console.log('response' , response);
        console.log(response.data.email);
      },
      error => {
        if (error.status === 400 || error.status === 500) {
          console.error('A specific error occurred:', error);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    );
  }
}
