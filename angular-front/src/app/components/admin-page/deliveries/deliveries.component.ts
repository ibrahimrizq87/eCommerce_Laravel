import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeliveryService } from '../../../services/delivery.service';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 


@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent {
  deliveries: any[] | null[] = [];
  filterDeliveries: any[] | null[] = [];
  page: number = 1;
  currentLanguage: string ='en';

  itemsPerPage: number = 20;
  totalItems: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  totalCustomers: number = 0;

  @Output() linkClicked = new EventEmitter<string>();
  constructor(	 private sharedService: SharedService,
    private toastr :ToastrService,private deliveryService: DeliveryService) { 


 this.sharedService.language$.subscribe(language => {
  this.currentLanguage = language;
  });


    }




  search() {
    if (this.searchTerm) {
      this.filterDeliveries = this.deliveries.filter(deliveries =>
        deliveries.user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filterDeliveries = this.deliveries;
    }
  }

  viewCustomer(customer: any) {
    this.deliveryService.setDelivery(customer);
    sessionStorage.setItem('return-to', 'deliveries');
    this.linkClicked.emit("show-delivery");
  }

  ngOnInit(): void {
    this.updateDeliveries();
  }


  updateDeliveries() {
    this.deliveryService.getDeliveries().subscribe(response => {
      this.deliveries = response.data;
      this.filterDeliveries = this.deliveries;


    },
      error => {

        // console.error('some error happend:', error);

      });
  }
  addDelivery(){
    this.linkClicked.emit("add-delivery");

  }

}
