import { Component } from '@angular/core';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-pms-footer',
  templateUrl: './pms-footer.component.html',
  styleUrls: ['./pms-footer.component.css']
})
export class PmsFooterComponent {
  constructor(private translate: TranslateService) {}

  t(key: string): string {
    return this.translate.get(key);
  }
}
