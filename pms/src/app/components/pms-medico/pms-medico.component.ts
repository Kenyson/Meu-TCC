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

interface Medico {
  crm: string;
  nome: string;
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
  nomeMedicoLogado: string = '';

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obterPacientes();
    this.obterNomeMedicoLogado();
  }

  redirecionarParaNewPaciente() {
    this.router.navigate(['/newPaciente']);
  }

  obterPacientes() {
    let crmMedicoLogado: string | undefined = undefined;

    crmMedicoLogado = (this.authService.usuarioLogado as Medico).crm;

    if (crmMedicoLogado) {
      this.http
        .get<Paciente[]>(`http://localhost:3000/medico/${crmMedicoLogado}/pacientes`)
        .subscribe((pacientes) => {
          this.items = pacientes.map((paciente) => ({
            ...paciente,
            idade: this.calcularIdade(paciente.data_nascimento),
          }));

          localStorage.setItem('pacientes', JSON.stringify(this.items));
        });
    }
  }

  onItemClicadoDuplo(event: { item: Paciente, id: any }) {
    const pacienteId = event.item.id;
    this.redirecionarPaciente(event.item);
  }

  redirecionarPaciente(paciente: Paciente) {
    const pacienteId = paciente.id;
    this.router.navigate(['/paciente', pacienteId]);
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

  private obterNomeMedicoLogado() {
    this.nomeMedicoLogado = (this.authService.usuarioLogado as Medico).nome;
  }
}
