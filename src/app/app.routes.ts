import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ListaDePaises } from './components/lista-de-paises/lista-de-paises';
import { AcercaDe } from './pages/acerca-de/acerca-de';
import { PageListaPaises } from './pages/page-lista-paises/page-lista-paises';
import { Pagina404 } from './pages/pagina404/pagina404';//agregado jose barillas//*/*/

export const routes: Routes = [
    {
        path: '',
        component:Home
    },
    {
        path: 'PageListaPaises',
        component: PageListaPaises
    },
   { path: 'AcercaDe',
    component: AcercaDe,
   },
   {    // agregado jose barillas
    path: '**',
    component: Pagina404
  }//------//-------//


];
