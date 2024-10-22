import { Component, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';



@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    LottieComponent
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
  product: any;
  currentLanguage: string = 'en';
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
  
  submitted: boolean = false;
  categories: any[] = [];
  selectedVideo: File | null = null;
  imageUploaded = false;
  selectedFile: File | null = null;
  fileLimitExceeded = false;
  selectedFiles: File[] = [];
  selectedColorImages: File[] = [];
  sizes: Size[] = [];
  backendErrors: any = {};
  sizeText: string = '';
  sizePrice: number = 0;
  colors: any;

  coverImage: string = '';
  selectedImage: string = '';
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
  @Output() linkClicked = new EventEmitter<string>();
  constructor(private categoryService: CategoryService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private productService: ProductService) {

    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
  }
  ngOnInit(): void {
    this.updateProduct();
    this.updateCategories();
    this.getSizes();
  }
  getSizes() {

  }
  removeImage(file: File): void {
    this.selectedColorImages = this.selectedColorImages.filter(selectedFile => selectedFile !== file);
  }
  onColorFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      if (event.target.files.length > 8) {
        this.selectedFiles = [];
        this.toastr.error('can not add more than 8 images');
      } else {
        this.selectedColorImages = Array.from(event.target.files);
      }
    }

  }
  updateCategories() {
    this.categories = this.categoryService.getAllCategory();
    // console.log('categories:: ', this.categories);

    if (this.categories.length < 1) {
      this.categoryService.getAllCategories().subscribe(response => {
        this.categories = response.data;
        // console.log('categories:: ', this.categories);
      }, error => {
        console.log('failure is: ', error);
      });

    }
  }

  deleteSize(index: number) {

    this.sizes.splice(index, 1);

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

  updateProduct() {
    if (this.productService.getSelectedProduct()) {
      this.product = this.productService.getSelectedProduct();
      // console.log(this.product);
    } else {
      this.linkClicked.emit('all-products');

    }
    this.coverImage = this.product.cover_image;
    if (this.product.sizes) {
      this.sizes = this.product.sizes;

    }
    if (this.product.sizes) {
      this.colors = this.product.colors;

    }

  }

  onImageClick(image: string) {
    this.coverImage = image;
    this.selectedImage = image;
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
  onSubmit(form: any): void {
    this.submitted = true;

    if (form.invalid || this.selectedFiles.length > 5 || this.sizes.length === 0) {
      this.toastr.error('data is not complete ');
    } else {
      this.disable = true;

      const formData = new FormData();
      formData.append('product_name', form.value.title);
      formData.append('price', this.sizes[0].price.toString());
      formData.append('description', form.value.description);
      formData.append('category_id', form.value.category);
      formData.append('stock', form.value.stock);
      // formData.append('size', form.value.size);
      formData.append('material', form.value.material);
      formData.append('id', this.product.id);


      if (this.selectedFile) {
        formData.append('cover_image', this.selectedFile);
      }
      this.selectedFiles.forEach((file, index) => {
        formData.append('images[]', file);
      });
      if (this.selectedVideo) {
        formData.append('video', this.selectedVideo);
      }
      this.sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][size]`, size.size);
        formData.append(`sizes[${index}][price]`, size.price.toString());
      });
  
      this.selectedColorImages.forEach((file, index) => {
        formData.append('colors[]', file);  
      });

      formData.forEach((value, key) => {
        console.log(key, value);
      });

      this.productService.updateProduct(formData).subscribe(

        response => {
          this.disable = false;

          if (this.currentLanguage == 'en') {
            this.toastr.success('updated successfully');
          } else {
            this.toastr.success('تمت العمليه بنجاح');
          }


          this.linkClicked.emit('all-products');


        }, error => {
          this.backendErrors = error.error.errors;
          this.disable = false;

          if (this.currentLanguage == 'en') {
            this.toastr.error('some error happend');
          } else {
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          } if (error.status === 400) {
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
        });

    }
  }

}


interface Size {
  size: string;
  price: number;
}
