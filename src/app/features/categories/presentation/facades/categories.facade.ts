import { Injectable, inject } from '@angular/core';

import type {
  Category,
  CreateCategoryDto,
} from '../../domain/category.model';
import { DeleteCategoryUseCase } from '../../domain/usecase/delete-category.usecase';
import { ManageCategoriesUseCase } from '../../domain/usecase/manage-categories.usecase';

@Injectable({ providedIn: 'root' })
export class CategoriesFacade {
  private readonly manageCategories = inject(ManageCategoriesUseCase);
  private readonly deleteCategoryUseCase = inject(DeleteCategoryUseCase);

  getAll(): Promise<Category[]> {
    return this.manageCategories.getAll();
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.manageCategories.create(dto);
  }

  update(category: Category): Promise<Category> {
    return this.manageCategories.update(category);
  }

  delete(id: string): Promise<void> {
    return this.deleteCategoryUseCase.execute(id);
  }
}
