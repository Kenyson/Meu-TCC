import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  selectedOption: string;
  medicoData: any = {};
  pacienteData: any = {};

  constructor() {
    this.selectedOption = 'medico';
  }

  submitForm() {
    if (this.selectedOption === 'medico') {
      // Enviar os dados do médico para o backend (por exemplo, usando uma requisição HTTP POST)
      console.log(this.medicoData);
    } else if (this.selectedOption === 'paciente') {
      // Enviar os dados do paciente para o backend (por exemplo, usando uma requisição HTTP POST)
      console.log(this.pacienteData);
    }
  }
}
