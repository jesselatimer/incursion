import { useContext, useMemo, useState } from 'react';
import { CategoryChoicesContext, DataContext, TrueMageContext } from './App';
import { Choice } from '../models/Choice';
import { Col, Image, Row, Stack, CloseButton } from 'react-bootstrap';
import { Entity as EntityType } from '../models/Entity';
import EntityModal from './EntityModal';

function Summary({
  entity,
  choice,
  choices,
}: {
  entity: EntityType;
  choice: Choice;
  choices: Choice[];
}) {
  const { setChoices } = useContext(CategoryChoicesContext);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Row
        key={choice.entityKey + 'SummaryRow'}
        style={{
          alignItems: 'center',
          paddingBottom: '5px',
          paddingTop: '5px',
          margin: '0',
        }}
      >
        <Col sm={3} style={{ padding: 0 }}>
          <Image
            src={entity.imageUrl}
            thumbnail
            onClick={() => setShowModal(true)}
            style={{
              cursor: 'pointer',
            }}
          />
        </Col>
        <Col sm={7}>
          <Stack direction="vertical">
            <strong
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {entity.label}
              {entity.entityLevels.length > 1 ? `: ${choice.level}` : ''}
            </strong>
          </Stack>
        </Col>
        <Col sm={1}>
          {entity.subCategory !== 'potentials' && (
            <CloseButton
              onClick={() =>
                setChoices(
                  choices.filter((choice) => choice.entityKey !== entity.key),
                  entity.category
                )
              }
            />
          )}
        </Col>
      </Row>
      <EntityModal
        entity={entity}
        choices={choices}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default Summary;
