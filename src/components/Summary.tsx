import { useContext, useMemo } from 'react';
import { TrueMageContext } from './App';
import Container from 'react-bootstrap/Container';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { groupBy, map } from 'lodash';
import { CATEGORIES } from '../data/categories';
import { ALL_ENTITIES } from '../data/entities';
import { Col, Image, Row, Stack } from 'react-bootstrap';
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
    <Container className="Summary">
      <h2 className="Summary-header">{trueMage.name}</h2>
      {map(CATEGORIES, (category) => {
        const choices = categoryChoices[category.key];
        if (!choices?.length) return null;
        const choicesByEntityKey = groupBy(choices, 'entityKey');
        const pointType = category.pointType;
        const pointsUsed = calculatePoints(choices, pointType?.key);
        return (
          <Container key={category.key + 'SummaryContainer'}>
            ---------
            <h3>-{CATEGORIES[category.key].label}</h3>
            {pointType ? (
              <p>
                {pointType?.label}: {pointsUsed}/{pointType?.startingValue}
              </p>
            ) : null}
            {/* Mapping over all subcategories to preserve order */}
            {map(category.subCategories, (subCategory) => {
              const currentEntities = entitiesBySubCategory[subCategory];
              if (!currentEntities?.length) return null;
              const chosenEntities = currentEntities.filter(
                (e) => !!choicesByEntityKey[e.key]
              );
              if (chosenEntities.length === 0) return null;
              return (
                <div key={subCategory + 'Summary'}>
                  <h4>--{subCategory}</h4>
                  {/* Mapping over all entities to preserve order */}
                  {map(currentEntities, (entity) => {
                    const choice = (choicesByEntityKey[entity.key] || [])[0];
                    if (!choice) return null;
                    return (
                      <Row key={choice.entityKey + 'SummaryRow'}>
                        <Col sm={4}>
                          <Image
                            src={
                              entity.imageUrl ||
                              'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F456%2F164%2Foriginal%2Fvector-question-mark.jpg&f=1&nofb=1&ipt=959dad5e7755c1955a39aceef2008d08b5277a30bdbf5582b19d504482ebee9a&ipo=images'
                            }
                            thumbnail
                          />
                        </Col>
                        <Col>
                          <Stack direction="vertical">
                            <strong>
                              {entity.label}
                              {choice.value > 1 ? `: ${choice.value}` : ''}
                            </strong>
                          </Stack>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              );
            })}
          </Container>
        );
      })}
    </Container>
  );
}

export default Summary;
