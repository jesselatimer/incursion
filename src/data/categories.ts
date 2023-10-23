import { Category, CategoryKey } from '../models/Category';
import { POINT_TYPES } from './pointTypes';

export const CATEGORIES: Record<CategoryKey, Category> = {
  foundations: {
    label: 'Foundations',
    pointType: POINT_TYPES.foundations,
    subCategories: ['Potentials', 'Sources', 'Methods'],
  },
  talents: {
    label: 'Talents',
    pointType: POINT_TYPES.talents,
  },
  bonds: {
    label: 'Bonds',
    pointType: POINT_TYPES.bonds,
    subCategories: ['Allies', 'Artifacts', 'Contacts', 'Pacts'],
  },
  threats: {
    label: 'Threats',
    pointType: null,
  },
};
