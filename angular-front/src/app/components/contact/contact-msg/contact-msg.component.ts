import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../../../services/contact.service';
import { RouterModule ,Router } from '@angular/router';
import { SharedService } from '../../../services/language.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contact-msg',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
 
  templateUrl: './contact-msg.component.html',
  styleUrl: './contact-msg.component.css'
})
export class ContactMsgComponent {
  submitted: boolean = false;
  imageUploaded = false;
  backendErrors: any = {};

  currentLanguage: string ='en';
  constructor(private customerService: CustomerService,
    private contactService:ContactService,
    private router :Router,
    private toastr :ToastrService,
    private sharedService: SharedService,
  ) {
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });
            
   }

  customer: any = {
    user: {
      name: '',
      email: ''
    },
    phone: ''
  };



  ngOnInit(): void {
    this.customerData();
    }

  


  getErrorMessages(): string[] {
    const errorMessages: string[] = [];
    if (this.backendErrors) {
      Object.keys(this.backendErrors).forEach(key => {
        this.backendErrors[key].forEach((message: string) => {
          errorMessages.push(`${key}: ${message}`);
        });
      });
    }
    return errorMessages;
  }

  
  onSubmit(from: any) {
    this.submitted = true;
    if (from.valid) {
      const formData = new FormData();
      
      Object.keys(from.value).forEach(key => {
        formData.append(key, from.value[key]);
      });
      this.contactService.setMessage(formData).subscribe(
        response=>{
          if (this.currentLanguage == 'en'){
            this.toastr.success('message sent successfully');
          }else{
            this.toastr.success('تمت العمليه بنجاح');
          }
            
          this.router.navigate(['/home']);


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
  customerData(){
    if(this.customerService.getCurrentCustomer()){
      this.customer =  this.customerService.getCurrentCustomer();
      console.log('customer', this.customer)

    }else{
    this.customerService.getCustomer().subscribe(
        response=>{
          this.customer =response.data;
          // console.log('customer data', this.customer)
        },error=>{
          if(error.status === 401){
          }
          // console.log('error happend is:: ',error);

        }
      );
    }
  }


}
