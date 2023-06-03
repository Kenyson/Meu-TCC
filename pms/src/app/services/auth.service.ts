import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosResponse } from 'axios';

interface Medico {
  crm: string;
  nome: string;
}

interface Paciente {
  nome: string;
  cpf: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuarioLogado: Medico | Paciente | null = null;
  mensagemErro: string = '';

  constructor(private router: Router) {}

  loginMedico(crm: string, estado: string, password: string) {
    axios
      .post('http://localhost:3000/login', {
        userType: 'medico',
        crm,
        estado,
        password
      })
      .then((response: AxiosResponse<any>) => {
        if (response.data.success) {
          console.log(response.data.nome);
          this.usuarioLogado = { crm, nome: response.data.nome};
          this.router.navigate(['/medico']);
        } else {
          this.mensagemErro = response.data.message;
        }
      })
      .catch((error: any) => {
        console.error(error);
        this.mensagemErro = 'Erro ao realizar o login do médico.';
      });
  }

  loginPaciente(cpf: string, password: string) {
    axios
      .post('http://localhost:3000/login', {
        userType: 'paciente',
        cpf,
        password
      })
      .then((response: AxiosResponse<any>) => {
        if (response.data.success) {
          console.log(response.data.nome);
          this.usuarioLogado = { nome:response.data.nome , cpf,};
          this.router.navigate(['/paciente']);
        } else {
          this.mensagemErro = response.data.message;
        }
      })
      .catch((error: any) => {
        console.error(error);
        this.mensagemErro = 'Erro ao realizar o login do paciente.';
      });
  }

  logout(): void {
    this.usuarioLogado = null;
    this.router.navigate(['/login']);
  }

  isUsuarioAutenticado(): boolean {
    return this.usuarioLogado !== null;
  }
}
