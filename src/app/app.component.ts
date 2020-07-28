import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hotchocolate-demo-client';

  pokemon: any[];
  newPokemonName = '';
  newPokemonType = '';
  isAddingPokemon = false;

  constructor(private apollo: Apollo, private matDialog: MatDialog) { }

  ngOnInit() {
    this.getPokemons();
  }

  get pokemonAddingMode(): boolean {
    return this.isAddingPokemon;
  }

  set pokemonAddingMode(val: boolean) {
    this.isAddingPokemon = val;
  }

  getPokemons() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            pokemon {
              id
              name
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe(result => {
        console.log(result);
        const data = result.data as any;
        this.pokemon = data.pokemon as any[];
      });
  }

  addNewPokemon() {
    this.pokemonAddingMode = false;
    let type = '';
    if (this.newPokemonType !== '') {
      type = this.newPokemonType;
    } else {
      type = 'None';
    }
    this.apollo.mutate({
      mutation: gql`
        mutation {
          pokemon(name:"${this.newPokemonName}", type:"${type}") {
            name
            type
          }
        }`,
      variables: {
        name: this.newPokemonName,
        type: 'None'
      }
    }).subscribe(result => {
      this.newPokemonName = '';
      this.newPokemonType = '';
      this.getPokemons();
    });
  }

  openDialog(pokemonId: number){
    const dialogRef = this.matDialog.open(ModalDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // pokemon is to be deleted
        this.removePokemon(pokemonId);
      }
    });
  }

  openDetailsDialog(pokemonId: number) {

  }

  removePokemon(pokemonId: number){
    this.apollo.mutate({
      mutation: gql`
        mutation{
          removePokemon(id: ${pokemonId}){
            name,
            type,
            id
          }
        }`
      }).subscribe(result => {
        console.log('time to delete');
        this.getPokemons();
      });
  }
}
