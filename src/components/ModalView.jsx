import { useState } from "react";

import { Modal, Spinner } from 'react-bootstrap';

const ModalView = ({ isProcessing, handleClose }) => {
    return (
        <Modal
            show={isProcessing}
            onHide={handleClose}
            backdrop={false}
            keyboard={false}
            centered
            size="sm"
        >
            <div style={{ textAlign: 'center' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>

                <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: '#c8c8c8' }}>
                    내보내기가 진행중입니다.
                </p>
            </div>
        </Modal>
    );
}

export default ModalView;