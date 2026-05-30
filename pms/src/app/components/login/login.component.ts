import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  selectedOption: string;
  estados: string[];
  selectedEstado: string;
  crm: string;
  cpf: string;
  password: string;
  errorMessage: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.selectedOption = 'paciente';
    this.estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
    this.selectedEstado = '';
    this.crm = '';
    this.cpf = '';
    this.password = '';
    this.errorMessage = '';

    if (this.authService.isMedicoLoggedIn()) {
      this.router.navigate(['/medico']);
    } else if (this.authService.isPacienteLoggedIn()) {
      this.router.navigate(['/paciente']);
    }
  }

  changeOption(option: string) {
    this.selectedOption = option;
  }

  fillDemoLogin(type: string) {
    if (type === 'medico') {
      this.selectedOption = 'medico';
      this.crm = '99999';
      this.selectedEstado = 'São Paulo';
      this.password = 'doctor123';
    } else if (type === 'paciente1') {
      this.selectedOption = 'paciente';
      this.cpf = '12345678901';
      this.password = 'patient123';
    } else if (type === 'paciente2') {
      this.selectedOption = 'paciente';
      this.cpf = '98765432100';
      this.password = 'patient123';
    } else if (type === 'paciente3') {
      this.selectedOption = 'paciente';
      this.cpf = '11122233344';
      this.password = 'patient123';
    }
  }

  submitForm() {
    this.errorMessage = '';

    if (this.selectedOption === 'medico') {
      this.authService.loginMedico(this.crm, this.selectedEstado, this.password)
        .then(() => {
          this.router.navigate(['/medico']);
        })
        .catch((error) => {
          this.errorMessage = error;
        });
    } else if (this.selectedOption === 'paciente') {
      this.authService.loginPaciente(this.cpf, this.password)
        .then(() => {
          this.router.navigate(['/paciente']);
        })
        .catch((error) => {
          this.errorMessage = error;
        });
    }
  }

  criarCadastro() {
    this.router.navigate(['/cadastro']);
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}