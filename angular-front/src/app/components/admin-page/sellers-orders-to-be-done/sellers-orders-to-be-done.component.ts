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
  selector: 'app-sellers-orders-to-be-done',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
   FormsModule,
   MatPaginatorModule

 ],
  templateUrl: './sellers-orders-to-be-done.component.html',
  styleUrl: './sellers-orders-to-be-done.component.css'
})
export class SellersOrdersToBeDoneComponent {
  @Output() linkClicked = new EventEmitter<string>();
  currentLanguage: string ='en';

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
    private toastrService:ToastrService,
    private sharedService: SharedService,
    
  ){

 this.sharedService.language$.subscribe(language => {
  this.currentLanguage = language;
  });
  }




  ngOnInit(): void {
    this.updateOrders();
}

onPageChange(event: PageEvent) {
  this.currentPage = event.pageIndex+1; 
  this.itemsPerPage = event.pageSize; 
  this.updateOrders();
}

getCustomer(order:any){
  this.customerService.getCustomerById(order.user.id).subscribe(
    response=>{

      this.customerService.setCurrentCustomer(response.data);
      sessionStorage.setItem('return-to' , 'seller-orders');
      this.linkClicked.emit("show-customer"); 

    },error=>{
      // console.log('error getting data:',error);
    }
  );
}

deleteOrder(order:any){
  this.orderService.deleteOrder(order.id).subscribe(
      (response) => {
        this.updateOrders();
        if (this.currentLanguage == 'en'){
          this.toastrService.success('deleted successfully');
        }else{
          this.toastrService.success('تم الحذف بنجاح.');
        }
      },
      (error) => {
        // this.toastrService.error('an error happened try again later');
          if (error.status === 401) {
              sessionStorage.removeItem('authToken');
              sessionStorage.setItem('loginSession', 'true');
              this.updateOrders();
              
            }else if(error.status === 403){
              if (this.currentLanguage == 'en'){
                this.toastrService.error('can not delete a payed order');
              }else{
                this.toastrService.error('لا يمكن حذف طلب مدفوع.');
              }
    
            }else{
    

              if (this.currentLanguage == 'en'){
                this.toastrService.error('an erro happend try again later');
              }else{
                this.toastrService.error('حدث خطأ، يرجى المحاولة لاحقًا.');
              }
            }            }
  );
}

viewOrder(order:any){
      this.orderService.setCurrentOrder(order);
      sessionStorage.setItem('return-to' , 'seller-orders-to-b-done');
      this.linkClicked.emit("view-order"); 
}
deliveryed(order:any){
  this.orderService.updateOrderStatus({'id':order.id , 'status': 'delivered'}).subscribe(
    response=>{
      if (this.currentLanguage == 'en'){
        this.toastrService.success('updated successfully');
      }else{
        this.toastrService.success('تمت العمليه بنجاح');
      }      this.updateOrders();
    },error=>{
      if (this.currentLanguage == 'en'){
        this.toastrService.error('some error happend');
      }else{
        this.toastrService.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
      }
    }
  );
}

search() {
  if (this.searchCriteria === 'date') {
      if (!this.startDate || !this.endDate) {
        if (this.currentLanguage == 'en')
          {
            this.toastrService.error("Start and End dates are required.");

          }else{
            this.toastrService.error("تاريخ البدء وتاريخ الانتهاء مطلوبان.");

          }
          return;
      }
      if (new Date(this.startDate) >= new Date(this.endDate)) {
          if (this.currentLanguage == 'en')
            {
              this.toastrService.error("Start Date must be less than End Date.");
  
            }else{
              this.toastrService.error("يجب أن يكون تاريخ البدء أقل من تاريخ الانتهاء.");
  
            }
          return;
      }
  }

  // console.log("Searching...", this.searchCriteria, this.searchTerm, this.startDate, this.endDate, this.priceFrom, this.priceTo);
  this.updateOrders();
}
changeCriteria(){
  this.priceFrom  = 0;
  this.priceTo = 0;
  this.searchTerm = '';
  this.startDate = '';
  this.endDate = '';
}
updateOrders(){
  this.orderService.getWaitingOrders(
    'done',
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
      // console.log('my serponse >>>>>+++::: ',response);



    },error=>{
      if(error.status === 404){
      }
      console.log("error",error);

    }
  );
}

}

