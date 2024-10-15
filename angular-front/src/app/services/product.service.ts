import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class ProductService {
    // private apiUrl = 'http://0.0.0.0:8000/api/products'; 
    private apiUrl = environment.apiUrl+'/products';


    constructor(private http: HttpClient) { }
    private selectedProduct: any;

    setProduct(product: any) {
      this.selectedProduct = product;

    }
  
    getSelectedProduct() {
      return this.selectedProduct;
    }

    private allProducts: any [] = [];

    setAllProduct(products: any) {
      this.allProducts = products;

    }

    // getProducts(page: number, itemsPerPage: number, searchCriteria: string, searchTerm: string, priceFrom: number, priceTo: number): Observable<any> {
    //   let params: any = {
    //     page: page,
    //     itemsPerPage: itemsPerPage,
    //   };
  
    //   if (searchCriteria && searchTerm) {
    //     params[searchCriteria] = searchTerm;
    //   }
  
    //   if (priceFrom && priceTo) {
    //     params.priceFrom = priceFrom;
    //     params.priceTo = priceTo;
    //   }
  
    //   return this.http.get(this.apiUrl, { params });
    // }
  
    // getAllProduct() {
    //   return this.allProducts;
    // }

    // getProducts(page: number, itemsPerPage: number, searchCriteria: string, searchTerm: string, priceFrom: number, priceTo: number): Observable<any> {
    //   const params = new HttpParams()
    //     .set('page', page.toString())
    //     .set('itemsPerPage', itemsPerPage.toString())
    //     .set('searchCriteria', searchCriteria)
    //     .set('searchTerm', searchTerm)
    //     .set('priceFrom', priceFrom.toString())
    //     .set('priceTo', priceTo.toString());
    
    //   return this.http.get('api/products', { params });
    // }

    getProducts(page: number, itemsPerPage: number, searchCriteria: string, searchTerm: string, priceFrom: number, priceTo: number): Observable<any> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('itemsPerPage', itemsPerPage.toString());
    
      if (searchCriteria && searchTerm) {
        params = params.set('searchCriteria', searchCriteria).set('searchTerm', searchTerm);
      }
    
      // if (priceFrom !== null) {
      // }
      if (priceTo >0) {
        params = params.set('priceFrom', priceFrom.toString());
        params = params.set('priceTo', priceTo.toString());
      }
    
      return this.http.get(this.apiUrl, { params });
    }
    


    getProduct(id: string): Observable<any> {
        const authToken = sessionStorage.getItem('authToken');

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${authToken}`
        });
        return this.http.get(`${this.apiUrl}/${id}`, { headers });
    }


    

    getLatestProducts(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.get(`${this.apiUrl}/most-selled`, { headers });
  }

    getProductsInWishlist(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.get(`${this.apiUrl}/wishlist/all`, { headers });
  }

    

    getAllProducts(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return this.http.get(this.apiUrl, { headers });
    }
    
    getMostOfferedProducts(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return this.http.get(this.apiUrl+'/most-offered', { headers });
    }
    
    getMostOfferedProductsSeller(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return this.http.get(this.apiUrl+'/most-ordered-seller', { headers });
    }



    
    
    getRelatedProducts(categotyId: string): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return this.http.get(`${this.apiUrl}/related-products/${categotyId}`, { headers });
    }

    getProductsByCategory(categotyId: string): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return this.http.get(`${this.apiUrl}/byCategory/${categotyId}`, { headers });
    }

    getProductsRecent(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return this.http.get(`${this.apiUrl}/recent`, { headers });
    }

    deleteProduct(id: string): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }

    restoreProduct(id: string): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.get(`${this.apiUrl}/restore/${id}`, { headers });
    }


   
    addProduct(productData: any): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.post(this.apiUrl,productData, { headers });
      // return this.http.post(this.apiUrl,productData);

    }


    getMyProducts(): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.get(this.apiUrl+'/myProduct', { headers });

    }

    updateProduct(productData: any ): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      return this.http.post(`${this.apiUrl}/update`,productData, { headers });
    }

    getProductsByOffer(
      page: number, 
      itemsPerPage: number, 
      searchCriteria: string, 
      searchTerm: string, 
      priceFrom: number, 
      priceTo: number, 
      offer_id: string
    ): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
    
      let params = new HttpParams()
        .set('page', page.toString())
        .set('itemsPerPage', itemsPerPage.toString());
    
      if (searchCriteria && searchTerm) {
        params = params.set('searchCriteria', searchCriteria).set('searchTerm', searchTerm);
      }
    
      if (priceTo > 0) {
        params = params.set('priceFrom', priceFrom.toString()).set('priceTo', priceTo.toString());
      }
    
      params = params.set('offerId', offer_id.toString());
    
      return this.http.get(`${this.apiUrl}/byOffer/${offer_id}`, { headers, params });
    }

    getDeletedProducts(
      page: number, 
      itemsPerPage: number, 
      searchCriteria: string, 
      searchTerm: string, 
      priceFrom: number, 
      priceTo: number
    ): Observable<any> {
      const authToken = sessionStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      let params = new HttpParams()
        .set('page', page.toString())
        .set('itemsPerPage', itemsPerPage.toString());
    
      if (searchCriteria && searchTerm) {
        params = params.set('searchCriteria', searchCriteria).set('searchTerm', searchTerm);
      }
    
      if (priceTo > 0) {
        params = params.set('priceFrom', priceFrom.toString()).set('priceTo', priceTo.toString());
      }
      
      return this.http.get(this.apiUrl+"/deleted", { headers ,params });
    }
    


    

}



