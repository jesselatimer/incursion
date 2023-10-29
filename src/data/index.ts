import Papa from 'papaparse';
import { Category, CategoryKey } from '../models/Category';
import { PointType, PointTypeKey } from '../models/PointType';
import { EntityKey, Entity } from '../models/Entity';

export * from './pointCalculators';
export * from './trueMage';
export * from './categories';
export * from './pointTypes';

export const getDataFromImport = async () => {
  const categoriesByKey: Record<CategoryKey, Category> =
    await parseCsv<Category>(
      '/incursion/imported/Incursion 12bbfa34b24149a3959e7b2fabbf0550/Categories 209902f319f64b48bc9cca434d7e449b_all.csv'
    );
  console.log('categoriesByKey', categoriesByKey);

  const entitiesByKey: Record<EntityKey, Entity> = await parseCsv<Entity>(
    '/incursion/imported/Incursion 12bbfa34b24149a3959e7b2fabbf0550/Entities ec7305ac1c814f7290ef03a1b62b6549_all.csv'
  );
  console.log('entitiesByKey', entitiesByKey);

  const pointTypesByKey: Record<PointTypeKey, PointType> =
    await parseCsv<PointType>(
      '/incursion/imported/Incursion 12bbfa34b24149a3959e7b2fabbf0550/PointType 5a48b198234543278cf43279915248ce_all.csv'
    );
  console.log('pointTypesByKey', pointTypesByKey);
};

async function parseCsv<V>(path: string): Promise<Record<string, V>> {
  return new Promise((resolve) => {
    Papa.parse<V>(path, {
      download: true,
      delimiter: ',',
      header: true,
      complete: function (results) {
        const resultsByKey = results.data.reduce((acc, category) => {
          // @ts-ignore These have a key, not sure how to convince typescript
          acc[category.key] = category;
          return acc;
        }, {} as Record<string, V>);
        resolve(resultsByKey);
      },
      error: function (err, file) {
        console.log(err, file);
        throw new Error('err parsing');
      },
    });
  });
}
