import { Toast, ToastContainer } from 'react-bootstrap';
import { ValidationState } from './App';

function ValidationToast({
  showValidationError,
  setShowValidationError,
}: {
  showValidationError: ValidationState;
  setShowValidationError: (showValidationError: ValidationState) => void;
}) {
  return (
    <ToastContainer
      containerPosition="fixed"
      position="bottom-center"
      style={{ zIndex: 1 }}
    >
      <Toast
        onClose={() => setShowValidationError({ show: false })}
        show={showValidationError.show}
        delay={3000}
        autohide
      >
        <Toast.Body>
          {showValidationError.show && showValidationError.message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ValidationToast;
