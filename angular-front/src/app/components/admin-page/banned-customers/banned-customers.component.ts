import { Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 
	



@Component({
  selector: 'app-banned-customers',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule,FormsModule],
  templateUrl: './banned-customers.component.html',
  styleUrl: './banned-customers.component.css'
})
export class BannedCustomersComponent {
  currentLanguage: string ='en';

  customers:any [] |null [] =[];
  page: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  totalCustomers: number = 0;

  constructor( private sharedService: SharedService,
    private toastr :ToastrService,
    private customerService: CustomerService ) {

      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
        });
     }
  ngOnInit(): void {
    this.updateCustomers();
    }
    search(): void {
      this.currentPage = 1;
      this.updateCustomers();
  
  
    }
    onPageChange(event: PageEvent) {
      this.currentPage = event.pageIndex + 1;
      this.itemsPerPage = event.pageSize;
      this.updateCustomers();
    }
  
    activate(customer:any){
      this.customerService.unBanCustomer(customer.id).subscribe(
        response=>{
          this.updateCustomers();
if (this.currentLanguage == 'en'){
  this.toastr.success('user activated successfully');
}else{
  this.toastr.success('تمت العمليه بنجاح');
}
        },error=>
          {
            
 if (this.currentLanguage == 'en'){
  this.toastr.error('some error happend');
}else{
  this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
}

          }
      );
    }
    updateCustomers(){
      this.customerService.getAllBannedCustomers(
        this.currentPage,
      this.itemsPerPage,
      this.searchTerm,
      ).subscribe(response => {
              this.customers = response.data;
              this.totalCustomers = response.total; 

      },
      error => {
        
        console.error('some error happend:', error);
    
      });
    }


}

