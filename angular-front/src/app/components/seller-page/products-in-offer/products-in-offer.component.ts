import { Component, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-products-in-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-in-offer.component.html',
  styleUrl: './products-in-offer.component.css'
})
export class ProductsInOfferComponent {
  @Output() linkClicked = new EventEmitter<string>();
  offer: any;
  products: Product[] = [];
  constructor(
    private productService: ProductService, private offerService: OfferService) { }
  ngOnInit(): void {
    this.getOffer();

    this.updateProducts();
  }
  getOffer() {
    if (this.offerService.getCurrentOffer()) {
      this.offer = this.offerService.getCurrentOffer();
    } else {
      this.linkClicked.emit('all-seller-offers');

    }
  }

  deleteProduct(product: any) {
this.offerService.removeProduct({'product_id':product.id , 'offer_id':this.offer.id}).subscribe(
  response=>{
    alert('removed successfully');
    this.updateProducts();
    console.log('success', response);
  },error=>{

    alert('some error happend');
    console.log('error happend', error);
  }
);
  }
  updateProducts() {
    this.productService.getProductsByOffer(this.offer.id).subscribe(
      response => {
        this.products = response.data;
        this.products.forEach(product => {
          product.priceAfterOffers = product.price;
          product.totalOffers = 0;

          product.addedOffers.forEach(offerAdded => {
            const endDate = new Date(offerAdded.offer.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (endDate.getTime() >= today.getTime()) {
              product.totalOffers += offerAdded.offer.discount;
              product.priceAfterOffers -= (offerAdded.offer.discount / 100) * product.price;
            }

          });
        });
        console.log('my products::', this.products);
      }, error => {
        console.log('there is an error :; ', error)
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
  category: Category
  cover_image: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  images: Array<{ id: number; url: string }>;
  addedOffers: OfferItem[];
  user: User;
  totalOffers: number;
  priceAfterOffers: number;
}
interface Category {
  id: number;
  category_name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

