import { Component ,ChangeDetectorRef , OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule , CommonModule],
  providers: [UserService],

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: any;  
  isLogged: Boolean = false; 
  userImage:string = '';
  userName:string = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef 
  ) { }


  logout(): void {

    this.userService.logOut().subscribe(
      response => {
        console.log('here');
        
          sessionStorage.removeItem('authToken');
          // this.isLogged = false;
          // this.userImage = '';
          // this.userName = '';
          window.location.reload();

        
      },
      error => {
        if (error.status === 400 || error.status === 500) {
          console.error('A specific error occurred:', error);
        }else{
          console.error('An unexpected error occurred:', error);
        }
      }
    );


  }
  
  ngOnInit(): void {
    
console.log(sessionStorage.getItem('authToken'));
    if(sessionStorage.getItem('authToken')){

      this.isLogged=true; 
      // this.cdr.detectChanges();
      this.userService.getUser().subscribe(
        response => {
          
          this.user = response.data; 
          console.log(response);
          console.log(response.data.image);
  
          this.userImage = this.user.image;
          this.userName = this.user.name;
        },
        error => {
          if (error.status === 400 || error.status === 500) {
            console.error('A specific error occurred:', error);
          } else if (error.status === 401){
  sessionStorage.removeItem('authToken');
    this.isLogged = false;
          }else{
            console.error('An unexpected error occurred:', error);
          }
        }
      );
    }

  
  }
}
