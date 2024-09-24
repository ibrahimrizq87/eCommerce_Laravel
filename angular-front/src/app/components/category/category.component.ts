
  import { Component } from '@angular/core';
  import { CategoryService } from '../../services/category.service';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-category',
    standalone: true,
    imports: [    CommonModule],

    templateUrl: './category.component.html',
    styleUrl: './category.component.css'
  })
  export class CategoryComponent {
  categories:any [] |null [] =[];
    constructor(private categoryService: CategoryService ,private router: Router) { }


    onCategoryClick(category: any): void {
      this.categoryService.setCategory(category);
      this.router.navigate(['/products']);
    }
    
    
    ngOnInit(): void {
      this.categoryService.getAllCategories().subscribe(response => {
        console.log(response);
        this.categories = response.data;
        this.categories.forEach(element => {
          console.log(element.image);
        });

      },
      error => {
        
        console.error('Registration failed:', error);
        console.log('Error: ' + error.error);

      });
    }

  }
