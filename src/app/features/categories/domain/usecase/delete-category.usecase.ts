import { Injectable, inject } from '@angular/core';

import { TaskRepository } from '../../../tasks/domain/task.repository';
import { CategoryRepository } from '../category.repository';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryUseCase {
  private readonly categoryRepository = inject(CategoryRepository);
  private readonly taskRepository = inject(TaskRepository);

  async execute(categoryId: string): Promise<void> {
    await this.taskRepository.clearCategoryReferences(categoryId);
    await this.categoryRepository.delete(categoryId);
  }
}
