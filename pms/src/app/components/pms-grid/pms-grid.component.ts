import { Component, Input } from '@angular/core';

interface Item {
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
  @Input() novoItemFuncao: () => void = () => {};

 /* newItem() {
    const newItem: Item = {};
    this.colunas.forEach(coluna => {
      newItem[coluna.propriedade] = '';
    });
    this.items.push(newItem);
  }*/
}
