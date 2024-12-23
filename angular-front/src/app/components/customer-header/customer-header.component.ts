import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/language.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './customer-header.component.html',
  styleUrl: './customer-header.component.css'
})
export class CustomerHeaderComponent {
  categories:any;
  constructor(
    private userService: UserService,
    private sharedService:SharedService,
    private categoryService: CategoryService
  ) { }

  
  
    currentLanguage: string = 'en'; 
  
    ngOnInit() {
      this.loadLanguage();
      this.getCategories();
  
    }


    getCategories(){
      this.categories = this.categoryService.getAllCategory();
      if (this.categories.length < 1) {
        this.categoryService.getAllCategories().subscribe(response => {
          this.categories = response.data;
        }, error => {
          console.log('failure is: ', error);
        });
  
      }
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
