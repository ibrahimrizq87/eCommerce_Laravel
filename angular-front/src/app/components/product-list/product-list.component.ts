
import { Component, TemplateRef } from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/language.service';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    CustomerHeaderComponent,
    MatPaginatorModule,
    CarouselModule
  ],



  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'

})

export class ProductListComponent {
  products: Product[] = [];
  subCategories:any;
  currentLanguage: string = 'en';
  category: any;
  selectedId: number | null = null;
  selectedsuBId: number | null = null;

  
  categories:any [] |null [] =[];

  page: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  priceFrom: number = 0;
  priceTo: number  = 0;
  totalProducts: number = 0;
  searchCriteria: string = 'name';
  isShowCategories=false;
  noProductsTemplate: TemplateRef<NgIfContext<any>> | null | undefined;
  customOptions: OwlOptions = {
    loop: true, 
    margin: 10, 
    nav: true, 
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'], 
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 5 
      }
    }
  };
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private toastr :ToastrService,
    private sharedService: SharedService,
    private cartService: CartService
  ) {
    this.sharedService.updateLanguage();

    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
  }
  parents: any;

  getCategories(){
    this.categoryService.getParentCategories().subscribe(response => {
      this.parents = response.data;
    }, error => {
      console.log('failure is: ', error);
    });
  }

  onItemClick(parent: any): void {
    this.selectedId = parent.id;

    this.categoryService.getCategoriesByParent(parent.id).subscribe(response => {
   this.subCategories = response.data;
          }, error => {
      console.log('failure is: ', error);
    });

  }
  onSubItemClick(parent: any): void {
    this.selectedsuBId = parent.id;
    this.searchTerm= parent.category_name;
    this.searchCriteria = 'category';
 this.getProducts();

  }
  showCategories(){
this.isShowCategories = !this.isShowCategories;
  }
  getProducts(): void {
    this.productService.getProducts(this.currentPage, this.itemsPerPage, this.searchCriteria, this.searchTerm, this.priceFrom, this.priceTo)
      .subscribe(response => {
        this.products = response.data; 
        // console.log(response );
        this.totalProducts = response.total; 
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

    },error=>{
        // console.log('error>>>>>>>>>>>>>>>>' , error);
      });
  }
  

  search(): void {
    this.currentPage = 1; 
    this.getProducts();

    
  }


  changeCriteria(){
    this.searchTerm= '';
    this.priceFrom = 0;
    this.priceTo  = 0;
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
              
       if (this.currentLanguage == 'en'){
        this.toastr.success('added successfully to your cart');
      }else{
        this.toastr.success('تمت الإضافة بنجاح إلى سلتك');
      }
        
        // this.router.navigate(['/cart']);

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
        } else {
          if (this.currentLanguage == 'en'){
            this.toastr.success('added successfully');
          }else{
            this.toastr.success('تمت العمليه بنجاح');
          }        }
      }

    );
  }

  moveToCategory() {
    this.router.navigate(['/category']);

  }
  onProductClick(product: any) {
    this.productService.setProduct(product);
    this.router.navigate(['/product/view']);

  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex+1; 
    this.itemsPerPage = event.pageSize; 
    this.getProducts();
  }


  ngOnInit(): void {
    this.checkCategoty();
    this.getProducts();
    this. getCategories();
  }

  checkCategoty(){
    this.category = this.categoryService.getSelectedCategory();
    if (this.category) {
      this.searchTerm= this.category.category_name;
      this.searchCriteria = 'category';
      this.categoryService.setCategory(undefined);
    }
  }
  updateProductsOld(){

    this.category = this.categoryService.getSelectedCategory();
    if (this.category) {
      this.productService.getProductsByCategory(this.category.id).subscribe(
        response => {
          this.categoryService.setCategory(undefined);
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


        },
        error => {
          if (error.status === 400 || error.status === 500) {
            // console.error('A specific error occurred:', error);
          } else {
            // console.error('An unexpected error occurred:', error);
          }
        }
      );
    } else {

      this.productService.getAllProducts().subscribe(
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

