import { formatDate } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../_model/employee';
import { Price } from '../_model/price';
import { ApexContractualService } from '../_services/apex-contractual.service';
import { QuerySnapshot } from '@angular/fire/compat/firestore';
import { EntryData } from '../entry-data';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.css']
})
export class CalculateComponent implements OnInit {
  @ViewChild(MatSort) matSort!: MatSort;

  displayedColumns: string[] = ['date', 'productName', 'quantity', 'rate', 'rowTotal'];
  priceCategory: any;
  success = false;
  entries: any[] = [];
  dataSource!: MatTableDataSource<any>;
  employees: Employee[] = [];
  sorted: any[] = [];
  fg!: FormGroup;
  finalPrices: Price[] = [];
  thisMonth!: string | number;
  thisYear!: string;
  totalCalc = 0;
  prices: Price[] = [];
  finalData: any[] = [];
  finalEntries: any;
  dataAvailable = false;

  constructor(
    private contService: ApexContractualService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.initializeFormGroup();
  }

  initializeFormGroup(): void {
    const today = new Date();
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';

    this.thisMonth = ('0' + (today.getMonth() + 1)).toString().slice(-2);
    this.thisYear = today.getFullYear().toString();

    this.fg = this.fb.group({
      selectedMonth: [this.thisMonth],
      selectedYear: [this.thisYear],
      employeeId: [''],
      consolidated: ['']
    });
  }

  getEmployees(): void {
    this.employees = [];
    this.contService.getEmployees().subscribe((arg) => {
      this.employees = arg.map((res) => ({
        employeeName: res.payload.doc.data().employeeName,
        data: res.payload.doc.data(),
        docId: res.payload.doc.id,
        definition: res.payload.doc.data().definition
      }));
    });
  }

  getPrices(empId?: undefined): void {
    this.prices = [];
    this.finalPrices = [];
    
    this.contService.getPrices(empId).subscribe((arg: any[]) => {
      arg.forEach((res: { payload: { doc: { data: () => any; id: any; }; }; }) => {
        this.finalPrices.push({
          employeeId: res.payload.doc.data().employeeId,
          productId: res.payload.doc.data().productId,
          price: res.payload.doc.data().price,
          price2: res.payload.doc.data().price2,
          price3: res.payload.doc.data().price3,
          comments: res.payload.doc.data().comments,
        });
      });
      this.createFinalData();
    });
  }

 // ...

getEntries(): void {
  this.entries = [];
  this.finalEntries = [];
  this.finalData = [];
  this.totalCalc = 0;
  let dateFromDB;

  const selectedMonth = this.fg.get('selectedMonth')?.value;
  const selectedYear = this.fg.get('selectedYear')?.value;
  const employeeId = this.fg.get('employeeId')?.value;

  if (!selectedMonth || !selectedYear || !employeeId) {
    console.error("selectedMonth, selectedYear, or employeeId is null");
    return;
  }

  const selectedYearMonth = `${selectedMonth}/${selectedYear}`;

  this.contService.getEmployeePriceCat(employeeId).then((arg1: any) => {
    if (arg1 && arg1.data && typeof arg1.data === 'function') {
      const priceCategory = arg1.data().priceCategory as number;
      this.priceCategory.push(priceCategory);
      this.contService.getEntriesCalc(employeeId).subscribe((querySnapshot) => {
        const arg: EntryData[] = [];
        querySnapshot.forEach((res: any) => {
          arg.push(res.data());
        });

        arg.forEach((res) => {
          dateFromDB = res.dateAdded.substring(3, 10);
          if (dateFromDB === selectedYearMonth) {
            this.finalEntries.push(res);
          }
        });

        this.createArray(this.finalEntries, priceCategory);
      });
    } else {
      console.error("arg1 or arg1.data() is null");
    }
  });
}

// ...

  createConsolidatedArray(entriesArray: any[], priceCategory: number): void {
    // ... (remaining code)
  }

  createArray(entriesArray: any[], priceCategory: number): void {
    // ... (remaining code)
  }

  createFinalData(): void {
    console.log(this.dataSource);
  }
}
