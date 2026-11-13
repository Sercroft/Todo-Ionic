import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  ModalController,
} from '@ionic/angular';

import { Category } from '../../../domain/category.model';
import { CategoriesViewModel } from '../../view-models/categories.viewmodel';

const CATEGORY_COLORS = ['#3B82F6', '#A855F7', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#8B5CF6'];

@Component({
  selector: 'app-categories-manage',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Mis categorías</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="closeModal()"> Cerrar </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>{{ editingCategoryId ? 'Editar categoría' : 'Nueva categoría' }}</h2>

      <ion-input
        label="Nombre"
        labelPlacement="floating"
        placeholder="Ej. Trabajo, Personal..."
        [(ngModel)]="categoryName"
      ></ion-input>

      <ion-button expand="block" (click)="saveCategory()" [disabled]="!categoryName.trim()">
        {{ editingCategoryId ? 'Guardar cambios' : 'Crear categoría' }}
      </ion-button>

      @if (editingCategoryId) {
        <ion-button expand="block" fill="clear" color="medium" (click)="cancelEdit()"> Cancelar edición </ion-button>
      }

      <h2>Categorías ({{ viewModel.totalCategories() }})</h2>

      @if (viewModel.isLoading()) {
        <p>Cargando categorías...</p>
      } @else {
        @for (category of viewModel.categories(); track category.id) {
          <div class="category-item">
            <span
              class="category-pill"
              [style.backgroundColor]="category.color + '22'"
              [style.borderColor]="category.color"
              [style.color]="category.color"
            >
              {{ category.name }}
            </span>

            <div class="category-actions">
              <ion-button fill="clear" color="primary" (click)="editCategory(category)"> Editar </ion-button>

              <ion-button fill="clear" color="danger" (click)="deleteCategory(category.id)"> Eliminar </ion-button>
            </div>
          </div>
        } @empty {
          <p>No tienes categorías todavía.</p>
        }
      }

      @if (viewModel.error()) {
        <p>{{ viewModel.error() }}</p>
      }
    </ion-content>
  `,
  styles: [
    `
      .category-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        margin: 12px 0;
      }

      .category-pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 14px;
        border: 1px solid;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 600;
      }

      .category-actions {
        display: flex;
        align-items: center;
      }
    `,
  ],
  imports: [IonContent, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, FormsModule],
})
export class CategoriesManagePage implements OnInit {
  readonly viewModel: CategoriesViewModel = inject(CategoriesViewModel);
  private readonly modalController = inject(ModalController);

  categoryName = '';
  editingCategoryId: string | null = null;

  ngOnInit(): void {
    void this.viewModel.loadCategories();
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  async saveCategory(): Promise<void> {
    const name = this.categoryName.trim();

    if (!name) {
      return;
    }

    try {
      if (this.editingCategoryId) {
        const category = this.viewModel.categories().find((current) => current.id === this.editingCategoryId);

        if (!category) {
          return;
        }

        await this.viewModel.updateCategory({
          ...category,
          name,
        });
      } else {
        const color = this.getRandomColor();

        await this.viewModel.addCategory({
          name,
          color,
        });
      }

      this.cancelEdit();
    } catch {
      // El ViewModel ya registra el error.
    }
  }

  editCategory(category: Category): void {
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.categoryName = '';
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.viewModel.deleteCategory(id);

      if (this.editingCategoryId === id) {
        this.cancelEdit();
      }
    } catch {
      // El ViewModel ya registra el error.
    }
  }

  private getRandomColor(): string {
    const index = Math.floor(Math.random() * CATEGORY_COLORS.length);
    return CATEGORY_COLORS[index];
  }
}
