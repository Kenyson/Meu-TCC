import { Injectable } from '@angular/core';
import { LoadingComponent } from '../components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingComponent: LoadingComponent | null = null;

  setComponent(component: LoadingComponent): void {
    this.loadingComponent = component;
  }

  show(): void {
    if (this.loadingComponent) {
      this.loadingComponent.show();
    }
  }

  hide(): void {
    if (this.loadingComponent) {
      this.loadingComponent.hide();
    }
  }

  showSuccess(): void {
    if (this.loadingComponent) {
      this.loadingComponent.showSuccess();
    }
  }

  showError(message: string): void {
    if (this.loadingComponent) {
      this.loadingComponent.showError(message);
    }
  }
}