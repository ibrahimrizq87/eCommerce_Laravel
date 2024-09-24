import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { WishListService } from './services/wishlist.service';
import { ReviewService } from './services/review.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HeaderComponent,
    FooterComponent,
    FormsModule
   ],
  providers: [CategoryService ,ProductService
    ,WishListService,
    ReviewService
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-front';

  categories:any [] |null [] =[];
    constructor(private categoryService: CategoryService ) { }
   
    ngOnInit(): void {
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
