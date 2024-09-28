import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import {  Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {


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
            sessionStorage.setItem('loginSession', 'true');

            this.router.navigate(['/login']);
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      );
    } else {
      sessionStorage.setItem('loginSession', 'true');

      this.router.navigate(['/login']);

    }


  }
}
