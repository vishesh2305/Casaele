function renderStructured(text) {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean)
  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const isHeading = /^\d+\.|^last updated:|^privacy policy$/i.test(line)
        const isLabel = /:$/i.test(line)
        if (isHeading || isLabel) {
          return (
            <h3 key={idx} className="text-base md:text-lg font-semibold text-gray-900 border-l-4 border-red-300 pl-3">
              {line}
            </h3>
          )
        }
        return (
          <div key={idx} className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
            <p className="text-[15px] md:text-base text-gray-700 leading-7">{line}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-gray-100/60">
      {/* Hero */}
      <div className="px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white/60 backdrop-blur border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">Privacy Policy</h1>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-100">Updated • Oct 2025</span>
            </div>
            <div className="h-px bg-gradient-to-r from-red-200/60 via-gray-200 to-transparent mt-6" />

            {/* Content card */}
            <div className="mt-6">
              <div className="rounded-xl bg-white/80 backdrop-blur border border-gray-200 shadow p-5 sm:p-6">
                <div className="space-y-5 text-gray-700 leading-7">
                  <p>
                    CasadeELE (“we,” “us,” or “our”) is committed to protecting your privacy. Below is your policy content area.
                  </p>
                  <div className="rounded-lg border-l-4 border-red-300 bg-gray-50/70 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">Policy Content</h2>
                    {renderStructured(`Privacy Policy
Last updated: October 2025
CasadeELE (“we,” “us,” or “our”) is committed to protecting your privacy and personal information. This Privacy Policy describes what data we collect, how we use it, who we share it with, your rights regarding your data, and how you can contact us. This policy applies to all visitors, students, and subscribers who access our services.
1. Who We Are
CasadeELE owns and operates this website, including our online school, teaching material shop, and newsletter. Our services and policies apply to website visitors (“users”), registered students, and newsletter subscribers.
2. What Data We Collect
We may collect the following data:
Personal details: name, email, address, date of birth, phone number
Account data: username, password, profile preferences
Payment details: (when purchasing materials/courses) credit/debit card info (processed securely)
Newsletter data: email address, subscription preferences
Usage analytics: device type, browser information, IP address, geographic location, usage statistics


Communications: support requests, feedback, messages
Cookies and tracking data (see Section 5)
If you enroll a child or a minor, we may collect the child’s name, age, and related parent/guardian information, with consent.
3. How We Collect Your Data
We collect data in several ways:
When you fill in forms (register, purchase, sign up for the newsletter)
When you use our website (automatic data collection via cookies/analytics)
Through direct communication (email, support chat)
Through newsletter interactions (open rates, click analysis)
4. How We Use Your Data
We process your data for the following purposes:
To provide and manage online courses, memberships, and downloadable materials
To process orders, transactions, and payments
To send newsletters, updates, and educational resources
For analytics, website improvement, and fraud prevention
To respond to queries and support requests
For compliance with legal obligations
5. Cookies and Analytics
Our website uses cookies and similar tracking technologies to:
Enhance site functionality and personalization
Collect traffic statistics and usage trends
Analyze newsletter and marketing campaign performance
You may manage or disable cookies through your browser settings. Continued use of our website implies consent to our cookie policy.
6. Data Sharing and Third Parties
We may share your information with:
Payment processors (e.g., Stripe, PayPal)
Newsletter distribution providers
Hosting and website analytics services
We do not sell your personal data. Third parties may only use your data under strict contractual and legal conditions. We ensure appropriate safeguards such as Standard Contractual Clauses or other lawful mechanisms to maintain adequate protection.
7. Children’s Privacy
Parents or guardians may request access, correction, or deletion of their children’s data.
8. International Data Transfers
Your data may be processed and stored on servers outside your country. We ensure appropriate safeguards are in place to protect your data per applicable laws.
9. Data Security
We take reasonable steps to secure data via technical and organizational measures, such as SSL encryption, secure payment gateways, and regular security reviews. However, internet data transmission is not 100% secure.
10. Your Rights
Depending on your region, you may have the right to:
Access the data we hold about you
Request corrections or updates
Request deletion of your data
Withdraw consent for processing
Object to profiling and marketing communications
Lodge a complaint with relevant authorities
Contact us for inquiries or to exercise rights.
11. Third-Party Links
Our website may link to external sites. We are not responsible for their privacy practices. Please check those sites’ privacy policies.
12. Changes to This Policy
We may update this policy periodically to reflect new laws or business practices. Changes will be posted here with the revised date.
13. Contact Information
If you have questions, concerns, or requests regarding your privacy or data, please contact us at:
- Email: casadeelecontacto@gmail.com
- Contact form from the navigation bar.`)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer breadcrumbs / CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-500">Need changes? Send us the updated document and we’ll publish it.</div>
              <a href="/contact" className="inline-flex items-center rounded-md bg-red-700 px-3 py-1.5 text-white text-sm hover:bg-red-800">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


