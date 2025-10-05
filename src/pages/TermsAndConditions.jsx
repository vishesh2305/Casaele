function renderStructured(text) {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean)
  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const isHeading = /^\d+\.|^last updated:|^terms & conditions$/i.test(line)
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

export default function TermsAndConditions() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-gray-100/60">
      <div className="px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white/60 backdrop-blur border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">Terms & Conditions</h1>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-100">Updated • Oct 2025</span>
            </div>
            <div className="h-px bg-gradient-to-r from-red-200/60 via-gray-200 to-transparent mt-6" />

            {/* Content */}
            <div className="mt-6">
              <div className="rounded-xl bg-white/80 backdrop-blur border border-gray-200 shadow p-5 sm:p-6">
                <div className="space-y-6">
                  {/* Intro */}
                  <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed">
                    Welcome to CasadeELE. These Terms & Conditions govern your use of our website, online school, shop, and materials. Please read them carefully.
                  </p>

                  {/* Quick navigation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      '1. Site Ownership',
                      '2. Acceptance of Terms',
                      '3. Services',
                      '4. Enrollment & Courses',
                      '5. Payments & Refunds',
                      '6. Materials & IP',
                      '7. Conduct',
                      '8. Privacy & Data',
                      '9. Disclaimers & Liability',
                      '10. Changes & Contact',
                    ].map(item => (
                      <div key={item} className="text-sm md:text-[15px] text-gray-700 bg-gray-50/70 border border-gray-200 rounded-md px-3 py-2">
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Structured body (re-using the existing content, but formatted) */}
                  {renderStructured(`Terms & Conditions
Last updated: October 2025
1. Site Ownership
This site is owned and operated by CasadeELE. Storyline, narration, characters, designs, and teaching materials are our intellectual property. You receive a limited, non-transferable license for personal learning use only.
2. Acceptance of Terms
By using our website, purchasing products, registering for courses, or subscribing to our newsletter, you agree to these Terms, our Privacy Policy, and Cookie Policy. We may update these Terms from time to time.
3. Services
We provide synchronous, mixed, and asynchronous Spanish courses; a shop for digital/physical materials; a newsletter; and community features. Third‑party platforms may be used (e.g., Zoom/Google Meet) and have their own policies.
4. Enrollment & Courses
Enrollment is confirmed after registration and payment. Classes may change based on demand. Only registered and paid students may access the digital campus and materials. Minors may enroll with guardian authorization.
5. Payments & Refunds
Fees are due before course start unless otherwise stated. Digital products are non‑refundable. Refunds/cancellations follow the policy shown at purchase; partially refundable windows may apply before start dates.
6. Materials & IP
Study materials are personal-use only; do not reproduce or distribute without permission. Some courses include materials in the fee; otherwise they may be purchased separately.
7. Conduct
Be respectful to instructors, staff, and peers. Unauthorized sharing or downloading of materials is prohibited. We may exclude users for disruptive behavior or breaches.
8. Privacy & Data
We follow applicable privacy laws (including DPDP Act, 2023 and where relevant GDPR). We collect data to operate courses, process payments, and improve services. See our Privacy Policy for rights and cookie controls.
9. Disclaimers & Liability
Services are provided “as is”. We are not liable for third‑party outages, force majeure, or indirect damages, to the extent permitted by law.
10. Changes & Contact
We may modify these Terms by posting updates. For questions, support, or legal inquiries, contact our official email.`)}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-500">Have a revision? Send us the updated document and we’ll update the page.</div>
              <a href="/contact" className="inline-flex items-center rounded-md bg-red-700 px-3 py-1.5 text-white text-sm hover:bg-red-800">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


