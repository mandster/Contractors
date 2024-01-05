import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { Product } from '../_model/product';
import { Entry } from '../_model/entry';
import { Employee } from '../_model/employee';
import { Price } from '../_model/price';

@Injectable({
  providedIn: 'root',
})
export class ApexContractualService {
  constructor(private afs: AngularFirestore) {}

  addEmployee(employeeName: any, priceCategory: any, defintion: any) {
    return this.afs.collection('employees').add({
      employeeName: employeeName,
      priceCategory: priceCategory,
      defintion: defintion,
    });
  }

  getEmployees() {
    return this.afs
      .collection<Employee>('employees', (ref) => ref.orderBy('employeeName'))
      .snapshotChanges();
  }

  editEmployee(employeeId: string | undefined, employeeName: any, priceCategory: any, definition: any) {
    return this.afs.collection('employees').doc(employeeId).ref.update({
      employeeName: employeeName,
      priceCategory: priceCategory,
      definition: definition
    });
  }

  deleteEmployee(employeeId: string | undefined) {
    return this.afs.collection('employees').doc(employeeId).ref.delete();
  }

  getEmployee(id: string | undefined) {
    return this.afs.collection('employees').doc(id).ref.get();
  }

  editProduct(productId: string | undefined, productName: any, definition: any) {
    return this.afs.collection('products').doc(productId).ref.update({
      productName: productName,
      definition: definition
    });
  }

  addNewProduct(productName: any, size: any, definition: any) {
    return this.afs.collection('products').add({
      productName: productName,
      size: size,
      definition: definition,
    });
  }

  deleteProduct(productId: string | undefined) {
    return this.afs.collection('products').doc(productId).ref.delete();
  }

  getPrices(event: undefined) {
    console.log(event);
    return this.afs
      .collection<Price>('prices')
      .snapshotChanges();
  }

  getPriceByCat(prodId: any, cat: any) {
    return this.afs
    .collection('prices', (ref) => ref
    .where('productId', '==', prodId)
    )
      .get();
  }

  editPrice(priceId: string | undefined, price: any, price2: any) {
    return this.afs.collection('prices').doc(priceId).ref.update({
      price: price,
      price2: price2
    });
  }

  deletePrice(priceId: string | undefined) {
    console.log(priceId);
    return this.afs.collection('prices').doc(priceId).ref.delete();
  }

  addNewPrice(productId: any, price: any, price2: any, price3: any, comments: any) {
    return this.afs.collection('prices').add({
      productId: productId,
      price: price,
      price2: price2,
      price3: price3,
      comments: comments
    });
  }

  getProducts() {
    return this.afs
      .collection<Product>('products', (ref) => ref.orderBy('productName'))
      .snapshotChanges();
  }
  
  getProducts1() {
    return this.afs.collection('products').get();
  }

  getProduct(id: string | undefined) {
    return this.afs.collection('products').doc(id).ref.get();
  }

  addNewEntry(quantity: any, productId: any, employeeId: any, dateAdded: any, definition: any) {
    return this.afs.collection('entries').add({
      productId: productId,
      employeeId: employeeId,
      quantity: quantity,
      dateAdded: dateAdded,
      definition: definition,
    });
  }

  getProductById(id: string | undefined) {
    return this.afs.collection('products').doc(id).ref.get();
  }

  getEmployeeById(id: string | undefined) {
    console.log(id)
    return this.afs.collection('employees').doc(id).ref.get();
  }

  getEntries() {
    return this.afs.collection('entries').snapshotChanges();
  }

  getEntriesGet() {
    return this.afs.collection<Entry>('entries').get();
  }

  editEntry(entryId: string | undefined, productId: any, employeeId: any,definition: any, quantity: any, dateAdded: any) {
    return this.afs.collection('entries').doc(entryId).ref.update({
      productId: productId,
      employeeId: employeeId,
      definition: definition,
      quantity: quantity,
      dateAdded: dateAdded,
    });
  }

  getEntriesCalc(employeeId: any) {
    return this.afs
      .collection('entries', (ref) => ref
      .where('employeeId', '==', employeeId))
      .get();
  }

  getPricesCalc(procuctId: any) {
    return this.afs
      .collection('prices', (ref) => ref
      .where('productId', '==', procuctId)
      )
      .get();
  }

  getEmployeePriceCat(employeeId: string)
 {
return this.afs.collection('employees').doc(employeeId).ref.get();
 }

  getEntry(id: string | undefined) {
    return this.afs.collection('entries').doc(id).ref.get();
  }

  deleteEntry(entryId: string | undefined) {
    return this.afs.collection('entries').doc(entryId).ref.delete();
  }

  GetAssets(): Observable<any[]> {
    let assets: any[] = [
      {
        assetId: 1,
        assetName: 'Item A',
        cpuName: 'CPU A',
        hddName: 'HDD A',
      },
      {
        assetId: 2,
        assetName: 'Item B',
        cpuName: 'CPU B',
        hddName: 'HDD B',
      },
      {
        assetId: 3,
        assetName: 'Item C',
        cpuName: 'CPU C',
        hddName: 'HDD C',
      },
    ];

    return of(assets);
  }
}
