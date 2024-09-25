import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CustomerHeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

}
