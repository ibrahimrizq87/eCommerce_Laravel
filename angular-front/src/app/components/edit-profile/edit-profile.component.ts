import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
 
  providers: [AuthService],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',

  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1, overflow: 'visible' })),
      state('out', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      transition('in => out', animate('1s')),
      transition('out => in', animate('0.5s'))
    ])
  ]
})




export class EditProfileComponent {
  isSeller: boolean = false;
  selectedFile: File | null = null;
  submitted: boolean = false;
  imageUploaded = false;
  backendErrors: any = {};

  constructor(private authService: AuthService ,   private router: Router) { }


  onRoleChange(role: string) {
    this.isSeller = (role === 'seller');
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageUploaded = event.target.files && event.target.files.length > 0;

  }



  getErrorMessages(): string[] {
    const errorMessages: string[] = [];
    if (this.backendErrors) {
      Object.keys(this.backendErrors).forEach(key => {
        this.backendErrors[key].forEach((message: string) => {
          errorMessages.push(`${key}: ${message}`);
        });
      });
    }
    return errorMessages;
  }

  
  onSubmit(registerForm: any) {
    this.submitted = true;
    if (registerForm.valid) {
      const formData = new FormData();
      const deviceName = getDeviceName();
      console.log(deviceName);
      if (deviceName) {
        formData.append('device_name', deviceName);

      }


      Object.keys(registerForm.value).forEach(key => {
        formData.append(key, registerForm.value[key]);
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      console.log(formData);
      this.authService.register(formData).subscribe(
        response => {
          const token = response.token;
          console.log('Registration successful:', response);
          console.log('tocken:', token);
          sessionStorage.setItem('authToken', token);

          this.router.navigate(['/home']);

        },
        error => {
          if (error.status === 400 || error.status === 500) {
            this.backendErrors = error.error.errors;
            console.error('Registration failed:', error);
            console.log('Error: ' + error.error.errors);

            Object.keys(error.error.errors).forEach(key => {
              console.log('Field:', key);

              error.error.errors[key].forEach((message: String) => {
                console.log('Error message:', message);
              });
            });
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }




}

function getDeviceName(): string {
  const userAgent = navigator.userAgent;

  if (/android/i.test(userAgent)) {
    return 'Android Device';
  } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return 'iOS Device';
  } else if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  } else if (/Win/i.test(userAgent)) {
    return 'Windows PC';
  } else if (/Mac/i.test(userAgent)) {
    return 'Macintosh';
  } else if (/Linux/i.test(userAgent)) {
    return 'Linux';
  } else {
    return 'Unknown Device';
  }
}

