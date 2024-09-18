import { Component } from '@angular/core';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartContentComponent } from "./cart-content/cart-content.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CartListComponent,
    CartContentComponent,
    RouterOutlet
],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

}
