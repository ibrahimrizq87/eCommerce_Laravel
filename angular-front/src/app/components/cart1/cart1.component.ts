import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart1',
  standalone: true,
  imports: [CustomerHeaderComponent, RouterModule],
  templateUrl: './cart1.component.html',
  styleUrl: './cart1.component.css'
})
export class Cart1Component {

}
