import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { ChartModule } from '@syncfusion/ej2-angular-charts'
import {
  CategoryService,
  LegendService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import {
  DataLabelService,
  LineSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { LineChartComponent } from './LineChart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';


@NgModule({
  declarations: [AppComponent, LineChartComponent],
  imports: [BrowserModule, SpreadsheetAllModule,ChartModule,OverlayPanelModule,BrowserAnimationsModule,ReactiveFormsModule],
  providers: [
    CategoryService,
    LegendService,
    TooltipService,
    DataLabelService,
    LineSeriesService,
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}
