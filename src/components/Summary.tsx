import { useContext, useMemo } from 'react';
import { TrueMageContext } from './App';
import Container from 'react-bootstrap/Container';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { groupBy, map } from 'lodash';
import { CATEGORIES } from '../data/categories';
import { ALL_ENTITIES } from '../data/entities';
import { Card, Col, Image, Row, Stack } from 'react-bootstrap';
import { calculatePoints } from '../utils/calculatePoints';

function Summary({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const { trueMage } = useContext(TrueMageContext);
  const entitiesBySubCategory = useMemo(
    () => groupBy(ALL_ENTITIES, 'subCategory'),
    [ALL_ENTITIES]
  );
  return (
    <Container
      className="SummaryFixed"
      style={{
        position: 'fixed',
        maxWidth: '25%',
        maxHeight: 'calc(100% - 56px)',
        overflow: 'scroll',
        padding: '20px',
      }}
    >
      <h2 className="Summary-header">{trueMage.name}</h2>
      {map(CATEGORIES, (category) => {
        const choices = categoryChoices[category.key];
        if (!choices?.length) return null;
        const choicesByEntityKey = groupBy(choices, 'entityKey');
        const pointType = category.pointType;
        const pointsUsed = calculatePoints(choices, pointType?.key);
        return (
          <Card
            key={category.key + 'SummaryContainer'}
            style={{ marginTop: '10px' }}
          >
            <Card.Header>
              <Card.Title>{CATEGORIES[category.key].label}</Card.Title>
              <Card.Text>
                {Boolean(pointType) && (
                  <>
                    {pointType?.label}: {pointsUsed}/{pointType?.maxPoints}
                  </>
                )}
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {/* Mapping over all subcategories to preserve order */}
              {map(category.subCategories, (subCategory) => {
                const currentEntities = entitiesBySubCategory[subCategory];
                if (!currentEntities?.length) return null;
                const chosenEntities = currentEntities.filter(
                  (e) => !!choicesByEntityKey[e.key]
                );
                if (chosenEntities.length === 0) return null;
                return (
                  <div
                    key={subCategory + 'Summary'}
                    style={{ marginBottom: '10px' }}
                  >
                    <h4>{subCategory}</h4>
                    {/* Mapping over all entities to preserve order */}
                    {map(currentEntities, (entity) => {
                      const choice = (choicesByEntityKey[entity.key] || [])[0];
                      if (!choice) return null;
                      return (
                        <Row
                          key={choice.entityKey + 'SummaryRow'}
                          style={{
                            alignItems: 'center',
                            paddingBottom: '5px',
                            paddingTop: '5px',
                          }}
                        >
                          <Col sm={3} style={{ padding: 0 }}>
                            <Image
                              src={`/incursion/images/${entity.key}.jpg`}
                              thumbnail
                            />
                          </Col>
                          <Col sm={9}>
                            <Stack direction="vertical">
                              <strong
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {entity.label}
                                {entity.levels.length > 1
                                  ? `: ${choice.level}`
                                  : ''}
                              </strong>
                            </Stack>
                          </Col>
                        </Row>
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
  );
}

export default Summary;
