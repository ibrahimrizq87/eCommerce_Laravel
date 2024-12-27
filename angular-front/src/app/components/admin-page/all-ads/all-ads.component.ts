import { NgxPaginationModule } from 'ngx-pagination';
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/language.service';
import { AdService } from '../../../services/ad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-ads',
  standalone: true,
  imports: [NgxPaginationModule,CommonModule],
  templateUrl: './all-ads.component.html',
  styleUrl: './all-ads.component.css'
})
export class AllAdsComponent {
  page: number = 1;              
  itemsPerPage: number = 10; 
  filteredCategories:any; 
  categories:any;
  currentLanguage: string ='en';

    @Output() linkClicked = new EventEmitter<string>();
    constructor(
      private sharedService: SharedService,
      private toastr :ToastrService,
      private adService: AdService ) { 
        this.sharedService.language$.subscribe(language => {
          this.currentLanguage = language;
          });
  
      }
  addCategory(){
    this.linkClicked.emit('add-ads');

  }

  ngOnInit(): void {
    this.updateCategories();
    }
  updateCategories(){
    this.adService.getAllAds().subscribe(response => {
      this.categories = response;
      this.filteredCategories = this.categories; 
  // console.log( this.categories)
     
  
    },
    error => {
      
      // console.error('some error happend:', error);
      // console.log('Error: ' + error.error);
  
    });
  }
  deleteCategory(category:any){
    this.adService.deleteAd(category.id).subscribe(
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



