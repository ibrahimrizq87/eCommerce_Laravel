import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../../services/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
 
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',

})




export class EditProfileComponent {
  @Output() linkClicked = new EventEmitter<string>();
  
  
  
isSeller :Boolean = false;
  selectedFile: File | null = null;
  submitted: boolean = false;
  imageUploaded = false;
  backendErrors: any = {};
  currentLanguage: string ='en';
  constructor(private toastr:ToastrService,
    private sharedService: SharedService,
    private customerService: CustomerService) {

    this.sharedService.updateLanguage();  
this.sharedService.language$.subscribe(language => {
this.currentLanguage = language;
});

   }

  customer:any;


  ngOnInit(): void {
    this.customerData();
    }

  

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageUploaded = event.target.files && event.target.files.length > 0;

  }
  changePassword(){
  this.customerService.setCurrentCustomer(this.customer);
  this.linkClicked.emit('change-password');
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

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }


   this.customerService.updateCustomer(formData).subscribe(
    response=>{
      if (this.currentLanguage == 'en'){
        this.toastr.success('updated successfully')
      }else{
        this.toastr.success('تمت العمليه بنجاح');
      }
        
      this.customerService.setCurrentCustomer(response.data);
      this.linkClicked.emit('profile');
    },error=>{
      if (error.status === 400) {
        this.backendErrors = error.error.errors;

        // console.error('Registration failed:', error);
        // console.log('Error: ' + error.error.errors);

        // Object.keys(error.error.errors).forEach(key => {
        //   console.log('Field:', key);

        //   error.error.errors[key].forEach((message: String) => {
        //     console.log('Error message:', message);
        //   });
        // });
      }
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

    }else{
    this.customerService.getCustomer().subscribe(
        response=>{
          this.customer =response.data;
        },error=>{
          if(error.status === 401){
            // alert('login first please');
          }

        }
      );
    }
  }

}



