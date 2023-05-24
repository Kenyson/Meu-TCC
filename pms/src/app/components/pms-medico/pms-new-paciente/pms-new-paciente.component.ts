import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pms-new-paciente',
  templateUrl: './pms-new-paciente.component.html',
  styleUrls: ['./pms-new-paciente.component.css'],

})
export class PmsNewPacienteComponent implements OnInit {
  nome: string = '';
  medicamento: string = '';
  indicacao: string = '';
  posologia: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  salvar() {
    // Perform the necessary logic to save the new patient data
    const newPatient = {
      nome: this.nome,
      medicamento: this.medicamento,
      indicacao: this.indicacao,
      posologia: this.posologia
    };

    // Pass the new patient data back to the parent component
    this.activeModal.close(newPatient);
  }

  fechar() {
    // Dismiss the modal without saving
    this.activeModal.dismiss('Dismissed');
  }
}
