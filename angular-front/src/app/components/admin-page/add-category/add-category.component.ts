import { Component, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    LottieComponent
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  selectedFile: File | null = null;
  submitted: boolean = false;
  imageUploaded = false;
  currentLanguage: string = 'en';
  categories:any;
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
  
  @Output() linkClicked = new EventEmitter<string>();
  


  ngOnInit(): void {
    this.getCategories();
  }
  constructor(private sharedService: SharedService,
    private toastr: ToastrService,
    private categoryService: CategoryService) {
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

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

  getCategories(){
    // this.categories = this.categoryService.getAllCategory();
    this.categoryService.getParentCategories().subscribe(response => {
      this.categories = response.data;
    }, error => {
      console.log('failure is: ', error);
    });
    // if (this.categories.length < 1) {
     

    // }
  }
  onSubmit(categoryForm: any) {
    this.submitted = true;
    if (categoryForm.valid) {
      this.disable = true;
      const formData = new FormData();



      Object.keys(categoryForm.value).forEach(key => {
        formData.append(key, categoryForm.value[key]);
      });

      if (categoryForm.value.category) {
        formData.append('parent_id', categoryForm.value.category);
      }



      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      this.categoryService.addCategory(formData).subscribe(
        response => {
          this.disable = false;

          if (this.currentLanguage == 'en'){
            this.toastr.success('added successfully');
          }else{
            this.toastr.success('تمت العمليه بنجاح');
          }
          this.linkClicked.emit('all-categories');

        }, error => {
          this.disable = false;

          if (error.status === 422) {
            this.backendErrors = error.error.errors;
            Object.keys(error.error.errors).forEach(key => {
              error.error.errors[key].forEach((message: String) => {
              });
            });
          }
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
