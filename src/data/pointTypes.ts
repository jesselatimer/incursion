import { EntityKey } from '../models/Entity';
import { PointType } from '../models/PointType';

export const POINT_TYPES: Record<EntityKey, PointType> = {
  foundation_points: {
    label: 'Foundation Points',
    description: 'Used to purchase Potential, Sources, and Methods',
    startingValue: 21,
  },
  talent_points: {
    label: 'Talent Points',
    description: 'Used to purchase Talents',
    startingValue: 40,
  },
  bond_points: {
    label: 'Bond Points',
    description: 'Used to purchase Allies, Contacts, Artifacts, and Pacts',
    startingValue: 4,
  },
};
