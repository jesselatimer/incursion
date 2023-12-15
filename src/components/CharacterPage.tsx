import { flatten, groupBy, map } from 'lodash';
import Entity from './Entity';
import Container from 'react-bootstrap/Container';
import { useContext, useMemo } from 'react';
import { CategoryChoicesContext, DataContext } from './App';
import { Stack } from 'react-bootstrap';

// TODO: improve this component
// TODO: Add character export
function CharacterPage() {
  const { subCategoriesByKey, categoriesByKey, entitiesByKey } =
    useContext(DataContext);
  const { categoryChoices } = useContext(CategoryChoicesContext);

  const entitiesBySubCategory = useMemo(
    () => groupBy(entitiesByKey, 'subCategory'),
    [entitiesByKey]
  );

  const allChoiceKeys = useMemo(() => {
    return new Set(
      flatten(
        map(categoryChoices, (choices) =>
          choices.map((choice) => choice.entityKey)
        )
      )
    );
  }, [categoryChoices]);

  return (
    <Container>
      {map(categoriesByKey, (category) => {
        const choices = categoryChoices[category.key];
        if (!choices?.length) return null;

        return (
          <>
            <h2>{category.label}</h2>
            {/* Mapping over all subcategories to preserve order */}
            {map(category.subCategories, (subCategoryKey) => {
              const subCategory = subCategoriesByKey[subCategoryKey];
              const entitiesForSubcategory =
                entitiesBySubCategory[subCategoryKey];
              return (
                <div key={subCategory.label + 'div'} id={subCategory.key}>
                  <h3>{subCategory.label}</h3>
                  <Stack gap={3} style={{ marginBottom: '15px' }}>
                    {/* Mapping over all entities to preserve order */}
                    {map(entitiesForSubcategory, (entity) => {
                      if (!allChoiceKeys.has(entity.key)) return null;
                      return (
                        <Entity
                          key={entity.key}
                          entity={entity}
                          choices={choices}
                          style={'list'}
                        />
                      );
                    })}
                  </Stack>
                </div>
              );
            })}
          </>
        );
      })}
    </Container>
  );
}

export default CharacterPage;
