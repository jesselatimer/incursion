import { Toast, ToastContainer } from 'react-bootstrap';

function ValidationToast({
  showValidationError,
  setShowValidationError,
}: {
  showValidationError: boolean;
  setShowValidationError: (showValidationError: boolean) => void;
}) {
  console.log('inside the toast');
  console.log('showValidationError', showValidationError);
  return (
    <ToastContainer
      containerPosition="fixed"
      position="bottom-center"
      style={{ zIndex: 1 }}
    >
      <Toast
        onClose={() => setShowValidationError(false)}
        show={showValidationError}
        delay={3000}
        autohide
      >
        <Toast.Body>Not enough points to make selection</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ValidationToast;
