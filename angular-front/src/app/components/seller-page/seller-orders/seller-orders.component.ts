import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { OrderItemService } from '../../../services/order-item.service';
import { ProductService } from '../../../services/product.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent {
  orderItems:OrderItem [] = [];
  page: number = 1;              
  itemsPerPage: number = 20; 

  filteredProducts: any[] = [];
  priceFrom: number  = 0;
  priceTo: number = 0;
  searchTerm: string = '';
  searchCriteria: string = 'name'; 


  constructor(private orderService:OrderService,
  ){}




  ngOnInit(): void {
    this.updateOrders();
}

craft(item:any){

}
search(){}
serveFromStock(item:any){

}
updateOrders(){
//   this.orderService.getWaitingOrders('waiting').subscribe(
//     response=>{
//       this.orderItems = response.data;
//       console.log(this.orderItems);

//       this.orderItems.forEach(item => {
//         item.product.priceAfterOffers = item.product.price;
//         item.product.totalOffers = 0;

//         item.product.addedOffers.forEach(offerAdded => {
//           const endDate = new Date(offerAdded.offer.end_date);
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);

//           if (endDate.getTime() >= today.getTime()) {
//             item.product.totalOffers += offerAdded.offer.discount;
//             item.product.priceAfterOffers -= Math.floor((offerAdded.offer.discount / 100) * item.product.price);
//           }

//         });


//       });
//       this.filteredProducts = this.orderItems;

//     },error=>{
//       if(error.status === 404){
//       }
//       console.log("error",error);

//     }
//   );
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

}