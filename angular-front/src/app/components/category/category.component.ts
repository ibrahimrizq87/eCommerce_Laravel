
import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedService } from '../../services/language.service';



  @Component({
    selector: 'app-category',
    standalone: true,
    imports: [CarouselModule ,FormsModule , CommonModule, RouterModule, CustomerHeaderComponent, NgxPaginationModule],


    templateUrl: './category.component.html',
    styleUrl: './category.component.css'
  })
  export class CategoryComponent {
    customOptions: OwlOptions = {
      loop: true, 
      margin: 10, 
      nav: true, 
      navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'], 
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 3
        },
        1000: {
          items: 5 
        }
      }
    };
    parents: any;

    getCategories(){
      this.categoryService.getParentCategories().subscribe(response => {
        this.parents = response.data;
      }, error => {
        console.log('failure is: ', error);
      });
    }


    getSubCategories(){
      this.categoryService.getParentCategories().subscribe(response => {
        this.parents = response.data;
      }, error => {
        console.log('failure is: ', error);
      });
    }



    onItemClick(parent: any): void {
      // console.log('Clicked item:', parent);
      // alert(`You clicked on ${parent.name}`);
      this.selectedId = parent.id;

      this.categoryService.getCategoriesByParent(parent.id).subscribe(response => {
     this.categories = response.data;
         this.filteredCategories = this.categories; 
            }, error => {
        console.log('failure is: ', error);
      });

    }

    selectedId: number | null = null;
    currentLanguage: string = 'en';

  categories:any [] |null [] =[];
  filteredCategories: any[] = [];
  page: number = 1;              
  itemsPerPage: number = 20; 
  searchTerm: string = '';


    constructor(private categoryService: CategoryService ,
      private router: Router,
      private sharedService: SharedService,
    ) { 
      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
      });
    }



  search() {
    if (this.searchTerm) {
      this.filteredCategories = this.categories.filter(categories =>
        categories.category_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCategories = this.categories; 
    }
  }

    onCategoryClick(category: any): void {
      this.categoryService.setCategory(category);
      this.router.navigate(['/products']);
    }
    
    
    ngOnInit(): void {
      // this.categoryService.getAllCategories().subscribe(response => {
      //   // console.log(response);
      //   this.categories = response.data;
      //   this.filteredCategories = this.categories; 

     

      // },
      // error => {
        
      //   // console.error('Error getting data:', error);

      // });

    this.getCategories(); 
    }

  }
