import { Component } from '@angular/core';

interface Item {
  nome: string;
  medicamento: string;
  indicacao: string;
  posologia: string;
}

interface Coluna {
  nome: string;
  propriedade: keyof Item;
}

@Component({
  selector: 'app-pms-grid',
  templateUrl: './pms-grid.component.html',
  styleUrls: ['./pms-grid.component.css']
})
export class PmsGridComponent {
  items: Item[] = [
    { nome: 'João', medicamento: 'Paracetamol', indicacao: 'Febre', posologia: '1 comprimido a cada 6 horas' },
    { nome: 'Maria', medicamento: 'Dipirona', indicacao: 'Dor de cabeça', posologia: '1 comprimido a cada 8 horas' },
    { nome: 'Pedro', medicamento: 'Amoxicilina', indicacao: 'Infecção', posologia: '1 comprimido a cada 12 horas' },
  ];

  colunas: Coluna[] = [
    { nome: 'Nome Paciente', propriedade: 'nome' },
    { nome: 'Medicamento', propriedade: 'medicamento' },
    { nome: 'Indicação', propriedade: 'indicacao' },
    { nome: 'Posologia', propriedade: 'posologia' },
  ];

  newItem() {
    this.items.push({ nome: 'Novo item', medicamento: 'Medicamento X', indicacao: '50', posologia: '10' });
  }

  newPaciente() {
    console.log('Botão clicado!');
  }
}
