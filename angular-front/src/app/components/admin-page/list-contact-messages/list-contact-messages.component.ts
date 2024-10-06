import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact.service';

@Component({
  selector: 'app-list-contact-messages',
  standalone: true,
  imports: [NgxPaginationModule,
    CommonModule
  ],
  templateUrl: './list-contact-messages.component.html',
  styleUrl: './list-contact-messages.component.css'
})
export class ListContactMessagesComponent {
  messages: any;

  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private contactService: ContactService) { }
  ngOnInit(): void {
    this.updateMessages();
  }
  delete(message:any){
    this.contactService.deleteMessage(message.id).subscribe(
      response => {
        alert('deleted successfully');
        this.updateMessages();
        console.log(response);

      },error=>{
        alert('an error happend check you network connection')
        console.log('an error happend' , error)
      }
    );
  
  }

  updateMessages() {
    this.contactService.getAllMessage().subscribe(
      response => {
        // console.log(response);
        this.messages = response.data;
        // console.log(  this.messages );
        
      },error=>{
        console.log('an error happend' , error)
      }
    );
  }
}
