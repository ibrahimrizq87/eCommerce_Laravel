import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { City } from '../../../services/city.service';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    NgxPaginationModule,
    FormsModule],  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent {
  Cities:any [] |null [] =[];
  @Output() linkClicked = new EventEmitter<string>();

  page: number = 1;              
  itemsPerPage: number = 10;  

  filteredCities: any[] = [];
  searchTerm: string = '';

  constructor(private cityService: City ,private router: Router) { }
  search() {
    if (this.searchTerm) {
      console.log(this.searchTerm);
      this.filteredCities = this.Cities.filter(categories =>
        categories.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCities = this.Cities; 
    }
  }
  
  ngOnInit(): void {
  this.updateCategories();
  }
updateCategories(){
  this.cityService.getCities().subscribe(response => {
    this.Cities = response.data;
    this.filteredCities = this.Cities; 

   

  },
  error => {
    
    console.error('some error happend:', error);
    // console.log('Error: ' + error.error);

  });
}
  // updateCategory(category:any){
  //   this.cityService.setCategory(category);
  //   this.linkClicked.emit('update-category');

  // }
  addCategory(){
    this.linkClicked.emit('add-city');

  }
  deleteCity(city:any){
    this.cityService.deleteCity(city.id).subscribe(
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