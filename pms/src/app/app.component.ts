import { Component, ViewChild } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { TranslateService } from './services/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pms';

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  constructor(
    private translateService: TranslateService,
    private loadingService: LoadingService
  ) {}

  ngAfterViewInit(): void {
    this.loadingService.setComponent(this.loadingComponent);
  }
}
