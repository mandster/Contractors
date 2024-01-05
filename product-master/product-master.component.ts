import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApexContractualService } from '../_services/apex-contractual.service';
import { Product } from 'app/_model/product';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css'],
})
export class ProductMasterComponent implements OnInit {
  @ViewChild('editProd', { static: false })
  editProds!: ElementRef;

  success = false;
  editSuccess = false;
  deleteSuccess = false;
  products: Product[]  = [];
  finalData = [];
  fg!: FormGroup;
  fEdit!: FormGroup;
  editProductForm = false;

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.getProducts();
  }

  initializeForms(): void {
    this.fg = this.fb.group({
      productName: ['', Validators.required],
      definition: [''],
      size: [''],
    });

    this.fEdit = this.fb.group({
      productId: [''],
      productName: [''],
      definition: [''],
    });
  }

  addNewProduct(): void {
    const productName = this.fg.get('productName')?.value;
    const definition = this.fg.get('definition')?.value;
    const size = this.fg.get('size')?.value;

    this.contService.addNewProduct(productName, size, definition).then(() => {
      this.handleSuccess('Product added successfully.');
    });
  }

  preEditProduct(productId: any, productName: any, oldDef: any): void {
    this.fEdit.setValue({ productId, productName, definition: oldDef });
    this.editProductForm = true;
    // this.editProds.nativeElement.focus();
  }

  editProduct(): void {
    const productId = this.fEdit.get('productId')?.value;
    const productName = this.fEdit.get('productName')?.value;
    const definition = this.fEdit.get('definition')?.value;

    this.contService.editProduct(productId, productName, definition).then(() => {
      this.handleSuccess('Product edited successfully.');
      this.editProductForm = false;
    });
  }

  deleteProduct(productId: string | undefined): void {
    const result = confirm('Sure to delete?');
    if (result) {
      this.contService.deleteProduct(productId).then(() => {
        this.handleSuccess('Product deleted successfully.');
      });
    }
  }

  getProducts(): void {
    this.products = [];
    this.contService.getProducts().subscribe((snapshots) => {
      snapshots.forEach((snapshot) => {
        this.products.push({
          productName: snapshot.payload.doc.data().productName,
          docId: snapshot.payload.doc.id,
          definition: snapshot.payload.doc.data().definition,
          data: snapshot.payload.doc.data()
        });
      });
    });
  }

  private handleSuccess(message: string): void {
    // Common method to handle success messages
    // You can customize this method based on your application's needs.
    this.success = true; // or any other logic to display success message
    console.log(message);
  }
}
