import { Entity, EntityKey } from '../../models/Entity';
import { CATEGORIES } from '../categories';

export const POTENTIALS: Record<EntityKey, Entity> = {
  power: {
    key: 'power',
    label: 'Power',
    description:
      'The amount of aether you can put into one spell. The base rate of tax per circe used to cast spells.',
    category: CATEGORIES.foundations,
    subCategory: 'Potentials',
  },
  capacity: {
    key: 'capacity',
    label: 'Capacity',
    description:
      'Increases the amount of aether you can channel before being totally taxed. (Details depend on Source.)',
    category: CATEGORIES.foundations,
    subCategory: 'Potentials',
  },
};
