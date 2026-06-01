import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from 'src/app/services/translate.service';

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


  constructor(private http: HttpClient, private router: Router , private authService: AuthService, private translate: TranslateService) {}

  checkExistingCPF() {
    this.http.get<any[]>(`${environment.apiUrl}/pacientes/filtrar?caracteristica=cpf&valor=` + this.cpf)
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
      this.http.post(`${environment.apiUrl}/conexao`, conexao)
        .subscribe(
          (response) => {
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

      this.http.post(`${environment.apiUrl}/pacientes`, novoPaciente)
        .subscribe(
          (response: any) => {
            const conexao = {
              medico_id: (this.authService.usuarioLogado as Medico).crm,
              paciente_id: response.id
            };

            this.http.post(`${environment.apiUrl}/conexao`, conexao)
              .subscribe(
                (response) => {
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

  t(key: string): string {
    return this.translate.get(key);
  }
}
