import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { ItemsService } from 'src/app/services/items.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';

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
    posologia: '',
    nomeMedico: ''
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private itemService: ItemsService,
    private router: Router
  ) {}

  submitForm() {
    this.receita.data_prescricao = format(new Date(), 'dd-MM-yyyy');
    this.receita.medico_id = (this.authService.usuarioLogado as Medico).crm;
    this.receita.paciente_id = (this.itemService.getItemSelecionado().id);
    this.receita.nomeMedico = (this.authService.usuarioLogado as Medico).nome;

    this.http.post('http://localhost:3000/receitas', this.receita)
      .subscribe(
        () => {
          console.log('Receita salva com sucesso!');
          this.goToPatientScreen();
        },
        (error) => {
          console.error('Erro ao salvar a receita:', error);
        }
      );
  }



  goToPatientScreen() {
    this.router.navigate(['/paciente']);
  }
}
