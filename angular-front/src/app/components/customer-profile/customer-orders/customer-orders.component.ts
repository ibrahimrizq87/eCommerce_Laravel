import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [RouterModule ],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent {
  activeComponent: string = ''

  showComponent(component: string) {
    this.activeComponent = component;
  }
  @Output() linkClicked = new EventEmitter<string>();

  // Emit the component identifier when a link is clicked
  onLinkClick(component: string) {
    this.linkClicked.emit(component);
  }
}
