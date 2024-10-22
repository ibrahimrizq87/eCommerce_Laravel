import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/language.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './customer-header.component.html',
  styleUrl: './customer-header.component.css'
})
export class CustomerHeaderComponent {

  constructor(
    private userService: UserService,
    private sharedService:SharedService
  ) { }

  
  
    currentLanguage: string = 'en'; 
  
    ngOnInit() {
      this.loadLanguage();
  
    }
  
    changeLanguage(lang: string) {
      this.currentLanguage = lang;
      this.sharedService.setLanguage(lang);
    }
  
    loadLanguage() {
    
      this.currentLanguage = this.sharedService.getLanguage();
  
    }



  logout(): void {

    this.userService.logOut().subscribe(
      response => {
        sessionStorage.removeItem('authToken');
        window.location.reload();
      },
      error => {
        if (error.status === 400 || error.status === 500) {
          // console.error('A specific error occurred:', error);
        } else {
          // console.error('An unexpected error occurred:', error);
        }
      }
    );


  }

}
