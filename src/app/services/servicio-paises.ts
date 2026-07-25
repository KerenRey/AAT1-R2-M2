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
  
  // URL absoluta oficial conectada directamente de forma externa
  private apiUrl = 'https://restcountries.com';
  private token = 'rc_live_0f9a757f945c4fab9ae7163df3179793';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getTodos(): Observable<ModeloPaises[]> {
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?limit=250&fields=names,capitals,region,population,flag,codes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => res.data?.objects || [])
    );
  }

  buscarPorNombre(nombre: string): Observable<ModeloPaises[]> {
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?q=${encodeURIComponent(nombre)}&fields=names,capitals,region,population,flag,codes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => res.data?.objects || [])
    );
  }

  buscarPorRegion(region: string): Observable<ModeloPaises[]> {
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?region=${encodeURIComponent(region)}&limit=250&fields=names,capitals,region,population,flag,codes`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => res.data?.objects || [])
    );
  }

  getPaisesDestacados(): Observable<ModeloPaises[]> {
    const nombres = ['Mexico', 'France', 'Japan', 'Brazil', 'South Africa', 'Australia'];
    const peticiones = nombres.map(nombre =>
      this.http.get<ApiV5Response>(
        `${this.apiUrl}?q=${encodeURIComponent(nombre)}&limit=1&fields=names,capitals,region,population,flag,codes`,
        { headers: this.getHeaders() }
      ).pipe(
        // EXTRACCIÓN CORREGIDA: Devuelve el objeto individual país o null
        map(res => (res.data?.objects && res.data.objects.length > 0) ? res.data.objects[0] : null),
        catchError(() => of(null))
      )
    );
    return forkJoin(peticiones).pipe(
      map(results => results.filter((p): p is ModeloPaises => p !== null))
    );
  }

  getPorCodigo(nombreOCodigo: string): Observable<ModeloPaises | null> {
    const nombre = decodeURIComponent(nombreOCodigo);
    return this.http.get<ApiV5Response>(
      `${this.apiUrl}?q=${encodeURIComponent(nombre)}&fields=names,capitals,region,subregion,population,flag,codes,area,languages,currencies,continents,borders,classification,links`,
      { headers: this.getHeaders() }
    ).pipe(
      map(res => {
        // EXTRACCIÓN CORREGIDA: Devuelve el objeto individual del país para la vista detalle
        if (!res.data || !res.data.objects || res.data.objects.length === 0) return null;
        return res.data.objects[0];
      }),
      catchError(() => of(null))
    );
  }
}
