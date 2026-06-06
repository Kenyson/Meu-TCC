import { AuthService } from 'src/app/services/auth.service';
import { SyncService, StoredAccount } from 'src/app/services/sync.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from 'src/app/services/translate.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { LoadingService } from 'src/app/services/loading.service';

interface LocalMedico {
  crm: number;
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
  invalidFields: { [key: string]: boolean } = {};
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private syncService: SyncService,
    private translate: TranslateService,
    private validator: ValidatorService,
    private loading: LoadingService
  ) {}

  ngOnDestroy() {
    this.resetState();
  }

  applyCPFMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    const formatted = this.validator.getCPFFormatted(value);
    input.value = formatted;
    this.cpf = formatted;
  }

  applyPhoneMask(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    const formatted = this.validator.applyPhoneMask(value);
    input.value = formatted;
    this.paciente.telefone = formatted;
  }

  validateFields() {
    this.invalidFields = {};
    if (!this.validator.validateCPF(this.cpf)) {
      this.invalidFields['cpf'] = true;
    }
  }

  validateFormFields() {
    this.invalidFields = {};
    if (!this.paciente.nome) {
      this.invalidFields['nome'] = true;
    }
    if (!this.paciente.cpf || !this.validator.validateCPF(this.paciente.cpf)) {
      this.invalidFields['paciente_cpf'] = true;
    }
  }

  checkExistingCPF() {
    if (!this.validator.validateCPF(this.cpf)) {
      this.invalidFields['cpf'] = true;
      this.showError = true;
      this.errorMessage = this.t('register.invalidCpf');
      return;
    }
    this.loading.show();
    this.http.get<any[]>(`${environment.apiUrl}/pacientes/filtrar?caracteristica=cpf&valor=` + this.cpf.replace(/\D/g, '')).subscribe({
      next: (response: any[]) => {
        this.loading.hide();
        if (response.length > 0) {
          this.cpfExists = true;
          this.preexiste = true;
          this.paciente = response[0];
        } else {
          this.cpfExists = true;
          this.paciente.cpf = this.cpf;
        }
      },
      error: (error) => {
        this.loading.hide();
        this.loading.showError('Erro ao verificar CPF: ' + (error.error || error.message || 'Erro desconhecido'));
        console.error('Erro ao verificar o CPF:', error);
      }
    });
  }

  goToMedicoScreen() {
    this.router.navigate(['/medico']);
  }

  submitForm() {
    this.showError = false;
    this.errorMessage = '';
    this.invalidFields = {};

    if (!this.paciente.nome) {
      this.invalidFields['nome'] = true;
    }
    if (!this.paciente.cpf || !this.validator.validateCPF(this.paciente.cpf)) {
      this.invalidFields['paciente_cpf'] = true;
    }

    if (Object.keys(this.invalidFields).length > 0) {
      this.errorMessage = this.t('register.invalidFields');
      this.showError = true;
      return;
    }

    this.loading.show();

    if (this.preexiste) {
      const conexao = {
        medico_id: Number((this.authService.usuarioLogado as any)?.crm),
        paciente_id: this.paciente.id
      };
      this.http.post(`${environment.apiUrl}/conexao`, conexao).subscribe({
        next: (conexaoResponse) => {
          this.loading.showSuccess();
          this.goToMedicoScreen();
        },
        error: (error) => {
          this.loading.showError('Erro ao criar a conexão: ' + (error.error || error.message || 'Erro desconhecido'));
          console.error('Erro ao criar a conexão:', error);
        }
      });
    } else {
      const cleanCPF = this.paciente.cpf ? this.paciente.cpf.replace(/\D/g, '') : this.cpf.replace(/\D/g, '');
      const cleanTelefone = this.paciente.telefone ? this.paciente.telefone.replace(/\D/g, '') : '';

      const novoPaciente = {
        nome: this.paciente.nome,
        cpf: cleanCPF,
        telefone: cleanTelefone
      };

      this.http.post<any>(`${environment.apiUrl}/pacientes`, novoPaciente).subscribe({
        next: async (response: any) => {
          // Adicionar o paciente ao localStorage antes do sync
          const storedAccount: StoredAccount = {
            type: 'paciente',
            id: response.id,
            nome: response.nome || this.paciente.nome,
            sobrenome: response.sobrenome || '',
            cpf: cleanCPF,
            telefone: cleanTelefone,
            senha: null as any
          };
          this.syncService.addStoredAccount(storedAccount);

          try {
            await this.syncService.manualSync();
          } catch (syncErr) {
            console.error('Erro no sync após criar paciente:', syncErr);
          }

          const conexao = {
            medico_id: Number((this.authService.usuarioLogado as any)?.crm),
            paciente_id: response.id
          };

          this.http.post(`${environment.apiUrl}/conexao`, conexao).subscribe({
            next: (conexaoResp) => {
              this.loading.showSuccess();
              this.goToMedicoScreen();
            },
            error: (error) => {
              this.loading.showError('Erro ao criar a conexão: ' + (error.error || error.message || 'Erro desconhecido'));
              console.error('Erro ao criar a conexão:', error);
            }
          });
        },
        error: (error) => {
          this.loading.showError('Erro ao criar o paciente: ' + (error.error || error.message || 'Erro desconhecido'));
          console.error('Erro ao criar o paciente:', error);
        }
      });
    }
  }

  t(key: string): string {
    return this.translate.get(key);
  }

  private resetState() {
    this.cpf = '';
    this.cpfExists = false;
    this.preexiste = false;
    this.paciente = {
      id: 0,
      nome: '',
      cpf: '',
      telefone: '',
    };
    this.invalidFields = {};
    this.errorMessage = '';
    this.showError = false;
  }
}