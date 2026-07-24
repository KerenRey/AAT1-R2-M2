import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorComponent } from '../../components/buscador/buscador';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BuscadorComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {  // <--- ¡Asegúrate de que tenga la palabra 'export class HomeComponent'!

}