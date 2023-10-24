import { useContext } from 'react';
import { TrueMageContext } from './App';
import Container from 'react-bootstrap/Container';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { groupBy, map } from 'lodash';
import { CATEGORIES } from '../data/categories';
import { ALL_ENTITIES } from '../data/entities';
import { Col, Image, Row, Stack } from 'react-bootstrap';

function Summary({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const { trueMage } = useContext(TrueMageContext);

  return (
    <Container className="Summary">
      <h2 className="Summary-header">{trueMage.name}</h2>
      {map(CATEGORIES, (category) => {
        const choices = categoryChoices[category.key];
        if (!choices?.length) return null;
        const choicesByEntityKey = groupBy(choices, 'entityKey');
        return (
          <Container key={category.key + 'SummaryContainer'}>
            <h3>{CATEGORIES[category.key].label}</h3>
            {map(ALL_ENTITIES, (entity, entityKey) => {
              const choice = (choicesByEntityKey[entityKey] || [])[0];
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
          </Container>
        );
      })}
    </Container>
  );
}

export default Summary;
