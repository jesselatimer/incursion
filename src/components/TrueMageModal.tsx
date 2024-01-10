import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { DataContext, TrueMageContext } from './App';
import { createNewTrueMage, getTrueMagesFromStorage } from '../data';
import { map } from 'lodash';
import TrueMageModalRow from './TrueMageModalRow';

function TrueMageModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  const { setTrueMage } = useContext(TrueMageContext);

  const { trueMages: trueMagesFromStorage } = getTrueMagesFromStorage();
  const [trueMages, setTrueMages] = useState(trueMagesFromStorage);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select True Mage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs="1">
            <strong>Active</strong>
          </Col>
          <Col xs="1">
            <strong>ID</strong>
          </Col>
          <Col xs="3">
            <strong>Name</strong>
          </Col>
          <Col>
            <strong>Choices</strong>
          </Col>
          <Col xs="1">
            <strong>Delete</strong>
          </Col>
        </Row>
        {map(trueMages, (trueMage) => {
          return (
            <TrueMageModalRow trueMage={trueMage} setTrueMages={setTrueMages} />
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
              setTrueMages(getTrueMagesFromStorage().trueMages);
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
