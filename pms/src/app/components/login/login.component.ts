import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Medico {
  crm: number;
  estado: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  especialidade: string;
  senha: string;
}

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  cpf: string;
  telefone: string;
  senha: string;
}

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

  constructor(private router: Router, private http: HttpClient) {
    this.selectedOption = 'medico';
    this.estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
    this.selectedEstado = '';
    this.mensagemErro = '';
  }

  changeOption(option: string) {
    this.selectedOption = option;
    this.mensagemErro = '';
  }

  submitForm() {
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (this.selectedOption === 'medico') {
      const crm = (document.getElementById('crm') as HTMLInputElement).value;
      const estado = this.selectedEstado;

      this.http.post<any>('http://localhost:3000/login', { crm, estado, password, userType: 'medico' })
        .subscribe(response => {
          if (response.success) {
            this.router.navigate(['/medico']);
          } else {
            this.mensagemErro = 'Credenciais inválidas. Por favor, tente novamente.';
          }
        }, error => {
          console.error(error);
          this.mensagemErro = 'Erro ao efetuar login.';
        });
    } else if (this.selectedOption === 'paciente') {
      const cpf = (document.getElementById('cpf') as HTMLInputElement).value;

      this.http.post<any>('http://localhost:3000/login', { cpf, password, userType: 'paciente' })
        .subscribe(response => {
          if (response.success) {
            this.router.navigate(['/paciente']);
          } else {
            this.mensagemErro = 'Credenciais inválidas. Por favor, tente novamente.';
          }
        }, error => {
          console.error(error);
          this.mensagemErro = 'Erro ao efetuar login.';
        });
    }
  }
}
