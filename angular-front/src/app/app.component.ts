import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { WishListService } from './services/wishlist.service';
import { ReviewService } from './services/review.service';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HeaderComponent,
    FooterComponent,
    FormsModule
  ],
  providers: [
    CategoryService,
    ProductService,
    WishListService,
    ReviewService,
    UserService
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user: any;
  isLogged: Boolean = false; 

  title = 'angular-front';

  categories: any[] | null[] = [];
  constructor( private userService: UserService,
    private categoryService: CategoryService) { }

  ngOnInit(): void {




    if(sessionStorage.getItem('authToken')){
      this.isLogged = true;
      this.userService.getUser().subscribe(
        response => {
    
          this.user = response.data;
          this.userService.setUser(this.user);
          
        },
        error => {
          if (error.status === 400 || error.status === 500) {
            console.error('A specific error occurred:', error);
          } else if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            this.isLogged = false;
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      );
    }
      
        
    





    this.categoryService.getAllCategories().subscribe(response => {
      console.log(response);
      this.categories = response.data;
      this.categoryService.setAllCategory(this.categories);
    },
      error => {

        console.error('Registration failed:', error);
        console.log('Error: ' + error.error);

      });
  }
}

