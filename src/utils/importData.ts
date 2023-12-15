import Papa from 'papaparse';
import { Category, CategoryKey, CategorySchema } from '../models/Category';
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
import { reduce, replace } from 'lodash';

export type DataByKey = {
  categoriesByKey: Record<CategoryKey, Category>;
  subCategoriesByKey: Record<SubCategoryKey, SubCategory>;
  entitiesByKey: Record<EntityKey, Entity>;
  entityLevelsByKey: Record<EntityLevelKey, EntityLevel>;
  pointTypesByKey: Record<PointTypeKey, PointType>;
  setting: string;
  home: string;
};

export const getDataFromImport = async (): Promise<DataByKey> => {
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
        imageUrl: `/incursion/imported/${rowEntity.Image}`,
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
        level:
          entityLevel.level && typeof entityLevel.level === 'string'
            ? parseInt(entityLevel.level)
            : undefined,
        pointCost:
          entityLevel.pointCost && typeof entityLevel.pointCost === 'string'
            ? entityLevel.pointCost === ''
              ? undefined
              : parseInt(entityLevel.pointCost)
            : undefined,
      };
    }
  );
  const home = await fetch(
    '/incursion/imported/Home fd3b42adc0dd41f093e3357f18eeb02a.md'
  );
  let homeText = await home.text();

  const setting = await fetch(
    '/incursion/imported/Setting 61b4b535ec174572a4419910929e7022.md'
  );
  let settingText = await setting.text();

  [homeText, settingText] = [homeText, settingText].map((text) =>
    text.replaceAll('jpg](', 'jpg](/incursion/imported/')
  );

  return {
    categoriesByKey,
    subCategoriesByKey,
    entitiesByKey,
    entityLevelsByKey,
    pointTypesByKey,
    setting: settingText,
    home: homeText,
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
        const resultsByKey = await reduce(
          results.data,
          async (acc, result) => {
            if (callback) result = callback(result);
            if (typeof result.Self !== 'string') {
              console.log('no self', result);
              throw new Error('No Self');
            }
            const selfPaths = result.Self.match(regex);
            if (!selfPaths || selfPaths.length < 1) {
              console.error('Cannot parse Self', result);
              throw new Error('Cannot parse Self');
            }
            const pathToSelf = `${selfPaths[0].slice(1, -1)}.md`;
            const description = await fetchMarkdown(pathToSelf);
            const parsedResult = parser.parse({
              ...result,
              description,
            });
            if (!parsedResult.key) {
              throw new Error('key not found');
            }
            return {
              ...(await acc),
              [parsedResult.key]: parsedResult,
            };
          },
          Promise.resolve({} as Record<string, z.infer<SchemaType>>)
        );
        resolve(resultsByKey);
      },
      error: function (err) {
        throw err;
      },
    });
  });
}

async function fetchMarkdown(pathToSelf: string): Promise<string | undefined> {
  try {
    const self = await fetch(`/incursion/imported/${pathToSelf}`);
    const selfString = await self.text();
    if (selfString) {
      const regex = /\[\]\(.+\.md/g;
      const matches = selfString.match(regex);
      if (matches?.length) {
        const pathToDescription = matches[0].slice(3);
        const description = await fetch(
          `/incursion/imported/${pathToDescription}`
        );
        const descriptionString = await description.text();
        return descriptionString;
      }
    }
  } catch (e) {
    console.log("Markdown file: couldn't read =>", pathToSelf, e);
    throw e;
  }
}
