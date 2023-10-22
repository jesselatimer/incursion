import { Entity, EntityKey } from '../models/Entity';
import { FOUNDATION_TYPE } from '../models/Foundation';
import { POINT_TYPES } from './pointTypes';

export const POTENTIALS: Record<EntityKey, Entity> = {
  power: {
    label: 'Power',
    description:
      'The amount of aether you can put into one spell. The base rate of tax per circe used to cast spells.',
    subtype: FOUNDATION_TYPE.Potential,
    pointType: POINT_TYPES.foundation_points,
  },
  capacity: {
    label: 'Capacity',
    description:
      'Increases the amount of aether you can channel before being totally taxed. (Details depend on Source.)',
    subtype: FOUNDATION_TYPE.Potential,
    pointType: POINT_TYPES.foundation_points,
  },
};
