import { Component, NgModule } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterModule} from '@angular/router';
import { CategoryService } from '../../services/category.service';

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
  constructor(private productService: ProductService ,private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.category =this.categoryService.getSelectedCategory();
console.log('category: ',this.category);
    this.productService.getAllProducts().subscribe(
      response => {
        this.products = response; 
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
