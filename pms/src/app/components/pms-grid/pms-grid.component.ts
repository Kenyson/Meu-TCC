import { Component } from '@angular/core';

@Component({
  selector: 'app-pms-grid',
  templateUrl: './pms-grid.component.html',
  styleUrls: ['./pms-grid.component.css']
})
export class PmsGridComponent {

  pacientes = [
    { nome: 'João', medicamento: 'Silva', indicacao: '30', posologia: '25' },
    { nome: 'Maria', medicamento: 'Santos', indicacao: '25', posologia: '25' },
    { nome: 'Lucas', medicamento: 'Rodrigues', indicacao: '40', posologia: '25' }
  ];

  adicionarPaciente() {
    this.pacientes.push({ nome: 'Novo paciente', medicamento: 'Medicamento X', indicacao: '50', posologia: '10' });
  }

  newPaciente() {
    console.log('Botão clicado!');
  };
}
