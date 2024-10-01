import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from '../../seller-page/update-product/update-product.component';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-all-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-offers.component.html',
  styleUrl: './all-offers.component.css'
})
export class AllOffersComponent {
  offers: any; 

  constructor(private offerService: OfferService) { }


  ngOnInit(): void {
    this.updateOffers();  
  }
  delete(offer:any){
    this.offerService.deleteOffer(offer.id).subscribe(
      response=>{
        alert('deleted successfully');
        this.updateOffers();  


      },error=>{
        console.log('error happend::',error);
        alert('error deleting offer');

      }
    );
  }
  isOfferActive(endDate: string): boolean {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return end >= today;
  }
  updateOffers(){
    this.offerService.getAllOffers().subscribe(
      response=>{
this.offers = response.data;
console.log(response);
      },error=>{
        console.log('error getting the data::' , error)

      }
    );  }

}
