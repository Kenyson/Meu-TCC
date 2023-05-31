import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  selectedOption: string;
  estados: string[];
  selectedEstado: string;
  mensagemErro: string;

  constructor(private router: Router) {
    this.selectedOption = 'medico';
    this.estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
    this.selectedEstado = '';
    this.mensagemErro = '';
  }

  changeOption(option: string) {
    this.selectedOption = option;
    this.mensagemErro = '';
  }

  testLogin() {
    if (this.selectedOption === 'medico') {
      const crm = (document.getElementById('crm') as HTMLInputElement).value;
      const estado = this.selectedEstado;

      if (crm === '123456' && estado === 'São Paulo') {
        return '/medico';
      } else {
        return '/login';
      }
    } else if (this.selectedOption === 'paciente') {
      const cpf = (document.getElementById('cpf') as HTMLInputElement).value;

      if (cpf === '12345678900') {
        return '/paciente';
      } else {
        return '/login';
      }
    }
    return '/login';
  }

  submitForm() {
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (this.selectedOption === 'medico') {
      const crm = (document.getElementById('crm') as HTMLInputElement).value;
      const estado = this.selectedEstado;

      if (crm === '123456' && estado === 'São Paulo' && password === 'senhaMedico') {
        this.router.navigate(['/medico']);
      } else {
        this.mensagemErro = 'Credenciais inválidas. Por favor, tente novamente.';
      }
    } else if (this.selectedOption === 'paciente') {
      const cpf = (document.getElementById('cpf') as HTMLInputElement).value;

      if (cpf === '12345678900' && password === 'senhaPaciente') {
        this.router.navigate(['/paciente']);
      } else {
        this.mensagemErro = 'Credenciais inválidas. Por favor, tente novamente.';
      }
    }
  }
}
