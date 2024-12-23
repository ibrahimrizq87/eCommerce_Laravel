import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';

@Component({
  selector: 'app-all-offers',
  standalone: true,
  imports: [CommonModule,
    NgxPaginationModule,
    FormsModule],
  templateUrl: './all-offers.component.html',
  styleUrl: './all-offers.component.css'
})
export class AllOffersComponent {
  @Output() linkClicked = new EventEmitter<string>();

  offers: Offer[] = [];
  filteredOffers: any;
  page: number = 1;
  itemsPerPage: number = 10;
  startDate: string = '';
  endDate: string = '';
  currentLanguage: string = 'en';
  discount: number = 0;
  searchCriteria: string = 'date';
  constructor(private sharedService: SharedService,
    private toastr: ToastrService,
    private offerService: OfferService) {
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
    });

  }




  addOffer() {
    this.linkClicked.emit('add-offer');

  }
  getProducts(offer: any) {
    this.offerService.setCurrentOffer(offer);
    this.linkClicked.emit('product-in-offer');

  }
  deleteOffer(offer: any) {
    this.offerService.deleteOffer(offer.id).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('deleted successfully');
        } else {
          this.toastr.success('تمت العمليه بنجاح');
        }
        // alert(' successfully');
        this.updateOffers();


      }, error => {
        // console.log('error happend::',error);
        // alert('error deleting offer');
        if (this.currentLanguage == 'en') {
          this.toastr.error('some error happend');
        } else {
          this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
        }

      }
    );
  }
  addProductsToOffer(offer: any) {
    this.offerService.setCurrentOffer(offer);
    this.linkClicked.emit('product-offers');

  }


  search() {
    if (new Date(this.startDate) > new Date(this.endDate)) {
      if (this.currentLanguage == 'en') {
        this.toastr.warning('Start date must be before end date.');
      } else {
        this.toastr.warning('تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء.');
      }
      return;
    }
    if (this.searchCriteria === 'date') {
      if (this.startDate != '' && this.endDate != '') {
        this.filteredOffers = this.offers.filter(offer => {
          const offerStartDate = new Date(offer.start_date);
          const offerEndDate = new Date(offer.end_date);
          const isWithinDateRange = offerStartDate >= new Date(this.startDate) && offerEndDate <= new Date(this.endDate);

          return isWithinDateRange;
        });
      }
    } else if (this.searchCriteria === 'discount') {
      this.filteredOffers = this.offers.filter(offer => {
        const isWithinDiscount = offer.discount >= this.discount;

        return isWithinDiscount;
      });
    }

    this.page = 1;

  }

  ngOnInit(): void {
    this.updateOffers();
  }
  delete(offer: any) {
    this.offerService.deleteOffer(offer.id).subscribe(
      response => {
        if (this.currentLanguage == 'en') {
          this.toastr.success('Deleted successfully');
        } else {
          this.toastr.success('تمت العمليه بنجاح');
        } this.updateOffers();


      }, error => {

        if (this.currentLanguage == 'en') {
          this.toastr.error('some error happend');
        } else {
          this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
        }

      }
    );
  }
  isOfferActive(endDate: string): boolean {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return end >= today;
  }

  didOfferStart(startDate: string): boolean {
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start <= today;
  }
  updateOffers() {
    this.offerService.getAllOffers().subscribe(
      response => {
        this.offers = response.data;
        this.filteredOffers = response.data;

        // console.log(response);
      }, error => {
        // console.log('error getting the data::' , error)

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