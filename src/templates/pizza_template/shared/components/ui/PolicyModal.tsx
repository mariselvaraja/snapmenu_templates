import React from 'react';
import Modal from './Modal';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: {
    title: string;
    subtitle?: string;
    content: string;
  };
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policy }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={policy.title}
      subtitle={policy.subtitle}
    >
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
    </Modal>
  );
};

export default PolicyModal;
