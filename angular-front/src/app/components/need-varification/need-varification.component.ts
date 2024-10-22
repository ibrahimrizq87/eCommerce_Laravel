import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
 
	 


@Component({
  selector: 'app-need-varification',
  standalone: true,
  imports: [LottieComponent,CommonModule],
  templateUrl: './need-varification.component.html',
  styleUrl: './need-varification.component.css'
})
export class NeedVarificationComponent {
  private successAnimationItem: AnimationItem | undefined;
  currentLanguage: string ='en';

  successAnimationOptions: AnimationOptions = {
    path: 'animations/email.json',
    loop: true,
    autoplay: true
  };

  successAnimationCreated(animationItem: AnimationItem): void {
    this.successAnimationItem = animationItem;
  }

  user: any;
  isLogged: Boolean = false;
  constructor(
    private sharedService: SharedService,
		 private toastr :ToastrService,
    private userService: UserService,
    private router: Router
  ) { 
    this.sharedService.language$.subscribe(language => {
      this.currentLanguage = language;
      });

  }

  resendVerificationEmail() {
    this.userService.resendVarification(localStorage.getItem('tockenForVarification')).subscribe(
      response => {
        if (this.currentLanguage == 'en'){
          this.toastr.success('sent successfully');
        }else{
          this.toastr.success('تمت العمليه بنجاح');
        }
        
    console.log(response);
        },error => {    
          if (this.currentLanguage == 'en'){
            this.toastr.error('some error happend');
          }else{
            this.toastr.error('لقد حدثت مشكله تحقق من اتصال الانترنت');
          }
          


      }
    );
    // console.log('Resending verification email...');
  }

  ngOnInit(): void {

    if (localStorage.getItem('needVarification')){

    }else{
      this.updateUser();
    }

  }

  reloadPage(): void {

    // window.location.reload();  
    localStorage.removeItem('needVarification');
    localStorage.removeItem('tockenForVarification');

    this.router.navigate(['/login']);


  }
  updateUser() {

    if (sessionStorage.getItem('authToken')) {
      if (this.userService.getCurrentUser()) {
        this.user = this.userService.getCurrentUser();
        this.isLogged = true;


      } else {
        this.userService.getUser().subscribe(
          response => {

            this.user = response.data;
            console.log(this.user)
            if (this.user.email_verified_at){
              this.router.navigate(['/login']);
              localStorage.removeItem('needVarification');
        
            }

          },
          error => {
            if (error.status === 400 || error.status === 500) {
              console.error('A specific error occurred:', error);
            } else if (error.status === 401) {

              sessionStorage.removeItem('authToken');
              this.isLogged = false;

              sessionStorage.setItem('loginSession', 'true');
              this.router.navigate(['/login']);

            } else {
              console.error('An unexpected error occurred:', error);
            }
          }
        );
      }
    } else {
      sessionStorage.removeItem('authToken');
      this.isLogged = false;

      sessionStorage.setItem('loginSession', 'true');
      this.router.navigate(['/login']);
    }
  }



}
