import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pms-header',
  templateUrl: './pms-header.component.html',
  styleUrls: ['./pms-header.component.css']
})
export class PmsHeaderComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
