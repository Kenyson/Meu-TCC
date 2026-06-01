import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { environment } from 'src/environments/environment';
import { ItemsService } from 'src/app/services/items.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { LoadingService } from 'src/app/services/loading.service';

interface Medico {
  crm: string;
  nome: string;
}

@Component({
  selector: 'app-pms-new-receita',
  templateUrl: './pms-new-receita.component.html',
  styleUrls: ['./pms-new-receita.component.css']
})
export class PmsNewReceitaComponent {
  receita = {
    nome_comercial: '',
    principio_ativo: '',
    indicacao: '',
    medico_id: '',
    paciente_id: '',
    data_prescricao: '',
    data_validade: '',
    posologia: '',
    nomeMedico: ''
  };
  invalidFields: { [key: string]: boolean } = {};
  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private itemService: ItemsService,
    private router: Router,
    private translate: TranslateService,
    private validator: ValidatorService,
    private loading: LoadingService
  ) {}

  validateFields() {
    this.invalidFields = {};
    if (!this.receita.nome_comercial) {
      this.invalidFields['nome_comercial'] = true;
    }
    if (!this.receita.principio_ativo) {
      this.invalidFields['principio_ativo'] = true;
    }
    if (!this.receita.indicacao) {
      this.invalidFields['indicacao'] = true;
    }
    if (!this.receita.posologia) {
      this.invalidFields['posologia'] = true;
    }
    if (!this.receita.data_validade) {
      this.invalidFields['data_validade'] = true;
    }
  }

  submitForm() {
    this.showError = false;
    this.errorMessage = '';
    this.validateFields();

    if (Object.keys(this.invalidFields).length > 0) {
      this.errorMessage = this.t('register.invalidFields');
      this.showError = true;
      return;
    }

    this.loading.show();

    this.receita.data_prescricao = format(new Date(), 'dd-MM-yyyy');
    this.receita.medico_id = (this.authService.usuarioLogado as Medico).crm;
    const pacienteSelecionado = this.itemService.getItemSelecionado();
    this.receita.paciente_id = pacienteSelecionado?.id || '';
    this.receita.nomeMedico = (this.authService.usuarioLogado as Medico).nome;

    if (this.receita.data_validade && this.receita.data_validade.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = this.receita.data_validade.split('-');
      this.receita.data_validade = `${d}-${m}-${y}`;
    }

    this.http.post(`${environment.apiUrl}/receitas`, this.receita)
      .subscribe(
        () => {
          this.loading.showSuccess();
          this.goToPatientScreen();
        },
        (error) => {
          this.loading.showError('Erro ao salvar a receita');
          console.error('Erro ao salvar a receita:', error);
        }
      );
  }

  goToPatientScreen() {
    this.router.navigate(['/paciente']);
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}