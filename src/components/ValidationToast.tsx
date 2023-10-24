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
          Not enough points to make selection. Current points:
          {showValidationError.show
            ? ` ${showValidationError.currentPoints}/${showValidationError.maxPoints}`
            : ''}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ValidationToast;
