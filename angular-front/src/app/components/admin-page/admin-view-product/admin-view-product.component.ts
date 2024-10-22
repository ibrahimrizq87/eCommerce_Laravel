import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-view-product',
  standalone: true,
   imports: [CommonModule,
    FormsModule
  ], 

  templateUrl: './admin-view-product.component.html',
  styleUrl: './admin-view-product.component.css'
})
export class AdminViewProductComponent {
  product: any; 
  currentSize: any;

  stars: number = 0;
  addedOffer: OfferItem[] = [];
  currentLanguage: string ='en';
  coverImage: string = '';
  selectedImage: string = '';
  reviews: Feedback[] = [];
  offers: Offer[] = [];

  @Output() linkClicked = new EventEmitter<string>();
  constructor(private productService: ProductService ,
    private sharedService: SharedService,
		 private toastr :ToastrService,
     private reviewService:ReviewService) {
      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
        });
  
      }

  onImageClick(image: string) {
    this.coverImage = image;
    this.selectedImage = image;
  }

  changeSize(size:any){
    this.currentSize = size;
    this.product.price = size.price;
    
    let myproduct:Product = this.product;
    myproduct.totalOffers=0;
    myproduct.priceAfterOffers = myproduct.price;
    myproduct.addedOffers.forEach(offerAdded => {
      const endDate = new Date(offerAdded.offer.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endDate.getTime() >= today.getTime()) {
        myproduct.totalOffers += offerAdded.offer.discount;
        myproduct.priceAfterOffers -= Math.floor((offerAdded.offer.discount / 100) * myproduct.price);
      }

    });
    this.product = myproduct;


  }
ngOnInit(): void {
  this.updateProducts();  
  this.updateReview();
}

selectedColor:any;
selectImage(color: any): void {
  this.selectedColor = color;
  this.coverImage = color.image;
}
deleteReview(review:any){
  this.reviewService.deleteReview(review.id).subscribe(
    response=>{
      if (this.currentLanguage == 'en'){
        this.toastr.success('deleted successfully');
      }else{
        this.toastr.success('تمت العمليه بنجاح');
      }
          this.updateReview();

    }, error =>{
      if (this.currentLanguage == 'en'){
        this.toastr.error('some error happend');
      }else{
        this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
      }

    }
  );
}
updateProducts(){

  if (this.productService.getSelectedProduct()){
this.product = this.productService.getSelectedProduct();
this.coverImage = this.product.cover_image;

this.addedOffer = this.product.addedOffers;
this.offers =[];
this.currentSize = this.product.sizes[0];
this.addedOffer.forEach(addedOffer => {
  this.offers.push(addedOffer.offer);
})
this.offers
// console.log('product: ', this.product);
this.coverImage = this.product.cover_image;



// console.log('my productdndk' ,this.product);
  }else{
    this.linkClicked.emit('all-products');

  }
}

updateReview(){
  this.reviewService.getAllReviews(this.product.id).subscribe(
    response => {
      this.reviews = response.data;
      this.stars=0;

      this.reviews.forEach(review => {
        this.stars += review.rating;

      });
if (this.reviews.length > 0) {
this.stars = Math.floor(this.stars / this.reviews.length);

}else{
this.stars = 0;
}


    }, error => {

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
  last_name: string;
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
interface Feedback {
  id: number;
  feedback: string;
  rating: number;
  user: User;
  product: Product;
}



