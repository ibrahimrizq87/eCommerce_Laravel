import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CustomerHeaderComponent, CommonModule , LottieComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  private successAnimationItem: AnimationItem | undefined;

  successAnimationOptions: AnimationOptions = {
     path: 'animations/confirmation.json', // Correct path
     loop: true,
     autoplay: true
   };
    successAnimationCreated(animationItem: AnimationItem): void {
     this.successAnimationItem = animationItem;
   }


  openModal() {
    const modal = document.getElementById("myModal");
    if (modal != null) {
      modal.style.display = "block";

    }
  }
  closeModal(){
    const modal = document.getElementById("myModal");
    if (modal != null) {
      modal.style.display = "none";
    }
    
  }
}
