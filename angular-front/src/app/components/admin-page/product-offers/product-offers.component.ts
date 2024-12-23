
import { Component, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';


import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 


@Component({
  selector: 'app-product-offers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule
  ],
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.css'
})
export class ProductOffersComponent {
  @Output() linkClicked = new EventEmitter<string>();
  products:Product[] = [];
  currentLanguage: string ='en';

  addError:boolean = false;
  selectedProducts: any[] = [];
  offer:any;

 
  page: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  priceFrom: number = 0;
  priceTo: number  = 0;
  totalProducts: number = 0;
  searchCriteria: string = 'name';

  constructor(
    private sharedService: SharedService,
    private toastr :ToastrService,

    private productService: ProductService  ,private offerService:OfferService) {



 this.sharedService.language$.subscribe(language => {
  this.currentLanguage = language;
  });

    }
    ngOnInit(): void {
      this.getProducts();
      this.getOffer();
      
    }


    onProductSelect(product: any, event: any) {
      if (event.target.checked) {
        this.addError = false;
        this.selectedProducts.push(product);
      } else {
        this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
      }
    }

    selectAllProducts(event: any) {
      const isChecked = event.target.checked;
  
      this.products.forEach(product => {
        product.selected = isChecked;
        if (isChecked && !this.selectedProducts.includes(product)) {
          this.selectedProducts.push(product); 
          this.addError = false;

        } else if (!isChecked) {
          this.selectedProducts = []; 
        }

      });
    }

    getOffer(){
if(this.offerService.getCurrentOffer()){
this.offer=this.offerService.getCurrentOffer();
}else{
  this.linkClicked.emit('all-offers');

}
    }




 
    onPageChange(event: PageEvent) {
      this.currentPage = event.pageIndex+1; 
      this.itemsPerPage = event.pageSize; 
      this.getProducts();
    }
  
  
    getProducts(): void {

      this.productService.getProductsForOffers(this.currentPage, this.itemsPerPage, this.searchCriteria, this.searchTerm, this.priceFrom, this.priceTo)
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
  
addProducts(){
  if (this.selectedProducts.length < 1) {
    this.addError = true;
    return;
  }

  const selectedProductIds = this.selectedProducts.map(product => product.id); 
  const offerId = this.offer.id; 

  const data = {
    product_ids: selectedProductIds,
    offer_id: offerId
  };

  this.offerService.addOfferToProducts(data).subscribe(
    response => {
             
      if (this.currentLanguage == 'en'){
        this.toastr.success('Offer added successfully');
      }else{
        this.toastr.success('تمت العمليه بنجاح');
      }
      this.linkClicked.emit('all-offers');

    },
    error => {
      if (this.currentLanguage == 'en'){
        this.toastr.error('some error happend');
      }else{
        this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
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
  selected:boolean;
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

