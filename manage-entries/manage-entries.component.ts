import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApexContractualService } from '../_services/apex-contractual.service';

@Component({
  selector: 'app-manage-entries',
  templateUrl: './manage-entries.component.html',
  styleUrls: ['./manage-entries.component.css']
})
export class ManageEntriesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  success = false;
  entries: any[] = [];
  finalEntries: any[] = [];
  products: any[] = [];
  employees: any[] = [];
  finalDatas: any[] = [];
  quantity: any;
  employeeId: string = '';
  productId: string = '';
  fg!: FormGroup;
  selectedMonth: string | number = '';
  selectedYear: string = '';
  productName: string = '';
  employeeName: string = '';
  dateAddedFromDB: string = '';
  dateMonthFromDB: string = '';
  dateMonthRequired: string = '';
  displayedColumns: string[] = ['dateAdded', 'employeeName', 'productName', 'quantity'];
  dataSource: MatTableDataSource<any> | null = null;
  preDataSource: any[] = [];

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getProducts();
    const format = 'dd/MM/yyyy';
    const myDate = Date.now();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    this.selectedMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);
    this.selectedYear = new Date().getFullYear().toString().slice(-2);
    this.getEntries();
    this.fg = this.fb.group({
      quantity: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      definition: [''],
      productId: [''],
      employeeId: [''],
      dateAdded: formattedDate,
    });
  }

  getEntries(): void {
    this.finalEntries = [];
    this.contService.getEntries().subscribe((arg: any[]) => {
      this.finalEntries = arg;
      this.createFinalData();
    });
  }

  createFinalData(): void {
    this.finalDatas = this.finalEntries
      .filter((arg) => {
        const monthAdded = arg.dateAdded.substring(3, 5);
        const yearAdded = arg.dateAdded.substring(8, 10);
        this.dateMonthFromDB = monthAdded + '/' + yearAdded;
        this.dateMonthRequired = this.selectedMonth + '/' + this.selectedYear;
        return this.dateMonthFromDB === this.dateMonthRequired;
      })
      .map((arg) => {
        this.quantity = arg.quantity;
        this.dateAddedFromDB = arg.dateAdded;

        const product = this.products.find((p) => p.docId === arg.productId);
        const employee = this.employees.find((emp) => emp.docId === arg.employeeId);

        return {
          productName: product ? product.data.productName : '',
          employeeName: employee ? employee.data.employeeName : '',
          quantity: this.quantity,
          dateAdded: this.dateAddedFromDB,
          productId: product ? product.docId : '',
          employeeId: employee ? employee.docId : '',
        };
      });

    this.dataSource = new MatTableDataSource(this.finalDatas);
    this.dataSource.sort = this.sort;
  }

  changeMonth(event: any): void {
    this.selectedMonth = event.value;
    this.getEntries();
  }

  changeYear(event: any): void {
    this.selectedYear = event.value;
    this.getEntries();
  }

  getProducts(): void {
    this.contService.getProducts().subscribe((res: any[]) => {
      this.products = res.map((arg: { payload: { doc: { data: () => any; id: any; }; }; }) => ({
        data: arg.payload.doc.data(),
        docId: arg.payload.doc.id,
      }));
    });
  }

  getEmployees(): void {
    this.contService.getEmployees().subscribe((res: any[]) => {
      this.employees = res.map((arg: { payload: { doc: { data: () => any; id: any; }; }; }) => ({
        data: arg.payload.doc.data(),
        docId: arg.payload.doc.id,
      }));
    });
  }

  addNewEntry(): void {
    const quantity = this.fg.get('quantity')?.value;
    const definition = this.fg.get('definition')?.value;
    const productId = this.fg.get('productId')?.value;
    const employeeId = this.fg.get('employeeId')?.value;
    const dateAdded = this.fg.get('dateAdded')?.value;
  
    if (quantity !== undefined && definition !== undefined && productId !== undefined &&
        employeeId !== undefined && dateAdded !== undefined) {
      this.contService
        .addNewEntry(quantity, productId, employeeId, dateAdded, definition)
        .then(() => {
          this.success = true;
          this.getEntries();
        });
    } else {
      console.error('One or more form controls are null or undefined.');
    }
  }
  

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
}
