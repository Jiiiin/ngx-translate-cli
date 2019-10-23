import { Component } from '@angular/core';
import { tanslate } from 'ngx-translate';
@Component({
  selector: 'nz-demo-tooltip-arrow-point-at-center',
  template: `
  `,
  styles: [
    `
      button {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    `
  ]
})
export class NzDemoTooltipArrowPointAtCenterComponent {
  constructor(private _tanslate: tanslate) {
}
    public cc = "边缘对齐";
    public formsetting: any;
    public i18values;
    aa(){
        const aa = '边缘'
        console.log('箭头指向中心')
    }

    initForm() {
      this.formsetting = {
          group: [
            {label: '名称'},
            {label: '地址'}
          ]
      }
    }

    getI18() {
      this._translate.get(['ad','cc']).subscribe((value) => {
        this.i18values = value;
      })
    }


}