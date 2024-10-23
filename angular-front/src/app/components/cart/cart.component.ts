import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { CartService } from '../../services/cart.service';
import { CommonModule, NgIfContext } from '@angular/common';
import { SharedService } from '../../services/language.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CustomerHeaderComponent,
    RouterModule,
    CommonModule
  ],
  providers: [UserService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  empty: boolean = true;
  totalPrice: number = 0;
  totalPriceAfterOffers: number = 0;
  totalOffers: number = 0;
  currentLanguage: string = 'en';
  cartItems: CartItem[] = [];
  user: any;
  constructor(private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private cartService: CartService) {
    this.sharedService.updateLanguage();
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
  }


  ngOnInit(): void {
    this.updateCartItems();
    this.updateUser();
  }
  downQuantity(item: any) {
    if (item.quantity > 1) {
      this.cartService.updateItem({ 'stock': item.quantity - 1 }, item.id).subscribe(
        response => {
          item.quantity--;

          this.totalPrice -= (item.product.price);
          this.totalPriceAfterOffers -= (item.product.priceAfterOffers);
          this.totalOffers -= (item.product.price - item.product.priceAfterOffers);

        }, error => {

          if (this.currentLanguage == 'en') {
            this.toastr.error('error happend while updating\n theck your network please');
          } else {
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
        }
      );

    }
  }
  addQuantity(item: any) {

    if (item.product.stock > item.quantity) {

      this.cartService.updateItem({ 'stock': item.quantity + 1 }, item.id).subscribe(
        response => {
          item.quantity++;
          this.totalPrice += Number(item.product.price);
          this.totalPriceAfterOffers += Number(item.product.priceAfterOffers);
          this.totalOffers += Number(item.product.price - item.product.priceAfterOffers);
          // this.totalPrice += (item.product.price);
          // this.totalPriceAfterOffers += (item.product.priceAfterOffers);
          // this.totalOffers += (item.product.price - item.product.priceAfterOffers);

        }, error => {
          if (this.currentLanguage == 'en') {
            this.toastr.error('error happend while updating\n theck your network please');
          } else {
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
        }
      );

    } else {
      if (this.currentLanguage == 'en') {
        this.toastr.warning('no enough products in our stock\n max is: ' + item.product.stock);
      } else {
        this.toastr.error(item.product.stock + ' لا يوجد كمية كافية بالمخزون اكبر كمية يمكن طلبها هى ');
      }
      item.quantity--;
    }
  }


  deleteItem(item: any) {
    this.cartService.deleteItem(item.id).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('deleted successfully');
        } else {
          this.toastr.success('تمت العمليه بنجاح');
        }

        this.updateCartItems();
      }, error => {
        if (this.currentLanguage == 'en') {
          this.toastr.error('some error happend');
        } else {
          this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
        }

      }
    );
  }
  updateUser() {

    console.log(sessionStorage.getItem('authToken'));
    if (sessionStorage.getItem('authToken')) {
      this.userService.getUser().subscribe(
        response => {
          this.userService.setUser(response.user);
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

  }
  updateCartItems() {
    this.cartService.getAllItems().subscribe(
      response => {
        this.cartItems = response.data;
        // console.log('my cart data::::::::::', this.cartItems);

        if (this.cartItems.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;

        }
        this.cartItems.forEach(item => {
          if (item.product.stock < item.quantity) {
            item.quantity = item.product.stock + 1;
            this.downQuantity(item);
          } else if (item.product.stock == 0) {
            this.deleteItem(item);
            return;
          }
          item.product.price = item.size.price;
          item.product.priceAfterOffers = item.product.price;
          item.product.totalOffers = 0;

          item.product.addedOffers.forEach(offerAdded => {
            const endDate = new Date(offerAdded.offer.end_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (endDate.getTime() >= today.getTime()) {
              item.product.totalOffers += offerAdded.offer.discount;
              item.product.priceAfterOffers -= Math.floor((offerAdded.offer.discount / 100) * item.product.price);
            }

          });

          this.totalPrice += (item.product.price) * item.quantity;
          this.totalPriceAfterOffers += (item.product.priceAfterOffers) * item.quantity;
          this.totalOffers += (item.product.price - item.product.priceAfterOffers) * item.quantity;


        });


      }, error => {
        // console.log('error happend', error);
        if (error.status === 401) {
          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');
          this.router.navigate(['/login']);
        }
      }
    );
  }


}


interface Size {
  size: string;
  price: number;
}

interface Offer {
  id: number;
  start_date: string;
  end_date: string;
  discount: number;
}

interface AddedOffer {
  id: number;
  offer: Offer;
  offer_id: number;
  product_id: number;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  cover_image: string;
  // size: string;
  material: string;
  video: string;

  totalOffers: number;
  priceAfterOffers: number;

  addedOffers: AddedOffer[];
}

interface CartItem {
  id: number;
  quantity: number;
  user_id: number;
  product_id: number;
  product: Product;
  size: Size;
  color:Color;
}
interface Color {
  id: number;
  image: string;

}