import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SharedService } from '../../services/language.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  currentLanguage: string = 'en';
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    navSpeed: 400,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
      1400: { items: 5 }
    },
    nav: false,
    dots: false
  };


  products: Product[] = [];

  constructor(private productService: ProductService,
    private router: Router,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private cartService: CartService
  ) {
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });

  }
  ngOnInit(): void {
    this.updateProduct();
  }

  ViewProduct(product: any) {

    this.productService.setProduct(product);
    this.router.navigate(['/product/view']);
  }
  updateProduct() {

    this.productService.getLatestProducts().subscribe(
      response => {
        this.products = response.data;
        this.products.forEach(product => {
          product.priceAfterOffers = product.price;
          product.totalOffers = 0;

          product.addedOffers.forEach(offerAdded => {
            const endDate = new Date(offerAdded.offer.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (endDate.getTime() >= today.getTime()) {
              product.totalOffers += offerAdded.offer.discount;
              product.priceAfterOffers -= Math.floor((offerAdded.offer.discount / 100) * product.price);

            }

          });
        });
        // console.log('products after:', this.products);



        // console.log('response' , response);
        // console.log(response.data.email);
      },
      error => {
        if (error.status === 400 || error.status === 500) {
          // console.error('A specific error occurred:', error);
        } else {
          // console.error('An unexpected error occurred:', error);
        }
      }
    );


  }



  addToCart(product: any) {
    if (!product.sizes[0]) {
      this.toastr.error('size must be set');
      return;
    }
    let obj: any = { 'product_id': product.id, 'quantity': 1, "size": product.sizes[0].id };
    if (product.colors.length > 0) {
      obj.color = product.colors[0].id;
    }
    this.cartService.addItem(obj).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('added successfully to your cart');
        } else {
          this.toastr.success('تمت الاضافة الى العربة بنجاح');

        }
        this.router.navigate(['/cart']);

      }, error => {

        if (error.status === 401) {

          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');

          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          if (this.currentLanguage == 'en') {
            this.toastr.warning("this product is already in your cart\n check your cart");
          } else {
            this.toastr.warning("هذا المنتج فى العربة بالفعلت تحقق من العربة");

          }
        } else {

          if (this.currentLanguage == 'en') {
            this.toastr.error('some error happend');
          } else {
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
        }
      }

    );
  }

}





interface Offer {
  id: number;
  discount: number;
  start_date: string;
  end_date: string;
}

interface OfferItem {
  id: number;
  offer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  offer: Offer;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  material: string;
  size: string;
  image: string;
  video: string;
  category: Category
  cover_image: string;
  created_at: string;
  updated_at: string;
  total_ordered: string;

  deleted_at: string | null;
  images: Array<{ id: number; url: string }>;
  addedOffers: OfferItem[];
  user: User;
  totalOffers: number;
  priceAfterOffers: number;
}
interface Category {
  id: number;
  category_name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

