import Papa from 'papaparse';
import { Category, CategoryKey } from '../models/Category';
import { PointType, PointTypeKey } from '../models/PointType';
import { EntityKey, Entity } from '../models/Entity';
import { SubCategory, SubCategoryKey } from '../models/SubCategory';
import { EntityLevel, EntityLevelKey } from '../models/EntityLevel';

// TODO: I should really do some validation and use different types for csv objects vs domain objects

export const getDataFromImport = async () => {
  const categoriesByKey: Record<CategoryKey, Category> =
    await parseCsv<Category>(
      '/incursion/imported/Categories 209902f319f64b48bc9cca434d7e449b_all.csv',
      (category) => {
        return {
          ...category,
          subCategories: category.subCategories
            ? // @ts-ignore this is a string, i'm fixing it
              category.subCategories.split(',')
            : [],
        };
      }
    );

  const entitiesByKey: Record<EntityKey, Entity> = await parseCsv<Entity>(
    '/incursion/imported/Entities ec7305ac1c814f7290ef03a1b62b6549_all.csv',
    (entity) => {
      return {
        ...entity,
        // @ts-ignore this is a string, i'm fixing it
        entityLevels: entity.entityLevels ? entity.entityLevels.split(',') : [],
      };
    }
  );

  const pointTypesByKey: Record<PointTypeKey, PointType> =
    await parseCsv<PointType>(
      '/incursion/imported/PointType 5a48b198234543278cf43279915248ce_all.csv'
    );

  const subCategoriesByKey: Record<SubCategoryKey, SubCategory> =
    await parseCsv<SubCategory>(
      '/incursion/imported/Subcategories 74b3bfb500de4b19982b9aced3f3123d_all.csv'
    );

  const entityLevelsByKey: Record<EntityLevelKey, EntityLevel> =
    await parseCsv<EntityLevel>(
      '/incursion/imported/Entity Levels c6999b8546224bf58fcdcde6692517e0_all.csv',
      (entityLevel) => {
        return {
          ...entityLevel,
          // @ts-ignore fixing type
          level: parseInt(entityLevel.level),
          pointCost:
            entityLevel.pointCost !== undefined
              ? // @ts-ignore fixing type
                parseInt(entityLevel.pointCost)
              : undefined,
        };
      }
    );

  return {
    categoriesByKey,
    subCategoriesByKey,
    entitiesByKey,
    entityLevelsByKey,
    pointTypesByKey,
  };
};

const regex = /\(.+\./g;

async function parseCsv<V>(
  path: string,
  callback?: (result: V) => V
): Promise<Record<string, V>> {
  return new Promise(async (resolve) => {
    Papa.parse<V>(path, {
      download: true,
      delimiter: ',',
      header: true,
      complete: async function (results) {
        const resultsByKey = results.data.reduce((acc, result) => {
          if (callback) result = callback(result);
          // @ts-ignore
          const pathToSelf = `${result.Self.match(regex)[0].slice(1, -1)}.md`;
          // @ts-ignore These have a key, not sure how to convince typescript
          acc[result.key] = { ...result, pathToSelf };
          return acc;
        }, {} as Record<string, V>);
        resolve(resultsByKey);
      },
      error: function (err, file) {
        throw new Error('err parsing');
      },
    });
  });
}
