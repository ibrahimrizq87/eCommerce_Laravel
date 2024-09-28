import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [RouterModule, CommonModule, CarouselModule],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent {
  customOptions: OwlOptions = {
    loop: true,          
    autoplay: false,      
    autoplayTimeout: 3000, 
    autoplayHoverPause: true,  
    mouseDrag: true,     
    touchDrag: true,     
    navSpeed: 400,       
    navText: ['<','>'],
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
      1400: { items: 5 }
    },
    nav: true,           
    dots: true      
  };
}
