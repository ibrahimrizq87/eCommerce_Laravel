import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../../services/offer.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
        
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [CommonModule, FormsModule ,LottieComponent],
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent {
  private lodingAnimaation: AnimationItem | undefined;
  disable:boolean =false;
  
            lodingAnimaationOptions: AnimationOptions = {
      path: 'animations/loading-main.json',
      loop: true,
      autoplay: true
    };
  
            loadingAnimation(animationItem: AnimationItem): void {
      this.lodingAnimaation = animationItem;
  
    }
  backendErrors: any = {};
  startDate: string | undefined;
  endDate: string | undefined;
  minEndDate: string | undefined;
  submitted = false;
  currentLanguage: string ='en';

  constructor(	 private sharedService: SharedService,
    private toastr :ToastrService,
    private offerService: OfferService) { 
      this.sharedService.language$.subscribe(language => {
        this.currentLanguage = language;
        });

    }
  @Output() linkClicked = new EventEmitter<string>();

  onStartDateChange() {
    if (this.startDate) {
      this.minEndDate = this.startDate;
      if (this.endDate && this.endDate < this.startDate) {
        this.endDate = undefined;
      }
    }
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
  onSubmit(form: any) {
    this.submitted = true;
    if (form.valid) {
      this.disable = true;
      const formData = new FormData();
      formData.append('start_date', form.value.startDate);
      formData.append('end_date', form.value.endDate);
      formData.append('discount', form.value.discount);

      this.offerService.addOffer(formData).subscribe(
        response => {
          this.disable = false;

          if (this.currentLanguage == 'en'){
            this.toastr.success('added successfully');
          }else{
            this.toastr.success('تمت العمليه بنجاح');
          }
          this.linkClicked.emit('all-offers');

        }, error => {
          this.disable = false;

          this.backendErrors = error.error.errors;
          if (error.status === 400) {
            this.backendErrors = error.error.errors;


            Object.keys(error.error.errors).forEach(key => {
         
            });
          }else{

          }
          if (this.currentLanguage == 'en'){
            this.toastr.error('some error happend');
          }else{
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
        }
      )

    }
  }

  submitDates() {
    if (this.startDate && this.endDate) {
      console.log('Start Date:', this.startDate);
      console.log('End Date:', this.endDate);
    }
  }
}
