import Papa from 'papaparse';
import * as mdx from '@mdx-js/mdx';
import type { MDXContent } from 'mdx/types';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
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
import { reduce } from 'lodash';
import { Appendix, AppendixKey, AppendixSchema } from '../models/Appendix';
import {
  IN_WORLD_TERMS,
  IN_WORLD_TERMS_BY_PLURAL,
  CYOA_TERMS,
  CYOA_TERMS_BY_PLURAL,
} from '../data/glossary';

export type DataByKey = {
  categoriesByKey: Record<CategoryKey, Category>;
  subCategoriesByKey: Record<SubCategoryKey, SubCategory>;
  entitiesByKey: Record<EntityKey, Entity>;
  entityLevelsByKey: Record<EntityLevelKey, EntityLevel>;
  pointTypesByKey: Record<PointTypeKey, PointType>;
  appendicesByKey: Record<AppendixKey, Appendix>;
  setting?: MDXContent;
};

export const getDataFromImport = async (): Promise<DataByKey> => {
  const [
    categoriesByKey,
    entitiesByKey,
    pointTypesByKey,
    subCategoriesByKey,
    entityLevelsByKey,
    appendicesByKey,
    setting,
  ] = await Promise.all([
    parseCsv<typeof CategorySchema>(
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
          appendices:
            rowCategory.appendices && typeof rowCategory.appendices === 'string'
              ? rowCategory.appendices.split(',')
              : [],
        };
      }
    ),
    parseCsv<typeof EntitySchema>(
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
          grants:
            rowEntity.grants && typeof rowEntity.grants === 'string'
              ? rowEntity.grants.split(',')
              : [],
        };
      }
    ),
    parseCsv<typeof PointTypeSchema>(
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
    ),
    parseCsv<typeof SubCategorySchema>(
      '/incursion/imported/Subcategories 74b3bfb500de4b19982b9aced3f3123d_all.csv',
      SubCategorySchema
    ),
    parseCsv<typeof EntityLevelSchema>(
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
    ),
    parseCsv<typeof AppendixSchema>(
      '/incursion/imported/Appendices d3e0624b649b48e2970db9f9c83b3e27_all.csv',
      AppendixSchema
    ),
    fetch(
      '/incursion/imported/System & Setting 61b4b535ec174572a4419910929e7022.md'
    ),
  ]);

  let settingText = await setting.text();

  [settingText] = [settingText].map((text) =>
    text.replaceAll('jpg](', 'jpg](/incursion/imported/')
  );

  const compiledSetting = compileDescription({
    description: settingText,
    compiledDescription: undefined,
  })?.compiledDescription;

  return {
    categoriesByKey,
    subCategoriesByKey,
    entitiesByKey,
    entityLevelsByKey,
    pointTypesByKey,
    appendicesByKey,
    setting: compiledSetting,
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
        const selfPaths = reduce(
          results.data,
          (acc, result) => {
            if (callback) result = callback(result);
            if (typeof result.Self !== 'string') {
              console.error('no self', result);
              throw new Error('No Self');
            }
            const selfPaths = result.Self.match(regex);
            if (!selfPaths || selfPaths.length < 1) {
              console.error('Cannot parse Self', result);
              throw new Error('Cannot parse Self');
            }
            const pathToSelf = `${selfPaths[0].slice(1, -1)}.md`;
            return [...acc, pathToSelf];
          },
          [] as string[]
        );

        const resultsByKey: Record<string, z.infer<SchemaType>> = {};
        await Promise.all(
          selfPaths.map(async (pathToSelf, index) => {
            let result = results.data[index];
            if (callback) result = callback(result);
            if (typeof result.Self !== 'string') {
              console.error('no self', result);
              throw new Error('No Self');
            }
            try {
              const description = await fetchMarkdown(pathToSelf);
              const parsedResult: z.infer<SchemaType> = parser.parse({
                ...result,
                description,
              });
              if (!parsedResult.key) {
                console.error('key not found', parsedResult);
                throw new Error('key not found');
              }
              const compiledResult =
                compileDescription<z.infer<SchemaType>>(parsedResult);
              resultsByKey[parsedResult.key] = compiledResult;
            } catch (err) {
              console.log('Error parsing', result);
              throw err;
            }
          })
        );

        // Maintain order which was messed up by parallel fetching
        const sortedResultsByKey: Record<string, z.infer<SchemaType>> = {};
        const recordsToAddToEnd: z.infer<SchemaType>[] = [];
        results.data.forEach((result) => {
          if (!result.key || typeof result.key !== 'string')
            throw new Error('must have key');
          // Move granted entities to the end
          if (typeof result.grantedBy === 'string' && result.grantedBy !== '') {
            recordsToAddToEnd.push(resultsByKey[result.key]);
            return;
          }
          sortedResultsByKey[result.key] = resultsByKey[result.key];
        });
        recordsToAddToEnd.forEach((r) => (sortedResultsByKey[r.key] = r));
        resolve(sortedResultsByKey);
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

const compileDescription = <T extends Object>(currentResult: T) => {
  if (
    !(
      'description' in currentResult &&
      currentResult.description &&
      typeof currentResult.description === 'string'
    )
  )
    return currentResult;

  const usedKeys = new Set();

  const markdownList = currentResult.description.split(/([^a-zA-z])/);
  const modifiedMarkdown = markdownList.map((str: string) => {
    const inWorld =
      IN_WORLD_TERMS[str.toLowerCase() as keyof typeof IN_WORLD_TERMS];
    const inWorldPlural =
      IN_WORLD_TERMS_BY_PLURAL[
        str.toLowerCase() as keyof typeof IN_WORLD_TERMS
      ];
    const cyoa = CYOA_TERMS[str as keyof typeof CYOA_TERMS];
    const cyoaPlural = CYOA_TERMS_BY_PLURAL[str as keyof typeof CYOA_TERMS];

    const isPlural = Boolean(inWorldPlural || cyoaPlural);
    const keyToAdd = isPlural
      ? (inWorldPlural?.singular ?? cyoaPlural.singular).toLowerCase()
      : str.toLowerCase();

    if (usedKeys.has(keyToAdd)) {
      return str;
    } else if (inWorld || inWorldPlural) {
      const description = inWorld?.description ?? inWorldPlural.description;
      usedKeys.add(keyToAdd);
      return `<GlossaryOverlay variant="in-world" str="${str}" description={\`${description}\`}>${str}</GlossaryOverlay>`;
    } else if (cyoa || cyoaPlural) {
      const description = cyoa?.description ?? cyoaPlural.description;
      usedKeys.add(keyToAdd);
      return `<GlossaryOverlay variant="cyoa" str="${str}" description={\`${description}\`}>${str}</GlossaryOverlay>`;
    } else {
      return str;
    }
  });

  const compiledMarkdown = mdx.compileSync(modifiedMarkdown.join(''), {
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
  });

  const { default: CompiledMarkdown } = mdx.runSync(String(compiledMarkdown), {
    ...runtime,
    Fragment: 'fragment',
  });

  return { ...currentResult, compiledDescription: CompiledMarkdown };
};
