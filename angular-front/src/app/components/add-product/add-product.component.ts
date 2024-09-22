import { Component } from '@angular/core';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
})
export class AddProductComponent {
  title: string = '';
  price: number = 0;
  description: string = '';
  category: string = '';
  imageFiles: FileList | null = null;
  videoFile: File | null = null;

  constructor(private productService: ProductService) {}

  addProduct() {
    const newProduct = {
      title: this.title,
      price: this.price,
      description: this.description,
      category: this.category,
      images: this.imageFiles,
      video: this.videoFile,
    };

    this.productService.addProduct(newProduct).subscribe(response => {
      console.log('Product added:', response);
      // Reset the form or show a success message
    });
  }
}
