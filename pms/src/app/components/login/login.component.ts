import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
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

  submitForm() {
    this.errorMessage = '';

    if (this.selectedOption === 'medico') {
      this.authService.loginMedico(this.crm, this.selectedEstado, this.password)
        .then(() => {
          // Login bem-sucedido
          this.router.navigate(['/medico']);
        })
        .catch((error) => {
          // Erro durante o login
          this.errorMessage = error;
        });
    } else if (this.selectedOption === 'paciente') {
      this.authService.loginPaciente(this.cpf, this.password)
        .then(() => {
          // Login bem-sucedido
          this.router.navigate(['/paciente']);
        })
        .catch((error) => {
          // Erro durante o login
          this.errorMessage = error;
        });
    }
  }

  criarCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
