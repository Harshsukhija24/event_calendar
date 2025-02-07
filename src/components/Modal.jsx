import React from "react";

const Modal = ({
  title,
  ctaText,
  onCtaClick,
  secondaryCta,
  onSecondaryCtaClick,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">{title}</div>
        <div className="modal-actions">
          {secondaryCta && (
            <button onClick={onSecondaryCtaClick} className="secondary-cta">
              {secondaryCta}
            </button>
          )}
          <button onClick={onCtaClick} className="primary-cta">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
