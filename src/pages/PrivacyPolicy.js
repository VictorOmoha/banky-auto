import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { site, fullAddress } from '../data/site';
import './Pages.css';

export const LEGAL_UPDATED = 'November 4, 2026';

function PrivacyPolicy() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" lead={`How ${site.legalName} collects, uses and protects your information.`} />

      <section className="section">
        <div className="container legal">
          <article className="legal__body">
            <p className="legal__updated">Last updated: {LEGAL_UPDATED}</p>

            <p>
              This Privacy Policy explains how {site.legalName} (“{site.name},” “we,” “us” or “our”) handles the personal
              information you give us when you visit our website, contact us, apply for financing or sign up to receive
              text messages from us.
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li>Contact details you provide, such as your name, email address, phone number and mailing address.</li>
              <li>The contents of messages and inquiries you send us, including the vehicles you are interested in.</li>
              <li>Your text messaging consent choices, including the date, time and phone number of any opt-in or opt-out.</li>
              <li>Basic technical information your browser sends, such as device type and pages visited.</li>
            </ul>

            <h2>How we use your information</h2>
            <ul>
              <li>To answer your questions and respond to your requests.</li>
              <li>To schedule test drives and appointments and to follow up on vehicles you asked about.</li>
              <li>To send the text messages you have agreed to receive.</li>
              <li>To run, secure and improve our website and our business.</li>
              <li>To comply with the law.</li>
            </ul>

            <h2>Text messaging (SMS)</h2>
            <p>
              If you opt in, {site.legalName} may send you text messages. Marketing messages (such as promotions, new
              inventory and special offers) and non-marketing messages (such as appointment reminders, replies to your
              inquiries and updates on your vehicle or paperwork) each require their own separate consent. Consent is not a
              condition of any purchase.
            </p>
            <p>
              Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to opt out at any time
              or <strong>HELP</strong> for assistance. See our <Link to="/terms-of-use">Terms of Service</Link> for the full
              SMS terms.
            </p>

            <div className="legal__callout">
              <h2>We do not share your mobile information</h2>
              <p>
                No mobile information will be shared with third parties or affiliates for marketing or promotional
                purposes. Text messaging originator opt-in data and consent will not be shared with, sold to or provided to
                any third parties. All of the above categories exclude text messaging originator opt-in data and consent;
                this information will not be shared with any third parties.
              </p>
            </div>

            <h2>How we share information</h2>
            <p>
              <strong>We do not sell, rent or trade your personal information.</strong> We do not share, sell or provide
              your personal information (PII) or your messaging consent data to third parties for their own marketing or
              any other purpose. We share information only:
            </p>
            <ul>
              <li>
                With service providers who help us run our business (for example, website hosting or the messaging platform
                that delivers our texts). They may use the information only to provide services to us and may not use or
                share it for any other purpose.
              </li>
              <li>
                With a lender, only when you choose to submit a credit application, and only to process that application.
              </li>
              <li>When required by law, or to protect the rights, property or safety of our customers or our business.</li>
            </ul>

            <h2>How we protect your information</h2>
            <p>
              We use reasonable administrative, technical and physical safeguards to protect your information. No method of
              transmission over the internet is completely secure, but we work to keep your information safe.
            </p>

            <h2>Your choices</h2>
            <ul>
              <li>Reply STOP to any text message to stop receiving texts from us.</li>
              <li>Ask us to update or delete the personal information we hold about you.</li>
              <li>Ask us to stop contacting you by email or phone.</li>
            </ul>

            <h2>Children’s privacy</h2>
            <p>Our website and services are not directed to children under 13, and we do not knowingly collect their information.</p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy from time to time. The “Last updated” date above shows when it last changed.</p>

            <h2>Contact us</h2>
            <p>
              {site.legalName}
              <br />
              {fullAddress}
              <br />
              Phone: <a href={site.phoneHref}>{site.phone}</a>
              <br />
              Email: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicy;
