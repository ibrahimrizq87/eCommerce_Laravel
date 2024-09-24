import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CustomerHeaderComponent, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

}
