import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  selectedOption: string;
  medicoData: any = {};
  pacienteData: any = {};

  constructor(private http: HttpClient, private router: Router) {
    this.selectedOption = 'medico';
  }

  submitForm() {
    if (this.selectedOption === 'medico') {
      if (this.medicoData.senha !== this.medicoData.Confirmsenha) {
        console.error('A senha e a confirmação da senha não coincidem.');
        return;
      }

      this.http.post('http://localhost:3000/medicos', this.medicoData)
        .subscribe(
          response => {
            console.log('Médico cadastrado com sucesso:', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Erro ao cadastrar médico:', error);
          }
        );
    } else if (this.selectedOption === 'paciente') {
      if (this.pacienteData.senha !== this.pacienteData.Confirmsenha) {
        console.error('A senha e a confirmação da senha não coincidem.');
        return;
      }

      this.http.post('http://localhost:3000/pacientes', this.pacienteData)
        .subscribe(
          response => {
            console.log('Paciente cadastrado com sucesso:', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Erro ao cadastrar paciente:', error);
          }
        );
    }
  }
}
