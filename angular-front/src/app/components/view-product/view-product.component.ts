import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { CommonModule } from '@angular/common';
import { ReviewComponent } from "../product-details/review/review.component";
import { ViewReviewsComponent } from "../view-reviews/view-reviews.component";


@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CustomerHeaderComponent, CommonModule, ReviewComponent, ViewReviewsComponent],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {
  // for watch video
  showVideo = false;
  reviews: any;

  toggleVideo() {
    this.showVideo = !this.showVideo;
  }


  //for review 
  showReview = false;
  toggleReview() {
    this.showReview = !this.showReview;
  }
} 
