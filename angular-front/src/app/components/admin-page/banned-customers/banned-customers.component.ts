import { Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-banned-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banned-customers.component.html',
  styleUrl: './banned-customers.component.css'
})
export class BannedCustomersComponent {

  customers:any [] |null [] =[];
  constructor(private customerService: CustomerService ) { }
  ngOnInit(): void {
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
      this.customerService.getAllBannedCustomers().subscribe(response => {
        console.log(response);
        this.customers = response.data;
  
    
      },
      error => {
        
        console.error('some error happend:', error);
    
      });
    }


}

