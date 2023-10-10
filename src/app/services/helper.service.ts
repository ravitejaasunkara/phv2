import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private http:HttpClient) { }

  private searchResultsCachedData$:any;

  getData(keyword:string){
    return this.http.get<any>(`http://localhost:9789/producthelper/search?keyword=${keyword.trim()}`);
  }
  getProductsDataByISBN(isbn:string){
    //return of(['products',isbn]);
    return this.http.get(`http://localhost:9789/producthelper/product/${isbn.trim()}`);
  }
  getCategoriesDataByISBN(isbn:string){
    return this.http.get(`http://localhost:9789/producthelper/categories/${isbn.trim()}`);
  }
  getClassificationsDataByIsbn(isbn:string){
    return this.http.get(`http://localhost:9789/producthelper/classifications/${isbn.trim()}`)
  }
  getImprintsDataByISBN(isbn:string){  
    return this.http.get(`http://localhost:9789/producthelper/imprint-publisher/${isbn}`);
  }
  getDownloadsDataByISBN(isbn:string){
    return this.http.get(`http://localhost:9789/producthelper/downloads/${isbn}`);
  }
  getInventoryDataByISBN(isbn:string){
    return of(['inventory',isbn]);
  }
  getDiscountsDataByISBN(isbn:string){
    return this.http.get(`http://localhost:9789/producthelper/downloads/${isbn}`);
  }
  getPricesDataByISBN(isbn:string) {
    return this.http.get(`http://localhost:9789/producthelper/pricing/${isbn}`);
  }
  getSeriesDataByISBN(isbn:string){
    return this.http.get(`http://localhost:9789/producthelper/series/${isbn}`);
  }
  getVersionTypeByIsbn(isbn:string) {
    return this.http.get(`http://localhost:9789/producthelper/version-type/${isbn}`);
  }
  getBindingStyleByIsbn(isbn:string) {
    return this.http.get(`http://localhost:9789/producthelper/binding-style/${isbn}`);
  }
  getRelatedBindingsByIsbn(isbn:string) {
    return this.http.get(`http://localhost:9789/producthelper/related-bindings-data/${isbn}`);
  }
  getRelatedTitlesByIsbn(isbn:string) {
    return this.http.get(`http://localhost:9789/producthelper/related-titles/${isbn}`);
  }
  getOriginatorsDataByISBN(isbn:string){
    return this.http.get(`http://localhost:9789/producthelper/originators/${isbn}`);
  }
  getFilterDataByISBN(isbn:string){
    return of(['Filter',isbn]);
  }
  getResourcesDataByISBN(isbn:string){
    return of(['resources',isbn]);
  }
  
}
