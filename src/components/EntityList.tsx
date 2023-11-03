import '../css/App.css';
import { filter, groupBy, map } from 'lodash';
import Entity from './Entity';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useContext, useMemo } from 'react';
import { CategoryChoicesContext, DataContext } from './App';
import Markdown from './Markdown';
import { useLoaderData } from 'react-router-dom';
import { EntityListArgs } from '..';

function EntityList() {
  const { subCategoriesByKey, categoriesByKey, entitiesByKey } =
    useContext(DataContext);
  const { categoryChoices } = useContext(CategoryChoicesContext);
  const { categoryKey } = useLoaderData() as EntityListArgs['params'];

  const entities = useMemo(
    () => filter(entitiesByKey, (entity) => entity.category === categoryKey),
    [categoryKey]
  );

  if (!entities?.length) return null;
  if (!categoryKey) return null;

  const choices = categoryChoices[categoryKey] || [];
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
                    <Col
                      key={entity.key + 'Col'}
                      style={{ maxWidth: '400px', minWidth: '300px' }}
                    >
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
