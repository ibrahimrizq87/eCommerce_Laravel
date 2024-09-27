import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css'] // Fixed typo from styleUrl to styleUrls
})
export class AddOfferComponent {
  startDate: string | undefined;
  endDate: string | undefined;
  minEndDate: string | undefined;

  onStartDateChange() {
    if (this.startDate) { // Check if startDate is defined
      this.minEndDate = this.startDate;
      if (this.endDate && this.endDate < this.startDate) {
        this.endDate = undefined;
      }
    }
  }

  submitDates() {
    if (this.startDate && this.endDate) {
      console.log('Start Date:', this.startDate);
      console.log('End Date:', this.endDate);
    }
  }
}
