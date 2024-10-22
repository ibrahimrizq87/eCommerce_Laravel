import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { SharedService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
 

@Component({
  selector: 'app-banned-user',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './banned-user.component.html',
  styleUrl: './banned-user.component.css'
})
export class BannedUserComponent {


  currentLanguage: string ='en';

constructor(	 private sharedService: SharedService,
  private router:Router){

 this.sharedService.language$.subscribe(language => {
  this.currentLanguage = language;
  });
  }
goToContact(){
  this.router.navigate(['/contact']);
}
back(){
  this.router.navigate(['/login']);

}
ngOnInit(): void {
 if(sessionStorage.getItem('banned')){
  sessionStorage.removeItem('banned');
 }else{
  this.router.navigate(['/login']);

 }
}
}

