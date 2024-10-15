import { Component, OnInit, Output, EventEmitter  } from '@angular/core';

import { OrderItemService } from '../../../services/order-item.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { SharedService } from '../../../services/language.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customer-orders',
  standalone: true,
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css'],
  imports: [CommonModule, RouterModule]
})
export class CustomerOrdersComponent implements OnInit {
  @Output() linkClicked = new EventEmitter<string>();

  orders: Order[] = [];
  currentLanguage: string ='en';
  constructor(private sharedService: SharedService,
    private orderItemService: OrderItemService,
     private router: Router,
     private toastr :ToastrService,
    private productService:ProductService,
  private orderService:OrderService) {
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });

  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOlddOrders().subscribe(
      (response) => {
        this.orders = response;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  viewOrder(order:any){

    this.orderService.setCurrentOrder(order);
    this.linkClicked.emit('view-order');

  }
  deleteOrder(order:any){
    this.orderService.deleteOrder(order.id).subscribe(
      response=>{

  this.getOrders();
this.toastr.success("order deleted successfully");
      },error=>{
        this.toastr.error("an error happend while deleting the order");
        console.log('an error happend::>',error);
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

interface AddedOffer {
  id: number;
  offer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  offer: Offer;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  size: string;
  stock: number;
  material: string;
  cover_image: string;
  video: string | null;
  deleted_at: string | null;
  addedOffers: AddedOffer[];

  totalOffers: number;
  priceAfterOffers: number;

}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  status: string;
  created_at:string;
}

interface Order {
  address: string;
  created_at: string;
  error_message: string | null;
  id: number;
  order_items: OrderItem[];
  payment: string;
  payment_status: string;
  phone: string;
  status: string;
  total: number;
  updated_at: string;
  user_id: number;
}