import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { OrderItemService } from '../../../services/order-item.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent {
  orderItems:OrderItem [] = [];
  constructor(private orderService:OrderService,
    private orderItemService:OrderItemService,
    private productService:ProductService
  ){}


  ngOnInit(): void {
    this.updateOrderItems();
}
craft(item:any){
this.orderItemService.craftOrderItem(item.id).subscribe(
  response=>{
    alert('added to your accepted doing list');
    this.updateOrderItems();
  },error=>{
    console.log('error happend', error)
    alert('there is an error happend');

  }
);
}
serveFromStock(item:any){
  this.orderItemService.serveOrderItem(item.id).subscribe(
    response=>{
      alert('added to your accepted done list');
      this.updateOrderItems();
    },error=>{
      console.log('error happend', error)
      alert('there is an error happend');
  
    }
  );
}
updateOrderItems(){
  this.orderItemService.getAllMyOrderItems().subscribe(
    response=>{
      this.orderItems = response.data;
      console.log(this.orderItems);

      this.orderItems.forEach(item => {
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


      });

    },error=>{
      if(error.status === 404){
      }
      console.log("error",error);

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

}