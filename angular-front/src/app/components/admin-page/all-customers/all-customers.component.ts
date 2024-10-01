import { Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-all-customers',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './all-customers.component.html',
  styleUrl: './all-customers.component.css'
})
export class AllCustomersComponent {
  customers:any [] |null [] =[];
  page: number = 1;              
  itemsPerPage: number = 10; 
  constructor(private customerService: CustomerService ) { }
  ngOnInit(): void {
    this.updateCustomers();
    }

    banUser(customer:any){
      this.customerService.banCustomer(customer.id).subscribe(
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
      this.customerService.getAllCustomers().subscribe(response => {
        console.log(response);
        this.customers = response.data;
  
    
      },
      error => {
        
        console.error('some error happend:', error);
    
      });
    }


}
