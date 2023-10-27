import { Choice } from '../models/Choice';
import { ALL_ENTITIES } from '../data/entities';
import { PointTypeKey } from '../models/PointType';
import { POINT_CALCULATORS } from '../data';

export const calculateBasePoints = (choices: Choice[]) => {
  let usedPoints = 0;
  for (const choice of choices) {
    const entity = ALL_ENTITIES[choice.entityKey];
    const levels = entity.levels.slice(0, choice.value);
    for (const level of levels) {
      usedPoints += level.pointCost;
    }
  }

  return usedPoints;
};

export const calculatePoints = (
  choices: Choice[],
  pointTypeKey?: PointTypeKey
) => {
  if (!pointTypeKey) return 0;
  const basePoints = calculateBasePoints(choices);
  const pointCalculator = POINT_CALCULATORS[pointTypeKey];
  let addedPoints = 0;
  if (pointCalculator) {
    addedPoints = pointCalculator(choices);
  }
  return basePoints + addedPoints;
};
