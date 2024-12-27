import { Component, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AdService } from '../../../services/ad.service';



@Component({
  selector: 'app-add-ads',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    LottieComponent
  ],
  templateUrl: './add-ads.component.html',
  styleUrl: './add-ads.component.css'
})
export class AddAdsComponent {

  backendErrors: any = {};

  selectedFile: File | null = null;
  submitted: boolean = false;
  imageUploaded = false;
  currentLanguage: string = 'en';
  categories:any;
  @Output() linkClicked = new EventEmitter<string>();

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
  
  


  constructor(private sharedService: SharedService,
    private toastr: ToastrService,
    private adService: AdService) {
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

  onSubmit(categoryForm: any) {
    this.submitted = true;
    if (categoryForm.valid) {
      this.disable = true;
      const formData = new FormData();



  
      formData.append('ad_description', categoryForm.value['ad_description'] || '');

      


      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.adService.addAd(formData).subscribe(
        response => {
          this.disable = false;

          if (this.currentLanguage == 'en'){
            this.toastr.success('added successfully');
          }else{
            this.toastr.success('تمت العمليه بنجاح');
          }
          this.linkClicked.emit('all-ads');

        }, error => {
          this.disable = false;

          if (error.status === 422) {
            this.backendErrors = error.error.errors;
            Object.keys(error.error.errors).forEach(key => {
              error.error.errors[key].forEach((message: String) => {
              });
            });
          }else if(error.status === 403){
            this.toastr.error('يجب ادخال صوره او وصف للاعلان');

          }
          console.log(error )
          if (this.currentLanguage == 'en'){
            this.toastr.error('some error happend');
          }else{
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
        }
      );

    } else {
    }
  }
}
