import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pms-new-paciente',
  templateUrl: './pms-new-paciente.component.html',
  styleUrls: ['./pms-new-paciente.component.css']
})
export class PmsNewPacienteComponent {
  paciente = {
    nomePaciente: '',
    medicamento: '',
    indicacao: '',
    posologia: ''
  };

  constructor(private http: HttpClient) {}

  submitForm() {
    this.http.post('http://localhost:3000/receitas', this.paciente)
      .subscribe(
        (novaReceita: any) => {
          console.log('Receita salva:', novaReceita);
        },
        (error) => {
          console.error('Erro ao salvar a receita:', error);
        }
      );
  }
}
