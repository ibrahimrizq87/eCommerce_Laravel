import { Component, EventEmitter, Output } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-to-be-delivered-otems',
  standalone: true,
  imports: [CommonModule,
    NgxPaginationModule,
    FormsModule,
    MatPaginatorModule

  ],
  templateUrl: './to-be-delivered-otems.component.html',
  styleUrl: './to-be-delivered-otems.component.css'
})
export class ToBeDeliveredOtemsComponent {


  @Output() linkClicked = new EventEmitter<string>();

  orders: any[] = [];
  page: number = 1;
  itemsPerPage: number = 20;
  priceFrom: number = 0;
  priceTo: number = 0;
  searchTerm: string = '';
  searchCriteria: string = 'name';
  startDate: string = '';
  endDate: string = '';
  currentPage: number = 1;

  totalOrders: number = 0;
  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private toastrService: ToastrService,


  ) { }



  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.updateOrders();
  }

  ngOnInit(): void {
    this.updateOrders();
  }

  craft(item: any) {

  }
  getCustomer(order: any) {
    this.customerService.getCustomerById(order.user.id).subscribe(
      response => {

        this.customerService.setCurrentCustomer(response.data);
        sessionStorage.setItem('return-to', 'seller-orders');
        this.linkClicked.emit("show-customer");

      }, error => {
        console.log('error getting data:', error);
      }
    );
  }

  deleteOrder(order: any) {
    this.orderService.deleteOrder(order.id).subscribe(
      (response) => {
        this.updateOrders();
        this.toastrService.success('deleted successfully');
      },
      (error) => {
        alert('an error happened try again later');
        if (error.status === 401) {
          sessionStorage.removeItem('authToken');
          sessionStorage.setItem('loginSession', 'true');
          this.updateOrders();

        } else if (error.status === 403) {
          this.toastrService.error('can not delete a payed order');

        } else {

          this.toastrService.error('an erro happend try again later');
        }
      }
    );
  }
  viewOrder(order: any) {
    this.orderService.setCurrentOrder(order);
    sessionStorage.setItem('return-to', 'done-orders');
    this.linkClicked.emit("view-order");
  }
  delivery(order: any) { }

  search() {
    if (this.searchCriteria === 'date') {
      if (!this.startDate || !this.endDate) {
        this.toastrService.error("Start and End dates are required.");
        return;
      }
      if (new Date(this.startDate) >= new Date(this.endDate)) {
        this.toastrService.error("Start Date must be less than End Date.");
        return;
      }
    }

    if (this.searchCriteria === 'total') {

      if (this.priceFrom >= this.priceTo) {
        this.toastrService.error("From price must be less than To price.");
        return;
      }
    }

    // console.log("Searching...", this.searchCriteria, this.searchTerm, this.startDate, this.endDate, this.priceFrom, this.priceTo);
    this.updateOrders()
  }
  changeCriteria() {
    this.priceFrom = 0;
    this.priceTo = 0;
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
  }
  updateOrders() {
    this.orderService.getWaitingOrders(
      'delivered',
      this.currentPage,
      this.itemsPerPage,
      this.priceFrom,
      this.searchTerm,
      this.priceTo,
      this.searchCriteria,
      this.startDate,
      this.endDate
    ).subscribe(
      response => {
        this.orders = response.data;
        this.totalOrders = response.total;
        console.log('my serponse >>>>>+++::: ', response);



      }, error => {
        if (error.status === 404) {
        }
        console.log("error", error);

      }
    );
  }

}

