import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModeloPaises } from '../models/modelo-paises';

@Injectable({
  providedIn: 'root',
})
export class ServicioPaises {
  private http = inject(HttpClient);

  private apiUrl = 
    '/api/countries/v5';

  private token =
    'rc_live_0f9a757f945c4fab9ae7163df3179793';

  buscarPaises(texto: string): Observable<any> {

    const params = new HttpParams()
      .set('q', texto)
      .set('limit', 5)
      .set('pretty', 1);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })


    return this.http.get<any>(
      this.apiUrl,
      {
        params,
        headers
      }
    )
  }
}

//Generar codigo en base CORS en la cabezera, permiso de la caberaza, credencciales y origins
// Configuration CORSapp.use(cors({  origin: 'http://localhost:4200', 
// URL de votre frontend  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  allowedHeaders: ['Content-Type', 'Authorization'],  credentials: true,  optionsSuccessStatus: 200}));
// forma de implemetnar en Angular