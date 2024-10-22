import { Component, EventEmitter, Output } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';



import { SharedService } from '../../../services/language.service';
 




@Component({
  selector: 'app-deleted-orders',
  standalone: true,
  imports: [CommonModule,
    NgxPaginationModule,
   FormsModule,
   MatPaginatorModule

 ],  templateUrl: './deleted-orders.component.html',
  styleUrl: './deleted-orders.component.css'
})
export class DeletedOrdersComponent {

  currentLanguage: string ='en';

  @Output() linkClicked = new EventEmitter<string>();

  orders:any [] = [];
  page: number = 1;              
  itemsPerPage: number = 20; 
  priceFrom: number  = 0;
  priceTo: number = 0;
  searchTerm: string = '';
  searchCriteria: string = 'name'; 
  startDate: string = '';
  endDate: string = '';
  currentPage: number = 1;
  totalOrders:number =0;
  
  constructor(
    private orderService:OrderService,
    private customerService:CustomerService,
    private toastr:ToastrService,
    private sharedService: SharedService,
    
  ){
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });
  }



  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex+1; 
    this.itemsPerPage = event.pageSize; 
    this.updateOrders();
  }

  ngOnInit(): void {
    this.updateOrders();
}


getCustomer(order:any){
  this.customerService.getCustomerById(order.user.id).subscribe(
    response=>{

      this.customerService.setCurrentCustomer(response.data);
      sessionStorage.setItem('return-to' , 'deleted-orders');
      this.linkClicked.emit("show-customer"); 

    },error=>{
      // console.log('error getting data:',error);
    }
  );
}

restore(item:any){
  this.orderService.restoreOrder(item.id).subscribe(
    response=>{
if (this.currentLanguage == 'en'){
  this.toastr.success('restored successfully');
}else{
  this.toastr.success('تمت العمليه بنجاح');
}
this.updateOrders();
    },error=>{
      if (this.currentLanguage == 'en'){
        this.toastr.error('some error happend');
      }else{
        this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
      }    }
  );
}
viewOrder(order:any){
      this.orderService.setCurrentOrder(order);
      sessionStorage.setItem('return-to' , 'deleted-orders');
      this.linkClicked.emit("view-order"); 
}


search() {
  if (this.searchCriteria === 'date') {
      if (!this.startDate || !this.endDate) {
          this.toastr.error("Start and End dates are required.");
          return;
      }
      if (new Date(this.startDate) >= new Date(this.endDate)) {
          this.toastr.error("Start Date must be less than End Date.");
          return;
      }
  }

  if (this.searchCriteria === 'total') {
     
      if (this.priceFrom >= this.priceTo) {
        this.toastr.error("From price must be less than To price.");
          return;
      }
  }

  this.updateOrders()
}
changeCriteria(){
  this.priceFrom  = 0;
  this.priceTo = 0;
  this.searchTerm = '';
  this.startDate = '';
  this.endDate = '';
}
updateOrders(){
  this.orderService.getDDeletedOrders(
    this.currentPage,
    this.itemsPerPage,
    this.priceFrom , 
    this.searchTerm , 
    this.priceTo , 
    this.searchCriteria , 
    this.startDate , 
    this.endDate 
  ).subscribe(
    response=>{
      this.orders = response.data;
      this.totalOrders = response.total;

    },error=>{
      if(error.status === 404){
      }
      // console.log("error",error);

    }
  );
}

}

