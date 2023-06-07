import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Medico {
  crm: string;
}


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
    id: 0,
    nome: '',
    cpf: '',
    telefone: '',
  };


  constructor(private http: HttpClient, private router: Router , private authService: AuthService) {}

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

  goToMedicoScreen() {
    this.router.navigate(['/medico']);
  }

  submitForm() {

    if (this.preexiste) {
      const conexao = {
        medico_id: (this.authService.usuarioLogado as Medico).crm,
        paciente_id: this.paciente.id
      };
      this.http.post('http://localhost:3000/conexao', conexao)
        .subscribe(
          (response) => {
            console.log('Conexão realizada com sucesso!');
            this.goToMedicoScreen();
          },
          (error) => {
            console.error('Erro ao criar a conexão:', error);
          }
        );
    } else {
      const novoPaciente = {
        nome: this.paciente.nome,
        cpf: this.cpf,
        telefone: this.paciente.telefone
      };

      this.http.post('http://localhost:3000/pacientes', novoPaciente)
        .subscribe(
          (response: any) => {
            const conexao = {
              medico_id: (this.authService.usuarioLogado as Medico).crm,
              paciente_id: response.id
            };

            this.http.post('http://localhost:3000/conexao', conexao)
              .subscribe(
                (response) => {
                  console.log('Paciente e conexão criados com sucesso!');
                  this.goToMedicoScreen();
                },
                (error) => {
                  console.error('Erro ao criar a conexão:', error);
                }
              );
          },
          (error) => {
            console.error('Erro ao criar o paciente:', error);
          }
        );
    }
  }
}
