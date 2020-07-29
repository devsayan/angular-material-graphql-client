import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent implements OnInit {

  @Input()
  pokemonId: number;

  @Output()
  savePokemonClicked = new EventEmitter<void>();

  pokemon: any;

  constructor(private apollo: Apollo) { }

  getPokemonDetails(pokemonId: number) {
    this.apollo
      .watchQuery({
        query: gql(`
          {
            pokemonFromId(id: ${pokemonId}){
              id
              name
              type
            }
          }
        `),
        /*variables: {
          id: 4
        },*/
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe(result => {
        console.log(result);
        const data = result.data as any;
        this.pokemon = data.pokemonFromId[0] as any;
        console.log('fetched pokemon with id= ' + this.pokemon.id + ' name=' + this.pokemon.name + ' type=' + this.pokemon.type);
      });
  }

  ngOnInit(): void {
    this.getPokemonDetails(this.pokemonId);
  }

  savePokemonDetails() {
    let type = '';
    if (this.pokemon.type !== '') {
      type = this.pokemon.type;
    } else {
      type = 'None';
    }
    this.apollo.mutate({
      mutation: gql`
        mutation {
          updatePokemon(id: ${this.pokemon.id}, name:"${this.pokemon.name}", type:"${type}") {
            id
            name
            type
          }
        }`
    }).subscribe(result => {
      const data: any = result.data as any;
      this.pokemon = data.updatePokemon;
      this.savePokemonClicked.emit();
    });
  }
}

