import { Entity as EntityModel } from '../models/Entity';
import { CloseButton, Modal } from 'react-bootstrap';
import Entity from './Entity';

function EntityModal({
  entity,
  showModal,
  setShowModal,
}: {
  entity: EntityModel;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <CloseButton
        onClick={() => setShowModal(false)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          backgroundColor: 'white',
          borderRadius: '99px',
          zIndex: '1000000',
          padding: '7px',
        }}
      />
      <Modal.Body style={{ padding: '0' }}>
        <Entity entity={entity} />
      </Modal.Body>
    </Modal>
  );
}

export default EntityModal;
