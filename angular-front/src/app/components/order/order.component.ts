import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginAlertComponent } from '../login-alert/login-alert.component';

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
  constructor(private userService: UserService, private router: Router ,public dialog: MatDialog) { }
  openAlertDialogAsync() {
    setTimeout(() => {
      this.dialog.open(LoginAlertComponent, {
        data: {
          icon: 'Check',
          message: 'This Alert Dialog opened asynchronously'
        }
      });
    }, 200);
  }

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
