import { Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banned-customers',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule,FormsModule],
  templateUrl: './banned-customers.component.html',
  styleUrl: './banned-customers.component.css'
})
export class BannedCustomersComponent {

  customers:any [] |null [] =[];
  page: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  totalCustomers: number = 0;

  constructor(private customerService: CustomerService ) { }
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
alert('user banned successfully');
        },error=>
          {
            alert('some error happend');
            console.log('error happend',error);

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

