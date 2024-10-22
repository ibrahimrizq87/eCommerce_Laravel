
import { Component, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    NgxPaginationModule,
    FormsModule],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent {
  categories:any [] |null [] =[];
  @Output() linkClicked = new EventEmitter<string>();

  page: number = 1;              
  itemsPerPage: number = 10;  

  filteredCategories: any[] = [];
  searchTerm: string = '';
  currentLanguage: string ='en';
  constructor(
    private sharedService: SharedService,
    private toastr :ToastrService,private categoryService: CategoryService ,private router: Router) { 
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
  
  ngOnInit(): void {
  this.updateCategories();
  }
updateCategories(){
  this.categoryService.getAllCategories().subscribe(response => {
    this.categories = response.data;
    this.filteredCategories = this.categories; 

   

  },
  error => {
    
    // console.error('some error happend:', error);
    // console.log('Error: ' + error.error);

  });
}
  updateCategory(category:any){
    this.categoryService.setCategory(category);
    this.linkClicked.emit('update-category');

  }
  addCategory(){
    this.linkClicked.emit('add-category');

  }
  deleteCategory(category:any){
    this.categoryService.deleteCategory(category.id).subscribe(
response=>{
  this.updateCategories();
  if (this.currentLanguage == 'en'){
    this.toastr.success('deleted successfully');
  }else{
    this.toastr.success('تمت العمليه بنجاح');
  }

},error=>{
  if (this.currentLanguage == 'en'){
    this.toastr.error('some error happend');
  }else{
    this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
  }
}
    );
  }

}
