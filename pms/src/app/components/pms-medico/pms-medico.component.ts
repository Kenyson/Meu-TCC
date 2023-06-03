import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  cpf: string;
  telefone: string;
  data_nascimento: string;
}

@Component({
  selector: 'app-pms-medico',
  templateUrl: './pms-medico.component.html',
  styleUrls: ['./pms-medico.component.css']
})
export class PmsMedicoComponent implements OnInit {
  colunas = [
    { nome: 'Nome Paciente', propriedade: 'nome' },
    { nome: 'Idade', propriedade: 'idade' },
    { nome: 'CPF', propriedade: 'cpf' },
    { nome: 'Telefone', propriedade: 'telefone' },
  ];

  items: Paciente[] = [];

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obterPacientes();
    console.log('Crm do médico logado:', this.authService.usuarioLogado);
  }

  obterPacientes() {
    let cpfMedicoLogado: string | undefined = undefined; // Inicializa a variável com valor indefinido

    if (this.authService.usuarioLogado != null && 'id' in this.authService.usuarioLogado) {
      cpfMedicoLogado = this.authService.usuarioLogado.id.toString(); // Obtém o ID do médico logado
    }

    console.log(this.authService.usuarioLogado);

    if (cpfMedicoLogado) { // Verifica se o cpfMedicoLogado possui um valor válido
      this.http
        .get<Paciente[]>(`http://localhost:3000/pacientes?cpfMedico=${cpfMedicoLogado}`)
        .subscribe((pacientes) => {
          this.items = pacientes.map((paciente) => ({
            ...paciente,
            idade: this.calcularIdade(paciente.data_nascimento),
          }));
        });
    }
  }


  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  }
}
