import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishListService } from '../../services/wishlist.service';
import { CommonModule, NgIfContext } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../services/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  products: Product[] = [];
  noOfProducts: number = 0;
  currentLanguage: string = 'en';
  user: any;
  constructor(private wishlistService: WishListService,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private cartService: CartService,
    private toastr: ToastrService) {
    this.sharedService.updateLanguage();
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });

  }




  onProductClick(product: any) {
    this.productService.setProduct(product);
    this.router.navigate(['/product/view']);
  }
  addToCart(product: any) {




    this.cartService.addItem({ 'product_id': product.id, 'quantity': 1 }).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('added successfully to your cart');
        } else {
          this.toastr.success('تمت الاضافة الى العربة بنجاح');

        } this.router.navigate(['/cart']);

        console.log(response);
      }, error => {

        console.log('error Happend::', error);
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
  delete(product: any) {
    this.wishlistService.deleteWishlistItem(product.id).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('deleted successfully');
        } else {
          this.toastr.success('تمت العمليه بنجاح');
        }

        console.log(response);

        this.updateProducts();
      }, error => {

        if (this.currentLanguage == 'en') {
          this.toastr.error('some error happend');
        } else {
          this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
        }
        if (error.status === 400 || error.status === 500) {
          // console.error('A specific error occurred:', error);
        } else if (error.status === 401) {
          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');

          this.router.navigate(['/login']);
        } else {
          // console.error('An unexpected error occurred:', error);
        }

      }
    );
  }
  ngOnInit(): void {
    console.log(sessionStorage.getItem('authToken'));
    if (sessionStorage.getItem('authToken')) {
      this.userService.getUser().subscribe(
        response => {
          this.user = response.date;
        },
        error => {
          if (error.status === 400 || error.status === 500) {
            // console.error('A specific error occurred:', error);
          } else if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            sessionStorage.setItem('loginSession', 'true');

            this.router.navigate(['/login']);
          } else {
            // console.error('An unexpected error occurred:', error);
          }
        }
      );
    } else {
      sessionStorage.setItem('loginSession', 'true');

      this.router.navigate(['/login']);

    }



    this.updateProducts();
  }

  updateProducts() {

    this.productService.getProductsInWishlist().subscribe(
      response => {
        // console.log('hererererere');
        // console.log(response);
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
              product.priceAfterOffers -= (offerAdded.offer.discount / 100) * product.price;
            }

          });
        });
        this.noOfProducts = this.products.length;
        // console.log('products after:', this.products);



        // console.log('response', response);
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
}




interface Offer {
  id: number;
  discount: number;
  start_date: string;
  end_date: string;
}

// Interface for each item in addedOffers
interface OfferItem {
  id: number;
  offer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  offer: Offer;
}

// Interface for the Product User
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

// Interface for the Product
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
  cover_image: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  images: Array<{ id: number; url: string }>;
  addedOffers: OfferItem[];
  user: User;
  totalOffers: number;
  priceAfterOffers: number;
}