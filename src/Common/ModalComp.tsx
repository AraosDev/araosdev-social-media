import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ModalComp({
  openModalState,
  onCloseModal,
  modalSize = 'xl',
  header,
  modalBody,
  validationMsg = '',
  proceedHandler,
  proceedValidation,
  proceedLabel,
  bodyClass = '',
  shouldShowProceedBtn = true,
  titleTag = '',
}: ModalCompProps) {
  return (
    <Modal
      show={openModalState}
      onHide={onCloseModal}
      size={modalSize}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title as={titleTag}>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={bodyClass}>{modalBody()}</Modal.Body>
      {shouldShowProceedBtn && (
        <Modal.Footer>
          <div title={validationMsg}>
            <Button
              variant="primary"
              onClick={proceedHandler}
              disabled={!proceedValidation}
            >
              {proceedLabel}
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default ModalComp;
