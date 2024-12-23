import { Component, Output, EventEmitter } from '@angular/core';

import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../services/product.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';

@Component({
  selector: 'app-add-product',

  imports: [FormsModule
    , CommonModule,
    LottieComponent
  ],
  standalone: true,

  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  @Output() linkClicked = new EventEmitter<string>();
  private lodingAnimaation: AnimationItem | undefined;
  disable: boolean = false;

  lodingAnimaationOptions: AnimationOptions = {
    path: 'animations/loading-main.json',
    loop: true,
    autoplay: true
  };

  loadingAnimation(animationItem: AnimationItem): void {
    this.lodingAnimaation = animationItem;

  }

  fileLimitExceeded = false;
  categories: any[] = [];
  selectedFiles: File[] = [];
  selectedColorImages: File[] = [];
  imagePreviews: string[] = [];      // Array to store image preview URLs

  submitted = false;
  sizes: Size[] = [];
  backendErrors: any = {};
  selectedVideo: File | null = null;
  imageUploaded = false;
  currentLanguage: string = 'en';
  selectedFile: File | null = null;
  sizeText: string = '';
  sizePrice: number = 0;
  constructor(private sharedService: SharedService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });

  }



  ngOnInit(): void {
   
      this.categoryService.getSubCategories().subscribe(response => {
        this.categories = response.data;
      }, error => {
        console.log('failure is: ', error);
      });

    
  }
  deleteSize(index: number) {

    this.sizes.splice(index, 1);

  }
  addsize() {
    if (this.sizeText && this.sizePrice > 0) {
      this.sizes.push({ 'size': this.sizeText, 'price': this.sizePrice });
      this.sizeText = '';
      this.sizePrice = 0;
      this.toastr.success('added successfully');

    } else {
      this.toastr.error('can not add size without both size and price');
    }
  }
  onCoverImageSelect(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageUploaded = event.target.files && event.target.files.length > 0;

  }

  onVideoSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedVideo = event.target.files[0];
      // console.log('Selected Video:', this.selectedVideo);
    }
  }
  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      // this.selectedFiles = Array.from(event.target.files); 
      if (event.target.files.length > 5) {
        this.fileLimitExceeded = true;
        this.selectedFiles = [];
      } else {
        this.fileLimitExceeded = false;
        this.selectedFiles = Array.from(event.target.files);
      }
    }
  }
  onColorFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      if (event.target.files.length > 8) {
        this.selectedFiles = [];
        this.toastr.error('can not add more than 8 images');
      } else {
        this.selectedColorImages = Array.from(event.target.files);
        this.imagePreviews = [];
        this.selectedColorImages.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreviews.push(e.target?.result as string); // Store the preview URL
          };
          reader.readAsDataURL(file);  // Read the file as a Data URL
        });
      }
    }

  }

  removeImage(file: File): void {
    this.selectedColorImages = this.selectedColorImages.filter(selectedFile => selectedFile !== file);
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
  addColor() {

  }
  onSubmit(form: any): void {
    this.submitted = true;
    // console.log('form.invalid:',form.invalid);
    // console.log('this.selectedFiles.length:',this.selectedFiles.length);
    // console.log('this.selectedFiles.length:',this.selectedFiles.length);
    // console.log('this.sizes.length === 0:',this.sizes.length === 0);

    // console.log('product_name', form.value.title);
    // console.log('price', this.sizes[0].price.toString());
    // console.log('description', form.value.description);
    // console.log('category_id', form.value.category);
    // console.log('stock', form.value.stock);
    // console.log('size', form.value.size);
    // console.log('material', form.value.material);

    if (form.invalid || this.selectedFiles.length === 0 || this.selectedFiles.length > 5 || this.sizes.length === 0) {
      this.toastr.error('data is not complete ');
    } else {
this.disable = true;
      const formData = new FormData();
      formData.append('product_name', form.value.title);
      formData.append('price', this.sizes[0].price.toString());
      formData.append('description', form.value.description);
      formData.append('category_id', form.value.category);
      formData.append('stock', form.value.stock);
      // formData.append('size', form.value .size);
      formData.append('material', form.value.material);


      if (this.selectedFile) {
        formData.append('cover_image', this.selectedFile);
      }
      this.selectedFiles.forEach((file, index) => {
        formData.append('images[]', file);
      });
      this.selectedColorImages.forEach((file, index) => {
        formData.append('colors[]', file);
      });

      this.sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][size]`, size.size);
        formData.append(`sizes[${index}][price]`, size.price.toString());
      });

      if (this.selectedVideo) {
        formData.append('video', this.selectedVideo);
      }

      // if (form.value.video) {
      //   formData.append('videos', form.value.video);
      // }


      this.productService.addProduct(formData).subscribe(

        response => {
          this.disable = false;
          if (this.currentLanguage == 'en') {
            this.toastr.success('added successfully');
          } else {
            this.toastr.success('تمت العمليه بنجاح');
          }
          this.linkClicked.emit('all-products');

        }, error => {
          this.disable = false;

          this.backendErrors = error.error.errors;
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
          } else {

            // console.log('faild to upload due to:',error);

          }
          console.log('faild to upload due to:', error);
          if (this.currentLanguage == 'en') {
            this.toastr.error('some error happend');
          } else {
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
        });

    }
  }
  openModal() {
    const modal = document.getElementById("myModal");
    if (modal != null) {
      modal.style.display = "block";

    }
  }
  closeModal() {
    const modal = document.getElementById("myModal");
    if (modal != null) {
      modal.style.display = "none";

    }
  }
}


interface Size {
  size: string;
  price: number;
}
