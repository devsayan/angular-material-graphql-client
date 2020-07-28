import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {

  @Input() pokemon: any = { };
  isMouseOver = false;

  isDetailsShown = false;

  @Output() pokemonDeleted = new EventEmitter<number>();

  constructor() { }
}
