import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  cpf: string;
  telefone: string;
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obterPacientes();
  }

  obterPacientes() {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes')
      .subscribe(pacientes => {
        this.items = pacientes;
      });
  }


}
