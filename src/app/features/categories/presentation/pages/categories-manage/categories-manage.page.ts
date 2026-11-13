
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
  AlertController,
} from '@ionic/angular';

import type { Category } from '../../../domain/category.model';
import { CategoriesViewModel } from '../../view-models/categories.viewmodel';

const CATEGORY_COLORS = [
  '#3B82F6',
  '#A855F7',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#06B6D4',
  '#8B5CF6',
];

@Component({
  selector: 'app-categories-manage',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Mis categorías</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="closeModal()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="categories-container">

        <section class="form-section">
          <div class="section-heading">
            <div>
              <h2>{{ editingCategoryId ? 'Editar categoría' : 'Nueva categoría' }}</h2>
              <p>Organiza tus tareas por temas y colores.</p>
            </div>
          </div>

          <ion-input
            label="Nombre"
            labelPlacement="floating"
            fill="outline"
            placeholder="Ej. Trabajo, Personal..."
            [(ngModel)]="categoryName"
          ></ion-input>

          <div class="color-section">
            <span class="field-label">Color de la categoría</span>

            <div class="color-palette">
              @for (color of categoryColors; track color) {
                <button
                  type="button"
                  class="color-option"
                  [class.selected]="selectedColor === color"
                  [style.backgroundColor]="color"
                  [attr.aria-label]="'Seleccionar color ' + color"
                  [attr.aria-pressed]="selectedColor === color"
                  (click)="selectedColor = color"
                >
                  @if (selectedColor === color) {
                    <span>✓</span>
                  }
                </button>
              }
            </div>
          </div>

          <div
            class="preview-container"
            [style.backgroundColor]="selectedColor + '15'"
            [style.borderColor]="selectedColor + '55'"
          >
            <span class="preview-label">Vista previa</span>

            <span
              class="category-pill"
              [style.backgroundColor]="selectedColor + '22'"
              [style.borderColor]="selectedColor"
              [style.color]="selectedColor"
            >
              {{ categoryName.trim() || 'Nombre de categoría' }}
            </span>
          </div>

          <ion-button
            expand="block"
            (click)="saveCategory()"
            [disabled]="!categoryName.trim()"
          >
            {{ editingCategoryId ? 'Guardar cambios' : 'Crear categoría' }}
          </ion-button>

          @if (editingCategoryId) {
            <ion-button
              expand="block"
              fill="clear"
              color="medium"
              (click)="cancelEdit()"
            >
              Cancelar edición
            </ion-button>
          }
        </section>

        <section class="list-section">
          <div class="section-heading">
            <div>
              <h2>Tus categorías</h2>
              <p>Gestiona las categorías de tus tareas.</p>
            </div>

            <span class="category-count">
              {{ viewModel.totalCategories() }}
            </span>
          </div>

          @if (viewModel.isLoading()) {
            <div class="empty-state">
              <p>Cargando categorías...</p>
            </div>
          } @else {
            <div class="category-list">
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
                    <ion-button
                      fill="clear"
                      color="primary"
                      size="small"
                      (click)="editCategory(category)"
                    >
                      Editar
                    </ion-button>

                    <ion-button
                      fill="clear"
                      color="danger"
                      size="small"
                      (click)="deleteCategory(category)"
                    >
                      Eliminar
                    </ion-button>
                  </div>
                </div>
              } @empty {
                <div class="empty-state">
                  <h3>Aún no tienes categorías</h3>
                  <p>Crea tu primera categoría para organizar tus tareas.</p>
                </div>
              }
            </div>
          }
        </section>

        @if (viewModel.error()) {
          <p class="error-message">{{ viewModel.error() }}</p>
        }
      </div>
    </ion-content>
  `,
  styles: [
    `
      .categories-container {
        max-width: 600px;
        margin: 0 auto;
        padding-bottom: 24px;
      }

      .form-section,
      .list-section {
        padding: 18px;
        margin-bottom: 20px;
        border: 1px solid var(--ion-color-step-150, #e5e7eb);
        border-radius: 18px;
        background: var(--ion-card-background, var(--ion-background-color));
      }

      .section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }

      .section-heading h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }

      .section-heading p {
        margin: 5px 0 0;
        color: var(--ion-color-medium);
        font-size: 13px;
      }

      ion-input {
        margin-bottom: 18px;
      }

      .color-section {
        margin-bottom: 18px;
      }

      .field-label {
        display: block;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 600;
      }

      .color-palette {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .color-option {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        padding: 0;
        border: 2px solid transparent;
        border-radius: 50%;
        color: white;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
      }

      .color-option.selected {
        outline: 2px solid var(--ion-color-medium);
        outline-offset: 3px;
      }

      .preview-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        padding: 14px;
        margin-bottom: 18px;
        border: 1px solid;
        border-radius: 12px;
      }

      .preview-label {
        color: var(--ion-color-medium);
        font-size: 12px;
      }

      .category-pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 13px;
        border: 1px solid;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
      }

      .category-count {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        height: 30px;
        padding: 0 8px;
        border-radius: 10px;
        background: var(--ion-color-step-100, #f3f4f6);
        font-size: 13px;
        font-weight: 700;
      }

      .category-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .category-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 12px;
        border: 1px solid var(--ion-color-step-150, #e5e7eb);
        border-radius: 12px;
      }

      .category-actions {
        display: flex;
        align-items: center;
      }

      .empty-state {
        padding: 24px 12px;
        text-align: center;
        color: var(--ion-color-medium);
      }

      .empty-state h3 {
        margin: 0 0 8px;
        color: var(--ion-text-color);
        font-size: 16px;
      }

      .empty-state p {
        margin: 0;
        font-size: 13px;
      }

      .error-message {
        padding: 12px;
        border-radius: 10px;
        background: var(--ion-color-danger-tint);
        color: var(--ion-color-danger-shade);
        font-size: 13px;
      }
    `,
  ],
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    FormsModule,
  ],
})
export class CategoriesManagePage implements OnInit {
  readonly viewModel = inject(CategoriesViewModel);

  private readonly modalController = inject(ModalController);
  private readonly alertController = inject(AlertController);

  readonly categoryColors = CATEGORY_COLORS;

  categoryName = '';
  selectedColor = this.getRandomColor();
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
        const category = this.viewModel
          .categories()
          .find((current) => current.id === this.editingCategoryId);

        if (!category) {
          return;
        }

        await this.viewModel.updateCategory({
          ...category,
          name,
          color: this.selectedColor,
        });
      } else {
        await this.viewModel.addCategory({
          name,
          color: this.selectedColor,
        });
      }

      this.cancelEdit();
    } catch {
      // TO DO: Mostrar un mensaje de error al usuario. El ViewModel ya registra el error.
    }
  }

  editCategory(category: Category): void {
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
    this.selectedColor = category.color;
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.categoryName = '';
    this.selectedColor = this.getRandomColor();
  }

  async deleteCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: `¿Seguro que deseas eliminar "${category.name}"? Las tareas asociadas quedarán sin categoría.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role !== 'destructive') {
      return;
    }

    try {
      await this.viewModel.deleteCategory(category.id);

      if (this.editingCategoryId === category.id) {
        this.cancelEdit();
      }
    } catch {
      // TO DO: Mostrar un mensaje de error al usuario. El ViewModel ya registra el error.
    }
  }

  private getRandomColor(): string {
    const index = Math.floor(Math.random() * CATEGORY_COLORS.length);
    return CATEGORY_COLORS[index];
  }
}
