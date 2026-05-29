import { Component } from '@angular/core';
import { TranslateService } from './services/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pms';

  constructor(private translateService: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'pt';
    this.translateService.use(savedLang);
  }
}
