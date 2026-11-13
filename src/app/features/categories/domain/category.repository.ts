
import type { Category, CreateCategoryDto } from './category.model';

export abstract class CategoryRepository {
  abstract getAll(): Promise<Category[]>;

  abstract create(dto: CreateCategoryDto): Promise<Category>;

  abstract update(category: Category): Promise<Category>;

  abstract delete(id: string): Promise<void>;
}
