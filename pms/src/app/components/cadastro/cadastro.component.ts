import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';

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

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService) {
    this.selectedOption = 'medico';
  }

  submitForm() {
    if (this.selectedOption === 'medico') {
      if (this.medicoData.senha !== this.medicoData.Confirmsenha) {
        this.errorMessage = this.t('register.passwordMismatch');
        this.showError = true;
        return;
      }

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
        this.errorMessage = this.t('register.requiredFields');
        this.showError = true;
        return;
      }

      this.http.post('http://localhost:3000/medicos', this.medicoData).subscribe(
        response => {
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
        this.errorMessage = this.t('register.passwordMismatch');
        this.showError = true;
        return;
      }

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
        this.errorMessage = this.t('register.requiredFields');
        this.showError = true;
        return;
      }

      this.http.post('http://localhost:3000/pacientes', this.pacienteData).subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        error => {
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erro ao cadastrar paciente.';
          }
          this.showError = true;
        }
      );
    }
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}
