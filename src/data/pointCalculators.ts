import { reduce } from 'lodash';
import { Choice } from '../models/Choice';
import { Entity } from '../models/Entity';
import { ALL_ENTITIES } from './entities';
import { PointCalculator } from '../models/PointCalculator';
import { PointTypeKey } from '../models/PointType';

const FOUNDATION_POINTS_PER_METHOD_AND_SOURCE: Record<number, number> = {
  2: 0,
  3: 1,
  4: 3,
  5: 7,
  6: 11,
  7: 15,
  8: 19,
  9: 25,
};

export const POINT_CALCULATORS: Record<PointTypeKey, PointCalculator> = {
  foundation_points: {
    pointCalculator: (
      entity: Entity,
      value: number,
      choices: Choice[]
    ): number => {
      const baseCost = entity.levels[value - 1].pointCost;
      if (['Methods', 'Sources'].includes(entity.subCategory)) {
        const numberOfChoices = reduce(
          choices,
          (num, choice) => {
            const currentEntity = ALL_ENTITIES[choice.entityKey];
            if (['Methods', 'Sources'].includes(currentEntity.subCategory))
              return num + 1;
            return num;
          },
          0
        );
        return (
          baseCost +
          (FOUNDATION_POINTS_PER_METHOD_AND_SOURCE[numberOfChoices] || 0)
        );
      }
      return baseCost;
    },
  },
};