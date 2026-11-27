import { Injectable, inject } from '@angular/core';

import type {
  Category,
  CreateCategoryDto,
} from '../category.model';
import { CategoryRepository } from '../category.repository';

@Injectable({ providedIn: 'root' })
export class ManageCategoriesUseCase {
  private readonly categoryRepository = inject(CategoryRepository);

  getAll(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(dto);
  }

  update(category: Category): Promise<Category> {
    return this.categoryRepository.update(category);
  }
}
