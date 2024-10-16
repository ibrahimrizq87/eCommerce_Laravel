import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 



@Injectable({
  providedIn: 'root'
})
export class City {
  private apiUrl = environment.apiUrl+'/cities';

    
    private selectedCity: any;

    setCategory(city: any) {
      this.selectedCity = city;

    }
  
    getSelectedCity() {
      return this.selectedCity;
    }

    private allCitys: any [] = [];

    setAllCity(citys: any) {
      this.allCitys = citys;

    }
  
    getAllCity() {
      return this.allCitys;
    }


    constructor(private http: HttpClient) {

     }

   
    addCity(cityData: any): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.post(this.apiUrl,cityData, { headers });
    }
    getCities(): Observable<any> {
        const authToken = sessionStorage.getItem('authToken');
  
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });

        return this.http.get(this.apiUrl, { headers });
      }
      
      deleteCity(id: string): Observable<any> {
        const authToken = sessionStorage.getItem('authToken');
  
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
  
        return this.http.delete(this.apiUrl+'/'+id, { headers });
      }
  


}



