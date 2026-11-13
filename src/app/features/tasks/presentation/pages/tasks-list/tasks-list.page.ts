import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonTextarea, IonButton, IonCheckbox, ModalController } from '@ionic/angular';

import { CategoriesManagePage } from '../../../../categories/presentation/pages/categories-manage/categories-manage.page';
import { Task } from '../../../domain/task.model';
import { TasksViewModel } from '../../view-models/tasks.viewmodel';

@Component({
  selector: 'app-tasks-list',
  template: `
    <ion-content class="ion-padding">
      <h1>Mis tareas</h1>

      <ion-button expand="block" fill="outline" (click)="openCategoriesModal()"> Gestionar categorías </ion-button>

      <h2>{{ editingTaskId ? 'Editar tarea' : 'Nueva tarea' }}</h2>

      <ion-input
        label="Título"
        labelPlacement="floating"
        placeholder="¿Qué necesitas hacer?"
        [(ngModel)]="newTaskTitle"
      ></ion-input>

      <ion-textarea
        label="Descripción"
        labelPlacement="floating"
        placeholder="Descripción opcional"
        [(ngModel)]="newTaskDescription"
        rows="3"
      ></ion-textarea>

      <ion-button expand="block" (click)="saveTask()" [disabled]="!newTaskTitle.trim()">
        {{ editingTaskId ? 'Guardar cambios' : 'Crear tarea' }}
      </ion-button>

      @if (editingTaskId) {
        <ion-button expand="block" fill="clear" color="medium" (click)="cancelEdit()"> Cancelar edición </ion-button>
      }

      <h2>Estadísticas</h2>

      <p>Total: {{ viewModel.stats().total }}</p>
      <p>Pendientes: {{ viewModel.stats().pending }}</p>
      <p>Completadas: {{ viewModel.stats().completed }}</p>

      @if (viewModel.isLoading()) {
        <p>Cargando tareas...</p>
      } @else {
        @for (task of viewModel.filteredTasks(); track task.id) {
          <div>
            <ion-checkbox [checked]="task.completed" (ionChange)="toggleTask(task)">
              {{ task.title }}
            </ion-checkbox>

            <p>{{ task.description }}</p>
            <p>{{ task.completed ? 'Completada' : 'Pendiente' }}</p>

            <ion-button fill="clear" color="primary" (click)="editTask(task)"> Editar </ion-button>

            <ion-button color="danger" fill="clear" (click)="deleteTask(task.id)"> Eliminar </ion-button>
          </div>
        } @empty {
          <p>No tienes tareas todavía.</p>
        }
      }
    </ion-content>
  `,
  imports: [IonContent, IonInput, IonTextarea, IonButton, IonCheckbox, FormsModule],
})
export class TasksListPage implements OnInit {
  readonly viewModel: TasksViewModel = inject(TasksViewModel);

  private readonly modalController = inject(ModalController);

  newTaskTitle = '';
  newTaskDescription = '';
  editingTaskId: string | null = null;

  ngOnInit(): void {
    void this.viewModel.loadTasks();
  }

  async openCategoriesModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoriesManagePage,
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
      handle: true,
    });

    await modal.present();
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
      });
    } else {
      await this.viewModel.addTask({
        title,
        description: this.newTaskDescription.trim(),
      });
    }

    this.cancelEdit();
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
    this.newTaskTitle = task.title;
    this.newTaskDescription = task.description ?? '';
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
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
