import { Component } from '@angular/core';
import { ItemInfoComponent } from "./item-info/item-info.component";
import { SimilarItemsComponent } from "./similar-items/similar-items.component";
import { ReviewComponent } from "./review/review.component";
import { ViewReviewsComponent } from "./view-reviews/view-reviews.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ItemInfoComponent, SimilarItemsComponent, ReviewComponent, ViewReviewsComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

}
