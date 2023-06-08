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
  errorMessage: string = '';
  showError: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.selectedOption = 'medico';
  }

  submitForm() {
    if (this.selectedOption === 'medico') {
      if (this.medicoData.senha !== this.medicoData.Confirmsenha) {
        this.errorMessage = 'A senha e a confirmação da senha não coincidem.';
        return;
      }

      // Verifica se algum campo obrigatório está vazio
      if (
        !this.medicoData.crm ||
        !this.medicoData.estado ||
        !this.medicoData.nome ||
        !this.medicoData.sobrenome ||
        !this.medicoData.especialidade ||
        !this.medicoData.email ||
        !this.medicoData.senha ||
        !this.medicoData.Confirmsenha
      ) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
        this.showError = true;
        return;
      }

      this.http.post('http://localhost:3000/medicos', this.medicoData).subscribe(
        response => {
          console.log('Médico cadastrado com sucesso:', response);
          this.router.navigate(['/login']);
        },
        error => {
          if (error.message && error.status === 400) {
            this.errorMessage = error.error;
            this.showError = true;
          } else {
            this.errorMessage = 'Erro ao cadastrar médico.';
            this.showError = true;
          }
        }
      );
    } else if (this.selectedOption === 'paciente') {
      if (this.pacienteData.senha !== this.pacienteData.Confirmsenha) {
        this.errorMessage = 'A senha e a confirmação da senha não coincidem.';
        this.showError = true;
        return;
      }

      // Verifica se algum campo obrigatório está vazio
      if (
        !this.pacienteData.cpf ||
        !this.pacienteData.nome ||
        !this.pacienteData.sobrenome ||
        !this.pacienteData.email ||
        !this.pacienteData.telefone ||
        !this.pacienteData.dataNascimento ||
        !this.pacienteData.endereco ||
        !this.pacienteData.senha ||
        !this.pacienteData.Confirmsenha
      ) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
        return;
      }

      this.http.post('http://localhost:3000/pacientes', this.pacienteData).subscribe(
        response => {
          console.log('Paciente cadastrado com sucesso:', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Erro ao cadastrar paciente:', error);
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erro ao cadastrar paciente.';
          }
        }
      );
    }
  }
}
