import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculateComponent } from './calculate/calculate.component';
import { EmployeeMasterComponent } from './employee-master.component';
import { EntriesComponent } from './entries/entries.component';
import { PriceComponent } from './price-master/price/price.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { SearchComponent } from './search/search.component';
import { ManageEntriesComponent } from './manage-entries/manage-entries.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ApexContractualService } from './_services/apex-contractual.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CalculateComponent,
    EmployeeMasterComponent,
    EntriesComponent,
    PriceComponent,
    ProductMasterComponent,
    SearchComponent,
    ManageEntriesComponent,
    NavComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [
    AngularFirestore,
    ApexContractualService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
