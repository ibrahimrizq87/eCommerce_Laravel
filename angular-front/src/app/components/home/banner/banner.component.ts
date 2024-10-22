import { Component } from '@angular/core';
import { OrderPaymentService } from '../../../services/order-payment.service';
import {  Router,RouterModule } from '@angular/router';
import { CarouselComponent } from "../../carousel/carousel.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/language.service';
@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    RouterModule,
    CarouselComponent,
    CommonModule
],
  providers: [OrderPaymentService],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  currentLanguage: string ='en';
  constructor(private sharedService: SharedService,
    private OrderPaymentService: OrderPaymentService , private router: Router) {
      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
        });
     }

  goTOProducts(){
    this.router.navigate(['/products']);

  }

}
