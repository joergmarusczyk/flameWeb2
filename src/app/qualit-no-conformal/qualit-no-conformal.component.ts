import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { QualitNoConformalService } from './qualit-no-conformal.service';
import {Model} from '../Globals';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartColor} from 'chart.js';

@Component({
  selector: 'app-qualit-no-conformal',
  templateUrl: './qualit-no-conformal.component.html',
  styleUrls: ['./qualit-no-conformal.component.css']
})
export class QualitNoConformalComponent implements OnInit, OnChanges {

  constructor(private service: QualitNoConformalService,
    public model: Model) { }

    @Input() modelName;
    @Input() modelVersion;

    objectKeys = Object.keys;
    modelBuildInfo = {};
    modelValidationInfo = {};
    // PolarArea
    public polarChartOptions: any = {
      responsive: true,
      startAngle : 1 * Math.PI,
      scale: {
        gridLines: {
          color: 'rgba(0, 0, 0, 0.5)'
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.5)',
          fontStyle : 'bold'
        }
      }
    };
    public polarAreaChartLabels: Label[] = ['TP', 'FP', 'TN', 'FN'];
    public polarAreaChartData: SingleDataSet = [0, 0, 0, 0];
    public polarAreaChartData2: SingleDataSet = [0, 0, 0, 0];
    public polarAreaLegend = true;
    public polarAreaChartType: ChartType = 'polarArea';
    public polarAreaChartColors = [
      {
        backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(235,143,3,0.3)', 'rgba(3,49,155,0.3)', 'rgba(255,0,0,0.3)'],
      },
    ];


  ngOnChanges(): void {
    this.getValidation();
  }

  getValidation() {
    this.service.getValidation(this.modelName, this.modelVersion).subscribe(
      result => {
        const info = result;
        console.log(info);
        // INFO ABOUT MODEL
        for (const modelInfo of info['model_build_info']) {
          if (typeof modelInfo[2] === 'number') {
            modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
          }
          this.modelBuildInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
        }
        // INFO ABOUT VALIDATION
        for (const modelInfo of info['model_valid_info']) {
          if (typeof modelInfo[2] === 'number') {
            modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
          }
          if (typeof modelInfo[2] !== 'object') {
            this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
          }
        }
        setTimeout(() => {
          if (this.modelValidationInfo['TP']) {
            this.polarAreaChartData = [this.modelValidationInfo['TP'][1], this.modelValidationInfo['FP'][1],
            this.modelValidationInfo['TN'][1], this.modelValidationInfo['FN'][1]];
          }
          this.polarAreaChartData2 = [this.modelValidationInfo['TPpred'][1], this.modelValidationInfo['FPpred'][1],
          this.modelValidationInfo['TNpred'][1], this.modelValidationInfo['FNpred'][1]];
        }, 50);
      },
      error => {
        alert('Error getting model');
      }
    );
  }

}
