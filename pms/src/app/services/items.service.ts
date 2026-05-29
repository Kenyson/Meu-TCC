import { Injectable } from '@angular/core';
import { Item } from '../components/pms-grid/pms-grid.component';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly ITEM_SELECIONADO_KEY = 'itemSelecionado';
  private readonly PACIENTE_KEY = 'pacienteSelecionado';
  private readonly RECEITA_KEY = 'receitaSelecionada';

  private itemSelecionado: Item | null = null;
  private itemPaciente: Item | null = null;
  private itemReceita: Item | null = null;

  constructor() {
    const itemSelecionadoJSON = localStorage.getItem(this.ITEM_SELECIONADO_KEY);
    if (itemSelecionadoJSON && itemSelecionadoJSON !== 'null') {
      this.itemSelecionado = JSON.parse(itemSelecionadoJSON);
    }
    const pacienteJSON = localStorage.getItem(this.PACIENTE_KEY);
    if (pacienteJSON && pacienteJSON !== 'null') {
      this.itemPaciente = JSON.parse(pacienteJSON);
    }
    const receitaJSON = localStorage.getItem(this.RECEITA_KEY);
    if (receitaJSON && receitaJSON !== 'null') {
      this.itemReceita = JSON.parse(receitaJSON);
    }
  }

  setItemSelecionado(item: Item) {
    this.itemSelecionado = item;
    localStorage.setItem(this.ITEM_SELECIONADO_KEY, JSON.stringify(item));
  }

  getItemSelecionado(): Item | null {
    return this.itemSelecionado;
  }

  getItemSelecionadoNome(): string {
    return this.itemSelecionado?.['nome'] || this.itemPaciente?.['nome'] || '';
  }

  setItemPaciente(item: Item) {
    this.itemPaciente = item;
    localStorage.setItem(this.PACIENTE_KEY, JSON.stringify(item));
  }

  getItemPaciente(): Item | null {
    return this.itemPaciente;
  }

  setItemReceita(item: Item) {
    this.itemReceita = item;
    localStorage.setItem(this.RECEITA_KEY, JSON.stringify(item));
  }

  getItemReceita(): Item | null {
    return this.itemReceita;
  }
}