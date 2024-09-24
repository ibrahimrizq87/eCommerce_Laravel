import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartContentComponent } from "./cart-content/cart-content.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CartListComponent,
    CartContentComponent,
    RouterOutlet
],
providers: [UserService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  user: any;
  constructor(private userService: UserService, private router: Router ) { }


  ngOnInit(): void {
    console.log(sessionStorage.getItem('authToken'));
    if (sessionStorage.getItem('authToken')) {


      this.userService.getUser().subscribe(
        response => {


        },
        error => {
          if (error.status === 400 || error.status === 500) {
            console.error('A specific error occurred:', error);
          } else if (error.status === 401) {
            sessionStorage.removeItem('authToken');
            // alert('need to log in first');
            sessionStorage.setItem('loginSession', 'true');

            this.router.navigate(['/login']);
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      );
    } else {
      // alert('need to log in first');
      sessionStorage.setItem('loginSession', 'true');

      this.router.navigate(['/login']);

    }


  }
}
