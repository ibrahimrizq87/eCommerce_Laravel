
import { Component, NgModule, TemplateRef } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CommonModule, NgIfContext } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterModule} from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
// import { Product } from "../../models/product.model";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductDetailsComponent,
    CommonModule,
    RouterModule,
    CustomerHeaderComponent
],



  templateUrl: './product-list.component.html',
})

export class ProductListComponent {
  products: Product[] = []; 
  category :any;
  noProductsTemplate: TemplateRef<NgIfContext<any>> | null | undefined;
  constructor(private productService: ProductService ,private categoryService: CategoryService,private router: Router) { }
  

  moveToCategory(){
    this.router.navigate(['/category']);

  }
  onProductClick (product:any)
  {
    this.productService.setProduct(product);
    this.router.navigate(['/product/view']);

  }
  
  ngOnInit(): void {
    this.category =this.categoryService.getSelectedCategory();
if(this.category){
  this.productService.getProductsByCategory(this.category.id).subscribe(
    response => {
      this.products = response.data;
      this.products = response.data; 
      this.products.forEach(product=>{
        product.priceAfterOffers = product.price;
        product.totalOffers=0;  
        
      product.addedOffers.forEach(offerAdded => {
        const endDate = new Date(offerAdded.offer.end_date); 
        const today = new Date(); 
        today.setHours(0, 0, 0, 0); 

if (endDate.getTime() >= today.getTime()) { 
  product.totalOffers +=offerAdded.offer.discount;
  product.priceAfterOffers -= (offerAdded.offer.discount/100) *product.price;
}

      });
    });
      // console.log('addedOffers:', this.products.addedOffers);
      // console.log('offer:', this.products.addedOffers.offer);

      // this.products.addedOffers.forEach((offerAdded: { discount: number ,start_date: string ,end_date: string  }) => {
      //   console.log('discount:', offerAdded.discount);
      // });
      
      
      

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
}else{

  this.productService.getAllProducts().subscribe(
    response => {
      this.products = response.data; 
      this.products.forEach(product=>{
        product.priceAfterOffers = product.price;
        product.totalOffers=0;  
        
      product.addedOffers.forEach(offerAdded => {
        const endDate = new Date(offerAdded.offer.end_date); 
        const today = new Date(); 
        today.setHours(0, 0, 0, 0); 

if (endDate.getTime() >= today.getTime()) { 
  product.totalOffers +=offerAdded.offer.discount;
  product.priceAfterOffers -= (offerAdded.offer.discount/100) *product.price;
}

      });
    });
    console.log('products after:', this.products);

      

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
}

// Interface for Offer data
interface Offer {
  id: number;
  discount: number;
  start_date: string;
  end_date: string;
}

// Interface for each item in addedOffers
interface OfferItem {
  id: number;
  offer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  offer: Offer;
}

// Interface for the Product User
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

// Interface for the Product
interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  material: string;
  size: string;
  image: string;
  video: string;
  category:Category
  cover_image: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  images: Array<{ id: number; url: string }>;
  addedOffers: OfferItem[];
  user: User;
  totalOffers:number;
  priceAfterOffers:number;
}
interface Category {
  id: number;
  category_name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

