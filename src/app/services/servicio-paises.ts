import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { ModeloPaises } from '../models/modelo-paises';

// Estructura real que devuelve la API v5
interface ApiV5Response {
  data: {
    objects: ModeloPaises[];
    meta: {
      total: number;
      count: number;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class ServicioPaises {
  private http = inject(HttpClient);
  private apiUrl = '/api/countries/v5';
  private token = 'rc_live_3f376d543ff443f8b3105c2cfdcf9c48';

  private getHeaders(): HttpHeaders {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  console.log('Authorization:', headers.get('Authorization'));

  return headers;
}
/* private getHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Authorization': 'Bearer rc_live_5e204e0a7f9547ff93e6f3c254ae6f37',
    'Content-Type': 'application/json'
  });
} */

  /* getTodos(): Observable<ModeloPaises[]> {
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?limit=250&response_fields=names,capitals,region,population,flag,codes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => res.data.objects)
    );
  } */
 
  getTodos(): Observable<ModeloPaises[]> {
  console.log(this.getHeaders());

  return this.http.get<ApiV5Response>(
    `${this.apiUrl}?limit=100&response_fields=names,capitals,region,population,flag,codes`,
    { headers: this.getHeaders() }
  ).pipe(
    map(res => res.data.objects)
  );
}

  buscarPorNombre(nombre: string): Observable<ModeloPaises[]> {
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?q=${encodeURIComponent(nombre)}&fields=names,capitals,region,population,flag,codes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => res.data.objects)
    );
  }

  buscarPorRegion(region: string): Observable<ModeloPaises[]> {
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?region=${encodeURIComponent(region)}&limit=100&fields=names,capitals,region,population,flag,codes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => res.data.objects)
    );
  }

  getPaisesDestacados(): Observable<ModeloPaises[]> {
    // forkJoin con búsqueda individual por nombre — la API v5 no soporta ?codes=
    const nombres = ['Mexico', 'France', 'Japan', 'Brazil', 'South Africa', 'Australia'];
    const peticiones = nombres.map(nombre =>
      this.http.get<ApiV5Response>(
        `${this.apiUrl}?q=${encodeURIComponent(nombre)}&limit=1&fields=names,capitals,region,population,flag,codes`,
        { headers: this.getHeaders() }
      ).pipe(
        map(res => res.data.objects[0]),
        catchError(() => of(null))
      )
    );
    return forkJoin(peticiones).pipe(
      map(results => results.filter((p): p is ModeloPaises => p !== null))
    );
  }

  getPorCodigo(nombreOCodigo: string): Observable<ModeloPaises | null> {
    // La API v5 no tiene endpoint individual por código.
    // Buscamos por nombre (decodificado de URL) y tomamos el primer resultado.
    const nombre = decodeURIComponent(nombreOCodigo);
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?q=${encodeURIComponent(nombre)}&fields=names,capitals,region,subregion,population,flag,codes,area,languages,currencies,continents,borders,classification,links`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => {
        if (!res.data.objects || res.data.objects.length === 0) return null;
        return res.data.objects[0];
      }),
      catchError(() => of(null))
    );
  }
}
