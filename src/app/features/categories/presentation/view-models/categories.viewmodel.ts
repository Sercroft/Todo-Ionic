import { Injectable, computed, inject, signal } from '@angular/core';

import type { Category, CreateCategoryDto } from '../../domain/category.model';
import { CategoriesFacade } from '../facades/categories.facade';

@Injectable({ providedIn: 'root' })
export class CategoriesViewModel {
  private readonly categoriesFacade = inject(CategoriesFacade);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalCategories = computed(() => this.categories().length);

  async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const categories = await this.categoriesFacade.getAll();
      this.categories.set(categories);
    } catch {
      this.error.set('No fue posible cargar las categorías.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async addCategory(dto: CreateCategoryDto): Promise<void> {
    try {
      const newCategory = await this.categoriesFacade.create(dto);
      this.categories.update((categories) => [...categories, newCategory]);
      this.error.set(null);
    } catch {
      this.error.set('No fue posible crear la categoría.');
      throw new Error('Category creation failed');
    }
  }

  async updateCategory(category: Category): Promise<void> {
    try {
      const updatedCategory = await this.categoriesFacade.update(category);

      this.categories.update((categories) =>
        categories.map((current) => (current.id === updatedCategory.id ? updatedCategory : current)),
      );

      this.error.set(null);
    } catch {
      this.error.set('No fue posible actualizar la categoría.');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.categoriesFacade.delete(id);

      this.categories.update((categories) => categories.filter((category) => category.id !== id));

      this.error.set(null);
    } catch {
      this.error.set('No fue posible eliminar la categoría.');
      throw new Error('Category deletion failed');
    }
  }
}
