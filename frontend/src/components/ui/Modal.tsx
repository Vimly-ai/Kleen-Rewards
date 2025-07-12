/**
 * Modal Component - Enterprise Employee Rewards System
 * 
 * A sophisticated modal component with smooth animations,
 * accessibility features, and premium styling.
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { IconButton } from './Button';
import { cn } from './utils';
import type { ModalProps } from './types';

/**
 * Modal component with enterprise-grade features
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEsc = true,
    title,
    showCloseButton = true,
    centered = true,
    scrollBehavior = 'inside',
    className,
    children,
    ...props
  }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Size variants
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-none m-4',
    };

    // Focus management
    useEffect(() => {
      if (isOpen) {
        const previouslyFocusedElement = document.activeElement as HTMLElement;
        
        // Focus the modal
        setTimeout(() => {
          modalRef.current?.focus();
        }, 100);

        return () => {
          // Return focus to previously focused element
          previouslyFocusedElement?.focus();
        };
      }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
      if (!closeOnEsc || !isOpen) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEsc, isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'unset';
        };
      }
    }, [isOpen]);

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === overlayRef.current) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const modalContent = (
      <div
        ref={overlayRef}
        className={cn(
          'fixed inset-0 z-modal flex',
          {
            'items-center justify-center p-4': centered,
            'items-start justify-center pt-16 pb-4': !centered,
          }
        )}
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

        {/* Modal */}
        <div
          ref={ref || modalRef}
          className={cn(
            'relative bg-card border border-border rounded-xl shadow-2xl',
            'animate-slide-up transform transition-all duration-300',
            'focus:outline-none',
            sizeClasses[size],
            {
              'h-full': size === 'full',
              'max-h-[90vh] overflow-hidden': scrollBehavior === 'inside' && size !== 'full',
              'max-h-none': scrollBehavior === 'outside',
            },
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && (
                <h2 
                  id="modal-title" 
                  className="text-xl font-semibold text-foreground"
                >
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <IconButton
                  icon={<X className="h-5 w-5" />}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="ml-4"
                />
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn(
            'p-6',
            {
              'overflow-y-auto': scrollBehavior === 'inside',
              'max-h-[calc(90vh-8rem)]': scrollBehavior === 'inside' && (title || showCloseButton),
              'max-h-[calc(90vh-2rem)]': scrollBehavior === 'inside' && !title && !showCloseButton,
            }
          )}>
            {children}
          </div>
        </div>
      </div>
    );

    // Use portal to render modal at body level
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

/**
 * Modal Header component
 */
interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  showCloseButton = true,
  className,
}) => {
  return (
    <div className={cn(
      'flex items-center justify-between p-6 border-b border-border',
      className
    )}>
      <div className="flex-1">
        {children}
      </div>
      
      {showCloseButton && onClose && (
        <IconButton
          icon={<X className="h-5 w-5" />}
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close modal"
          className="ml-4"
        />
      )}
    </div>
  );
};

/**
 * Modal Body component
 */
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

/**
 * Modal Footer component
 */
interface ModalFooterProps {
  children: React.ReactNode;
  justify?: 'start' | 'end' | 'center' | 'between';
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  justify = 'end',
  className,
}) => {
  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  };

  return (
    <div className={cn(
      'flex items-center gap-3 p-6 border-t border-border',
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Confirmation Modal for dangerous actions
 */
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const variantConfig = {
    danger: {
      icon: '⚠️',
      confirmVariant: 'error' as const,
    },
    warning: {
      icon: '⚠️',
      confirmVariant: 'warning' as const,
    },
    info: {
      icon: 'ℹ️',
      confirmVariant: 'primary' as const,
    },
  };

  const config = variantConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{config.icon}</span>
          <p className="text-muted-foreground">
            {message}
          </p>
        </div>
      </div>

      <ModalFooter>
        <button
          onClick={onClose}
          className="btn-base btn-ghost px-4 py-2"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={cn(
            'btn-base px-4 py-2',
            config.confirmVariant === 'error' && 'bg-error-600 text-white hover:bg-error-700',
            config.confirmVariant === 'warning' && 'bg-warning-600 text-white hover:bg-warning-700',
            config.confirmVariant === 'primary' && 'btn-primary'
          )}
        >
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export type { ModalProps };