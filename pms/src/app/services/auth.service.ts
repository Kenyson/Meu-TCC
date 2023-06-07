import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosResponse } from 'axios';

interface Medico {
  crm: string;
  nome: string;
}

interface Paciente {
  id: string;
  cpf: string;
  nome: string;
}

interface MedicoLogado extends Medico {
  id: string;
}

interface PacienteLogado extends Paciente {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'authData';

  public usuarioLogado: MedicoLogado | PacienteLogado | null = null;
  mensagemErro: string = '';

  constructor(private router: Router) {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      this.usuarioLogado = JSON.parse(storedData);
    }
  }

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
          this.usuarioLogado = { id: response.data.crm, crm, nome: response.data.nome };
          this.saveDataToStorage();
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
          console.log(response.data.id)
          this.usuarioLogado = { id: response.data.id, nome: response.data.nome, cpf };
          this.saveDataToStorage();
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
    this.clearDataFromStorage();
    this.router.navigate(['/login']);
  }

  isUsuarioAutenticado(): boolean {
    return this.usuarioLogado !== null;
  }

  isMedicoLoggedIn(): boolean {
    return this.usuarioLogado !== null && 'crm' in this.usuarioLogado;
  }

  isPacienteLoggedIn(): boolean {
    return this.usuarioLogado !== null && 'cpf' in this.usuarioLogado;
  }

  private saveDataToStorage(): void {
    if (this.usuarioLogado !== null) {
      const { id, ...data } = this.usuarioLogado;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuarioLogado));
    }
  }

  private clearDataFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
