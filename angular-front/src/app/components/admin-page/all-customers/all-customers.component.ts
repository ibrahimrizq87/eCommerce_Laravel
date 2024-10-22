import { Component, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 


 
@Component({
  selector: 'app-all-customers',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatPaginatorModule],
  templateUrl: './all-customers.component.html',
  styleUrl: './all-customers.component.css'
})
export class AllCustomersComponent {
  customers: any[] | null[] = [];
  currentLanguage: string ='en';


  page: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  totalCustomers: number = 0;

  @Output() linkClicked = new EventEmitter<string>();

  constructor(	 private sharedService: SharedService,
    private toastr :ToastrService,private customerService: CustomerService) { 
      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
        });
    }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.updateCustomers();
  }


  search(): void {
    this.currentPage = 1;
    this.updateCustomers();


  }


  viewCustomer(customer: any) {
    // console.log('herererer')
    this.customerService.setCurrentCustomer(customer);
    sessionStorage.setItem('return-to', 'all-customers');

    this.linkClicked.emit("show-customer");

  }

  ngOnInit(): void {
    this.updateCustomers();
  }

  banUser(customer: any) {
    this.customerService.banCustomer(customer.id).subscribe(
      response => {
        this.updateCustomers();
        if (this.currentLanguage == 'en'){
          this.toastr.success('user banned  successfully');
        }else{
          this.toastr.success('تمت العمليه بنجاح');
        }
      }, error => {
        if (this.currentLanguage == 'en'){
          this.toastr.error('some error happend');
        }else{
          this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
        }      // console.log('error happend', error);

    }
    );
  }
  updateCustomers() {
    this.customerService.getAllCustomers(
      this.currentPage,
      this.itemsPerPage,
      this.searchTerm,
    ).subscribe(response => {
      this.customers = response.data;
      this.totalCustomers = response.total; 

      // this.filteredCustomers = this.customers;


    },
      error => {

        // console.error('some error happend:', error);

      });
  }


}
