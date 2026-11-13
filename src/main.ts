import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { LocalCategoryRepository } from './app/features/categories/data/local-category.repository';
import { CategoryRepository } from './app/features/categories/domain/category.repository';
import { LocalTaskRepository } from './app/features/tasks/data/local-task-repository';
import { TaskRepository } from './app/features/tasks/domain/task.repository';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    { provide: TaskRepository, useExisting: LocalTaskRepository },
    { provide: CategoryRepository, useExisting: LocalCategoryRepository },
  ],
}).catch((error) => console.error(error));
