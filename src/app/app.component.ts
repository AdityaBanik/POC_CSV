import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Spreadsheet,
  SpreadsheetComponent,
} from '@syncfusion/ej2-angular-spreadsheet';
import * as Papa from 'papaparse';
import { FormControl } from '@angular/forms';
import { max } from 'rxjs';
@Component({
  selector: 'app-root',
  template: `
    <section class="container" *ngIf="showChart">
      <h4>CO2 Emissions</h4>
      <app-line-chart
        [chartData]="sheetsData"
        xName="Month"
        yName="CO2 (KMT)"
      ></app-line-chart>
    </section>

    <section class="container">
      <button (click)="open()" class="e-btn e-primary">Open File</button>
      <button (click)="chartOptions.toggle($event)" class="e-btn e-primary">
        Create Chart
      </button>
      <button (click)="op.toggle($event)" class="e-btn e-primary">
        Compare CSV
      </button>

      <p-overlayPanel #chartOptions>
        <form class="form-container">
          <label
            >Chart Type
            <select [formControl]="chartType">
              <option value="line">Line</option>
              <option value="bar">Bar</option>
            </select>
          </label>
        </form>
      </p-overlayPanel>

      <p-overlayPanel #op>
        <form
          *ngIf="this.spreadsheet!.sheets.length >= 2; else notEnoughSheets"
          (submit)="compareSheetData($event)"
          class="form-container"
        >
          <div *ngFor="let sheet of this.spreadsheet!.sheets; index as i">
            <label>
              <input type="checkbox" [value]="i" />
              {{ sheet.name }}
            </label>
          </div>
          <button type="submit" class="e-btn e-tertiary">
            Generate Difference Sheet
          </button>
        </form>
        <ng-template #notEnoughSheets>
          <div>You need to have at least 2 sheets to compare</div>
        </ng-template>
      </p-overlayPanel>

      <ejs-spreadsheet #spreadsheet >
        <e-sheets>
          <e-sheet>
            <e-ranges>
              <e-range></e-range>
            </e-ranges>
          </e-sheet>
        </e-sheets>
      </ejs-spreadsheet>
    </section>
  `,
  styles: [
    `
      .container {
        padding: 2em 5em;
      }
      .container > button {
        margin-bottom: 20px;
        margin-right: 5px;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }

      .form-container label {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('spreadsheet')
  spreadsheet: SpreadsheetComponent | undefined;

  sheetsData: any = [];
  //chart
  chartData: any;
  showChart: any;
  showCompareOptions: boolean = false;
  chartType!: FormControl<any>;

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.chartType = new FormControl('');
    this.chartType.setValue('line');
  }
  open() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv'; // Only accept .csv and .xlsx files

    fileInput.onchange = (event) => {
      // Get the selected file
      let file = (event.target as any).files[0];
      fileInput.onchange = null;
      // Parse the file with Papa Parse
      Papa.parse(file, {
        complete: (results) => {
          this.sheetsData.push(results.data);
          this.spreadsheet?.insertSheet([
            {
              index: this.spreadsheet?.sheets.length - 1,
              name: file.name.split('.')[0],
              ranges: [
                {
                  dataSource: this.sheetsData[this.sheetsData.length - 1],
                },
              ],
              columns: this.sheetsData[this.sheetsData.length - 1].map(
                (_: any) => {
                  return { width: 100 };
                }
              ),
            },
          ]);
          if (this.sheetsData.length == 1) {
            this.spreadsheet?.delete(this.spreadsheet.sheets.length - 1);
          }
        },
        header: true,
      });
    };

    // Trigger the file input dialog
    fileInput.click();
  }

  generateChart() {
    this.showChart = false;
    setTimeout(() => {
      this.showChart = true;
    }, 0);
  }

  compareSheetData(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const checkboxes = Array.from(form.elements).filter(
      (element: any) => element.checked
    );
    const selectedIndices = checkboxes.map((checkbox: any) =>
      Number(checkbox.value)
    );

    let keys: string[] = [];
    let data: any[] = [];
    selectedIndices.forEach((item) => {
      // @ts-ignore
      keys.push(...this.spreadsheet?.sheets[item]?.ranges[0]?.info.flds);
      // @ts-ignore
      data.push(this.spreadsheet?.sheets[item]?.ranges[0]?.dataSource);
    });
    keys = [...new Set(keys)];

    console.log(this.compareArraysByKeys(data, keys));
    this.spreadsheet?.insertSheet([
      {
        index: this.spreadsheet?.sheets.length - 1,
        name: 'Difference',
        ranges: [
          {
            dataSource: this.compareArraysByKeys(data, keys),

          },
        ],
        columns: keys.map((_) => {
          return { width: 130 };
        }), 
      },
    ]);
  
  }

/*   compareArraysByKeys(objectsArrays: any[], keys: any[]) {
    const comparedData: any = [];

    const maxRows = Math.max(...objectsArrays.map((array) => array.length));

    for (let i = 0; i < maxRows; i++) {
      const row: any = {};
      keys.forEach((key) => {
        objectsArrays.forEach((array, index) => {

          const value = array[i] && array[i][key] ? array[i][key] : 'missing';
          if (!row[key]) {
            row[key] = value;
          } else {
            row[key] =
              row[key] === value
                ? row[key]
                : `${row[key]},${value}`;
          }
        });
      });

      comparedData.push(row);
    }
    return comparedData;
  } */

  compareArraysByKeys(objectsArrays: any[], keys: any[]) {
    const comparedData: any = [];
  
    const maxRows = Math.max(...objectsArrays.map((array) => array.length));
  
    for (let i = 0; i < maxRows; i++) {
      const row: any = {};
      keys.forEach((key) => {
        objectsArrays.forEach((array, index) => {
  
          const value = array[i] && array[i][key] ? array[i][key] : 'missing';
          if (!row[key]) {
            row[key] = { value: value, style: {} };
          } else {
            row[key].value =
              row[key].value === value
                ? row[key].value
                : `${row[key].value},${value}`;
  
            // If the value contains a comma, set the style
            if (row[key].value.includes(',')) {
              row[key].style = {color:'red', backgroundColor: 'orange' };
            }
          }
        });
      });
  
      comparedData.push(row);
    }
    return comparedData;
  }
}
