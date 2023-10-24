import { Category, CategoryKey } from '../models/Category';
import { POINT_TYPES } from './pointTypes';

export const CATEGORIES: Record<CategoryKey, Category> = {
  foundations: {
    key: 'foundations',
    label: 'Foundations',
    pointType: POINT_TYPES.foundation_points,
    subCategories: ['Potentials', 'Sources', 'Methods'],
  },
  talents: {
    key: 'talents',
    label: 'Talents',
    pointType: POINT_TYPES.talent_points,
  },
  bonds: {
    key: 'bonds',
    label: 'Bonds',
    pointType: POINT_TYPES.bond_points,
    subCategories: ['Allies', 'Artifacts', 'Contacts', 'Pacts'],
  },
  threats: {
    key: 'threats',
    label: 'Threats',
    pointType: null,
  },
};
