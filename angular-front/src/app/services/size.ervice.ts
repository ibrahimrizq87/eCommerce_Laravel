import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiUrl = environment.apiUrl+'/sizes';


    constructor(private http: HttpClient) { }



    getAllSizes(): Observable<any> {

      return this.http.get(this.apiUrl);
    }

   
}



