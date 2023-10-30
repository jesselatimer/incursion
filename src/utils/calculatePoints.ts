import { Choice } from '../models/Choice';
import { PointTypeKey } from '../models/PointType';
import { POINT_CALCULATORS } from '../data';
import { Entity, EntityKey } from '../models/Entity';
import { EntityLevel, EntityLevelKey } from '../models/EntityLevel';

const calculateBasePoints = (
  choices: Choice[],
  entitiesByKey: Record<EntityKey, Entity>,
  entityLevelsByKey: Record<EntityLevelKey, EntityLevel>
) => {
  let usedPoints = 0;
  for (const choice of choices) {
    const entity = entitiesByKey[choice.entityKey];
    if (entity && entity.entityLevels) {
      const levels = entity.entityLevels.slice(0, choice.level);
      for (const levelKey of levels) {
        const level = entityLevelsByKey[levelKey];
        if (level && level.pointCost) {
          usedPoints += level.pointCost;
        }
      }
    }
  }

  return usedPoints;
};

export const calculatePoints = (
  choices: Choice[],
  entitiesByKey: Record<EntityKey, Entity>,
  entityLevelsByKey: Record<EntityLevelKey, EntityLevel>,
  pointTypeKey?: PointTypeKey
) => {
  if (!pointTypeKey) return 0;
  const basePoints = calculateBasePoints(
    choices,
    entitiesByKey,
    entityLevelsByKey
  );
  const pointCalculator = POINT_CALCULATORS[pointTypeKey];
  let addedPoints = 0;
  if (pointCalculator) {
    addedPoints = pointCalculator(choices, entitiesByKey);
  }
  return basePoints + addedPoints;
};
