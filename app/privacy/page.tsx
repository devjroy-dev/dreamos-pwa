// app/privacy/page.tsx
// Public, server-rendered Privacy Policy for The Dream Wedding.
// Meta app-publish gate: must return 200 with the policy text in the initial HTML,
// no JS execution required, no auth. This is a Server Component (no client directive).
//
// Design: locked house system — ink #0C0A09, gold #C9A84C, cream #F8F7F5,
// Cormorant (display) / DM Sans (body) / Jost (labels) via the root layout font vars.
// The page renders a self-covering full-viewport cream wrapper with explicit ink
// colours on the subtree, so the global `html, body { ...dark... !important }` rule
// (globals.css) cannot bleed onto this unclassed public route.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — The Dream Wedding',
  description:
    'How The Dream Wedding collects, uses, processes and protects your personal data.',
};

// Static by construction (no dynamic data). Force-static so the full text is baked
// into the served HTML — exactly what Meta's fetcher needs.
export const dynamic = 'force-static';

const EFFECTIVE_DATE = '29 September 2026';

export default function PrivacyPolicyPage() {
  return (
    <main className="tdw-privacy">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.tdw-privacy {
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
.tdw-privacy * { box-sizing: border-box; }
.tdw-privacy .wrap { max-width: 680px; margin: 0 auto; }

.tdw-privacy .eyebrow {
  font-family: var(--font-jost), sans-serif;
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #C9A84C;
  margin: 0 0 18px;
}
.tdw-privacy h1 {
  font-family: var(--font-cormorant), Georgia, serif;
  font-weight: 500;
  font-size: 46px;
  line-height: 1.08;
  letter-spacing: 0.005em;
  color: #0C0A09;
  margin: 0 0 14px;
}
.tdw-privacy .effective {
  font-size: 14px;
  color: #6B645C;
  margin: 0 0 12px;
}
.tdw-privacy .lede {
  font-size: 16px;
  color: #3A342E;
  margin: 20px 0 0;
}
.tdw-privacy .rule {
  height: 1px;
  background: #C9A84C;
  opacity: 0.55;
  border: 0;
  margin: 40px 0 8px;
}

.tdw-privacy section { margin-top: 40px; }
.tdw-privacy h2 {
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
.tdw-privacy h2 .num {
  font-family: var(--font-jost), sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #C9A84C;
  min-width: 22px;
}
.tdw-privacy p { margin: 0 0 14px; color: #241F1A; }
.tdw-privacy ul { margin: 0 0 14px; padding: 0; list-style: none; }
.tdw-privacy li {
  position: relative;
  padding-left: 20px;
  margin: 0 0 10px;
  color: #241F1A;
}
.tdw-privacy li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 12px;
  width: 5px;
  height: 5px;
  background: #C9A84C;
  border-radius: 50%;
}
.tdw-privacy li strong, .tdw-privacy p strong {
  font-weight: 600;
  color: #0C0A09;
}
.tdw-privacy a {
  color: #0C0A09;
  text-decoration: underline;
  text-decoration-color: #C9A84C;
  text-underline-offset: 3px;
}
.tdw-privacy .contact-block {
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.7;
  color: #241F1A;
}
.tdw-privacy .contact-block .who {
  font-weight: 600;
  color: #0C0A09;
}
.tdw-privacy .foot {
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
  .tdw-privacy { padding: 52px 20px 72px; }
  .tdw-privacy h1 { font-size: 38px; }
  .tdw-privacy h2 { font-size: 22px; }
}
`,
        }}
      />

      <div className="wrap">
        <p className="eyebrow">The Dream Wedding</p>
        <h1>Privacy Policy</h1>
        <p className="effective">Effective date: {EFFECTIVE_DATE}</p>
        <p className="lede">
          This policy explains what personal data The Dream Wedding collects, how we
          use and process it, who we share it with, and the choices and rights you
          have. It applies to everyone who uses our WhatsApp-based assistant and
          related services.
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
            For the purposes of India&rsquo;s Digital Personal Data Protection Act,
            2023 (the &ldquo;DPDP Act&rdquo;), The Dream Wedding is the Data Fiduciary
            responsible for the personal data described here. Our registered address
            is 9/1506, Lotus Boulevard, Sector 100, Noida, Uttar Pradesh, India.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">2</span> Information we collect
          </h2>
          <ul>
            <li>
              <strong>Contact details</strong> &mdash; your WhatsApp phone number, and
              your name where you provide it.
            </li>
            <li>
              <strong>Message content</strong> &mdash; the content of the WhatsApp
              messages you exchange with our assistant, including text and any details
              you share about your wedding, enquiries or business.
            </li>
            <li>
              <strong>Wedding and planning data</strong> &mdash; wedding dates, venues,
              planning details, and information about your couple or planning circle
              where you choose to share it.
            </li>
            <li>
              <strong>Vendor business data</strong> &mdash; for vendor users, your
              business profile, portfolio, pricing, availability and enquiry records.
            </li>
            <li>
              <strong>Payment metadata</strong> &mdash; records of transactions and
              subscription status. We do not store your full card or bank credentials;
              those are handled by our payment processor.
            </li>
            <li>
              <strong>Technical data</strong> &mdash; basic delivery and diagnostic
              information needed to run the messaging service reliably, such as message
              delivery status and timestamps.
            </li>
          </ul>
          {/* WEB-8 (CE-47): the founder's paragraph for the website enquiry box, word for word; CE-47 ruling 5: the contact address is in section 14, so the paragraph says where it is. */}
          <p id="website-enquiries">
            <strong>{"Enquiries sent from a vendor's website."}</strong>{" "}
            {"When you send an enquiry through the enquiry box on a vendor's website made with The Dream Wedding, we collect your name, your mobile number with its country code, the occasion, the date if you give one, the page you were on, and any messages you write in the box. We pass them to that vendor only, so the vendor, and the assistant answering on the vendor's behalf, can reply to your enquiry; we do not use them for anything else and we do not sell them. We keep them for as long as the vendor keeps the enquiry in their records with us, and for no more than 90 days after the vendor closes their account. To have them removed, write to us at the contact address in the Grievance officer and contact section of this page, or follow the steps under Deleting your data, and we will remove them from our records and ask the vendor to do the same."}
          </p>
        </section>

        <section>
          <h2>
            <span className="num">3</span> How we use your information
          </h2>
          <ul>
            <li>
              To operate the assistant that answers your messages and performs
              back-office tasks on your behalf.
            </li>
            <li>To create and maintain your account, vendor profile, or couple circle.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To improve the reliability and quality of the service.</li>
            <li>
              To communicate with you about the service, and to respond to your
              requests and grievances.
            </li>
            <li>To comply with applicable law.</li>
          </ul>
          <p>
            We process your personal data on the basis of your consent, and where
            applicable to perform the service you have asked us to provide and to meet
            our legal obligations.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">4</span> How your data is processed and shared
          </h2>
          <p>
            Our service depends on a small number of trusted providers who process
            personal data on our instructions:
          </p>
          <ul>
            <li>
              <strong>Meta Platforms (WhatsApp, Instagram and Facebook)</strong>: the
              messaging and ads channels. Messages to and from the assistant travel
              through Meta&rsquo;s infrastructure and are subject to Meta&rsquo;s own terms
              and privacy practices.
            </li>
            <li>
              <strong>Anthropic and DeepSeek</strong>: AI model providers. The content of
              your messages is sent to these providers so the assistant can understand and
              respond. They process this content to generate replies and do not use it to
              contact you directly.
            </li>
            <li>
              <strong>Supabase</strong>: our database provider, where your account data and
              message records are stored.
            </li>
            <li>
              <strong>Cloudinary</strong>: where portfolio photos are stored.
            </li>
            <li>
              <strong>Railway</strong>: which hosts our servers.
            </li>
            <li>
              <strong>Razorpay</strong>: our payment processor, which handles payment and
              card or bank details when you transact.
            </li>
          </ul>
          <p>
            We previously used Twilio as a messaging provider; that integration is no
            longer active.
          </p>
          <p>
            We do not sell your personal data. We share it only with the providers above,
            as needed to run the service, or where we are required to do so by law or valid
            legal process. Some of these providers may process data on servers located
            outside India; where that happens, we take reasonable steps to ensure your data
            stays protected in line with this policy and applicable law.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">5</span> Your Google account
          </h2>
          <p>
            If you connect your Google account to your vendor account, we access it
            only with your consent, through Google&rsquo;s official APIs. We read the
            search performance of websites you own &mdash; the searches people used to
            find your pages, and how those pages ranked in Google Search &mdash; and we
            confirm that you own a site before we read anything about it. We show that
            information to you in your own account and use it for nothing else. Your
            Google access tokens are encrypted at rest. We never act on an account you
            have not connected. We do not sell Google account data, we do not use it for
            advertising, and we do not use it to train any AI or machine-learning model.
            We do not share it with anyone. You can disconnect at any time from your
            account settings, or revoke our access directly from your Google account.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">6</span> Your Instagram and Facebook accounts
          </h2>
          <p>
            If you are a vendor, you can connect your Instagram professional account, and
            for ads your Facebook Page and ad account. We connect only when you ask us to,
            through Meta&rsquo;s own login, and we use only what the feature you turned on
            needs.
          </p>
          <p>
            <strong>Portfolio import.</strong> We read your Instagram profile and your
            photos and videos so you can choose which ones to copy into your portfolio.
            Nothing is copied until you pick it, and what you pick stays in your portfolio
            until you remove it.
          </p>
          <p>
            <strong>Instagram messages.</strong> When you turn this on, we read the direct
            messages people send to your Instagram account and reply to them in your
            studio&rsquo;s name. We reply only to people who have messaged you first. We
            save the details of each enquiry to your leads so you can take over. If someone
            asks whether they are talking to a person, the reply says it is an automated
            assistant answering for your studio.
          </p>
          <p>
            <strong>Posts and ads.</strong> If you run ads through us, we read the Facebook
            Pages and business portfolios you manage, your ad accounts, your posts and the
            results of your ads, so we can create your ads and show you how they are doing.
          </p>
          <p>
            To write replies, the text of Instagram messages is sent to the AI providers
            named in &ldquo;How your data is processed and shared&rdquo;. We store messages,
            enquiries and imported photos with the providers named there. We do not sell
            any of this data, we do not use it for any advertising other than the ads you
            choose to run, and we do not use it to train any AI or machine-learning model.
          </p>
          <p>
            You can turn off Instagram messages at any time in &ldquo;WhatsApp and
            Instagram&rdquo;, disconnect Instagram from your Portfolio page, and disconnect
            your ad account in Posts &amp; ads. When you disconnect, we delete the access Meta
            gave us. Removing The Dream Wedding from your Instagram or Facebook settings also
            ends our access.
          </p>
          <p>
            If you have messaged a vendor on Instagram and the reply came from us, we handle
            your messages on the vendor&rsquo;s behalf, only to answer your enquiry and pass
            it to the vendor. Reply STOP to stop automated replies. To have your messages
            deleted, see <a href="#deleting-your-data">&ldquo;Deleting your data&rdquo;</a>.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">7</span> Data retention
          </h2>
          <p>
            We keep your personal data for as long as your account is active and for as
            long as needed to provide the service, comply with our legal obligations,
            resolve disputes and enforce our agreements. When data is no longer
            required, we delete or anonymise it. You may ask us to erase your data as
            described below.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">8</span> Your rights
          </h2>
          <p>
            Subject to the DPDP Act and other applicable law, you have the right to:
          </p>
          <ul>
            <li>access the personal data we hold about you;</li>
            <li>request correction or updating of inaccurate or incomplete data;</li>
            <li>request erasure of your personal data;</li>
            <li>
              withdraw consent you have given (this does not affect processing already
              carried out);
            </li>
            <li>
              nominate another individual to exercise your rights in the event of death
              or incapacity; and
            </li>
            <li>raise a grievance about how your data is handled.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:hello@thedreamwedding.in">hello@thedreamwedding.in</a>. We
            will respond within the timelines required by applicable law.
          </p>
        </section>

        <section id="deleting-your-data">
          <h2>
            <span className="num">9</span> Deleting your data
          </h2>
          <p>You can delete your data yourself, or ask us to.</p>
          <p>
            <strong>Your Instagram or Facebook connection.</strong> Disconnect Instagram
            from your Portfolio page, or disconnect your ad account in Posts &amp; ads. We
            delete the access Meta gave us and the account identifier we hold. You can also remove The Dream Wedding in Instagram&rsquo;s settings, under
            apps and websites, or in Facebook&rsquo;s settings.
          </p>
          <p>
            <strong>Photos.</strong> Remove any photo from your Portfolio page. Photos you
            imported from Instagram stay in your portfolio after you disconnect, until you
            remove them.
          </p>
          <p>
            <strong>Instagram messages and enquiries.</strong> Turning off Instagram messages
            stops new replies. Messages already exchanged and enquiries already saved stay in
            your account. To have them deleted, write to us as below.
          </p>
          <p>
            <strong>Your whole account.</strong> Write to{' '}
            <a href="mailto:hello@thedreamwedding.in">hello@thedreamwedding.in</a> from the
            email address on your account, or give us the phone number you sign in with, and
            say that you want your account deleted. We will confirm the request with you, then
            delete your account and the data in it within 30 days, except records the law
            requires us to keep, such as payment and tax records.
          </p>
          <p>
            <strong>If you are not a Dream Wedding user.</strong> If you messaged a vendor on
            WhatsApp or Instagram and the reply came from us, write to{' '}
            <a href="mailto:hello@thedreamwedding.in">hello@thedreamwedding.in</a> with your
            phone number or Instagram username, and we will delete your messages within 30
            days.
          </p>
          <p>
            <strong>If you asked Meta to delete your data.</strong> After a deletion request
            through Instagram or Facebook, the page Meta shows you tells you what we deleted.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">10</span> Stopping messages
          </h2>
          <p>
            You can stop receiving messages from our assistant at any time by replying{' '}
            <strong>STOP</strong> to any WhatsApp message from us. You may also contact
            us at <a href="mailto:hello@thedreamwedding.in">hello@thedreamwedding.in</a>{' '}
            to opt out or to close your account.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">11</span> Data security
          </h2>
          <p>
            We use reasonable security practices and procedures to protect your
            personal data, in line with the Information Technology Act, 2000 and its
            rules. These include restricting access to your data, relying on
            established providers for storage and processing, and reviewing our
            practices from time to time. No method of transmission or storage is
            completely secure, but we work to protect your information and to address
            any incident responsibly.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">12</span> Children
          </h2>
          <p>
            Our service is intended for adults planning or providing services for
            weddings. It is not directed at children, and we do not knowingly collect
            personal data from anyone under 18. If you believe a child has provided us
            data, contact us and we will remove it.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">13</span> Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. When we do, we will change the
            effective date at the top of this page, and where appropriate we will
            notify you. Please review this page periodically.
          </p>
        </section>

        <section>
          <h2>
            <span className="num">14</span> Grievance officer and contact
          </h2>
          <p>
            If you have questions, requests or complaints about this policy or your
            personal data, please contact:
          </p>
          <div className="contact-block">
            <span className="who">Grievance Officer, The Dream Wedding</span>
            <br />
            Email: <a href="mailto:hello@thedreamwedding.in">hello@thedreamwedding.in</a>
            <br />
            Address: 9/1506, Lotus Boulevard, Sector 100, Noida, Uttar Pradesh, India
          </div>
          <p style={{ marginTop: '14px' }}>
            We will acknowledge and address grievances in accordance with the DPDP Act,
            2023 and applicable law.
          </p>
        </section>

        <p className="foot">The Dream Wedding &middot; Noida, India</p>
      </div>
    </main>
  );
}
