import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pms-new-paciente',
  templateUrl: './pms-new-paciente.component.html',
  styleUrls: ['./pms-new-paciente.component.css']
})
export class PmsNewPacienteComponent {
  cpf: string = '';
  cpfExists: boolean = false;
  preexiste: boolean = false;
  paciente = {
    id: 0, // Adicione a propriedade 'id' ao objeto paciente
    nome: '',
    cpf: '',
    telefone: '',
  };

  constructor(private http: HttpClient) {}

  checkExistingCPF() {
    this.http.get<any[]>('http://localhost:3000/pacientes/filtrar?caracteristica=cpf&valor=' + this.cpf)
      .subscribe(
        (response: any[]) => {
          if (response.length > 0) {
            this.cpfExists = true;
            this.preexiste = true;
            this.paciente = response[0];
          } else {
            this.cpfExists = true;
          }
        },
        (error) => {
          console.error('Erro ao verificar o CPF:', error);
        }
      );
  }

  submitForm() {
    if (this.preexiste) {
      // Atualiza o registro do paciente com a referência ao médico
      this.http.put(`http://localhost:3000/pacientes/${this.paciente.id}`, this.paciente)
        .subscribe(
          () => {
            console.log('Paciente atualizado:', this.paciente);
          },
          (error) => {
            console.error('Erro ao atualizar o paciente:', error);
          }
        );
    } else {
      // Adiciona um novo registro de paciente
      this.http.post('http://localhost:3000/pacientes', this.paciente)
        .subscribe(
          (novoPaciente: any) => {
            console.log('Paciente adicionado:', novoPaciente);
          },
          (error) => {
            console.error('Erro ao adicionar o paciente:', error);
          }
        );
    }
  }
}
