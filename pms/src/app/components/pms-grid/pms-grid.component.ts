import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';
import { TranslateService } from 'src/app/services/translate.service';

export interface Item {
  id: any;
  expirada?: boolean;
  [prop: string]: any;
}

interface Coluna {
  nome: string;
  propriedade: string;
}

@Component({
  selector: 'app-pms-grid',
  templateUrl: './pms-grid.component.html',
  styleUrls: ['./pms-grid.component.css']
})
export class PmsGridComponent implements OnInit {
  @Input() items: Item[] = [];
  @Input() colunas: Coluna[] = [];
  @Input() novoItemNome: string = '';
  @Input() mostrarBotao: boolean = true;
  @Input() mostrarBotaoVoltarMedico: boolean = false;
  @Input() tituloTabela: string = '';
  @Output() onItemClicadoDuplo: EventEmitter<{ item: Item, id: any }> = new EventEmitter<{ item: Item, id: any }>();
  @Output() onViewButtonClick: EventEmitter<Item> = new EventEmitter<Item>();
  @Input() novoItemFuncao: () => void = () => {};
  @Input() mostrarRemover: boolean = true;
  @Output() onRemoveButtonClick: EventEmitter<Item> = new EventEmitter<Item>();

  constructor(private router: Router, private itemsService: ItemsService, private translate: TranslateService) {}

  ngOnInit() {
    this.translate.use(this.translate.getCurrentLang());
  }

  onViewButton(item: Item) {
    this.onViewButtonClick.emit(item);
  }

  onRemoveButton(item: Item) {
    this.onRemoveButtonClick.emit(item);
  }

  voltarParaListaPacientes() {
    this.router.navigate(['/medico']);
  }

  itemClicadoDuplo(item: Item) {
    this.onItemClicadoDuplo.emit({ item, id: item.id });
  }

  redirecionarPaciente(item: Item) {
    const pacienteId = item.id;
    this.router.navigate(['/paciente']);
  }

  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  pesquisa: string = '';

  get itensFiltrados(): Item[] {
    if (this.pesquisa.trim() === '') {
      return this.items;
    }
    const pesquisaLower = this.pesquisa.toLowerCase();
    return this.items.filter(item =>
      Object.values(item).some(value => value && value.toString().toLowerCase().includes(pesquisaLower))
    );
  }

  get itensExibidos(): Item[] {
    const startIndex = (this.paginaAtual - 1) * this.itensPorPagina;
    const endIndex = startIndex + this.itensPorPagina;
    return this.itensFiltrados.slice(startIndex, endIndex);
  }

  get totalPaginas(): number {
    return Math.ceil(this.itensFiltrados.length / this.itensPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  selecionarPagina(pagina: number) {
    this.paginaAtual = pagina;
  }

  getTranslatedColumn(key: string): string {
    const translated = this.translate.get(key);
    return translated !== key ? translated : key;
  }

  getSearchPlaceholder(): string {
    const translated = this.translate.get('search.placeholder');
    return translated !== 'search.placeholder' ? translated : 'Search';
  }

  getActionsColumnHeader(): string {
    const translated = this.translate.get('grid.actions');
    return translated !== 'grid.actions' ? translated : 'Ações';
  }

  getActionButtonText(): string {
    const translated = this.translate.get('grid.view');
    return translated !== 'grid.view' ? translated : 'Ver';
  }

  getRemoveButtonText(): string {
    const translated = this.translate.get('grid.remove');
    return translated !== 'grid.remove' ? translated : 'Remover';
  }

  getBackToPatientsText(): string {
    const translated = this.translate.get('medico.backToPatients');
    return translated !== 'medico.backToPatients' ? translated : 'Back to Patient List';
  }
}
