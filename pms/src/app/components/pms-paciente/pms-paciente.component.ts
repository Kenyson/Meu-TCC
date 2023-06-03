import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Receita {
  id: number;
  nomeComercial: string;
  principioAtivo: string;
  posologia: string;
  indicacao: string;
  dataPrescricao: Date;
  medico: string;
}

@Component({
  selector: 'app-pms-paciente',
  templateUrl: './pms-paciente.component.html',
  styleUrls: ['./pms-paciente.component.css']
})
export class PmsPacienteComponent implements OnInit {
  colunas = [
    { nome: 'Nome Comercial', propriedade: 'nomeComercial' },
    { nome: 'Princípio Ativo', propriedade: 'principioAtivo' },
    { nome: 'Posologia', propriedade: 'posologia' },
    { nome: 'Indicação', propriedade: 'indicacao' },
    { nome: 'Data da Prescrição', propriedade: 'dataPrescricao' },
    { nome: 'Médico', propriedade: 'medico' },
  ];

  items: Receita[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.obterReceitas();
  }

  obterReceitas() {
    this.http.get<Receita[]>('http://localhost:3000/receitas')
      .subscribe(receitas => {
        this.items = receitas;
      });
  }
}
