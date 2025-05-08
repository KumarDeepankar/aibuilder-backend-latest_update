import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  max-width: ${props => props.maxWidth || '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover, &:focus {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(86, 84, 162, 0.2);
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth, 
  showCloseButton = true,
  ariaLabel = "Dialog" 
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Handle focus trap
  useEffect(() => {
    if (!isOpen) return;
    
    // Save previously focused element and focus modal
    previousActiveElement.current = document.activeElement;
    
    // Find all focusable elements in the modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements?.length) {
      // Focus first element
      focusableElements[0].focus();
      
      // Trap focus inside modal
      const handleTabKey = (e) => {
        // If we're on the last focusable element and pressing Tab, go to the first
        if (!e.shiftKey && document.activeElement === focusableElements[focusableElements.length - 1]) {
          e.preventDefault();
          focusableElements[0].focus();
        } 
        // If we're on the first focusable element and pressing Shift+Tab, go to the last
        else if (e.shiftKey && document.activeElement === focusableElements[0]) {
          e.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        }
      };
      
      modalRef.current.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          handleTabKey(e);
        }
      });
    }
    
    // Prevent scrolling of body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body scrolling and focus when modal closes
      document.body.style.overflow = 'auto';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);
  
  // Don't render anything if modal is closed
  if (!isOpen) return null;
  
  // Use portal to render modal outside of the DOM hierarchy
  return ReactDOM.createPortal(
    <ModalOverlay 
      className="modal-overlay"
      onClick={(e) => {
        // Close modal when clicking the overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <ModalContent 
        ref={modalRef} 
        className="modal-content"
        maxWidth={maxWidth}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <CloseButton 
            onClick={onClose} 
            aria-label="Close dialog"
            className="modal-close-button"
          >
            ✕
          </CloseButton>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;