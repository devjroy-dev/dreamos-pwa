// app/terms/page.tsx
// Public, server-rendered Terms of Service for The Dream Wedding.
// Meta App Review gate: the Terms of Service URL in Settings > Basic is rendered in
// the Business Login consent dialog's footer, so this must return 200 with the terms
// text in the initial HTML, no JS execution required, no auth.
// Server Component (no client directive).
//
// Design: locked house system — ink #0C0A09, gold #C9A84C, cream #F8F7F5,
// Cormorant (display) / DM Sans (body) / Jost (labels) via the root layout font vars.
// Byte-sibling of app/privacy/page.tsx: same wrapper strategy, same scale, same rhythm.
// The full-viewport cream wrapper carries explicit ink colours on the subtree so the
// global `html, body { ...dark... !important }` rule (globals.css) cannot bleed onto
// this unclassed public route.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — The Dream Wedding',
  description:
    'The terms that govern your use of The Dream Wedding’s WhatsApp-based back-office service.',
};

// Static by construction (no dynamic data). Force-static so the full text is baked
// into the served HTML — exactly what Meta's fetcher needs.
export const dynamic = 'force-static';

const EFFECTIVE_DATE = '1 September 2026';

export default function TermsOfServicePage() {
  return (
    <main className="tdw-terms">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tdw-terms {
  min-height: 100dvh;
  background: #F8F7F5;
  color: #0C0A09;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.72;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 72px 24px 96px;
  box-sizing: border-box;
}
.tdw-terms * { box-sizing: border-box; }
.tdw-terms .wrap { max-width: 680px; margin: 0 auto; }

.tdw-terms .eyebrow {
  font-family: var(--font-jost), sans-serif;
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #C9A84C;
  margin: 0 0 18px;
}
.tdw-terms h1 {
  font-family: var(--font-cormorant), Georgia, serif;
  font-weight: 500;
  font-size: 46px;
  line-height: 1.08;
  letter-spacing: 0.005em;
  color: #0C0A09;
  margin: 0 0 14px;
}
.tdw-terms .effective {
  font-size: 14px;
  color: #6B645C;
  margin: 0 0 12px;
}
.tdw-terms .lede {
  font-size: 16px;
  color: #3A342E;
  margin: 20px 0 0;
}
.tdw-terms .rule {
  height: 1px;
  background: #C9A84C;
  opacity: 0.55;
  border: 0;
  margin: 40px 0 8px;
}

.tdw-terms section { margin-top: 40px; }
.tdw-terms h2 {
  font-family: var(--font-cormorant), Georgia, serif;
  font-weight: 500;
  font-size: 25px;
  line-height: 1.2;
  color: #0C0A09;
  margin: 0 0 14px;
  display: flex;
  align-items: baseline;
  gap: 14px;
}
.tdw-terms h2 .num {
  font-family: var(--font-jost), sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #C9A84C;
  min-width: 22px;
}
.tdw-terms p { margin: 0 0 14px; color: #241F1A; }
.tdw-terms ul { margin: 0 0 14px; padding: 0; list-style: none; }
.tdw-terms li {
  position: relative;
  padding-left: 20px;
  margin: 0 0 10px;
  color: #241F1A;
}
.tdw-terms li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 12px;
  width: 5px;
  height: 5px;
  background: #C9A84C;
  border-radius: 50%;
}
.tdw-terms li strong, .tdw-terms p strong {
  font-weight: 600;
  color: #0C0A09;
}
.tdw-terms a {
  color: #0C0A09;
  text-decoration: underline;
  text-decoration-color: #C9A84C;
  text-underline-offset: 3px;
}
.tdw-terms .contact-block {
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.7;
  color: #241F1A;
}
.tdw-terms .contact-block .who {
  font-weight: 600;
  color: #0C0A09;
}
.tdw-terms .foot {
  margin-top: 56px;
  padding-top: 22px;
  border-top: 1px solid rgba(12, 10, 9, 0.12);
  font-family: var(--font-jost), sans-serif;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8A837B;
}

@media (max-width: 560px) {
  .tdw-terms { padding: 52px 20px 72px; }
  .tdw-terms h1 { font-size: 38px; }
  .tdw-terms h2 { font-size: 22px; }
}
`,
        }}
      />

      <div className="wrap">
        <p className="eyebrow">The Dream Wedding</p>
        <h1>Terms of Service</h1>
        <p className="effective">Effective date: {EFFECTIVE_DATE}</p>
        <p className="lede">
          These terms govern your use of The Dream Wedding. By using our service, you
          agree to them. They sit alongside our{' '}
          <a href="/privacy">Privacy Policy</a>, which explains how we handle your
          personal data.
        </p>

        <hr className="rule" />

        <section>
          <h2>
            <span className="num">1</span> Who we are
          </h2>
          <p>
            The Dream Wedding (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            operates an AI-assisted back-office service for the Indian wedding
            industry. We help wedding vendors &mdash; photographers, planners,
            decorators and similar businesses &mdash; and the couples and families
            they serve, primarily through WhatsApp.
          </p>
          <p>
            Our registered address is 9/1506, Lotus Boulevard, Sector 100, Noida,
            Uttar Pradesh, India.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">2</span> Who may use the service
          </h2>
          <p>
            You must be at least 18 years old and able to enter into a binding
            contract. Vendor accounts are for businesses operating lawfully in India.
            You are responsible for the accuracy of the information you give us, and
            for keeping access to your account secure.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">3</span> Your account
          </h2>
          <p>
            We sign you in using your phone number and a one-time passcode sent over
            WhatsApp. Keep control of that number. You are responsible for activity
            carried out through your account. Tell us promptly if you believe someone
            else has gained access to it.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">4</span> What the service does
          </h2>
          <p>
            We provide tools to manage bookings, client enquiries, payments, calendars
            and portfolios, and an assistant that answers messages and performs
            back-office tasks on your behalf.
          </p>
          <p>
            The assistant is automated and can make mistakes. You remain responsible
            for your commitments to your clients, for the accuracy of the quotes, dates
            and prices you confirm, and for your own compliance with applicable law.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">5</span> Messaging
          </h2>
          <p>
            We deliver messages over WhatsApp using the WhatsApp Business Platform.
            Your use of WhatsApp is also governed by Meta&rsquo;s own terms. You can
            stop receiving messages from our assistant at any time by replying{' '}
            <strong>STOP</strong> to any WhatsApp message from us, or by contacting us.
          </p>
          <p>
            If you send messages to your own clients through our service, you are
            responsible for having their consent to be contacted and for the content of
            those messages.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">6</span> Acceptable use
          </h2>
          <p>You may not use the service to:</p>
          <ul>
            <li>send unlawful, misleading, abusive or unsolicited messages;</li>
            <li>impersonate another person or business;</li>
            <li>infringe anyone&rsquo;s intellectual property rights;</li>
            <li>attempt to gain unauthorised access to our systems or data; or</li>
            <li>interfere with the operation of the service.</li>
          </ul>
          <p>
            We may suspend or terminate accounts that breach these limits.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">7</span> Fees and payments
          </h2>
          <p>
            Paid plans and their prices are shown in the app before you subscribe.
            Payments are processed by our payment processor; we do not store your full
            card or bank details. Unless stated otherwise, fees are non-refundable for
            periods already served. We may change prices with reasonable notice; a
            change does not apply to a period you have already paid for.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">8</span> Your content
          </h2>
          <p>
            You keep ownership of the content you provide &mdash; your portfolio, your
            business information and your client records. You grant us the limited
            permission needed to store, process and display that content in order to
            run the service for you. We do not sell your content, and we do not show
            one vendor another vendor&rsquo;s data.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">9</span> Third-party services
          </h2>
          <p>
            The service depends on providers including Meta Platforms, our AI model
            providers, our database provider and our payment processor, as described in
            our <a href="/privacy">Privacy Policy</a>. We are not responsible for their
            acts or for their availability.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">10</span> Availability
          </h2>
          <p>
            We aim to keep the service running, but we do not guarantee uninterrupted
            or error-free operation. We may change, suspend or discontinue features,
            and we will give reasonable notice of significant changes where we can.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">11</span> Liability
          </h2>
          <p>
            To the extent permitted by law, we are not liable for indirect or
            consequential loss, loss of profits, loss of business or loss of data.
            Nothing in these terms excludes liability that cannot lawfully be excluded.
            Where liability is limited, our total liability is capped at the fees you
            paid us in the twelve months before the claim arose.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">12</span> Ending the service
          </h2>
          <p>
            You may stop using the service and close your account at any time by
            contacting us. We may suspend or end your access if you breach these terms,
            if we are required to by law, or if we discontinue the service. How we
            handle your data after closure is described in our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">13</span> Changes to these terms
          </h2>
          <p>
            We may update these terms from time to time. When we do, we will change the
            effective date at the top of this page and, where appropriate, notify you.
            Continuing to use the service after a change means you accept the updated
            terms.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">14</span> Governing law
          </h2>
          <p>
            These terms are governed by the laws of India. The courts at Noida, Uttar
            Pradesh have jurisdiction over any dispute arising from them.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">15</span> Contact
          </h2>
          <p>
            If you have questions about these terms, please contact:
          </p>
          <div className="contact-block">
            <span className="who">The Dream Wedding</span>
            <br />
            Email:{' '}
            <a href="mailto:hello@thedreamwedding.in">hello@thedreamwedding.in</a>
            <br />
            Address: 9/1506, Lotus Boulevard, Sector 100, Noida, Uttar Pradesh, India
          </div>
        </section>

        <p className="foot">The Dream Wedding &middot; Noida, India</p>
      </div>
    </main>
  );
}
