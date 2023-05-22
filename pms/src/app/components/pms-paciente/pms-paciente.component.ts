import { Component } from '@angular/core';

@Component({
  selector: 'app-pms-paciente',
  templateUrl: './pms-paciente.component.html',
  styleUrls: ['./pms-paciente.component.css']
})

export class PmsPacienteComponent {
  // Tela que aparece para o paciênte

  colunas = [
    { nome: 'Nome Paciente', propriedade: 'nome' },
    { nome: 'Medicamento', propriedade: 'medicamento' },
    { nome: 'Indicação', propriedade: 'indicacao' },
    { nome: 'Posologia', propriedade: 'posologia' },
  ];

  items = [
    { nome: 'João', medicamento: 'Paracetamol', indicacao: 'Febre', posologia: '1 comprimido a cada 6 horas' },
    { nome: 'Maria', medicamento: 'Dipirona', indicacao: 'Dor de cabeça', posologia: '1 comprimido a cada 8 horas' },
    { nome: 'Pedro', medicamento: 'Amoxicilina', indicacao: 'Infecção', posologia: '1 comprimido a cada 12 horas' },
  ];
}
