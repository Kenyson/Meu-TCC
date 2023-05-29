import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Receita {
  id: number;
  nomePaciente: string;
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
    { nome: 'Nome Paciente', propriedade: 'nomePaciente' },
    { nome: 'Medicamento', propriedade: 'medicamento' },
    { nome: 'Indicação', propriedade: 'indicacao' },
    { nome: 'Posologia', propriedade: 'posologia' },
  ];

  items: Receita[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obterReceitas();
  }

  obterReceitas() {
    this.http.get<Receita[]>('http://localhost:3000/receitas')
      .subscribe(receitas => {
        this.items = receitas;
      });
  }

  novaReceita() {
    console.log('chamou')
    console.log(this.router)
    if (this.router) {
      this.router.navigate(['/newPaciente']);
    }
  }

}
