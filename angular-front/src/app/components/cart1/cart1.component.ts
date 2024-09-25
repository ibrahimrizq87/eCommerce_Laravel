import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";

@Component({
  selector: 'app-cart1',
  standalone: true,
  imports: [CustomerHeaderComponent],
  templateUrl: './cart1.component.html',
  styleUrl: './cart1.component.css'
})
export class Cart1Component {

}
