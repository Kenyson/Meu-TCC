import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Paciente {
  id: number;
  nome: string;
  medicamento: string;
  indicacao: string;
  posologia: string;
}

@Component({
  selector: 'app-pms-medico',
  templateUrl: './pms-medico.component.html',
  styleUrls: ['./pms-medico.component.css']
})
export class PmsMedicoComponent implements OnInit {
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

  novoPaciente() {
    const novoPaciente: Paciente = {
      id: 0,
      nome: 'Novo Paciente',
      medicamento: 'Medicamento',
      indicacao: 'Indicação',
      posologia: 'Posologia'
    };

    this.http.post<Paciente>('http://localhost:3000/pacientes', novoPaciente)
      .subscribe(response => {
        console.log('Novo paciente criado:', response);
        this.obterPacientes();
      });
  }
}
