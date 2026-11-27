import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskRepository } from '../../../tasks/domain/task.repository';
import { CategoryRepository } from '../category.repository';

import { DeleteCategoryUseCase } from './delete-category.usecase';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;

  let categoryRepository: {
    delete: ReturnType<typeof vi.fn>;
  };

  let taskRepository: {
    clearCategoryReferences: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    categoryRepository = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    taskRepository = {
      clearCategoryReferences: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        DeleteCategoryUseCase,
        {
          provide: TaskRepository,
          useValue: taskRepository,
        },
        {
          provide: CategoryRepository,
          useValue: categoryRepository,
        },
      ],
    });

    useCase = TestBed.inject(DeleteCategoryUseCase);
  });

  describe('Given a category with associated tasks', () => {
    it('When the category is deleted, Then its tasks are unlinked before deleting the category', async () => {
      // Given
      const categoryId = 'category-123';
      const executionOrder: string[] = [];

      taskRepository.clearCategoryReferences.mockImplementation(async () => {
        executionOrder.push('clear-references');
      });

      categoryRepository.delete.mockImplementation(async () => {
        executionOrder.push('delete-category');
      });

      // When
      await useCase.execute(categoryId);

      // Then
      expect(taskRepository.clearCategoryReferences).toHaveBeenCalledWith(categoryId);

      expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);

      expect(executionOrder).toEqual(['clear-references', 'delete-category']);
    });
  });

  describe('Given that unlinking task references fails', () => {
    it('When the category is deleted, Then the category should not be deleted', async () => {
      // Given
      const categoryId = 'category-123';

      taskRepository.clearCategoryReferences.mockRejectedValue(new Error('Storage error'));

      // When
      await expect(useCase.execute(categoryId)).rejects.toThrow('Storage error');

      // Then
      expect(categoryRepository.delete).not.toHaveBeenCalled();
    });
  });
});
