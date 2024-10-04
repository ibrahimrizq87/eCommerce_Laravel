import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-all-seller-offers',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './all-seller-offers.component.html',
  styleUrl: './all-seller-offers.component.css'
})
export class AllSellerOffersComponent {
  offers: any; 
  page: number = 1;              
  itemsPerPage: number = 20; 
  @Output() linkClicked = new EventEmitter<string>();

  constructor(private offerService: OfferService) { }

  ngOnInit(): void {
    this.updateOffers();  
  }
  addOffer(){
    this.linkClicked.emit('add-offer');

  }
  getProducts(offer:any){
    this.offerService.setCurrentOffer(offer);
    this.linkClicked.emit('product-in-offer');

  }
  deleteOffer(offer:any){
    this.offerService.deleteOffer(offer.id).subscribe(
      response=>{
        alert('deleted successfully');
        this.updateOffers();  


      },error=>{
        console.log('error happend::',error);
        alert('error deleting offer');

      }
    );}
addProductsToOffer(offer:any){
  this.offerService.setCurrentOffer(offer);
  this.linkClicked.emit('product-offers');

}

  updateOffers(){
    this.offerService.getMyOffers().subscribe(
      response=>{
this.offers = response.data;
console.log(response);
      },error=>{
        console.log('error getting the data::' , error)

      }
    );  }
    isOfferActive(endDate: string): boolean {
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return end >= today;
    }
  
}



