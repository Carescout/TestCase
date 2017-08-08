import { FormsModule } from '@angular/forms';
import { HomeComponent } from './../home/home.component';
import { Http, HttpModule } from '@angular/http';
import { Component, OnInit } from '@angular/core';

import * as _ from 'underscore';

export class PagingService {
    getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);
 
        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
 
        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
        let pages = _.range(startPage, endPage + 1);
 
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}

@Component({
    selector: 'careprovider',
    templateUrl: './careprovider.component.html',
    providers: [PagingService]
})
export class CareProviderComponent {
    allcareproviders: any[];
    pagedcareproviders: any[];    
    displaycareproviders: any[];
    providernumberfilteredArray: any[];
    providernamefilteredArray: any[];
    zipcodefilteredArray: any[];
    pager: any = {};
    providernumber = '';
    providername = '';     
    zipcode = '';

    constructor(private http: Http, private pagingservice: PagingService  ) {}

    ngOnInit(){
        console.log('---CareProviderComponent: ngOnInit');
        
        this.http.get('https://data.medicare.gov/resource/4pq5-n9py.json')
            .subscribe(response =>{
                this.allcareproviders = response.json();
                this.pagedcareproviders = this.allcareproviders;
                this.setPage(1);
            });
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        this.pager = this.pagingservice.getPager(this.pagedcareproviders.length, page);
 
        // get current page of items
        this.displaycareproviders = this.pagedcareproviders.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onSearch(){
//Angu Comments - Here code can be optimized by filter after filter -- sorry no time... late night
        this.providernumberfilteredArray = this.allcareproviders.filter( careprovider => careprovider.federal_provider_number.toString().indexOf(this.providernumber.toString())!== -1 )
        this.providernamefilteredArray = this.providernumberfilteredArray.filter( careprovider => careprovider.provider_name.toLowerCase().indexOf(this.providername.toLowerCase())!== -1 )
        this.zipcodefilteredArray = this.providernamefilteredArray.filter( careprovider => careprovider.provider_zip_code.toString().indexOf(this.zipcode.toString())!== -1 )
        this.pagedcareproviders = this.zipcodefilteredArray;
        this.setPage(1);
    }
}