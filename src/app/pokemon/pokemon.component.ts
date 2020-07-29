import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {

  @Input() pokemon: any = { };

  isDetailsShown = false;

  @Output() pokemonDeleted = new EventEmitter<number>();

  constructor(private matDialog: MatDialog) { }

  openDialog(pokemonId: number) {
    const dialogRef = this.matDialog.open(ModalDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // pokemon is to be deleted
        this.pokemonDeleted.emit(pokemonId);
      }
    });
  }
}
