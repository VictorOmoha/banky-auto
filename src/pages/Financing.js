import React from 'react';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import './Pages.css';

// Secure credit application hosted by DealerCenter.
const creditAppUrl =
  'https://dwssecuredforms.dealercenter.net/CreditApplication/index/29017421?themecolor=568dd9&formtype=l&frameId=dws_frame_0&standalone=true&ls=Our%20Website';

function Financing() {
  return (
    <>
      <PageHeader
        eyebrow="Financing"
        title="Apply for financing online."
        lead="Fill out our secure credit application and we’ll work with our lenders to find an option that fits you. All credit situations are welcome."
      />

      <section className="section">
        <div className="container">
          <div className="credit-app card">
            <iframe
              src={creditAppUrl}
              title="Credit application"
              className="credit-app__frame"
              scrolling="auto"
              frameBorder="0"
            />
          </div>
          <p className="credit-app__fallback muted">
            Trouble seeing the form?{' '}
            <a href={creditAppUrl} target="_blank" rel="noopener noreferrer">
              Open the credit application in a new tab <Icon name="external" size={14} />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default Financing;
