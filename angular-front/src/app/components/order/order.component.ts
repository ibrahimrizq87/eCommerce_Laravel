import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [],
  providers: [UserService],

  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  user: any; 
  constructor(private userService: UserService ) { }
  
  ngOnInit(): void {
    this.userService.getUser('9').subscribe(
      response => {
        this.user = response; 
        console.log(response);
        console.log(response.data.email);
      },
      error => {
        if (error.status === 400 || error.status === 500) {
          console.error('A specific error occurred:', error);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    );
  }
}
