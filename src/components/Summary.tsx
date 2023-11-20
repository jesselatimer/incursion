import { useContext, useMemo } from 'react';
import { CategoryChoicesContext, DataContext, TrueMageContext } from './App';
import Container from 'react-bootstrap/Container';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { groupBy, map } from 'lodash';
import { Card } from 'react-bootstrap';
import { calculatePoints } from '../utils/calculatePoints';
import SummaryEntity from './SummaryEntity';

function Summary({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const dataByKey = useContext(DataContext);
  const {
    categoriesByKey,
    entitiesByKey,
    entityLevelsByKey,
    pointTypesByKey,
    subCategoriesByKey,
  } = dataByKey;

  const { trueMage } = useContext(TrueMageContext);
  const entitiesBySubCategory = useMemo(
    () => groupBy(entitiesByKey, 'subCategory'),
    [dataByKey]
  );

  const { setChoices } = useContext(CategoryChoicesContext);

  return (
    <>
      <h2 className="Summary-header">{trueMage.name}</h2>
      <Container
        className="SummaryFixed"
        style={{
          position: 'sticky',
          maxHeight: '100vh',
          overflow: 'scroll',
          padding: '0',
          top: '0',
        }}
      >
        {map(categoriesByKey, (category, categoryKey) => {
          const choices = categoryChoices[category.key];
          if (!choices?.length) return null;
          const choicesByEntityKey = groupBy(choices, 'entityKey');
          const pointTypeKey = category.pointType;
          const pointType = pointTypeKey ? pointTypesByKey[pointTypeKey] : null;
          const pointsUsed = calculatePoints(
            choices,
            entitiesByKey,
            entityLevelsByKey,
            pointType?.key
          );
          return (
            <Card
              key={category.key + 'SummaryContainer'}
              style={{ marginTop: '10px' }}
            >
              <Card.Header>
                <Card.Title>{category.label}</Card.Title>
                <Card.Text>
                  {Boolean(pointType) && (
                    <span
                      style={
                        pointsUsed > pointType!.maxPoints
                          ? { color: 'red' }
                          : {}
                      }
                    >
                      {pointType?.label}: {pointsUsed}/{pointType?.maxPoints}
                    </span>
                  )}
                </Card.Text>
              </Card.Header>
              <Card.Body>
                {/* Mapping over all subcategories to preserve order */}
                {map(category.subCategories, (subCategoryKey) => {
                  const subCategory = subCategoriesByKey[subCategoryKey];
                  const currentEntities = entitiesBySubCategory[subCategoryKey];
                  if (!currentEntities?.length) return null;
                  const chosenEntities = currentEntities.filter(
                    (e) => !!choicesByEntityKey[e.key]
                  );
                  if (chosenEntities.length === 0) return null;
                  return (
                    <div
                      key={subCategory.label + 'Summary'}
                      style={{ marginBottom: '10px' }}
                    >
                      <h4>{subCategory.label}</h4>
                      {/* Mapping over all entities to preserve order */}
                      {map(currentEntities, (entity) => {
                        const choice = (choicesByEntityKey[entity.key] ||
                          [])[0];
                        if (!choice) return null;
                        return (
                          <SummaryEntity
                            entity={entity}
                            choice={choice}
                            choices={choices}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          );
        })}
      </Container>
    </>
  );
}

export default Summary;
