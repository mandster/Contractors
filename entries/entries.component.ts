import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Entry } from '../_model/entry';
import { ApexContractualService } from '../_services/apex-contractual.service';

interface Element {
  quantity: any;
  definition: any;
  productId: any;
  employeeId: any;
  dateAdded: any;
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
})
export class EntriesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) matSort!: MatSort;

  success = false;
  entries: any[] = [];
  finalEnteries: any[] = [];
  products: any[] = [];
  employees: any[] = [];
  finalDatas: any[] = [];
  quantity: any;
  employeeId!: string;
  productId!: string;
  fg!: FormGroup;
  selectedMonth!: string;
  selectedYear!: string;
  productName!: string;
  employeeName!: string;
  dateAddedFromDB!: string;
  dateMonthFromDB!: string;
  dateMonthRequired!: string;
  displayedColumns: string[] = [
    'dateAdded',
    'employeeName',
    'productName',
    'quantity',
  ];
  dataSource!: MatTableDataSource<Entry>;
  preDataSource: any[] = [];
  loading = false;

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
    this.employees = [];
    this.getEmployees();
    this.getProducts();
    this.initializeForm();
    this.selectedMonth = this.formatDateComponent(new Date(), 'MM');
    this.selectedYear = this.formatDateComponent(new Date(), 'yy');
    this.getEntries();
  }

  initializeForm() {
    const format = 'dd/MM/yyyy';
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const formattedDate = this.formatDateComponent(yesterday, format);

    this.fg = this.fb.group({
      quantity: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      definition: [''],
      productId: ['0'],
      employeeId: ['0'],
      dateAdded: formattedDate,
    });
  }

  getEntries(month?: string, year?: string) {
    this.contService.getEntriesGet().subscribe((arg) => {
      this.finalEnteries = arg.docs.map((res: any) => res.data());
      this.createFinalData();
    });
  }

  createFinalData(month?: string, year?: string) {
    this.finalDatas = this.finalEnteries
      .filter((arg: any) => arg.dateAdded)
      .filter((arg: any) => {
        const monthAdded = arg.dateAdded.substring(3, 5);
        const yearAdded = arg.dateAdded.substring(8, 10);
        this.dateMonthFromDB = monthAdded + '/' + yearAdded;
        this.dateMonthRequired = this.selectedMonth + '/' + this.selectedYear;
        return this.dateMonthFromDB === this.dateMonthRequired;
      })
      .map((arg: any) => {
        this.quantity = arg.quantity;
        this.dateAddedFromDB = arg.dateAdded;
        this.productId = this.getProductById(arg.productId);
        this.employeeId = arg.id;
        return {
          productName: this.productName,
          employeeName: this.employeeName,
          quantity: this.quantity,
          dateAdded: this.dateAddedFromDB,
          productId: this.productId,
          employeeId: this.employeeId,
        };
      });

    this.dataSource = new MatTableDataSource<Entry>(this.finalDatas);
    this.dataSource.sort = this.matSort;
  }

  getEmployeeById(empId: any) {
    
  }

  formatDateComponent(date: Date, format: string): string {
    return formatDate(date, format, 'en-US');
  }

  changeMonth(event: any) {
    this.selectedMonth = event;
    this.getEntries(this.selectedMonth, this.selectedYear);
  }

  changeYear(event: any) {
    this.selectedYear = event;
    this.getEntries(this.selectedMonth, this.selectedYear);
  }

  getProducts() {
    this.contService.getProducts().subscribe((res) => {
      this.products = res.map((arg) => ({
        data: arg.payload.doc.data(),
        docId: arg.payload.doc.id,
      }));
    });
  }
  
  getEmployees() {
    this.contService.getEmployees().subscribe((res) => {
      this.employees = res.map((arg) => ({
        data: arg.payload.doc.data(),
        docId: arg.payload.doc.id,
      }));
    });
  }

  addNewEntry() {
    this.loading = true;
    const quantity = this.fg.get('quantity')?.value;
    const definition = this.fg.get('definition')?.value;
    const productId = this.fg.get('productId')?.value;
    const employeeId = this.fg.get('employeeId')?.value;
    const dateAdded = this.fg.get('dateAdded')?.value;

    this.contService
      .addNewEntry(quantity, productId, employeeId, dateAdded, definition)
      .then(() => {
        this.success = true;
        this.fg.disable();
        this.entries = [];
        this.loading = false;
      });
  }

  addNew() {
    this.success = false;
    this.fg.enable();
  }

  getEmployee(empId: string): void {
    const employee = this.employees.find((arg) => arg.docId === empId);
    this.employeeName = employee ? employee.data.employeeName : '';
  }

  getProductById(prodId: string): string {
    const product = this.products.find((arg) => arg.docId === prodId);
    return product ? product.data.productName : '';
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
  }
}
