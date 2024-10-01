
import { Component, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-offers',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.css'
})
export class ProductOffersComponent {
  @Output() linkClicked = new EventEmitter<string>();
  products:Product[] = [];
  addError:boolean = false;
  selectedProducts: any[] = [];
  offer:any;
  constructor(
    private productService: ProductService  ,private offerService:OfferService) {}
    ngOnInit(): void {
      this.updateProducts();
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
  this.linkClicked.emit('all-seller-offers');

}
    }

updateProducts(){
  this.productService.getMyProducts().subscribe(
    response=>{
      this.products = response.data;
      this.products.forEach(product=>{
        product.priceAfterOffers = product.price;
        product.totalOffers=0;  
        product.selected = false;
        
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
      console.log('my products::' , this.products);
    },error=>{
      console.log('there is an error :; ',error)
    }
  );
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
      console.log('Offer added successfully', response);
    },
    error => {
      console.log('Error adding offer', error);
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

