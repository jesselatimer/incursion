import { flatten, groupBy, map } from 'lodash';
import Container from 'react-bootstrap/Container';
import { useContext, useMemo, useState } from 'react';
import { CategoryChoicesContext, DataContext } from './App';
import { Card } from 'react-bootstrap';
import EntityModal from './EntityModal';
import { EntityKey } from '../models/Entity';

// TODO: Add character export
function CharacterPage() {
  const { categoriesByKey, entitiesByKey } = useContext(DataContext);
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

  const [modalEntity, setModalEntity] = useState<EntityKey | undefined>(
    undefined
  );

  return (
    <Container fluid>
      <h1>True Mage Summary</h1>
      {map(categoriesByKey, (category) => {
        const choices = categoryChoices[category.key];
        if (!choices?.length) return null;

        return (
          <div
            style={{ marginTop: '30px' }}
            key={category.key + 'CharacterCategory'}
          >
            <h2>{category.label}</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(28vw, 1fr))',
                gridGap: '1em',
              }}
            >
              {/* Mapping over all subcategories to preserve order */}
              {map(category.subCategories, (subCategoryKey) => {
                const entitiesForSubcategory =
                  entitiesBySubCategory[subCategoryKey];
                return map(entitiesForSubcategory, (entity) => {
                  if (!allChoiceKeys.has(entity.key)) return null;
                  const choice = choices.find(
                    (choice) => choice.entityKey === entity.key
                  );
                  if (!choice) return null;
                  return (
                    <Card
                      onClick={() => setModalEntity(entity.key)}
                      style={{ cursor: 'pointer' }}
                      key={entity.key + 'CharacterCard'}
                    >
                      <Card.Header as="h5" style={{ textAlign: 'center' }}>
                        {entity.label}
                      </Card.Header>
                      <Card.Img src={entity.imageUrl} />
                      <Card.Footer style={{ textAlign: 'center' }}>
                        Level {choice.level}/{entity.entityLevels.length}
                      </Card.Footer>
                    </Card>
                  );
                });
              })}
            </div>
          </div>
        );
      })}
      {modalEntity && (
        <EntityModal
          entity={entitiesByKey[modalEntity]}
          showModal={Boolean(modalEntity)}
          setShowModal={() => setModalEntity(undefined)}
        />
      )}
    </Container>
  );
}

export default CharacterPage;
