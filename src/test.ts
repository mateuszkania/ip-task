import test from 'ava';

import { CORRECT } from './correctResult';
import { INPUT } from './input';
import { Category } from './mockedApi';
import { categoryTree } from './task';

test('categoryTree should return the correct category tree structure', async (t) => {
  const getCategories = async (): Promise<Category[]> => INPUT;

  const result = await categoryTree(getCategories);

  t.deepEqual(result, CORRECT);
});
