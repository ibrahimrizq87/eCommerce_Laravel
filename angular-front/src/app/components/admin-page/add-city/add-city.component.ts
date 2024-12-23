import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { City } from '../../../services/city.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 
@Component({
  selector: 'app-add-city',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css'
})
export class AddCityComponent {
  selectedFile: File | null = null;
  submitted: boolean = false;
  imageUploaded = false;


  @Output() linkClicked = new EventEmitter<string>();

  constructor(private sharedService: SharedService,
    private toastr :ToastrService,private cityService: City) { 
      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
        });
    }
  currentLanguage: string ='en';
  backendErrors: any = {};
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

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageUploaded = event.target.files && event.target.files.length > 0;

  }

  onSubmit(categoryForm: any) {
    this.submitted = true;
    if (categoryForm.valid && this.imageUploaded) {
      const formData = new FormData();



      Object.keys(categoryForm.value).forEach(key => {
        formData.append(key, categoryForm.value[key]);
      });



      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      this.cityService.addCity(formData).subscribe(
        response => {
          this.toastr.success('added successfully');
          this.linkClicked.emit('cities');

        }, error => {

          if (error.status === 422) {
            this.backendErrors = error.error.errors;

            Object.keys(error.error.errors).forEach(key => {

              error.error.errors[key].forEach((message: String) => {
              });
            });
          }
          this.toastr.error('some error happend');
        }
      );

    } else {
    }
  }
}



