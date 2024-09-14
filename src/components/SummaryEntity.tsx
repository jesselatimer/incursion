import { useContext, useState } from 'react';
import { CategoryChoicesContext, DataContext } from './App';
import { Choice } from '../models/Choice';
import { Col, Image, Row, Stack, CloseButton } from 'react-bootstrap';
import { Entity as EntityType } from '../models/Entity';
import EntityModal from './EntityModal';

function SummaryEntity({
  entity,
  choice,
}: {
  entity: EntityType;
  choice: Choice;
}) {
  const { removeChoice } = useContext(CategoryChoicesContext);
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
          {entity.subCategory !== 'potentials' && !entity.grantedBy && (
            <CloseButton
              onClick={() => {
                if (entity.grantedBy) return;
                removeChoice({
                  entityKey: entity.key,
                });
              }}
            />
          )}
        </Col>
      </Row>
      <EntityModal
        entity={entity}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default SummaryEntity;
