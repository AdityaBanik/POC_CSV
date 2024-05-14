import { Component, Input } from '@angular/core';
import { data } from '@syncfusion/ej2';
import { interval } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  template: `
    <ejs-chart
      [primaryXAxis]="xAxis"
      [primaryYAxis]="yAxis"
      [dataSource]="chartData[showchart]"
      [tooltip]="{ enable: true }"
        [legendSettings]="legendSettings"
    >
      <e-series-collection>
        <e-series
          type="Line"
          [xName]="xName"
          [yName]="yName"
          [marker]="markerSettings"
        ></e-series>
      </e-series-collection>
    </ejs-chart>
  `,
  styles: [],
})
export class LineChartComponent {
  @Input() chartData: any[] = [];
  @Input() xName: string | undefined;
  @Input() yName: string | undefined;
  @Input() showchart: number = 0;
  xAxis = {
    valueType: 'Category',
  };

  yAxis = {};

  markerSettings = {
    visible: true,
    dataLabel: {
      visible: true,
    },
  };

  legendSettings = { visible: true, position: 'Top' };

}
