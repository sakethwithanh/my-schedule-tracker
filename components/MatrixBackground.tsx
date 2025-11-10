import React from 'react';

const MatrixColumn: React.FC = () => <div className="matrix-column"></div>;

const MatrixPattern: React.FC = () => (
  <div className="matrix-pattern">
    {Array.from({ length: 40 }).map((_, i) => (
      <MatrixColumn key={i} />
    ))}
  </div>
);

export const MatrixBackground: React.FC = () => {
  return (
    <div className="matrix-container" aria-hidden="true">
      {/* Render enough patterns to cover very wide screens */}
      <MatrixPattern />
      <MatrixPattern />
      <MatrixPattern />
      <MatrixPattern />
      <MatrixPattern />
    </div>
  );
};
