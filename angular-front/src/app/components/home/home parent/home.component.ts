import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { LatestProductsComponent } from '../latest-products/latest-products.component';
import { RouterModule, Router } from '@angular/router';
import { CarouselComponent } from "../../carousel/carousel.component";
import { CategoryCarouselComponent } from "../../../home/category-carousel/category-carousel.component";
import { ProductCarouselComponent } from "../../../home/product-carousel/product-carousel.component";
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { SharedService } from '../../../services/language.service';
import { FooterComponent } from '../../footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    CommonModule,
    HomeComponent,
    BannerComponent,
    LatestProductsComponent,
    RouterModule,
    CarouselComponent,
    CategoryCarouselComponent,
    ProductCarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  products: Product[] = [];
  currentLanguage: string = 'en';
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
    this.updateProducts();
  }
  viewProduct(product: any) {

    this.productService.setProduct(product);
    this.router.navigate(['/product/view']);
  }
  updateProducts() {
    this.productService.getMostOfferedProducts().subscribe(
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
      }, error => {
        // console.log('an error happpend ::' , error)
      }
    );
  }

  addBuyNow(product: any){
    if (!product.sizes[0]){
      this.toastr.error('size must be set');
      return;
  }
  let obj:any ={ 'product_id': product.id, 'quantity': 1, "size": product.sizes[0].id};
if (product.colors.length>0){
  obj.color = product.colors[0].id;
}
  this.cartService.addItem(obj).subscribe(
      response => {
              
       if (this.currentLanguage == 'en'){
        this.toastr.success('added successfully to your cart');
      }else{
        this.toastr.success('تمت الإضافة بنجاح إلى سلتك');
      }
        
        this.router.navigate(['/checkout']);

      }, error => {

        // console.log('error Happend::', error);
        if (error.status === 401) {

          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');

          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          if (this.currentLanguage == 'en'){
            this.toastr.warning("this product is already in your cart\n check your cart");
          }else{
            this.toastr.success('هذا المنتج موجود بالفعل في سلتك.\nتحقق من سلتك');
          }
          this.router.navigate(['/checkout']);

        } else {
          if (this.currentLanguage == 'en'){
            this.toastr.success('added successfully');
          }else{
            this.toastr.success('تمت العمليه بنجاح');
          }        }
      }

    );
  }

  addToCart(product: any) {
    if (!product.sizes[0]){
      this.toastr.error('size must be set');
      return;
  }
  let obj:any ={ 'product_id': product.id, 'quantity': 1, "size": product.sizes[0].id};
if (product.colors.length>0){
  obj.color = product.colors[0].id;
}
  this.cartService.addItem(obj).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('added successfully to your cart');
        } else {
          this.toastr.success('تمت الاضافة الى العربة بنجاح');

        }
        // this.router.navigate(['/cart']);

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
  deleted_at: string | null;
  images: Array<{ id: number; url: string }>;
  addedOffers: OfferItem[];
  user: User;
  total_ordered: string;

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

