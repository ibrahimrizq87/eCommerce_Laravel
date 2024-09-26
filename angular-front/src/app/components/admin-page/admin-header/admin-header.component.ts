import { Component , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  @Output() linkClicked = new EventEmitter<string>();

  onLinkClick(component: string) {
    console.log('Emitting:', component);  // Debugging: check what component is being emitted
    this.linkClicked.emit(component); 
  }
}
