import { useContext, useEffect, useMemo, useState } from 'react';
import { DataContext } from './App';
import { Choice } from '../models/Choice';
import { Category } from '../models/Category';
import { groupBy, map } from 'lodash';
import { Card, Collapse, Image, Stack, ToggleButton } from 'react-bootstrap';
import { calculatePoints } from '../utils/calculatePoints';
import SummaryEntity from './SummaryEntity';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import useWindowDimensions from '../utils/useWindowDimensions';

function SummaryCard({
  category,
  choices,
}: {
  category: Category;
  choices: Choice[];
}) {
  const dataByKey = useContext(DataContext);
  const {
    entitiesByKey,
    entityLevelsByKey,
    pointTypesByKey,
    subCategoriesByKey,
  } = dataByKey;

  const entitiesBySubCategory = useMemo(
    () => groupBy(entitiesByKey, 'subCategory'),
    [entitiesByKey]
  );

  const choicesByEntityKey = useMemo(
    () => groupBy(choices, 'entityKey'),
    [choices]
  );

  const pointTypeKey = category.pointType;
  const pointType = pointTypeKey ? pointTypesByKey[pointTypeKey] : null;
  const pointsUsed = useMemo(
    () =>
      calculatePoints(
        choices,
        entitiesByKey,
        entityLevelsByKey,
        pointType?.key
      ),
    [choices, entitiesByKey, entityLevelsByKey, pointType]
  );

  const location = useLocation();
  const windowDimensions = useWindowDimensions();

  const [collapsed, setCollapsed] = useState(true);

  const [hidden, setHidden] = useState(
    windowDimensions.width >= 768
      ? location.pathname !== `/category/${category.key}`
      : true
  );

  useEffect(() => {
    setHidden(location.pathname !== `/category/${category.key}`);
    // On mobile this element is at the top and defaulting to open is bad UX.
    // On destop it's on the side and it's better to default open
    if (windowDimensions.width < 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [location]);

  if (hidden) {
    return null;
  }

  return (
    <Card>
      <Card.Header
        key={category.key + 'SummaryCardAccordian'}
        style={{
          backgroundColor: 'rgb(25, 25, 25)',
          ...(collapsed ? { borderRadius: '5px', borderBottom: '0' } : {}),
        }}
      >
        <Stack direction="horizontal">
          <Stack>
            <h3>
              <Link
                style={{ textDecoration: 'none' }}
                to={`category/${category.key}`}
              >
                {category.label}
              </Link>
            </h3>
            {Boolean(pointType) && (
              <span
                style={
                  pointsUsed > (pointType?.maxPoints || 0)
                    ? { color: 'red' }
                    : {}
                }
              >
                {pointType?.label}: {pointsUsed}/{pointType?.maxPoints}
              </span>
            )}
          </Stack>
          <ToggleButton
            id={`${category.key}ToggleButton`}
            className={`SummaryCardToggleButton${
              collapsed ? ' collapsed' : ''
            }`}
            type="checkbox"
            variant="secondary"
            checked={collapsed}
            value="1"
            onChange={(e) => setCollapsed(e.currentTarget.checked)}
            style={{
              width: 'fit-content',
              backgroundColor: 'inherit',
              borderRadius: '50%',
              border: 'none',
            }}
          >
            <Image
              src="/incursion/up-chevron.png"
              style={{
                width: '25px',
                filter: 'invert(1)',
              }}
            />
          </ToggleButton>
        </Stack>
      </Card.Header>
      <Collapse in={!collapsed}>
        <div>
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
                  key={subCategory.label + 'SummaryCard'}
                  style={{ marginBottom: '10px' }}
                >
                  <h4>
                    {subCategory.key === 'thaumaturgy' ? (
                      <>{subCategory.label}</>
                    ) : (
                      <HashLink
                        style={{ textDecoration: 'none' }}
                        to={`category/${category.key}#${subCategory.key}`}
                      >
                        {subCategory.label}
                      </HashLink>
                    )}
                  </h4>
                  {/* Mapping over all entities to preserve order */}
                  {map(currentEntities, (entity) => {
                    const choice = (choicesByEntityKey[entity.key] || [])[0];
                    if (!choice) return null;
                    return (
                      <SummaryEntity
                        key={entity.key + 'SummaryEntity'}
                        entity={entity}
                        choice={choice}
                      />
                    );
                  })}
                </div>
              );
            })}
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}

export default SummaryCard;
