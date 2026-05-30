import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ItemsService } from 'src/app/services/items.service';
import { TranslateService } from 'src/app/services/translate.service';

interface Paciente {
  id: number;
  nome: string;
  sobrenome: string;
  idade: number;
  cpf: string;
  telefone: string;
  data_nascimento: string;
}

interface Medico {
  crm: string;
  nome: string;
}

@Component({
  selector: 'app-pms-medico',
  templateUrl: './pms-medico.component.html',
  styleUrls: ['./pms-medico.component.css']
})
export class PmsMedicoComponent implements OnInit {
  colunas = [
    { nome: 'medico.columns.name', propriedade: 'nome' },
    { nome: 'medico.columns.lastName', propriedade: 'sobrenome' },
    { nome: 'medico.columns.age', propriedade: 'idade' },
    { nome: 'medico.columns.cpf', propriedade: 'cpf' },
    { nome: 'medico.columns.phone', propriedade: 'telefone' },
  ];

  items: Paciente[] = [];
  nomeMedicoLogado: string = '';

  get tituloTabela(): string {
    return `${this.t('medico.title')} ${this.nomeMedicoLogado}`;
  }

  get novoItemNomeValue(): string {
    return this.t('medico.addPatient');
  }

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private itemsService: ItemsService, private translate: TranslateService) {}

  ngOnInit() {
    this.obterPacientes();
    this.obterNomeMedicoLogado();
  }

  redirecionarParaNewPaciente() {
    this.router.navigate(['/newPaciente']);
  }

  onViewButton(item: any) {
    this.itemsService.setItemSelecionado(item);
    this.itemsService.setItemPaciente(item);
    localStorage.setItem('paciente_id', item.id);
    localStorage.setItem('paciente_nome', item.nome);
    this.router.navigate(['/paciente']);
  }

  onItemClicadoDuplo(event: { item: any, id: any }) {
    this.itemsService.setItemSelecionado(event.item);
    this.itemsService.setItemPaciente(event.item);
    localStorage.setItem('paciente_id', event.item.id);
    localStorage.setItem('paciente_nome', event.item.nome);
    this.router.navigate(['/paciente']);
  }

  onRemoveButton(item: any) {
    if (confirm(this.t('medico.confirmRemove'))) {
      const crm = (this.authService.usuarioLogado as Medico).crm;
      this.http.delete(`http://localhost:3000/medico/${crm}/pacientes/${item.id}`).subscribe({
        next: () => {
          this.items = this.items.filter((i) => i.id !== item.id);
        },
        error: (err) => {
          console.error('Erro ao remover paciente:', err);
        }
      });
    }
  }

  obterPacientes() {
    let crmMedicoLogado: string | undefined = undefined;

    crmMedicoLogado = (this.authService.usuarioLogado as Medico).crm;

    if (crmMedicoLogado) {
      this.http
        .get<Paciente[]>(`http://localhost:3000/medico/${crmMedicoLogado}/pacientes`)
        .subscribe((pacientes) => {
          this.items = pacientes.map((paciente) => ({
            ...paciente,
            idade: this.calcularIdade(paciente.data_nascimento),
          }));

          localStorage.setItem('pacientes', JSON.stringify(this.items));
        });
    }
  }

  calcularIdade(dataNascimento: string): number {
    if (!dataNascimento) return 0;
    const partes = dataNascimento.split('-');
    if (partes.length !== 3) return 0;
    const [dia, mes, ano] = partes.map(Number);
    const hoje = new Date();
    const dataNasc = new Date(ano, mes - 1, dia);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mesDiff = hoje.getMonth() - dataNasc.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  }

  private obterNomeMedicoLogado() {
    this.nomeMedicoLogado = (this.authService.usuarioLogado as Medico).nome;
  }

  t(key: string): string {
    return this.translate.get(key);
  }
}