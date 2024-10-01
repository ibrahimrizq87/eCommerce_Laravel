
import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent {
  categories:any [] |null [] =[];
  page: number = 1;              
  itemsPerPage: number = 10;  
  constructor(private categoryService: CategoryService ,private router: Router) { }

  ngOnInit(): void {
  this.updateCategories();
  }
updateCategories(){
  this.categoryService.getAllCategories().subscribe(response => {
    console.log(response);
    this.categories = response.data;
    this.categories.forEach(element => {
      console.log(element.image);
    });

  },
  error => {
    
    console.error('some error happend:', error);
    // console.log('Error: ' + error.error);

  });
}
  updateCategory(category:any){}
  deleteCategory(category:any){
    this.categoryService.deleteCategory(category.id).subscribe(
response=>{
  this.updateCategories();
  alert('deleted successfully');

},error=>{
console.log('error happened::' , error)
  alert('some error happened during deleting');
}
    );
  }

}
