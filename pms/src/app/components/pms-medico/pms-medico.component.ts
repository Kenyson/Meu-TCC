import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PmsNewPacienteComponent } from './pms-new-paciente/pms-new-paciente.component';


@Component({
  selector: 'app-pms-medico',
  templateUrl: './pms-medico.component.html',
  styleUrls: ['./pms-medico.component.css'],
})
export class PmsMedicoComponent {
  constructor(private modalService: NgbModal) {}

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

  novoPaciente() {
    console.log(this.modalService)
    const modalRef = this.modalService.open(PmsNewPacienteComponent)
    modalRef.result.then((result) => {
      console.log('Sucesso:', result);
    }, (reason) => {
      // Handle the dismiss event or any error that occurred
      console.log('Falha:', reason);
    });
  }
}
