import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  ModalController,
} from '@ionic/angular';

import { Category } from '../../../../categories/domain/category.model';
import { CategoriesManagePage } from '../../../../categories/presentation/pages/categories-manage/categories-manage.page';
import { CategoriesViewModel } from '../../../../categories/presentation/view-models/categories.viewmodel';
import { Task } from '../../../domain/task.model';
import { TasksViewModel, TaskStatusFilter } from '../../view-models/tasks.viewmodel';

@Component({
  selector: 'app-tasks-list',
  template: `
    <ion-content class="ion-padding">
      <div class="page-container">
        <!-- Header -->
        <header class="page-header">
          <div>
            <p class="eyebrow">ORGANIZA TU DÍA</p>
            <h1>Mis tareas</h1>
            <p class="subtitle">Organiza tus pendientes a tu manera.</p>
          </div>

          <ion-button fill="outline" size="small" class="categories-button" (click)="openCategoriesModal()">
            Gestionar categorías
          </ion-button>
        </header>

        <!-- Stats -->
        <section class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Total</span>
            <strong>{{ viewModel.stats().total }}</strong>
            <span class="stat-description">Tareas</span>
          </div>

          <div class="stat-card pending-stat">
            <span class="stat-label">Pendientes</span>
            <strong>{{ viewModel.stats().pending }}</strong>
            <span class="stat-description">Por completar</span>
          </div>

          <div class="stat-card completed-stat">
            <span class="stat-label">Completadas</span>
            <strong>{{ viewModel.stats().completed }}</strong>
            <span class="stat-description">Finalizadas</span>
          </div>
        </section>

        <!-- Task form -->
        <section class="form-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">{{ editingTaskId ? 'ACTUALIZACIÓN' : 'NUEVA ACTIVIDAD' }}</p>
              <h2>{{ editingTaskId ? 'Editar tarea' : 'Crear una tarea' }}</h2>
            </div>
          </div>

          <ion-input
            label="Título"
            labelPlacement="floating"
            fill="outline"
            placeholder="¿Qué necesitas hacer?"
            [(ngModel)]="newTaskTitle"
          ></ion-input>

          <ion-textarea
            label="Descripción"
            labelPlacement="floating"
            fill="outline"
            placeholder="Agrega algunos detalles..."
            [(ngModel)]="newTaskDescription"
            rows="3"
          ></ion-textarea>

          <ion-select
            label="Categoría"
            labelPlacement="floating"
            fill="outline"
            placeholder="Selecciona una categoría"
            interface="popover"
            [(ngModel)]="selectedCategoryId"
          >
            <ion-select-option [value]="null"> Sin categoría </ion-select-option>

            @for (category of categoriesViewModel.categories(); track category.id) {
              <ion-select-option [value]="category.id">
                {{ category.name }}
              </ion-select-option>
            }
          </ion-select>

          <div class="form-actions">
            <ion-button expand="block" (click)="saveTask()" [disabled]="!newTaskTitle.trim()">
              {{ editingTaskId ? 'Guardar cambios' : 'Crear tarea' }}
            </ion-button>

            @if (editingTaskId) {
              <ion-button expand="block" fill="clear" color="medium" (click)="cancelEdit()"> Cancelar </ion-button>
            }
          </div>
        </section>

        <!-- Filters -->
        <section class="filters-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">TU ORGANIZACIÓN</p>
              <h2>Lista de tareas</h2>
            </div>

            <span class="results-count"> {{ viewModel.filteredTasks().length }} resultados </span>
          </div>

          <div class="status-filters">
            <button type="button" [class.active]="viewModel.statusFilter() === 'all'" (click)="setStatusFilter('all')">
              Todas
            </button>

            <button
              type="button"
              [class.active]="viewModel.statusFilter() === 'pending'"
              (click)="setStatusFilter('pending')"
            >
              Pendientes
            </button>

            <button
              type="button"
              [class.active]="viewModel.statusFilter() === 'completed'"
              (click)="setStatusFilter('completed')"
            >
              Completadas
            </button>
          </div>

          <ion-select
            class="category-filter"
            label="Filtrar por categoría"
            labelPlacement="floating"
            fill="outline"
            interface="popover"
            [(ngModel)]="selectedCategoryFilterId"
            (ionChange)="applyCategoryFilter()"
          >
            <ion-select-option [value]="null"> Todas las categorías </ion-select-option>

            @for (category of categoriesViewModel.categories(); track category.id) {
              <ion-select-option [value]="category.id">
                {{ category.name }}
              </ion-select-option>
            }
          </ion-select>
        </section>

        <!-- Tasks -->
        <section class="tasks-section">
          @if (viewModel.isLoading()) {
            <div class="empty-state">
              <p>Cargando tareas...</p>
            </div>
          } @else {
            @for (task of viewModel.filteredTasks(); track task.id) {
              <article class="task-card" [class.task-completed]="task.completed">
                <div class="task-main">
                  <ion-checkbox [checked]="task.completed" (ionChange)="toggleTask(task)"></ion-checkbox>

                  <div class="task-content">
                    <h3>{{ task.title }}</h3>

                    @if (task.description) {
                      <p>{{ task.description }}</p>
                    }

                    <div class="task-metadata">
                      <span class="status-label" [class.status-done]="task.completed">
                        {{ task.completed ? 'Completada' : 'Pendiente' }}
                      </span>

                      @if (getCategory(task.categoryId); as category) {
                        <span
                          class="category-pill"
                          [style.background-color]="category.color + '22'"
                          [style.color]="category.color"
                          [style.border-color]="category.color"
                        >
                          {{ category.name }}
                        </span>
                      }
                    </div>
                  </div>
                </div>

                <div class="task-actions">
                  <ion-button fill="clear" size="small" color="primary" (click)="editTask(task)"> Editar </ion-button>

                  <ion-button fill="clear" size="small" color="danger" (click)="deleteTask(task.id)">
                    Eliminar
                  </ion-button>
                </div>
              </article>
            } @empty {
              <div class="empty-state">
                <h3>No hay tareas para mostrar</h3>
                <p>Prueba cambiando los filtros o crea una nueva tarea.</p>
              </div>
            }
          }
        </section>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .page-container {
        max-width: 760px;
        margin: 0 auto;
        padding-bottom: 32px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin: 12px 0 24px;
      }

      .eyebrow {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.3px;
        color: var(--ion-color-primary);
        margin: 0 0 6px;
      }

      h1 {
        font-size: 28px;
        font-weight: 750;
        margin: 0;
        letter-spacing: -0.7px;
      }

      .subtitle {
        color: var(--ion-color-medium);
        font-size: 13px;
        margin: 6px 0 0;
      }

      .categories-button {
        flex-shrink: 0;
        font-size: 11px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 28px;
      }

      .stat-card {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 14px 12px;
        border-radius: 16px;
        background: var(--ion-card-background, var(--ion-item-background, var(--ion-background-color)));
        border: 1px solid var(--ion-border-color);
      }

      .stat-label {
        color: var(--ion-color-medium);
        font-size: 11px;
        font-weight: 600;
      }

      .stat-card strong {
        font-size: 26px;
        font-weight: 750;
        line-height: 1.2;
      }

      .stat-description {
        color: var(--ion-color-medium);
        font-size: 10px;
      }

      .pending-stat strong {
        color: var(--ion-color-warning);
      }

      .completed-stat strong {
        color: var(--ion-color-success);
      }

      .form-card {
        padding: 18px;
        border: 1px solid var(--ion-border-color);
        border-radius: 18px;
        margin-bottom: 30px;
        background: var(--ion-card-background, var(--ion-background-color));
      }

      .section-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 19px;
        font-weight: 700;
        margin: 0;
      }

      .form-card ion-input,
      .form-card ion-textarea,
      .form-card ion-select {
        margin-bottom: 14px;
      }

      .form-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 6px;
      }

      .filters-section {
        margin-bottom: 18px;
      }

      .results-count {
        color: var(--ion-color-medium);
        font-size: 11px;
        white-space: nowrap;
      }

      .status-filters {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        padding: 5px;
        background: var(--ion-color-step-100, var(--ion-color-light));
        border-radius: 12px;
        margin-bottom: 14px;
      }

      .status-filters button {
        border: 0;
        border-radius: 9px;
        padding: 10px 4px;
        font-size: 11px;
        font-weight: 600;
        color: var(--ion-color-medium);
        background: transparent;
        cursor: pointer;
        transition:
          background 150ms ease,
          color 150ms ease;
      }

      .status-filters button.active {
        background: var(--ion-background-color);
        color: var(--ion-color-primary);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }

      .category-filter {
        margin-bottom: 6px;
      }

      .tasks-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .task-card {
        padding: 15px;
        border: 1px solid var(--ion-border-color);
        border-radius: 16px;
        background: var(--ion-card-background, var(--ion-background-color));
      }

      .task-main {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .task-main ion-checkbox {
        flex-shrink: 0;
        margin-top: 3px;
      }

      .task-content {
        min-width: 0;
        flex: 1;
      }

      .task-content h3 {
        font-size: 15px;
        font-weight: 650;
        margin: 0 0 6px;
        overflow-wrap: anywhere;
      }

      .task-content p {
        font-size: 12px;
        line-height: 1.5;
        color: var(--ion-color-medium);
        margin: 0 0 10px;
        overflow-wrap: anywhere;
      }

      .task-completed .task-content h3 {
        text-decoration: line-through;
        color: var(--ion-color-medium);
      }

      .task-metadata {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 7px;
      }

      .status-label,
      .category-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 20px;
        padding: 4px 9px;
        font-size: 10px;
        font-weight: 600;
        border: 1px solid transparent;
        color: #000;
      }

      .status-label {
        background: var(--ion-color-warning-tint);
      }

      .status-label.status-done {
        background: var(--ion-color-success-tint);
      }

      .category-pill {
        border-style: solid;
        border-width: 1px;
      }

      .task-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
        border-top: 1px solid var(--ion-border-color);
        padding-top: 5px;
      }

      .empty-state {
        text-align: center;
        padding: 32px 18px;
        border: 1px dashed var(--ion-border-color);
        border-radius: 16px;
        color: var(--ion-color-medium);
      }

      .empty-state h3 {
        color: var(--ion-text-color);
        font-size: 15px;
        margin: 0 0 8px;
      }

      .empty-state p {
        font-size: 12px;
        margin: 0;
        line-height: 1.5;
      }

      @media (max-width: 380px) {
        .page-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .categories-button {
          align-self: flex-start;
        }

        .stat-card {
          padding: 12px 8px;
        }

        .stat-card strong {
          font-size: 23px;
        }
      }
    `,
  ],
  imports: [IonContent, IonInput, IonTextarea, IonButton, IonCheckbox, IonSelect, IonSelectOption, FormsModule],
})

export class TasksListPage implements OnInit {
  readonly viewModel = inject(TasksViewModel);
  readonly categoriesViewModel = inject(CategoriesViewModel);

  private readonly modalController = inject(ModalController);

  newTaskTitle = '';
  newTaskDescription = '';
  selectedCategoryId: string | null = null;
  selectedCategoryFilterId: string | null = null;

  editingTaskId: string | null = null;

  ngOnInit(): void {
    void this.viewModel.loadTasks();
    void this.categoriesViewModel.loadCategories();
  }

  async openCategoriesModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoriesManagePage,
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
      handle: true,
    });

    await modal.present();
    await modal.onDidDismiss();

    await this.viewModel.loadTasks();
    await this.categoriesViewModel.loadCategories();
  }

  getCategory(categoryId: string | null): Category | undefined {
    if (!categoryId) {
      return undefined;
    }

    return this.categoriesViewModel.categories().find((category) => category.id === categoryId);
  }

  setStatusFilter(status: TaskStatusFilter): void {
    this.viewModel.setStatusFilter(status);
  }

  applyCategoryFilter(): void {
    this.viewModel.setCategoryFilter(this.selectedCategoryFilterId);
  }

  async saveTask(): Promise<void> {
    const title = this.newTaskTitle.trim();

    if (!title) {
      return;
    }

    if (this.editingTaskId) {
      const task = this.viewModel.tasks().find((currentTask) => currentTask.id === this.editingTaskId);

      if (!task) {
        return;
      }

      await this.viewModel.updateTask({
        ...task,
        title,
        description: this.newTaskDescription.trim(),
        categoryId: this.selectedCategoryId,
      });
    } else {
      await this.viewModel.addTask({
        title,
        description: this.newTaskDescription.trim(),
        categoryId: this.selectedCategoryId,
      });
    }

    this.cancelEdit();
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
    this.newTaskTitle = task.title;
    this.newTaskDescription = task.description ?? '';
    this.selectedCategoryId = task.categoryId;
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.selectedCategoryId = null;
  }

  async toggleTask(task: Task): Promise<void> {
    await this.viewModel.toggleTask(task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.viewModel.deleteTask(id);

    if (this.editingTaskId === id) {
      this.cancelEdit();
    }
  }
}
