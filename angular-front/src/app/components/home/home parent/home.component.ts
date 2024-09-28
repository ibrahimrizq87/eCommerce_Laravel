import { Component } from '@angular/core';
import { HomeContentComponent } from '../home-content/home-content.component';
import { BannerComponent } from '../banner/banner.component';
import { LatestProductsComponent } from '../latest-products/latest-products.component';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from "../../carousel/carousel.component";
import { CategoryCarouselComponent } from "../../../home/category-carousel/category-carousel.component";
import { ProductCarouselComponent } from "../../../home/product-carousel/product-carousel.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeComponent,
    HomeContentComponent,
    BannerComponent,
    LatestProductsComponent,
    RouterModule,
    CarouselComponent,
    CategoryCarouselComponent,
    ProductCarouselComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
