import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from '../../seller-page/update-product/update-product.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterModule, UpdateProductComponent, CommonModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent {
  @Output() linkClicked = new EventEmitter<string>();

  products: Product[] = []; 

  constructor(private productService: ProductService) { }

  activeComponent: string = 'all-products'; 

  updateProduct() {
    this.activeComponent = 'update-product'; 
  }
  deleteProduct(product:any){
    this.productService.deleteProduct(product.id).subscribe(
      response=>{
        alert('deleted sucessfully ');
        this.updateProducts();  

      },error=>{
        alert('some error happend ');
        console.log('error happend:::',error );

      }
    )
  }
  viewProduct(product:any){
    this.productService.setProduct(product);
    this.linkClicked.emit('view-product');

  

  }
  ngOnInit(): void {
    this.updateProducts();  
  }
  updateProducts(){

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


interface Offer {
  id: number;
  discount: number;
  start_date: string;
  end_date: string;
}

interface OfferItem {
  id: number;
  offer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  offer: Offer;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

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

