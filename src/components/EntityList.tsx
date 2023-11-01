import '../css/App.css';
import { groupBy, map } from 'lodash';
import Entity from './Entity';
import { Choice } from '../models/Choice';
import type { Entity as EntityType } from '../models/Entity';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useContext } from 'react';
import { DataContext } from './App';
import Markdown from './Markdown';

function EntityList({
  entities,
  choices,
}: {
  entities: EntityType[];
  choices: Choice[];
}) {
  const { subCategoriesByKey, categoriesByKey, entitiesByKey } =
    useContext(DataContext);

  if (!entities?.length) return null;

  const categoryKey = entities[0].category;
  const category = categoriesByKey[categoryKey];
  const entitiesBySubCategory = groupBy(entities, 'subCategory');
  const subCategories = category.subCategories.map(
    (subCategoryKey) => subCategoriesByKey[subCategoryKey]
  );
  return (
    <Container>
      <h2>{category.label}</h2>
      {Boolean(category.description) && (
        <Markdown>{category.description}</Markdown>
      )}
      <Container>
        <Row>
          {/* Mapping over all subcategories to preserve order */}
          {map(subCategories, (subCategory) => {
            const currentEntities = entitiesBySubCategory[subCategory.key];
            if (!currentEntities?.length) return null;
            const currentEntitiesByKey = groupBy(currentEntities, 'key');
            return (
              <Row key={subCategory.label + 'Row'}>
                <h3>{subCategory.label}</h3>
                {Boolean(subCategory.description) && (
                  <Markdown>{subCategory.description}</Markdown>
                )}
                {/* Mapping over all entities to preserve order */}
                {map(entitiesByKey, (_, entityKey) => {
                  const entity = (currentEntitiesByKey[entityKey] || [])[0];
                  if (!entity) return null;
                  return (
                    <Col key={entity.key + 'Col'} style={{ maxWidth: '400px' }}>
                      <Entity
                        key={entity.key}
                        entity={entity}
                        entityKey={entity.key}
                        choices={choices}
                      />
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Row>
      </Container>
    </Container>
  );
}

export default EntityList;
