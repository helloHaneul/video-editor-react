import { useState } from "react";

import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContainerView = ({ isShow, handleClose }) => {

    return (
        <ToastContainer className="p-3" position={'top-center'} style={{ zIndex: 1 }}>
            <Toast onClose={handleClose} show={isShow} delay={2000} bg="dark" autohide>
                <Toast.Header closeButton={false}>
                    <strong className="me-auto">Video Editor</strong>
                </Toast.Header>
                <Toast.Body>내보내기가 완료되었습니다.</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastContainerView;