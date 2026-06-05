import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root'
})
export class SyncGuard implements CanActivate {
  private hasSyncedThisSession = false;

  constructor(private syncService: SyncService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Executar sync apenas uma vez por sessão de navegador
    if (!this.hasSyncedThisSession) {
      this.hasSyncedThisSession = true;
      this.syncService.autoSync().catch(err => console.error('Erro no auto-sync:', err));
    }
    return true;
  }
}
