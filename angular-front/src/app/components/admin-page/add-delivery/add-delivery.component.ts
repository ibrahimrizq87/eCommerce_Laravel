import { Component , Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { GuestHeaderComponent } from "../../guest-header/guest-header.component";
import { SharedService } from '../../../services/language.service';
import { City } from '../../../services/city.service';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
  selector: 'app-add-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GuestHeaderComponent
  ],
  templateUrl: './add-delivery.component.html',
  styleUrl: './add-delivery.component.css'
})
export class AddDeliveryComponent {
  cities:any;
  isSeller: boolean = false;
  selectedFile: File | null = null;
  submitted: boolean = false;
  imageUploaded = false;
  user:any;
  backendErrors: any = {};
  currentLanguage: string ='en';

  @Output() linkClicked = new EventEmitter<string>();

  constructor(private city:City,
    private sharedService: SharedService,
    private userService: UserService, private deliveryService:DeliveryService) {
      this.sharedService.updateLanguage();  

      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
      });
       }

       onFileChange(event: any) {
        this.selectedFile = event.target.files[0];
        this.imageUploaded = event.target.files && event.target.files.length > 0;
    
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
    

      onSubmit(registerForm: any) {
        this.submitted = true;
        if (registerForm.valid) {
          const formData = new FormData();
      
          Object.keys(registerForm.value).forEach(key => {
            formData.append(key, registerForm.value[key]);
          });
    
          if (this.selectedFile) {
            formData.append('image', this.selectedFile);
          }
          formData.append('city_id', registerForm.value.city);

          this.userService.addDelivery(formData).subscribe(
            response => {
              this.deliveryService.setDelivery(response.user.data);
              alert('added successfully');
              this.linkClicked.emit('deliveries');
            },
            error => {
              if (error.status === 400 || error.status === 500) {
                this.backendErrors = error.error.errors;
                console.error('Registration failed:', error);
                console.log('Error: ' + error.error.errors);
    
                Object.keys(error.error.errors).forEach(key => {
                  console.log('Field:', key);
    
                    error.error.errors[key].forEach((message: String) => {
                    console.log('Error message:', message);
                  });
                });
              } else {
                console.error('An unexpected error occurred:', error);
                alert('an error happend');
              }
            }
          );
        } else {
          console.error('Form is invalid');
        }
      }


      ngOnInit(): void {
        this.city.getCities().subscribe(
          response=>{
            this.cities = response.data;
            console.log(this.cities);
          },error=>{
            console.log('error happen:' , error);
          }
        );
      }
    
}


























