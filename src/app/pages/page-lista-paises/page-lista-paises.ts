import { Component, inject, signal } from '@angular/core';
import { ListaDePaises } from '../../components/lista-de-paises/lista-de-paises';
import { ModeloPaises } from '../../models/modelo-paises';
import { ServicioPaises } from '../../services/servicio-paises';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-page-lista-paises',
  imports: [ListaDePaises, JsonPipe],
  templateUrl: './page-lista-paises.html',
  styleUrl: './page-lista-paises.css',
})
export class PageListaPaises {
  private ServicioPaises = inject(ServicioPaises);

  countries = signal<ModeloPaises[]>([]);

  buscar(texto: string): void {

    this.ServicioPaises
      .buscarPaises(texto)
      .subscribe({

        next: (datos: any) => {
          console.log("Datos recibidos: ", datos);
          this.countries.set(datos);

          if (datos?.data?.objects) {
            this.countries.set(datos.data.objects);
          }
        },
        error: (err) => {
          console.error('Error al buscar:', err);
        }
    })
} 


}
