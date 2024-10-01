import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

type GetCategoriesFn = () => Promise<Category[]>;

const extractOrder = (category: Category): number => {
  if (typeof category.Title === 'string') {
    const match = category.Title.match(/^(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return category.id;
};

const mapCategories = (categories: Category[]): CategoryListElement[] => {
  const mappedCategories = categories.map((category) => ({
    id: category.id,
    image: category.MetaTagDescription,
    name: category.name,
    order: extractOrder(category),
    children: mapCategories(category.children || []),
    showOnHome: false,
  }));
  return mappedCategories.sort((a, b) => a.order - b.order);
};

export const updateToShowOnHomeValue = (
  list: CategoryListElement[],
  toShowOnHome: number[]
): CategoryListElement[] => {
  if (list.length <= 5) {
    return list.map((a) => ({
      ...a,
      showOnHome: true,
    }));
  }

  if (toShowOnHome.length > 0) {
    return list.map((a) => ({
      ...a,
      showOnHome: toShowOnHome.includes(a.id),
    }));
  }

  return list.map((x, index) => ({
    ...x,
    showOnHome: index < 3,
  }));
};

export const categoryTree = async (
  getCategories: GetCategoriesFn,
  toShowOnHome: number[] = []
): Promise<CategoryListElement[]> => {
  const categories = await getCategories();
  const mappedCategories = mapCategories(categories);
  return updateToShowOnHomeValue(mappedCategories, toShowOnHome);
};
