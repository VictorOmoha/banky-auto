import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { site, fullAddress } from '../data/site';
import { LEGAL_UPDATED } from './PrivacyPolicy';
import './Pages.css';

function TermsOfService() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" lead={`The terms for using the ${site.legalName} website and text messaging program.`} />

      <section className="section">
        <div className="container legal">
          <article className="legal__body">
            <p className="legal__updated">Last updated: {LEGAL_UPDATED}</p>

            <p>
              These Terms of Service apply to your use of the website and text messaging services of {site.legalName} (“
              {site.name},” “we,” “us” or “our”). By using our website or opting in to our text messages, you agree to these
              terms.
            </p>

            <h2 id="sms">SMS / Text Messaging Terms</h2>
            <ol>
              <li>
                <strong>Program name and description.</strong> {site.legalName} text messages. When you opt in through our
                website’s contact form or in person, you may receive the type(s) of messages you agreed to:
                <ul>
                  <li>
                    <strong>Non-marketing (informational) messages:</strong> replies to your inquiries, appointment and test
                    drive reminders, and updates about your vehicle, financing or paperwork.
                  </li>
                  <li>
                    <strong>Marketing messages:</strong> promotions, special offers, new inventory alerts and other
                    marketing.
                  </li>
                </ul>
                Each type requires its own separate consent. Consent is not a condition of any purchase.
              </li>
              <li>
                <strong>Opting out.</strong> You can cancel the SMS service at any time. Just text <strong>STOP</strong> to
                the number that messaged you. After you send STOP, we will send you one message to confirm that you have
                been unsubscribed, and you will no longer receive SMS messages from us. To join again, sign up as you did
                the first time and we will start sending messages to you again.
              </li>
              <li>
                <strong>Help.</strong> If you are having trouble with the messaging program, reply with the keyword{' '}
                <strong>HELP</strong> for more assistance, or contact us directly at{' '}
                <a href={site.phoneHref}>{site.phone}</a> or <a href={`mailto:${site.email}`}>{site.email}</a>.
              </li>
              <li>
                <strong>Carrier liability.</strong> Carriers are not liable for delayed or undelivered messages.
              </li>
              <li>
                <strong>Rates and frequency.</strong> Message and data rates may apply for any messages sent to you from us
                and to us from you. Message frequency varies. If you have any questions about your text plan or data plan,
                it is best to contact your wireless provider.
              </li>
              <li>
                <strong>Privacy.</strong> If you have any questions regarding privacy, please read our{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>. We do not share, sell or provide your mobile information or
                messaging consent data to third parties.
              </li>
            </ol>

            <h2>Use of our website</h2>
            <p>
              You may use this website for lawful, personal purposes such as browsing our inventory and contacting us. You
              agree not to misuse the site, interfere with its operation or try to access it in unauthorized ways.
            </p>

            <h2>Vehicle information and pricing</h2>
            <p>
              We work to keep vehicle details, photos, prices and availability accurate, but errors can happen and
              inventory changes often. All vehicles are subject to prior sale. Prices do not include tax, title, license or
              dealer fees unless stated. Please confirm all details with us before purchase.
            </p>

            <h2>Financing</h2>
            <p>
              Financing is subject to credit approval by participating lenders. Submitting a credit application does not
              guarantee approval or specific terms.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              This website is provided “as is.” To the fullest extent allowed by law, {site.legalName} is not liable for any
              indirect or consequential damages arising from your use of the website or our messaging program.
            </p>

            <h2>Changes to these terms</h2>
            <p>We may update these terms from time to time. The “Last updated” date above shows when they last changed.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of the State of North Carolina.</p>

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

export default TermsOfService;
