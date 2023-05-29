import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Paciente {
  id: number;
  nome: string;
  medicamento: string;
  indicacao: string;
  posologia: string;
}

interface Item {
  nome: string;
  medicamento: string;
  indicacao: string;
  posologia: string;
}

@Component({
  selector: 'app-pms-paciente',
  templateUrl: './pms-paciente.component.html',
  styleUrls: ['./pms-paciente.component.css']
})
export class PmsPacienteComponent implements OnInit {
  colunas = [
    { nome: 'Nome Paciente', propriedade: 'nome' },
    { nome: 'Medicamento', propriedade: 'medicamento' },
    { nome: 'Indicação', propriedade: 'indicacao' },
    { nome: 'Posologia', propriedade: 'posologia' },
  ];

  items: Paciente[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obterPacientes();
  }

  obterPacientes() {
    this.http.get<Paciente[]>('http://localhost:3000/pacientes')
      .subscribe(pacientes => {
        this.items = pacientes;
      });
  }

  funcaoItemClicadoDuplo(item: Item) {

  }
}
