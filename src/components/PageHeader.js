import React from 'react';

function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <section className="page-header">
      <div className="container">
        {eyebrow && <span className="eyebrow rise">{eyebrow}</span>}
        <h1 className="h1 rise rise-2">{title}</h1>
        {lead && <p className="lead rise rise-3">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export default PageHeader;
