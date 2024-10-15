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
  showNow() {
    const requestData = { 'id': 2 };
    console.log('Sending request with data: ', requestData);
    this.OrderPaymentService.requestPayment(requestData).subscribe(
      response => {

        console.log(response);
        const url = response.url;
        window.open(url, '_blank');
      }
      , error => {
        if (error.status === 401) {
          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');
          this.router.navigate(['/login']);
        }
        console.error('An unexpected error occurred:', error);
        alert('an erro happend try again later');
        console.log('error happend::::', error);
      }
    )
  }
}
