
import { Injectable, inject } from '@angular/core';

import { LocalStorageService } from '../../../core/storage/local-storage.service';
import type {
  Category,
  CreateCategoryDto,
} from '../domain/category.model';
import { CategoryRepository } from '../domain/category.repository';

const CATEGORIES_STORAGE_KEY = 'todo_app_categories_v1';

@Injectable({
  providedIn: 'root',
})
export class LocalCategoryRepository extends CategoryRepository {
  private readonly storage = inject(LocalStorageService);

  async getAll(): Promise<Category[]> {
    return this.storage.getItem<Category[]>(CATEGORIES_STORAGE_KEY, []);
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const categories = await this.getAll();

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      color: dto.color,
    };

    await this.storage.setItem(CATEGORIES_STORAGE_KEY, [
      ...categories,
      newCategory,
    ]);

    return newCategory;
  }

  async update(category: Category): Promise<Category> {
    const categories = await this.getAll();

    const updatedCategories = categories.map((currentCategory) =>
      currentCategory.id === category.id ? category : currentCategory
    );

    await this.storage.setItem(CATEGORIES_STORAGE_KEY, updatedCategories);

    return category;
  }

  async delete(id: string): Promise<void> {
    const categories = await this.getAll();

    const updatedCategories = categories.filter(
      (category) => category.id !== id
    );

    await this.storage.setItem(CATEGORIES_STORAGE_KEY, updatedCategories);
  }
}
