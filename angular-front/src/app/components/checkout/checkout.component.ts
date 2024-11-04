import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { CustomerService } from '../../services/customer.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { SharedService } from '../../services/language.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CustomerHeaderComponent,
    CommonModule,
    LottieComponent,
    RouterModule,
    FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  submitted:boolean = false;
  cartItems: CartItem[] = [];
  payOnDelivery:number = 10;
  user: any;
  customer: any;
  totalPrice: number = 0;
  totalPriceAfterOffers: number = 0;
  total: number = 0;

  totalOffers: number = 0;
  currentLanguage: string ='en';
  selectedPaymentOption: string = 'payNow';

  private successAnimationItem: AnimationItem | undefined;
  constructor(
    private paymentService:PaymentService,
    private customerService: CustomerService,
    private sharedService: SharedService,
    private router: Router,
    private toastr :ToastrService,
    private cartService: CartService,
    private orderService:OrderService,
  ) { 
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      }); 

  }

  successAnimationOptions: AnimationOptions = {
    path: 'animations/confirmation.json',
    loop: true,
    autoplay: true
  };
  successAnimationCreated(animationItem: AnimationItem): void {
    this.successAnimationItem = animationItem;
  }

  ngOnInit(): void {
    this.updateCartItems();
    this.updateCustomer();
  }
  paymentChange(selectedOption: string) {
    this.selectedPaymentOption = selectedOption;

    if (selectedOption === 'payNow') {
      this.total = this.totalPriceAfterOffers; 
    } else if (selectedOption === 'delivery') {

      this.total = this.totalPriceAfterOffers +this.payOnDelivery;
    }
  }
  goBack(){
    this.router.navigate(['/cart']);
  }
  onSubmit(form:any){
    this.submitted = true;
    if (this.totalPrice<=0){

 if (this.currentLanguage == 'en'){
  this.toastr.warning('nothing to buy add products to your cart first');
}else{
  this.toastr.warning("يجب اضافة عناصر الى العربه اولا");
}

      this.router.navigate(['/products']);

      return;
    }
    if(form.valid){
      const formData = new FormData();

      
      Object.keys(form.value).forEach(key => {
        formData.append(key, form.value[key]);
      });
      formData.append('total',this.totalPriceAfterOffers.toString());
      
      

      this.orderService.addOrder(
        {
        'phone': form.value['phone'] , 
        'address':form.value['address'],
        'total' :this.total ,
        'payment' :this.selectedPaymentOption 
        }
      ).subscribe(
        response=>{
          

          
            const isPayed = response.pay;
          if(isPayed){
            if (this.currentLanguage == 'en'){
              this.toastr.success("order added successfully proceed to payment");
            }else{
              this.toastr.success("تمت العملية بنجاح اكمل عملية الدفع");

            }
            const url = response.url;
            window.open(url, '_blank');
            this.paymentService.setUrlPayment(url);
           
            this.router.navigate(['/need-to-pay']);


          }else{
            if (this.currentLanguage == 'en'){
              this.toastr.success("order added successfully payment on delivery");
            }else{
              this.toastr.success("تمت العملية سوف يتم الدفع عند التوصيل");

            }
          
            this.router.navigate(['/order']);
          }
    

          // console.log('order added::',response);
        },error=>{


          const isPayed = error.pay;
          if(isPayed){
            if (this.currentLanguage == 'en'){
              this.toastr.warning("order added successfully but there is a problem with payment");
            }else{
              this.toastr.warning("تمت اضافة الطلب لكن عملية الدفع لم تنجح حاول مرة اخرى");

            }
          }else{

            if (this.currentLanguage == 'en'){
              this.toastr.error('some error happend');
            }else{
              this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
            }
                      }

          // console.log('error happend',error);
          // console.log('error happend',error.pay);

        }
      );

    }
  }


  updateCustomer() {
    this.customerService.getCustomer().subscribe(
      response => {
        this.customer = response.data;
        // console.log('customer::' , response.data);
      }, error => {
        // console.log('an error happend:', error);
        if (error.status === 401) {
          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');
          this.router.navigate(['/login']);
        }

      }
    );
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

  updateCartItems() {
    this.cartService.getAllItems().subscribe(
      response => {
        this.cartItems = response.data;

        this.cartItems.forEach(item => {
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

          this.paymentChange(this.selectedPaymentOption);
        });


        // console.log('my cart data::', response);
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
  size: string;
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
}