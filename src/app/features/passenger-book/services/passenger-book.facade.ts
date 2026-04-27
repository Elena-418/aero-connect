import { Injectable, inject,signal } from '@angular/core';
import { PassengerService } from '../../../core/services/passenger.service';
import { PassengerProfile } from '../../../core/models/passenger.model';

/**
 * Facade de PassengerBook — versión imperativa
 *
 * Responsabilidades:
 *  - Coordinar las llamadas HTTP (PassengerService)
 *  - Mantener el estado de la feature
 *  - Exponer una API limpia al componente
 *
 * Problemas de esta implementación que resolveremos con Signals:
 *  1. Estado mutable y público → cualquiera puede escribir en él
 *  2. 'filteredPassengers' es un array duplicado de 'passengers' → pueden desincronizarse
 *  3. La lógica de filtrado tiene que ejecutarse manualmente en dos sitios (loadAll + applyFilter)
 *  4. setTimeout para ocultar el banner de éxito → no es reactivo
 *  5. Ninguna propiedad derivada está memoizada
 */
@Injectable()
export class PassengerBookFacade {
  private readonly passengerService = inject(PassengerService);

  // ── ESTADO ───────────────────────────────────────────────────────────────────
  // Propiedades de clase planas: no hay notificación automática de cambios,
  // Angular los detecta sólo porque usa Zone.js y revisión de árbol completo.

  public passengers= signal<PassengerProfile[]> ([]);

  // Array duplicado para la vista filtrada.
  // Hay que mantenerlo sincronizado con 'passengers' manualmente.
  public filteredPassengers= signal<PassengerProfile[]>([]);

  public selectedPassenger= signal<PassengerProfile | null>( null);

  // true mientras el formulario está en modo "alta" (en lugar de edición)
  public isCreating= signal (false);

  public isLoading = signal  (false);
  public isSaving = signal (false);
  // error: string | null = null;
  public error = signal<string | null>(null);
  public saveSuccess = signal (false);

  // ── ACCIONES ─────────────────────────────────────────────────────────────────

  loadAll(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.passengerService.getAll().subscribe({
      next: (passengers) => {
        this.passengers.set(passengers);
        // Hay que inicializar filteredPassengers también aquí.
        // Si lo olvidamos, la lista empieza vacía.
          this.filteredPassengers.set(passengers);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pasajeros.');
        this.isLoading.set(false);
      },
    });
  }

  select(passenger: PassengerProfile): void {
    this.selectedPassenger.set(passenger);
    this.isCreating.set(false);
    this.error.set(null);
    this.saveSuccess.set(false);
  }

  startNew(): void {
    this.selectedPassenger.set(null);
    this.isCreating.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);
  }

  applyFilter(term: string): void {
    if (!term.trim()) {
      // Restaurar la lista completa cuando el filtro está vacío.
      this.filteredPassengers.set(this.passengers());
      return;
    }
    const lower = term.toLowerCase();
    this.filteredPassengers.set(this.passengers().filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(lower) ||
        p.documentNumber.toLowerCase().includes(lower) ||
        p.email.toLowerCase().includes(lower)
    ));
  }

  save(data: Partial<PassengerProfile>): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);

    if (this.isCreating()) {
      this._create(data);
    } else {
      //!PONER PARENTESIS
      this._update(this.selectedPassenger()!.id, data);
    }
  }

  private _update(id: string, data: Partial<PassengerProfile>): void {
    this.passengerService.update(id, data).subscribe({
      next: (updated) => {
        // Actualizar en 'passengers' (fuente de verdad)
        const idx = this.passengers().findIndex((p) => p.id === id);
        //!preguntar a ivo

        if (idx !== -1) this.passengers()[idx] = (updated);

        // Actualizar también en 'filteredPassengers' para que la vista no quede desactualizada.
        // Si olvidamos esto, el item de la lista muestra datos viejos.
      this.passengers.set([...this.passengers(),updated])
      ;
    

        this.selectedPassenger.set(updated);
        this.isSaving.set(false);
        this.saveSuccess.set(true);

        // Ocultar el banner de éxito tras 3 segundos.
        // setTimeout con Zone.js funciona, pero en OnPush hay que envolverlo en NgZone.run().
        // Con signals, esto se resuelve de otra forma.
        setTimeout(() => { this.saveSuccess.set(false); }, 3000);
      },
      error: () => {
        this.error.set('No se pudo guardar. Inténtalo de nuevo.');
        this.isSaving.set(false);
      },
    });
  }

  private _create(data: Partial<PassengerProfile>): void {
    this.passengerService.create(data as Omit<PassengerProfile, 'id' | 'totalFlights'>).subscribe({
      next: (created) => {
        // Añadir el nuevo pasajero a ambos arrays.
        // Hay que recordar hacerlo en los dos sitios.
        this.passengers.set([...this.passengers(), created]);
        this.filteredPassengers.set([...this.filteredPassengers(), created]);

        this.selectedPassenger.set(created);
        this.isCreating.set(false);
        this.isSaving.set(false);
        this.saveSuccess.set(true);

        setTimeout(() => { this.saveSuccess.set(false); }, 3000);
      },
      error: () => {
        this.error.set('No se pudo crear el pasajero. Inténtalo de nuevo.');
        this.isSaving.set(false);

      },
    });
  }
}
