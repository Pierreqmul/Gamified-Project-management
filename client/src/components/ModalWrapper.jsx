import React from 'react';
import { Modal } from 'antd';

const ModalWrapper = ({ open, setOpen, children }) => {
  return (
    <Modal
      visible={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
    >
      {children}
    </Modal>
  );
};

export default ModalWrapper;
