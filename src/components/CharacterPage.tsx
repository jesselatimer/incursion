import { flatten, groupBy, map } from 'lodash';
import Container from 'react-bootstrap/Container';
import { useContext, useMemo } from 'react';
import { CategoryChoicesContext, DataContext } from './App';
import { Card, Col, Row } from 'react-bootstrap';

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
    <Container fluid>
      <h1>True Mage Summary</h1>
      {map(categoriesByKey, (category) => {
        const choices = categoryChoices[category.key];
        if (!choices?.length) return null;

        return (
          <>
            <h2>{category.label}</h2>
            <Row>
              {/* Mapping over all subcategories to preserve order */}
              {map(category.subCategories, (subCategoryKey) => {
                const subCategory = subCategoriesByKey[subCategoryKey];
                const entitiesForSubcategory =
                  entitiesBySubCategory[subCategoryKey];
                return (
                  <Col
                    key={subCategory.label + 'Col'}
                    id={subCategory.key}
                    xs={12 / Math.min(category.subCategories.length, 3)}
                  >
                    <h3>{subCategory.label}</h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fill, minmax(28vw, 1fr))',
                        gridGap: '1em',
                      }}
                    >
                      {/* Mapping over all entities to preserve order */}
                      {map(entitiesForSubcategory, (entity) => {
                        if (!allChoiceKeys.has(entity.key)) return null;
                        const choice = choices.find(
                          (choice) => choice.entityKey === entity.key
                        );
                        if (!choice) return null;
                        return (
                          <Card>
                            <Card.Header
                              as="h5"
                              style={{ textAlign: 'center' }}
                            >
                              {entity.label}
                            </Card.Header>
                            <Card.Img src={entity.imageUrl} />
                            <Card.Footer style={{ textAlign: 'center' }}>
                              Level {choice.level}/{entity.entityLevels.length}
                            </Card.Footer>
                          </Card>
                        );
                      })}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
        );
      })}
    </Container>
  );
}

export default CharacterPage;
