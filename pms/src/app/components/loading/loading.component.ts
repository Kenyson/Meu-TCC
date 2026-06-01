import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  show(): void {
    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;
    this.errorMessage = '';
  }

  hide(): void {
    this.isLoading = false;
    this.isSuccess = false;
    this.isError = false;
    this.errorMessage = '';
  }

  showSuccess(): void {
    this.isLoading = true;
    this.isSuccess = true;
    this.isError = false;
    this.errorMessage = '';
    setTimeout(() => {
      this.hide();
    }, 1000);
  }

  showError(message: string): void {
    this.isLoading = true;
    this.isSuccess = false;
    this.isError = true;
    this.errorMessage = message;
  }

  dismiss(): void {
    this.hide();
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}
