import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-seller-header',
  standalone: true,
  templateUrl: './seller-header.component.html',
  styleUrls: ['./seller-header.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})
export class SellerHeaderComponent {
  @Output() linkClicked = new EventEmitter<string>();

  onLinkClick(component: string) {
    console.log('Emitting:', component);  // Debugging: check what component is being emitted
    this.linkClicked.emit(component); 
  }
}
