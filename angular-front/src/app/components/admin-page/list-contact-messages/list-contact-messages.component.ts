import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact.service';
import { FormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/language.service';
 

@Component({
  selector: 'app-list-contact-messages',
  standalone: true,
  imports: [NgxPaginationModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './list-contact-messages.component.html',
  styleUrl: './list-contact-messages.component.css'
})
export class ListContactMessagesComponent {
  messages: Message[]=[];
  currentLanguage: string ='en';

  filteredMessages: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(	 private sharedService: SharedService,
    private toastr :ToastrService,
private contactService: ContactService) {

 this.sharedService.language$.subscribe(language => {
  this.currentLanguage = language;
  });
 }
  ngOnInit(): void {
    this.updateMessages();
  }
  search() {
    if (this.searchTerm) {
      this.filteredMessages = this.messages.filter(message =>
        message.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredMessages = this.messages; 
    }
  }
  delete(message:any){
    this.contactService.deleteMessage(message.id).subscribe(
      response => {
        // alert('deleted successfully');
        if (this.currentLanguage == 'en'){
          this.toastr.success('deleted successfully');
        }else{
          this.toastr.success('تمت العمليه بنجاح');
        }
        this.updateMessages();
        // console.log(response);

      },error=>{
        if (this.currentLanguage == 'en'){
          this.toastr.error('some error happend');
        }else{
          this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
        }
      }
    );
  
  }

  updateMessages() {
    this.contactService.getAllMessage().subscribe(
      response => {
        this.messages = response.data;
        this.filteredMessages =this.messages;
      },error=>{
        // console.log('an error happend' , error)
      }
    );
  }
}
interface Message {
  name: string;
  message: string;
  email: string;
  phone: string;
  id:number;
}