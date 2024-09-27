import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Output() linkClicked = new EventEmitter<string>();
  
  onLinkClick(component: string) {
    console.log('Emitting:', component);
    this.linkClicked.emit(component);
  }
}
