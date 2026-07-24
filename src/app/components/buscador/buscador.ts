import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [],
  templateUrl: './buscador.html',
  styleUrls: ['./buscador.css']
})
export class BuscadorComponent {

  @Output() terminoBusqueda = new EventEmitter<string>();

  onBuscar(event: any) {
    const texto = event.target.value;
    this.terminoBusqueda.emit(texto);
  }
}