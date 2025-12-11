import React from 'react';
import './Spinner.css';

function Spinner({ size = 'medium', color = 'primary' }) {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-circle"></div>
    </div>
  );
}

export function ButtonSpinner() {
  return (
    <div className="button-spinner">
      <div className="button-spinner-circle"></div>
    </div>
  );
}

export default Spinner;
