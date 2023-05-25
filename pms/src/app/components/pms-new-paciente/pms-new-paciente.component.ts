import { Component } from '@angular/core';

@Component({
  selector: 'app-pms-new-paciente',
  templateUrl: './pms-new-paciente.component.html',
  styleUrls: ['./pms-new-paciente.component.css']
})
export class PmsNewPacienteComponent {
  paciente = {
    nome: '',
    medicamento: '',
    indicacao: '',
    posologia: ''
  };


  submitForm() {
    // Aqui você pode fazer a lógica para enviar os dados para o backend
    // Por exemplo, usando um serviço de API para fazer a chamada HTTP POST
    console.log(this.paciente);
  }
}
