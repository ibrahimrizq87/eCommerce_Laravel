import { Component, Output , EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-part',
  standalone: true,
  imports: [RouterModule,
    CommonModule],
  templateUrl: './list-part.component.html',
  styleUrl: './list-part.component.css'
})
export class ListPartComponent {
  @Output() linkClicked = new EventEmitter<string>();

  currentLanguage: string ='en';
  
  
  onLinkClick(component: string) {
    this.linkClicked.emit(component);
  }
constructor(private sharedService: SharedService){
  this.sharedService.updateLanguage();  
this.sharedService.language$.subscribe(language => {
this.currentLanguage = language;
});
}


}
