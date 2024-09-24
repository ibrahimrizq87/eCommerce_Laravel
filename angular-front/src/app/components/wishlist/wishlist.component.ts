import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CustomerHeaderComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

}
