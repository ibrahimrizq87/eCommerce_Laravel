import { Component } from '@angular/core';
import { SharedService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { RouterModule , Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';


@Component({
  selector: 'app-need-to-pay',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './need-to-pay.component.html',
  styleUrl: './need-to-pay.component.css'
})
export class NeedToPayComponent {
  currentLanguage: string ='en';
  url:string='';
  constructor(private sharedService: SharedService,
    private router:Router,
    private paymentService:PaymentService
   ){
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });
            
  }
  ngOnInit(): void {
    if (this.paymentService.getPaymentUrl()){
      this.url = this.paymentService.getPaymentUrl();
    }else{
      this.router.navigate(['/order']);
    }
  }

  goBackToOrders(){
    this.router.navigate(['/order']);
  }
  payNow(){
    window.open(this.url, '_blank');

  }
}
