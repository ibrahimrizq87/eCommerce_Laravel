import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../../customer-header/customer-header.component";
import { RouterModule } from '@angular/router';
import { ListPartComponent } from '../../customer-profile/list-part/list-part.component';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CustomerHeaderComponent, ListPartComponent, RouterModule,],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css'
})
export class ViewOrderComponent {
  activeComponent: string = ''

  showComponent(component: string) {
    this.activeComponent = component;
  }
}
