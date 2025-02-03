import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { CommonModule } from '@angular/common';
import { ViewReviewsComponent } from "../view-reviews/view-reviews.component";
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { WishListService } from '../../services/wishlist.service';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/language.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CustomerHeaderComponent,
    CommonModule,
    ViewReviewsComponent,
    CommonModule,
    FormsModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {

  currentSize: any;
  showVideo = false;
  submitted = false;
  stars: number = 0;
  addToWish: Boolean = false;
  products: Product[] = [];
  ratingStars: number = 0;
  user: any;
  reviews: Feedback[] = [];
  product: any;
  offers: Offer[] = [];
  addedOffer: OfferItem[] = [];
  quantity: number = 1;
  coverImage: string = '';
  selectedImage: string = '';
  currentLanguage: string = 'en';
  reviewMessage: string = '';
  colors:any;

  constructor(private sharedService: SharedService,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private reviewService: ReviewService,
    private wishListService: WishListService,
    private toastr: ToastrService,
    private cartService: CartService) {
    this.sharedService.updateLanguage();
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
    this.currentLanguage = this.sharedService.getLanguage();


  }

  onProductClick(product: any) {
    this.productService.setProduct(product);

  }


  isOfferActive(endDate: string): boolean {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return end >= today;
  }
  onImageClick(image: string) {
    this.coverImage = image;
    this.selectedImage = image;
  }
  addOnQuantity() {
    if (this.product.stock > this.quantity)
      this.quantity++;
  }
  decOnQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  onQuantityChange(value: string) {
    // console.log('Quantity changed:', value);
  }
  addToCart() {
    if (!this.currentSize){
        this.toastr.error('size must be set');
        return;
    }
    let obj:any ={ 'product_id': this.product.id, 'quantity': this.quantity , "size": this.currentSize.id};
    if (this.product.colors.length>0 && !this.selectedColor){
      this.toastr.error('color must be set');
      return;
  }else if (this.selectedColor){
    obj.color = this.selectedColor.id;
  }
    this.cartService.addItem(obj).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('added successfully to your cart');
        } else {
          this.toastr.success('تمت الاضافة الى العربة بنجاح');

        }
        this.router.navigate(['/cart']);

        // console.log(response);
      }, error => {

        console.log('error Happend::',error);
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


  addAnotherToCart(product: any) {
    this.cartService.addItem({ 'product_id': product.id, 'quantity': 1 }).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('added successfully to your cart');
        } else {
          this.toastr.success('تمت الاضافة الى العربة بنجاح');

        } this.router.navigate(['/cart']);

        // console.log(response);
      }, error => {

        // console.log('error Happend::',error);
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




  zoomStyle: { [key: string]: string } = {};

  onMouseMove(event: MouseEvent) {
    const imageWrapper = (event.target as HTMLElement).parentElement!;
    const { offsetX, offsetY } = event;
    const { offsetWidth, offsetHeight } = imageWrapper;

    // Calculate the position percentage inside the image
    const xPercent = (offsetX / offsetWidth) * 100;
    const yPercent = (offsetY / offsetHeight) * 100;

    // Set the zoom effect dynamically
    this.zoomStyle = {
      transform: 'scale(2)', // Adjust zoom level
      transformOrigin: `${xPercent}% ${yPercent}%`
    };
  }

  onMouseLeave() {
    // Reset zoom when the mouse leaves
    this.zoomStyle = {
      transform: 'scale(1)',
      transformOrigin: 'center'
    };
  }


  addToWishList() {
    const formData = new FormData();
    formData.append('product_id', this.product.id);

    if (this.addToWish) {
      this.wishListService.deleteWishlistItem(this.product.id).subscribe(
        response => {
          if (this.currentLanguage == 'en') {
            this.toastr.success("removesd from wishlist successfully");
          } else {
            this.toastr.success("لم يعد هذا العنصر فى قائمة مفضلاتك");
          }

          this.addToWish = false;

        }, error => {
          if (error.status === 400 || error.status === 500) {
            // console.error('A specific error occurred:', error);
          } else if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            sessionStorage.setItem('loginSession', 'true');

            this.router.navigate(['/login']);
          } else {
            if (this.currentLanguage == 'en') {
              this.toastr.error("An error happend please check your network connection");
            } else {
              this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
            }

          }

        }
      );
    } else {
      this.wishListService.addItem(formData).subscribe(
        response => {
          // console.log(response);
          this.addToWish = true;
          this.toastr.success("Added from wishlist successfully");
        },
        error => {
          if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            sessionStorage.setItem('loginSession', 'true');
            this.router.navigate(['/login']);
            // console.error('A specific error occurred:', error);
          } else if (error.status === 409) {
            this.toastr.error("An error happend please check your network connection");
          } else {
            // console.error('An unexpected error occurred:', error);
          }
        }
      );
    }
  }



  ngOnInit(): void {

    this.componentDataRefresh();
  }
  onproductClick(product: any) {
    this.productService.setProduct(product);
    this.componentDataRefresh();
  }
  changeSize(size:any){
    this.currentSize = size;
    this.product.price = size.price;
    
    let myproduct:Product = this.product;
    myproduct.totalOffers=0;
    myproduct.priceAfterOffers = myproduct.price;
    myproduct.addedOffers.forEach(offerAdded => {
      const endDate = new Date(offerAdded.offer.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endDate.getTime() >= today.getTime()) {
        myproduct.totalOffers += offerAdded.offer.discount;
        // myproduct.priceAfterOffers -= Math.floor((offerAdded.offer.discount / 100) * myproduct.price);
      }

    });
    this.product = myproduct;


  }
  selectedColor:any;
  selectImage(color: any): void {
    this.selectedColor = color;
    this.coverImage = color.image;
  }
  componentDataRefresh() {

    if (this.productService.getSelectedProduct()) {
      this.product = this.productService.getSelectedProduct();
      this.addedOffer = this.product.addedOffers;
      if(this.product.colors){
        this.selectedColor = this.product.colors[0];
      }
      this.offers = [];
      this.addedOffer.forEach(addedOffer => {
        this.offers.push(addedOffer.offer);
      })
      this.offers
      this.coverImage = this.product.cover_image;


      this.currentSize = this.product.sizes[0];
      if (this.currentSize.price != this.product.price){
        this.product.price =this.currentSize.price ;
      }
      this.productService.getRelatedProducts(this.product.category.id).subscribe(
        response => {
          this.products = response.data;
          this.products =  this.products.filter(product => product.id !== this.product.id);

          console.log( this.products );
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
          // console.log(response.data.email);
        },
        error => {
          if (error.status === 400 || error.status === 500) {
            // console.error('A specific error occurred:', error);
            this.toastr.error("an error happend while getting the products");

          } else {
            // console.error('An unexpected error occurred:', error);
            this.toastr.error("an error happend while getting the products");

          }
        }
      );

    } else {
      this.router.navigate(['/products']);

    }

    this.updateReview();
    if (sessionStorage.getItem('authToken')) {
      if (this.userService.getCurrentUser()) {
        this.user = this.userService.getCurrentUser();

      } else {
        this.userService.getUser().subscribe(
          response => {

            this.user = response.data;


          },
          error => {

          }
        );
      }
      this.wishListService.isInMyWishlist({ 'product_id': this.product.id }).subscribe(
        response => {
          this.addToWish = response.message;
          // console.log('in my wish list?????',response.message);
        }, error => {
          // console.log('error happend in wishlist data:: ', error);
        }
      );

    }
  }
  deleteReview(review: any) {
    this.updateUser(review);
  }


  updateReview() {
    this.reviewService.getAllReviews(this.product.id).subscribe(
      response => {
        this.reviews = response.data;
        this.stars = 0;

        this.reviews.forEach(review => {
          this.stars += review.rating;

        });
        if (this.reviews.length > 0) {
          this.stars = Math.floor(this.stars / this.reviews.length);

        } else {
          this.stars = 0;
        }


      }, error => {

      }
    );
  }


  setRating(rating: number) {
    this.ratingStars = rating;
    // console.log("Rating set to:", this.ratingStars);
  }
  toggleVideo() {
    this.showVideo = !this.showVideo;
  }
  onSubmit(form: any): void {
    this.submitted = true;

    if (form.invalid) {

    } else {
      const formData = new FormData()
      formData.append('product_id', this.product.id)
      formData.append('feedback', form.value.review)
      formData.append('rating', this.ratingStars.toString())
      this.reviewMessage = '';
      this.ratingStars = 0;
      this.submitted = false;

      this.reviewService.addReview(formData).subscribe(
        response => {

          if (this.currentLanguage == 'en') {
            this.toastr.success('rating added successfully');
          } else {
            this.toastr.success('تمت العمليه بنجاح');
          }

          this.updateReview();
        },
        error => {
          if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            sessionStorage.setItem('loginSession', 'true');
            this.router.navigate(['/login']);
            // console.error('A specific error occurred:', error);
            // this.toastr.error("");
          } else if (error.status === 409) {
            if (this.currentLanguage == 'en') {
              this.toastr.warning("you can not add two reviews to the same product");
            } else {
              this.toastr.success('لا يمكن اضافة تقيمين لنفص العنصر');
            }
          } else {
            // console.error('An unexpected error occurred:', error);
          }
        }

      )

    }
  }

  showReview = false;
  toggleReview() {
    this.showReview = !this.showReview;
  }



  updateUser(review: any) {

    if (sessionStorage.getItem('authToken')) {
      if (this.userService.getCurrentUser()) {
        this.user = this.userService.getCurrentUser();



      } else {
        this.userService.getUser().subscribe(
          response => {

            this.user = response.data;
          },
          error => {
            if (error.status === 400 || error.status === 500) {
              // console.error('A specific error occurred:', error);
            } else if (error.status === 401) {
              sessionStorage.removeItem('authToken');
              sessionStorage.setItem('loginSession', 'true');
              this.router.navigate(['/login']);

            } else {
            }
          }
        );
      }
      if (this.user.id == review.user.id) {
        this.reviewService.deleteReview(review.id).subscribe(
          response => {


            if (this.currentLanguage == 'en') {
              this.toastr.success('deleted successfully');
            } else {
              this.toastr.success('تمت العمليه بنجاح');
            }
            this.updateReview();

          }, error => {

            if (this.currentLanguage == 'en') {
              this.toastr.error('some error happend');
            } else {
              this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
            }

          }
        )
      }




    } else {
      sessionStorage.removeItem('authToken');
      sessionStorage.setItem('loginSession', 'true');
      this.router.navigate(['/login']);
    }
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
  last_name: string;
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
  cover_image: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  images: Array<{ id: number; url: string }>;
  addedOffers: OfferItem[];
  sizes: Size[];

  user: User;
  totalOffers: number;
  priceAfterOffers: number;
  total_ordered: number;
}
interface Feedback {
  id: number;
  feedback: string;
  rating: number;
  user: User;
  product: Product;
}

interface Size {
  id: number;
  size: number;
  price: number;

}

