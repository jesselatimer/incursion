import Papa from 'papaparse';
import { Category, CategorySchema } from '../models/Category';
import { PointType, PointTypeKey, PointTypeSchema } from '../models/PointType';
import { EntityKey, Entity, EntitySchema } from '../models/Entity';
import {
  SubCategory,
  SubCategoryKey,
  SubCategorySchema,
} from '../models/SubCategory';
import {
  EntityLevel,
  EntityLevelKey,
  EntityLevelSchema,
} from '../models/EntityLevel';
import { ZodType, z } from 'zod';
import { reduce } from 'lodash';

export const getDataFromImport = async () => {
  const categoriesByKey: Record<string, Category> = await parseCsv<
    typeof CategorySchema
  >(
    '/incursion/imported/Categories 209902f319f64b48bc9cca434d7e449b_all.csv',
    CategorySchema,
    (rowCategory) => {
      return {
        ...rowCategory,
        subCategories:
          rowCategory.subCategories &&
          typeof rowCategory.subCategories === 'string'
            ? rowCategory.subCategories.split(',')
            : [],
      };
    }
  );

  const entitiesByKey: Record<EntityKey, Entity> = await parseCsv<
    typeof EntitySchema
  >(
    '/incursion/imported/Entities ec7305ac1c814f7290ef03a1b62b6549_all.csv',
    EntitySchema,
    (rowEntity) => {
      return {
        ...rowEntity,
        entityLevels:
          rowEntity.entityLevels && typeof rowEntity.entityLevels === 'string'
            ? rowEntity.entityLevels.split(',')
            : [],
      };
    }
  );

  const pointTypesByKey: Record<PointTypeKey, PointType> = await parseCsv<
    typeof PointTypeSchema
  >(
    '/incursion/imported/PointType 5a48b198234543278cf43279915248ce_all.csv',
    PointTypeSchema,
    (rowPointType) => {
      return {
        ...rowPointType,
        maxPoints:
          rowPointType.maxPoints && typeof rowPointType.maxPoints === 'string'
            ? parseInt(rowPointType.maxPoints)
            : null,
      };
    }
  );

  const subCategoriesByKey: Record<SubCategoryKey, SubCategory> =
    await parseCsv<typeof SubCategorySchema>(
      '/incursion/imported/Subcategories 74b3bfb500de4b19982b9aced3f3123d_all.csv',
      SubCategorySchema
    );

  const entityLevelsByKey: Record<EntityLevelKey, EntityLevel> = await parseCsv<
    typeof EntityLevelSchema
  >(
    '/incursion/imported/Entity Levels c6999b8546224bf58fcdcde6692517e0_all.csv',
    EntityLevelSchema,
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

async function parseCsv<SchemaType extends ZodType<any, any, any>>(
  path: string,
  parser: SchemaType,
  callback?: (result: Record<string, unknown>) => Record<string, unknown>
): Promise<Record<string, z.infer<SchemaType>>> {
  return new Promise(async (resolve) => {
    Papa.parse<Record<string, unknown>>(path, {
      download: true,
      delimiter: ',',
      header: true,
      complete: async function (results) {
        const resultsByKey = reduce(
          results.data,
          (acc, result) => {
            console.log('result', result);
            if (callback) result = callback(result);
            if (typeof result.Self !== 'string') {
              throw new Error('No Self');
            }
            const selfPaths = result.Self.match(regex);
            if (!selfPaths || selfPaths.length < 1) {
              throw new Error('Cannot parse Self');
            }
            // TODO: move the description lookup here
            const pathToSelf = `${selfPaths[0].slice(1, -1)}.md`;
            console.log('pathToSelf', pathToSelf);
            const parsedResult = parser.parse({
              ...result,
              pathToSelf,
              description: '',
            });
            if (!parsedResult.key) {
              throw new Error('key not found');
            }
            acc[parsedResult.key] = parsedResult;
            return acc;
          },
          {} as Record<string, z.infer<SchemaType>>
        );
        resolve(resultsByKey);
      },
      error: function (err) {
        throw err;
      },
    });
  });
}
