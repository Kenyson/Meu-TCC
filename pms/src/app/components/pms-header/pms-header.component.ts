import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from 'src/app/services/translate.service';
import { SyncService } from 'src/app/services/sync.service';

@Component({
  selector: 'app-pms-header',
  templateUrl: './pms-header.component.html',
  styleUrls: ['./pms-header.component.css']
})
export class PmsHeaderComponent implements OnInit {
  currentLang: string = 'pt';
  isSyncing: boolean = false;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private syncService: SyncService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.getCurrentLang();
  }

  goToHome(): void {
    this.router.navigate(['/']);
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

  async manualSync(): Promise<void> {
    this.isSyncing = true;
    try {
      await this.syncService.manualSync();
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}