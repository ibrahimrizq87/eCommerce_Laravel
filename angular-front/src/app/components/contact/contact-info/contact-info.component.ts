import { Component } from '@angular/core';
import { SharedService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css'
})
export class ContactInfoComponent {
  currentLanguage: string ='en';

  constructor(private sharedService: SharedService,){
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });
            
  }
}
