import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';

export interface Item {
  id: any;
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
export class PmsGridComponent {
  @Input() items: Item[] = [];
  @Input() colunas: Coluna[] = [];
  @Input() novoItemNome: string = '';
  @Input() mostrarBotao: boolean = true;
  @Input() tituloTabela: string = '';
  @Output() onItemClicadoDuplo: EventEmitter<{ item: Item, id: any }> = new EventEmitter<{ item: Item, id: any }>();
  @Input() novoItemFuncao: () => void = () => {};

  constructor(private router: Router, private itemsService: ItemsService) {}

  redirecionarPaciente(item: Item) {
    const pacienteId = item.id;
    this.router.navigate(['/paciente', pacienteId]);
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

  itemClicadoDuplo(item: Item) {
    this.itemsService.setItemSelecionado(item);
    this.router.navigate(['/paciente']);
  }
}
