import {
  Button,
  Col,
  FormCheck,
  Image,
  Modal,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from 'react-bootstrap';
import { useContext } from 'react';
import { DataContext, TrueMageContext } from './App';
import {
  createNewTrueMage,
  getTrueMagesFromStorage,
  initialChoices,
  getChoicesFromLocalStorage,
  updateTrueMage,
} from '../data';
import { flatten, map } from 'lodash';
import { CategoryKey } from '../models/Category';
import { Choice } from '../models/Choice';

function TrueMageModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  const { entitiesByKey } = useContext(DataContext);
  const { setTrueMage } = useContext(TrueMageContext);

  const { trueMages } = getTrueMagesFromStorage();

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select True Mage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* TODO: set buttons to select active true mage */}
          <Col xs="1">
            <strong>Active</strong>
          </Col>
          <Col xs="1">
            <strong>ID</strong>
          </Col>
          <Col xs="2">
            <strong>Name</strong>
          </Col>
          <Col>
            <strong>Choices</strong>
          </Col>
        </Row>
        {map(trueMages, (trueMage) => {
          const categoryChoices: Record<CategoryKey, Choice[]> =
            getChoicesFromLocalStorage(trueMage) || initialChoices;
          const flatChoices = flatten(Object.values(categoryChoices));
          return (
            <Row
              style={{
                alignItems: 'center',
              }}
            >
              {/* TODO: set buttons to select active true mage */}
              <Col xs="1">
                <FormCheck
                  type="radio"
                  id={'checkbox-' + trueMage.id}
                  disabled={trueMage.isActive}
                  checked={trueMage.isActive}
                  onClick={() => {
                    updateTrueMage({
                      ...trueMage,
                      isActive: true,
                    });
                    setTrueMage(trueMage);
                  }}
                />
              </Col>
              <Col xs="1">{trueMage.id}</Col>
              <Col xs="2">{trueMage.name}</Col>
              <Col>
                <Stack direction="horizontal">
                  {map(flatChoices, (choice) => {
                    const entity = entitiesByKey[choice.entityKey];
                    const renderTooltip = (props: Record<string, any>) => (
                      <Tooltip id="button-tooltip" {...props}>
                        {entity.label}
                        <br />
                        Level {choice.level}/{entity.entityLevels.length}
                      </Tooltip>
                    );

                    return (
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 50 }}
                        overlay={renderTooltip}
                      >
                        <Image
                          src={entity.imageUrl}
                          rounded
                          style={{
                            width: '30px',
                            height: '30px',
                            margin: '5px',
                          }}
                        />
                      </OverlayTrigger>
                    );
                  })}
                </Stack>
              </Col>
            </Row>
          );
        })}
        <div
          className="d-grid gap-2"
          style={{
            marginTop: '15px',
          }}
        >
          <Button
            size="lg"
            onClick={() => {
              const trueMage = createNewTrueMage();
              setTrueMage(trueMage);
            }}
          >
            Create New
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default TrueMageModal;
