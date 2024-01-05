  import { Component, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder } from '@angular/forms';
  import { Product } from '../../_model/product';
  import { ApexContractualService } from '../..//_services/apex-contractual.service';

  @Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.css'],
  })



  export class PriceComponent implements OnInit {
    
    success = false;
    successData = false;
    editSuccess = false;
    deleteSuccess = false;
    editPriceForm = false;
    products : Product[] = [];

    prices = [];
    finalPrices: { data: any; docId: any }[] = [];
    finalData: { 
      productName: any;
      productId: any;
      price: any;
      price2: any;
      price3: any;
      comments: any;
      docId: any;
    }[] = [];
    dateMonthFromDB: any;
    dateMonthRequired: any;
    dateAddedFromDB: any;
    productId: any;
    productName: any;


    fg!: FormGroup;
    fEdit!: FormGroup;

    constructor(
      private contService: ApexContractualService,
      private fb: FormBuilder
    ) {}

    

    ngOnInit(): void {
      this.getProducts();
      this.getPrices();
      this.fg = this.fb.group({
        productId: [''],
        price: [''],
        price2: [''],
        price3: [''],
        comments: [''],
      });
    }


    preEditPrice(priceId: any, productName: any, oldPrice: any, oldPrice2: any) {
      this.fEdit = this.fb.group({
        productId: this.productId,
        productName: productName,
        price: oldPrice,
        price2: oldPrice2,
        priceId: priceId,
      });
      this.editPriceForm = true;
    }

    editPrice() {
      const priceId = this.fEdit.get('priceId')!.value;
      const newPrice = this.fEdit.get('price')!.value;
      const newPrice2 = this.fEdit.get('price2')!.value;
      this.contService.editPrice(priceId, newPrice, newPrice2).then((arg: any) => {
        this.editSuccess = true;
      });
    }

    deletePrice(priceId: any) {
      var result = confirm('Sure to delete?');
      if (result) {
        //Logic to delete the item
        this.contService.deletePrice(priceId).then((arg: any) => {
          this.deleteSuccess = true;
        });
      }
    }

    async getPrices(empId?: undefined) {
      this.prices = [];
      this.finalPrices = [];
      this.contService.getPrices(empId).subscribe((arg: any[]) => {  // <-- Add type here
        arg.forEach((res: { payload: { doc: { data: () => any; id: any; }; }; }) => {
          this.finalPrices.push({
            data: res.payload.doc.data(),
            docId: res.payload.doc.id,
          });
        });
        this.createFinalData();
      });
    }

    // ... (existing code)

    async createFinalData() {
      this.finalData = [];
      this.finalPrices.forEach((arg) => {
        const price = arg.data.price;
        this.products.forEach((product: any) => { // Add type 'any' or replace with the actual type
          if (product.docId == arg.data.productId) {
            this.productName = product.productName;
            this.productId = product.docId;
          }
        });
        this.finalData.push({
          productName: this.productName,
          productId: this.productId,
          price: arg.data.price,
          price2: arg.data.price2,
          price3: arg.data.price3,
          comments: arg.data.comments,
          docId: arg.docId,
        });
        this.successData = true;
      });
    }
    
    addNewPrice() {
      const productId = this.fg.get('productId')!.value;
      const price = this.fg.get('price')!.value;
      const price2 = this.fg.get('price2')!.value;
      const comments = this.fg.get('comments')!.value;
      const price3 = this.fg.get('price3')!.value;
    
      this.contService
        .addNewPrice(productId, price, price2, price3, comments)
        .then((res: any) => {
          this.success = true;
        });
    }
    
  getProducts() {
    this.products = [];
    this.contService.getProducts().subscribe((arg: any[]) => {
      arg.forEach((res: { payload: { doc: { data: () => { (): any; new(): any; productName: any; definition: any; }; id: any; }; }; }) => 
        this.products.push({
          productName: res.payload.doc.data().productName,
          definition: res.payload.doc.data().definition,
          docId: res.payload.doc.id,
          data: res
        })
      );
    });
  }

  }

