import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-pms-header',
  templateUrl: './pms-header.component.html',
  styleUrls: ['./pms-header.component.css']
})
export class PmsHeaderComponent implements OnInit {
  currentLang: string = 'pt';

  constructor(public authService: AuthService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.currentLang = this.translate.getCurrentLang();
  }

  logout(): void {
    this.authService.logout();
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    window.location.reload();
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}
