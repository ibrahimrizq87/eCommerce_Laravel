import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://127.0.0.1:8000/api/users'; 

    constructor(private http: HttpClient) { }

    getUser(): Observable<any> {
        const authToken = sessionStorage.getItem('authToken');

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        return this.http.get(`${this.apiUrl}/me`, { headers });
    }


    login(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, userData);
    }

    logOut(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
    
      return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
    }
    
}



