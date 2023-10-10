import { Product } from 'src/app/models/product-main';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper.service';
import { error } from '@angular/compiler/src/util';
import { Subject, interval } from 'rxjs';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css']
})
export class HelperComponent {

  enteredTextInSkuIsbnTitleInputField: string = '';
  productData: any = [];
  productpageDropdownSelectedValue: string = 'Finder';
  productDataAvailable: boolean = false;
  showProductPage: boolean = false;
  hideSearchPageOnceClickedAndNavigatedToProductData: boolean = true;
  search_results: boolean = false;
  product_data: boolean = false;
  product_data_arr: any[] = [];
  categories_data: boolean = false;
  categories_data_arr: any[] = [];
  classifications_data: boolean = false;
  classification_data_arr: any[] = [];
  downloads_data: boolean = true;
  downloads_data_arr = [];
  imprints_data: boolean = false;
  imprints_data_arr = [];
  inventory_data: boolean = false;
  inventory_data_arr = [];
  originators_data: boolean = false;
  originators_data_arr = [];
  discounts_data: boolean = false;
  discounts_data_arr = [];
  series_data: boolean = false;
  series_data_arr: any[] = [];
  versiontype_data: boolean = false;
  versiontype_data_arr: any[] = [];
  binding_style_data: boolean = false;
  binding_style_data_arr: any[] = [];
  related_titles_data: boolean = false;
  related_titles_data_arr: any[] = [];
  related_bindings_data: boolean = false;
  related_bindings_data_arr: any[] = [];
  resources_data: boolean = false;
  resources_data_arr = [];
  filter_data: boolean = false;
  filter_data_arr = [];
  productPageTitle: string = '';
  productPageISBN: string = '';
  productPageSKN: string = '';
  firstPageData: any[] = [];
  related_bindings_data_flag: boolean = false;
  prices_data_arr: any[] = [];
  prices_data: boolean = false;
  //empty data
  downloads_data_empty: boolean = false;
  product_data_empty: boolean = false;
  categories_data_empty: boolean = false;
  classification_data_empty: boolean = false;
  series_data_empty: boolean = false;
  versiontype_data_empty: boolean = false;
  bindingstyle_data_empty: boolean = false
  related_bindings_data_empty: boolean = false;
  related_titles_data_empty: boolean = false;
  prices_data_empty: boolean = false;
  discounts_data_empty: boolean = false;
  originators_data_empty: boolean = false;
  search_results_empty: boolean = false;
  private searchSubject = new Subject<string>();
  private ngUnsubscribe = new Subject<void>(); // Used for unsubscribing

  dropdownArrayValues = ['Product', 'Categories & Classifications', 'Downloads', 'Imprints & Publishers', 'Inventory Status', 'Originators', 'Pricing & Discounts', 'Series & Bindings', 'Product Resources'];
  constructor(private helperService: HelperService, private http: HttpClient) { 
    this.setupSearchSubscription();
  }

  setupSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    ).subscribe((keyword: string) => {
      this.productSearch(keyword);
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  searchForProductWithEnteredKeyword() {
    this.searchSubject.next(this.enteredTextInSkuIsbnTitleInputField);
  }

  productSearch(keyword:string) {
    this.setErrorflags();
    this.setDataEmptyTriggers();
    this.productData = [];
    console.log(this.enteredTextInSkuIsbnTitleInputField);
    if (this.enteredTextInSkuIsbnTitleInputField) {
      this.helperService.getData(this.enteredTextInSkuIsbnTitleInputField)
        .subscribe((res: any) => {
          this.productData = res.data;
          this.productDataAvailable = this.productData.length != 0 ? true : false;
          this.search_results = this.productData.length > 0;
          console.log(this.productData.length);
        }, (res: any) => {
          this.productDataAvailable = false;
          this.search_results = false;
          this.search_results_empty = true;
          this.productData = [];
        })
    }
  }
  enableProductPageWithProductData(title: string, ISBN: string, SKN: string) {
    this.productPageTitle = title;
    this.productPageISBN = ISBN;
    this.productPageSKN = SKN;
    this.showProductPage = true;
    this.productDataAvailable = false;
    this.hideSearchPageOnceClickedAndNavigatedToProductData = false;
    this.productpageDropdownSelectedValue = 'Product';
    this.setErrorflags();
    this.product_data = true;
    this.productpageDropdownChanged();
  }
  productpageDropdownChanged() {
    this.setErrorflags();
    this.setDataEmptyTriggers();
    if (this.productpageDropdownSelectedValue == 'Product') {
      this.helperService.getProductsDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.product_data_arr = [];
        this.firstPageData = [res.data];
        this.product_data = true;
        this.firstPageData.forEach(res => {
          let product = new Product();
          product.name = res.name;
          product.subTitle = res.subTitle;
          product.sku = res.sku;
          product.isbn = res.isbn;
          product.isbn10 = res.isbn10;
          product.projectNo = res.projectNo;
          product.ownership = res.ownership;
          product.id = res.id;
          product.versionType = res.versionType;
          product.imprint = res.imprint;
          product.publisher = res.publisher;
          product.metatags = res.metatags;
          product.description = res.description;
          product.features = res.features;
          product.reviews = res.reviews;
          product.gtUpdate = res.gtLastUpdate;
          product.pubDate = res.publicationDate;
          product.copyRight = res.copyright;
          product.homeDiscountCode = res.homeDiscountCode;
          product.editionNo = res.editionNo;
          product.pages = res.pages;
          product.isBestSeller = res.isBestSeller;
          this.product_data_arr.push(product);
          console.log(this.product_data_arr[0].name);
        }, (error: any) => this.product_data_empty = true)
      });
    } else if (this.productpageDropdownSelectedValue == 'Categories & Classifications') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getCategoriesDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.categories_data = res.data.length > 0;
        this.categories_data_arr = res.data;
        console.log(this.categories_data_arr)
      });
      this.helperService.getClassificationsDataByIsbn(this.productPageISBN).subscribe((res: any) => {
        this.setErrorflags();
        this.setDataEmptyTriggers();
        this.classifications_data = res.data.length > 0;
        this.classification_data_arr = res.data;
        console.log(this.classification_data_arr);
      })
    } else if (this.productpageDropdownSelectedValue == 'Downloads') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getDownloadsDataByISBN(this.productPageISBN)
        .subscribe(
          (res: any) => {
            this.downloads_data_arr = res.data;
            this.downloads_data = res.data.length > 0;
            console.log(res)
          }, (error) => {
            this.downloads_data_empty = true;
          }
        );
      console.log(this.downloads_data);
    } else if (this.productpageDropdownSelectedValue == 'Imprints & Publishers') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getImprintsDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.imprints_data_arr = res.data;
        this.imprints_data = true;
        console.log(this.imprints_data_arr)
      });
    } else if (this.productpageDropdownSelectedValue == 'Inventory Status') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getInventoryDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.inventory_data_arr = res;
        this.inventory_data = true;
        console.log(res)
      });
    } else if (this.productpageDropdownSelectedValue == 'Originators') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getOriginatorsDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.originators_data_arr = res.data;
        this.originators_data = true;
        console.log(res)
      }, (error: any) => this.originators_data_empty = true);
    } else if (this.productpageDropdownSelectedValue == 'Pricing & Discounts') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getDiscountsDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.discounts_data_arr = res.data;
        this.discounts_data = true;
        console.log(res)
      }, (error: any) => this.discounts_data_empty = true);
      this.helperService.getPricesDataByISBN(this.productPageISBN)
        .subscribe((res: any) => {
          this.prices_data_arr = res.data;
          this.prices_data = true;
        }, (error: any) => this.prices_data_empty = true)
    } else if (this.productpageDropdownSelectedValue == 'Series & Bindings') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getSeriesDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.series_data_arr = [res.data];
        this.series_data = true;
        console.log(this.series_data_arr)
      }, (error) => this.series_data_empty = true)
      this.helperService.getVersionTypeByIsbn(this.productPageISBN).subscribe((res: any) => {
        this.versiontype_data_arr = [res.data];
        this.versiontype_data = true;
        console.log(this.versiontype_data_arr[0].id)
      }, (error) => this.versiontype_data_empty = true)
      this.helperService.getBindingStyleByIsbn(this.productPageISBN).subscribe((res: any) => {
        this.binding_style_data_arr = [res.data];
        this.binding_style_data = true;
        console.log(this.binding_style_data_arr)
      }, (error: any) => this.bindingstyle_data_empty = true)
      this.helperService.getRelatedBindingsByIsbn(this.productPageISBN).subscribe((res: any) => {
        this.related_bindings_data_arr = res.data;
        //this.related_bindings_data == res.data.length > 0;
        console.log(this.related_bindings_data_arr)
        //console.log(this.related_bindings_data);
        this.related_bindings_data_flag = true;
      }, (error: any) => this.related_bindings_data_empty = true)
      this.helperService.getRelatedTitlesByIsbn(this.productPageISBN).subscribe((res: any) => {
        this.related_titles_data = true;
        this.related_titles_data_arr = res.data;
        console.log(this.related_titles_data_arr)
      }, (error: any) => this.related_titles_data_empty = true)

    } else if (this.productpageDropdownSelectedValue == 'Product Resources') {
      this.setErrorflags();
      this.setDataEmptyTriggers();
      this.helperService.getResourcesDataByISBN(this.productPageISBN).subscribe((res: any) => {
        this.resources_data_arr = res;
        this.resources_data = true;
        console.log(res)
      });
    }
  }
  // this is to set false to all the remaining variables, so that only currently
  // selected dropdown value will only be selected, remaining all divs will be hidden from the template
  setErrorflags() {
    this.product_data = false;
    this.categories_data = false;
    this.downloads_data = false;
    this.imprints_data = false;
    this.originators_data = false;
    this.discounts_data = false;
    this.resources_data = false;
    this.series_data = false;
    this.versiontype_data = false;
    this.binding_style_data = false;
    this.related_bindings_data_flag = false;
    this.related_titles_data = false;
    this.inventory_data = false;
    this.filter_data = false;
    this.classifications_data = false;
    this.prices_data = false;
    this.discounts_data = false;
    this.originators_data = false;
  }
  gotohome() {
    this.hideSearchPageOnceClickedAndNavigatedToProductData = true;
    this.showProductPage = false;
    this.productDataAvailable = true;
    this.setErrorflags();
    this.setDataEmptyTriggers();
  }
  fetchNewProductDataWithIsbn(isbn: string) {
    console.log(isbn);
    this.setErrorflags();
    this.setDataEmptyTriggers();
    this.productpageDropdownSelectedValue = 'Product';
    this.productPageISBN = isbn;
    this.productpageDropdownChanged();
  }
  setDataEmptyTriggers() {
    this.product_data_empty = false;
    this.categories_data_empty = false;
    this.classification_data_empty = false;
    this.downloads_data_empty = false;
    this.series_data_empty = false;
    this.versiontype_data_empty = false;
    this.bindingstyle_data_empty = false
    this.related_bindings_data_empty = false;
    this.related_titles_data_empty = false;
    this.prices_data_empty = false;
    this.discounts_data_empty = false;
    this.originators_data_empty = false;
    this.search_results_empty = false;
  }

}


