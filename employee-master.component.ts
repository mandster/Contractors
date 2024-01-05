import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { ApexContractualService } from "./_services/apex-contractual.service";
import { Employee } from './_model/employee';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  success= false;
  employees: Employee[] = [];
  sorted = [];
  fg!: FormGroup;
  fEdit!: FormGroup;
  editSuccess = false;
  editEmployeeForm = false;
  deleteSuccess = false;

  constructor(
    private contService: ApexContractualService, private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getEmployees();

    this.fg = this.fb.group({
      // Your form controls here
      employeeName: ['', Validators.required],
      priceCategory: ['', Validators.required],
      definition: [''],
    });
  }

  addNewEmployee() {
    const employeeNameControl = this.fg.get("employeeName");
    const definitionControl = this.fg.get("definition");
    const priceCategoryControl = this.fg.get("priceCategory");
  
    // Check if controls are not null
    if (employeeNameControl && definitionControl && priceCategoryControl) {
      const employeeName = employeeNameControl.value;
      const definition = definitionControl.value;
      const priceCategory = priceCategoryControl.value;
  
      this.contService.addEmployee(employeeName, priceCategory, definition).then((res: any) => {
        this.success = true;
      });
    }
  }
  

  preEditEmployee(employeeId: any, employeeName: any, priceCategory: any, oldDef: any) {
    this.fEdit = this.fb.group({
      employeeId: employeeId,
      employeeName: employeeName,
      definition: oldDef,
      priceCategory: priceCategory
    });
    this.editEmployeeForm = true;
  }

  editEmployee() {
    const employeeIdControl = this.fEdit.get('employeeId');
    const employeeNameControl = this.fEdit.get('employeeName');
    const priceCategoryControl = this.fEdit.get('priceCategory');
    const definitionControl = this.fEdit.get('definition');
  
    // Check if controls are not null
    if (
      employeeIdControl &&
      employeeNameControl &&
      priceCategoryControl &&
      definitionControl
    ) {
      const employeeId = employeeIdControl.value;
      const employeeName = employeeNameControl.value;
      const priceCategory = priceCategoryControl.value;
      const definition = definitionControl.value;
  
      this.contService
        .editEmployee(employeeId, employeeName, priceCategory, definition)
        .then((arg: any) => {
          this.editSuccess = true;
          this.editEmployeeForm = false;
        });
    }
  }
  

  deleteEmployee(employeeId: string | undefined) {
    var result = confirm('Sure to delete?');
    if (result) {
      //Logic to delete the item
      this.contService.deleteEmployee(employeeId).then((arg: any) => {
        this.deleteSuccess = true;
      });
    }
  }

  getEmployees() {
    this.employees = [];
    this.contService.getEmployees().subscribe((arg: any[]) => {
      arg.forEach((res: { payload: { doc: { data: () => { (): any; new(): any; employeeName: any; definition: any; }; id: any; }; }; }) => {
        this.employees.push(
          {
            employeeName: res.payload.doc.data().employeeName,
            data:  res.payload.doc.data() ,
            docId: res.payload.doc.id,
            definition: res.payload.doc.data().definition
          })
      })
    })
    // this.sorted = this.employees.sort((a, b) => {
    //   return a.employeeName - b.employeeName;
    // });
  }

}
