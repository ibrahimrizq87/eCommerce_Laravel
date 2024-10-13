import { Component, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { SharedService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-info',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css'
})
export class CustomerInfoComponent {
  customer: any;
  currentLanguage: string ='en';

  constructor(private sharedService: SharedService,
    private router:Router,private customerService: CustomerService,

  ) { 
    this.sharedService.updateLanguage();  
    this.sharedService.language$.subscribe(language => {
    this.currentLanguage = language;
    });
          

  }
  @Output() linkClicked = new EventEmitter<string>();
  editProfile(){
    this.linkClicked.emit('edit-profile');

  }

  ngOnInit(): void {
    this.updateCustomer();
  }


  updateCustomer() {
    if(this.customerService.getCurrentCustomer()){
this.customer=this.customerService.getCurrentCustomer();
    }else{
      this.customerService.getCustomer().subscribe(
        response => {
          this.customer = response.data;
          console.log('customer::' , response.data);
        }, error => {
          console.log('an error happend:', error);
          if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            sessionStorage.setItem('loginSession', 'true');
            this.router.navigate(['/login']);
          }
  
        }
      );
    }
 
  }
}
