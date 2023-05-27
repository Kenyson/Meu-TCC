import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  selectedOption: string;

  constructor() {
    this.selectedOption = 'medico';
  }

  submitForm() {
  }
}
