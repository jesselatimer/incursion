import { flatten, groupBy, map } from 'lodash';
import Container from 'react-bootstrap/Container';
import { useContext, useMemo, useState } from 'react';
import { CategoryChoicesContext, DataContext, TrueMageContext } from './App';
import { Button, Card, Col, Row } from 'react-bootstrap';
import EntityModal from './EntityModal';
import { EntityKey } from '../models/Entity';
import CharacterMarkdown from './CharacterMarkdown';

// TODO: Add character export
function CharacterPage() {
  const { categoriesByKey, entitiesByKey } = useContext(DataContext);
  const { categoryChoices } = useContext(CategoryChoicesContext);
  const { trueMage } = useContext(TrueMageContext);

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

  const [showCharacterMarkdown, setCharacterMarkdown] =
    useState<boolean>(false);

  return (
    <Container fluid>
      <h1>{trueMage.name}</h1>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <CharacterMarkdown />
        </Col>
        <Col>
          {map(categoriesByKey, (category) => {
            const choices = categoryChoices[category.key];
            if (!choices?.length) return null;

            return (
              <Card
                key={category.key + 'CharacterCategory'}
                style={{ marginBottom: '15px' }}
              >
                <Card.Header>
                  <h2>{category.label}</h2>
                </Card.Header>
                <Card.Body>
                  {/* TODO: Fix this grid on mobile */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(15vw, 1fr))',
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
                      });
                    })}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </Col>
      </Row>
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
