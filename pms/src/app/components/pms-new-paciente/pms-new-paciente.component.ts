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
  paciente = {
    nome: '',
    cpf: '',
    telefone: '',
  };

  constructor(private http: HttpClient) {}

  checkExistingCPF() {
    this.http.get<any[]>('http://localhost:3000/pacientes?cpf=' + this.cpf)
      .subscribe(
        (response: any[]) => {
          if (response.length > 0) {
            this.cpfExists = true;
            console.log(response)
            this.paciente = response[0];
          } else {
            this.cpfExists = false;
          }
        },
        (error) => {
          console.error('Erro ao verificar o CPF:', error);
        }
      );
  }

  submitForm() {
    this.http.post('http://localhost:3000/pacientes', this.paciente)
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
