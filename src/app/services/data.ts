import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError, switchMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

export interface Pokemon {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprite: string;
  types: string[];
}

interface PokemonListResponse {
  results: { name: string; url: string }[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private listUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';

  pokemons = signal<Pokemon[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  private hasFetched = false;

  loadPokemons(): void {
    if (this.hasFetched) return;

    this.loading.set(true);
    this.error.set(null);

    this.http.get<PokemonListResponse>(this.listUrl).pipe(
      timeout(10000),
      switchMap((listRes) => {
        // The list endpoint only gives names/URLs — fetch full details for each
        const detailRequests = listRes.results.map((p) =>
          this.http.get<any>(p.url)
        );
        return forkJoin(detailRequests);
      }),
      catchError((err) => {
        console.error('API error:', err);
        this.error.set(`Failed to load pokemon: ${err.message || 'timeout'}`);
        this.loading.set(false);
        return of([]);
      })
    ).subscribe((details: any[]) => {
      if (details.length > 0) {
        const mapped: Pokemon[] = details.map((d) => ({
          name: d.name,
          id: d.id,
          height: d.height,
          weight: d.weight,
          sprite: d.sprites.front_default,
          types: d.types.map((t: any) => t.type.name)
        }));
        this.pokemons.set(mapped);
        this.hasFetched = true;
      }
      this.loading.set(false);
    });
  }
}