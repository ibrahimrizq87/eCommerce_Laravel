import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from '../../seller-page/update-product/update-product.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterModule,
     UpdateProductComponent, 
     CommonModule, 
     NgxPaginationModule,
     FormsModule,
     MatPaginatorModule
    ],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent {
  @Output() linkClicked = new EventEmitter<string>();

  products: Product[] = []; 
  category :any;

  page: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  priceFrom: number = 0;
  priceTo: number  = 0;
  totalProducts: number = 0;
  searchCriteria: string = 'name';

  constructor(private productService: ProductService) { }

  activeComponent: string = 'all-products'; 
  addProduct(){
    this.linkClicked.emit('add-product'); 

  }
  updateProduct(product:any){
    this.productService.setProduct(product);
    this.linkClicked.emit('update-product'); 

  }


  deleteProduct(product:any){
    this.productService.deleteProduct(product.id).subscribe(
      response=>{
        alert('deleted sucessfully ');
        this.getProducts();  

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
    this.getProducts();  
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex+1; 
    this.itemsPerPage = event.pageSize; 
    this.getProducts();
  }


  getProducts(): void {
    this.productService.getProducts(this.currentPage, this.itemsPerPage, this.searchCriteria, this.searchTerm, this.priceFrom, this.priceTo)
      .subscribe(response => {
        this.products = response.data; 
        this.totalProducts = response.total; 
        this.products.forEach(product => {
          product.priceAfterOffers = product.price;
          product.totalOffers = 0;

          product.addedOffers.forEach(offerAdded => {
            const endDate = new Date(offerAdded.offer.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (endDate.getTime() >= today.getTime()) {
              product.totalOffers += offerAdded.offer.discount;
              product.priceAfterOffers -= Math.floor((offerAdded.offer.discount / 100) * product.price);

            }

          });
        });

    },error=>{
        console.log('error>>>>>>>>>>>>>>>>' , error);
      });
  }
  

  search(): void {
    this.currentPage = 1; 
    this.getProducts();

    
  }


  changeCriteria(){
    this.searchTerm= '';
    this.priceFrom = 0;
    this.priceTo  = 0;
  }

//   updateProducts(){

//   this.productService.getAllProducts().subscribe(
//     response => {
//       this.products = response.data;
 
//       this.products.forEach(product=>{
//         product.priceAfterOffers = product.price;
//         product.totalOffers=0;  
        
//       product.addedOffers.forEach(offerAdded => {
//         const endDate = new Date(offerAdded.offer.end_date); 
//         const today = new Date(); 
//         today.setHours(0, 0, 0, 0); 

// if (endDate.getTime() >= today.getTime()) { 
//   product.totalOffers +=offerAdded.offer.discount;
//   product.priceAfterOffers -= Math.floor((offerAdded.offer.discount/100) *product.price);
// }

//       });
//     });
//     this.filteredProducts = this.products;

//     },
//     error => {
//       if (error.status === 400 || error.status === 500) {
//         console.error('A specific error occurred:', error);
//       } else {
//         console.error('An unexpected error occurred:', error);
//       }
//     }
//   );
//   }

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

