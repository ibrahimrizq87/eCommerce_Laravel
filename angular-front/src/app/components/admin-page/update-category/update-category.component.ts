import { Component, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 


@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    LottieComponent
  ],  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent {
  selectedFile: File | null = null;
  submitted: boolean = false;
  backendErrors: any = {};
  category:any;
  currentLanguage: string ='en';
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
  constructor(
    private sharedService: SharedService,
      private toastr :ToastrService,
      private categoryService: CategoryService ) { 
        this.sharedService.language$.subscribe(language => {
          this.currentLanguage = language;
          });

          
      }
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];

  }

  ngOnInit(): void {

    this.getCategories();

  
  this.category =this.categoryService.getSelectedCategory();
  if(this.category){
// console.log(this.category );
  }else{
    this.linkClicked.emit('all-categories');

  }
}


getCategories(){
  this.categoryService.getParentCategories().subscribe(response => {
    this.categories = response.data;
    // console.log(this.categories);
    // console.log(this.category);

  }, error => {
    console.log('failure is: ', error);
  });
}

onSubmit(categoryForm: any) {
  this.submitted = true;
  if (categoryForm.valid ) {
    this.disable = true;
    const formData = new FormData();


  
    Object.keys(categoryForm.value).forEach(key => {
      formData.append(key, categoryForm.value[key]);


    });
    formData.append('id', this.category.id);
if( categoryForm.value.category){
  formData.append('parent_id', categoryForm.value.category);
}



    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

formData.forEach((value, key) => {
});

this.categoryService.updateCategory(formData, this.category.id).subscribe(
response=>{
  this.disable = false;
  if (this.currentLanguage == 'en'){
    this.toastr.success('updates successfully');
  }else{
    this.toastr.success('تمت العمليه بنجاح');
  }
  this.linkClicked.emit('all-categories');

},error=>{
  this.disable = false;

  if (error.status === 422) {
    this.backendErrors = error.error.errors;
    // console.log('Error: ' + error.error.errors);

    // Object.keys(error.error.errors).forEach(key => {
    //   // console.log('Field:', key);

    //   error.error.errors[key].forEach((message: String) => {
    //     // console.log('Error message:', message);
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

  } else {
  }
}
}
