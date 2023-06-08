import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ItemsService } from 'src/app/services/items.service';

interface Receita {
  id: number;
  nomeComercial: string;
  principioAtivo: string;
  posologia: string;
  indicacao: string;
  dataPrescricao: Date;
  nomeMedico: string;
}

interface Paciente {
  id: string;
  cpf: string;
  nome: string;
}

let paciente_id: string;

@Component({
  selector: 'app-pms-paciente',
  templateUrl: './pms-paciente.component.html',
  styleUrls: ['./pms-paciente.component.css']
})
export class PmsPacienteComponent implements OnInit {
  colunas = [
    { nome: 'Nome Comercial', propriedade: 'nome_comercial' },
    { nome: 'Princípio Ativo', propriedade: 'principio_ativo' },
    { nome: 'Posologia', propriedade: 'posologia' },
    { nome: 'Indicação', propriedade: 'indicacao' },
    { nome: 'Data da Prescrição', propriedade: 'data_prescricao' },
    { nome: 'Médico', propriedade: 'nomeMedico' },
  ];

  items: Receita[] = [];
  mostrarBotao: boolean = false;
  nomeDoPaciente: String = '';

  constructor(private authService: AuthService, private http: HttpClient, private itemsService: ItemsService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isPacienteLoggedIn()) {
      paciente_id = (this.authService.usuarioLogado as Paciente).id;
      this.mostrarBotao = false;
      this.nomeDoPaciente = (this.authService.usuarioLogado as Paciente).nome;
    } else if (this.authService.isMedicoLoggedIn()) {
      this.nomeDoPaciente = this.nomeDoPaciente = this.itemsService.getItemSelecionadoNome();
      paciente_id = this.itemsService.getItemSelecionado().id;
      this.mostrarBotao = true;
    }
    this.obterReceitas();
  }

  redirecionarParaReceita() {

    this.router.navigate(['/receita']);
  }

  obterReceitas() {
    const url = `http://localhost:3000/receitas?paciente_id=${paciente_id}`;

    this.http.get<Receita[]>(url).subscribe(
      (receitas: Receita[]) => {
        this.items = receitas;
      },
      (error: any) => {
        console.error('Ocorreu um erro ao obter as receitas:', error);
      }
    );
  }
}
