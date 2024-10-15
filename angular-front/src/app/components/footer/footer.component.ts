import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedService } from '../../services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule,
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentLanguage: string ='en';
  constructor(private sharedService: SharedService){
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });
          
  }
}
