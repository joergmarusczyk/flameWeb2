import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {Model} from '../Globals';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.css']
})
export class ValidationsComponent implements OnChanges {

  @Input() name;
  @Input() version;
  modelDocumentation: any = undefined;

  constructor(public model: Model,
              private commonService: CommonService) { }


  ngOnChanges(): void {
    this.modelDocumentation = undefined;
    this.model.parameters = undefined;
    this.getParameters();
  }

  getParameters(): void {
    this.commonService.getParameters(this.name, this.version).subscribe(
      result => {
        this.model.parameters = result;
      },
      error => {
        alert('get paramaeters validation');
        alert(error.status + ' : ' + error.statusText);
      }
    );
  }
}
