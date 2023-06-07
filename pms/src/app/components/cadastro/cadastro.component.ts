import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  selectedOption: string;
  medicoData: any = {};
  pacienteData: any = {};

  constructor(private http: HttpClient) {
    this.selectedOption = 'medico';
  }

  submitForm() {

    if (this.selectedOption === 'medico') {
      this.http.post('http://localhost:3000/medicos', this.medicoData)
        .subscribe(
          response => {
            console.log('Médico cadastrado com sucesso:', response);
          },
          error => {
            console.error('Erro ao cadastrar médico:', error);
          }
        );
    } else if (this.selectedOption === 'paciente') {
      this.http.post('http://localhost:3000/pacientes', this.pacienteData)
        .subscribe(
          response => {
            console.log('Paciente cadastrado com sucesso:', response);
          },
          error => {
            console.error('Erro ao cadastrar paciente:', error);
          }
        );
    }
  }
}
