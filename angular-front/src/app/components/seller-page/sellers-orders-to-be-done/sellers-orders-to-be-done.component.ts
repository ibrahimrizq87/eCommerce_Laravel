import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { OrderItemService } from '../../../services/order-item.service';
import { ProductService } from '../../../services/product.service';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-sellers-orders-to-be-done',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './sellers-orders-to-be-done.component.html',
  styleUrl: './sellers-orders-to-be-done.component.css'
})
export class SellersOrdersToBeDoneComponent {
  orderItems:OrderItem [] = [];
  page: number = 1;              
  itemsPerPage: number = 20; 
  constructor(private orderService:OrderService,
    private orderItemService:OrderItemService,
    private productService:ProductService
  ){}

  ngOnInit(): void {
    this.updateOrderItems();
}

done(item:any){
  this.orderItemService.doneOrder(item.id).subscribe(
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
  this.orderItemService.getAllMyDoingOrderItems().subscribe(
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