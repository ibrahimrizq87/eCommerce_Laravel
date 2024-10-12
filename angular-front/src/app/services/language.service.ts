import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private languageSource = new BehaviorSubject<string>('en');
  language$ = this.languageSource.asObservable();

  setLanguage(language: string) {
    localStorage.setItem('language', language);
    this.languageSource.next(language);
  }

  getLanguage() {
    return localStorage.getItem('language') || 'en'; 
  }
}
