import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl+'/users';

    // private apiUrl = 'http://0.0.0.0:8000/api/users'; 

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



