import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header">
    <div className="page-header-center">
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="page-header-actions">{actions}</div>}
  </div>
);

export default PageHeader;
