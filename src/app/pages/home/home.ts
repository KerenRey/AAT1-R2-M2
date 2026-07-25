import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioPaises } from '../../services/servicio-paises';
import { ModeloPaises } from '../../models/modelo-paises';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private servicioPaises = inject(ServicioPaises);

  // Almacén en caché de todos los países de la API
  todosLosPaises: ModeloPaises[] = [];
  
  // Señal que interactúa directamente con el HTML de la vista
  paisesDestacados = signal<ModeloPaises[]>([]);
  cargando = signal(true);

  regions = [
    { name: 'Africa', label: 'África', countries: 54 },
    { name: 'Americas', label: 'América', countries: 35 },
    { name: 'Asia', label: 'Asia', countries: 48 },
    { name: 'Europe', label: 'Europa', countries: 44 },
    { name: 'Oceania', label: 'Oceanía', countries: 14 },
  ];

  ngOnInit() {
    // CORREGIDO: Llamamos a getTodos() para traer los más de 195 países sin fallas de términos
    this.servicioPaises.getTodos().subscribe({
      next: (paises) => {
        // Si la API devuelve los objetos ordenados o en bruto, los guardamos
        this.todosLosPaises = paises || [];
        
        // Inicialmente pintamos los primeros países obtenidos (puedes usar .slice(0, 12) si solo quieres mostrar unos pocos al abrir)
        this.paisesDestacados.set(this.todosLosPaises);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  // Método de filtrado local instantáneo por caracteres
  buscarPais(event: Event) {
    const termino = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    if (!termino) {
      // Si el input está limpio, restaura toda la lista en la pantalla
      this.paisesDestacados.set(this.todosLosPaises);
      return;
    }

    // Filtra las coincidencias evaluando tanto el nombre común como el oficial
    const filtrados = this.todosLosPaises.filter(pais => 
      pais.names?.common?.toLowerCase().includes(termino) || 
      pais.names?.official?.toLowerCase().includes(termino)
    );
    this.paisesDestacados.set(filtrados);
  }

  formatPoblacion(poblacion: number): string {
    if (!poblacion) return '0';
    if (poblacion >= 1_000_000_000) {
      return (poblacion / 1_000_000_000).toFixed(1) + 'B';
    }
    if (poblacion >= 1_000_000) {
      return (poblacion / 1_000_000).toFixed(0) + 'M';
    }
    return poblacion.toLocaleString('es');
  }
}
