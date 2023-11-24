import { useContext, useMemo } from 'react';
import { DataContext, TrueMageContext } from './App';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { groupBy, map } from 'lodash';
import { Accordion, Stack } from 'react-bootstrap';
import { calculatePoints } from '../utils/calculatePoints';
import SummaryEntity from './SummaryEntity';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

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

  return (
    <>
      <h2 className="Summary-header">{trueMage.name}</h2>
      <Accordion
        alwaysOpen
        className="SummaryFixed"
        style={{
          position: 'sticky',
          maxHeight: '100vh',
          overflow: 'scroll',
          padding: '0',
          top: '0',
          borderRadius: '0',
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
            <Accordion.Item
              key={category.key + 'SummaryAccordian'}
              eventKey={categoryKey}
              style={{ borderRadius: '0' }}
            >
              <Stack
                direction="horizontal"
                style={{
                  padding: '15px 10px',
                  backgroundColor: 'rgb(25, 25, 25)',
                }}
              >
                <Stack>
                  <h3>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={`category/${categoryKey}`}
                    >
                      {category.label}
                    </Link>
                  </h3>
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
                </Stack>
                <Accordion.Button
                  style={{ width: 'fit-content', backgroundColor: 'inherit' }}
                />
              </Stack>
              <Accordion.Body>
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
                      <h4>
                        <HashLink
                          style={{ textDecoration: 'none' }}
                          to={`category/${categoryKey}#${subCategory.key}`}
                        >
                          {subCategory.label}
                        </HashLink>
                      </h4>
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
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}

export default Summary;
