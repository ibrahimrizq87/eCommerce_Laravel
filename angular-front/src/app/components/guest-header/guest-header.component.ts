import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedService } from '../../services/language.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-guest-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './guest-header.component.html',
  styleUrl: './guest-header.component.css'
})
export class GuestHeaderComponent {



constructor(private sharedService:SharedService ,private http: HttpClient){

}

  currentLanguage: string = 'en'; 

  ngOnInit() {
    this.loadLanguage();

  }


  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.sharedService.setLanguage(lang);
  }

  loadLanguage() {
  
    this.currentLanguage = this.sharedService.getLanguage();

  }
}

