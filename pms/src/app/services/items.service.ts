import { Injectable } from '@angular/core';
import { Item } from '../components/pms-grid/pms-grid.component';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly ITEM_SELECIONADO_KEY = 'itemSelecionado';

  constructor() {
    const itemSelecionadoJSON = localStorage.getItem(this.ITEM_SELECIONADO_KEY);
    if (itemSelecionadoJSON) {
      this.itemSelecionado = JSON.parse(itemSelecionadoJSON);
    }
  }

  private itemSelecionado!: Item;

  setItemSelecionado(item: Item) {
    this.itemSelecionado = item;
    localStorage.setItem(this.ITEM_SELECIONADO_KEY, JSON.stringify(item));
  }

  getItemSelecionado(): Item {
    return this.itemSelecionado;
  }
}
