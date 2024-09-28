import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CategoryService } from '../../services/category.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-carousel',
  standalone: true,
  imports: [CarouselModule, RouterModule, CommonModule],
  templateUrl: './category-carousel.component.html',
  styleUrl: './category-carousel.component.css'
})
export class CategoryCarouselComponent {
  customOptions: OwlOptions = {
    loop: true,          
    autoplay: true,      
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
