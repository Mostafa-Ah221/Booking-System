import React, { useState } from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Bell, Download, Trash2, Settings, Search, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'collection',
      icon: Database,
      title: 'Information We Collect',
      color: 'from-indigo-500 to-indigo-600',
      content: `We collect various types of information to provide and improve our services. This includes:

Personal Information: When you register for an account, we collect your name, email address, phone number, and company information. This helps us create and manage your account effectively.

Usage Data: We automatically collect information about how you interact with our services, including IP addresses, browser types, device information, pages visited, time spent on pages, and click patterns.

Communication Data: When you contact our support team or communicate with us, we retain those communications to provide better service and resolve issues.

Payment Information: For paid services, we collect billing information including credit card details, billing addresses, and transaction history. Payment data is processed securely through encrypted channels.

Cookies and Tracking: We use cookies, web beacons, and similar technologies to track user preferences, analyze trends, and gather demographic information about our user base.`
    },
    {
      id: 'usage',
      icon: Eye,
      title: 'How We Use Your Information',
      color: 'from-indigo-500 to-indigo-600',
      content: `Your information is used for various legitimate business purposes:

Service Delivery: We use your data to provide, maintain, and improve our services, including personalizing your experience and developing new features.

Communication: We send you service-related announcements, updates, security alerts, and administrative messages. With your consent, we may also send promotional materials and newsletters.

Analytics and Research: We analyze usage patterns to understand how our services are used, identify trends, and improve functionality and user experience.

Security and Fraud Prevention: We use your information to detect, prevent, and respond to security incidents, fraudulent activities, and other harmful or illegal activities.

Legal Compliance: We process your data to comply with legal obligations, respond to lawful requests from authorities, and protect our rights and the rights of others.

Customer Support: We use your information to provide technical support, respond to inquiries, and resolve issues you may encounter.`
    },
    {
      id: 'sharing',
      icon: Globe,
      title: 'Information Sharing',
      color: 'from-indigo-500 to-indigo-600',
      content: `We are committed to protecting your privacy and only share your information in limited circumstances:

Service Providers: We work with trusted third-party service providers who assist us in operating our business, such as cloud hosting providers, payment processors, and analytics services. These providers are contractually obligated to protect your data.

Business Transfers: In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction.

Legal Requirements: We may disclose your information when required by law, such as in response to subpoenas, court orders, or legal processes, or to establish, exercise, or defend legal claims.

Consent: We may share your information with your explicit consent or at your direction.

Aggregated Data: We may share anonymized, aggregated, or de-identified information that cannot be used to identify you personally for research, marketing, or other purposes.

We never sell your personal information to third parties for their marketing purposes.`
    },
    {
      id: 'security',
      icon: Lock,
      title: 'Data Security',
      color: 'from-indigo-500 to-indigo-600',
      content: `We implement industry-standard security measures to protect your information:

Encryption: Data is encrypted both in transit (using TLS/SSL protocols) and at rest using strong encryption algorithms to prevent unauthorized access.

Access Controls: We maintain strict access controls, ensuring only authorized personnel can access your data on a need-to-know basis. All access is logged and monitored.

Infrastructure Security: Our servers and infrastructure are hosted in secure, certified data centers with physical security measures, redundancy, and disaster recovery capabilities.

Regular Audits: We conduct regular security audits, vulnerability assessments, and penetration testing to identify and address potential security risks.

Employee Training: Our staff receives ongoing security awareness training to recognize and prevent security threats.

Incident Response: We maintain an incident response plan to quickly detect, respond to, and recover from security incidents.

While we implement robust security measures, no system is completely secure. We encourage you to use strong passwords and enable two-factor authentication to further protect your account.`
    },
    {
      id: 'rights',
      icon: UserCheck,
      title: 'Your Privacy Rights',
      color: 'from-indigo-500 to-indigo-600',
      content: `You have several rights regarding your personal information:

Access: You have the right to request access to the personal information we hold about you and receive a copy of that data.

Correction: You can request that we correct any inaccurate or incomplete information about you.

Deletion: You may request deletion of your personal information, subject to certain legal exceptions such as record-keeping obligations.

Portability: You have the right to receive your data in a structured, commonly used, and machine-readable format and transmit it to another service provider.

Objection: You can object to certain processing activities, including direct marketing and automated decision-making.

Restriction: You may request that we restrict processing of your personal information in certain circumstances.

Withdraw Consent: Where we process data based on consent, you can withdraw that consent at any time.

To exercise these rights, please contact our privacy team through the contact information provided below. We will respond to your request within the timeframe required by applicable law.`
    },
    {
      id: 'cookies',
      icon: Settings,
      title: 'Cookies and Tracking',
      color: 'from-slate-500 to-slate-600',
      content: `We use various tracking technologies to enhance your experience:

Essential Cookies: Required for basic website functionality, including authentication, security, and maintaining your session.

Performance Cookies: Help us understand how visitors interact with our website by collecting anonymous usage statistics and performance data.

Functionality Cookies: Remember your preferences and settings to provide a personalized experience.

Analytics Cookies: Used to analyze traffic patterns, user behavior, and service performance through tools like Google Analytics.

Marketing Cookies: With your consent, we use these to deliver relevant advertisements and measure campaign effectiveness.

You can control cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of our services. Most browsers allow you to refuse cookies or alert you when cookies are being sent.

We also use similar technologies such as web beacons, pixel tags, and local storage to track user interactions and improve our services.`
    },
    {
      id: 'retention',
      icon: Download,
      title: 'Data Retention',
      color: 'from-slate-500 to-slate-600',
      content: `We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:

Active Accounts: While your account remains active, we retain your information to provide ongoing services.

Closed Accounts: After account closure, we may retain certain information for a reasonable period to comply with legal obligations, resolve disputes, enforce agreements, and maintain business records.

Legal Requirements: Some data may be retained longer to comply with legal, regulatory, tax, or accounting requirements.

Aggregated Data: We may retain anonymized or aggregated data indefinitely for analytical and research purposes.

Automatic Deletion: Certain types of data, such as logs and temporary files, are automatically deleted after a specified retention period.

When data is no longer needed, we securely delete or anonymize it in accordance with our data retention policies and applicable laws.

You can request deletion of your data at any time, subject to any legal obligations we may have to retain certain information.`
    },
    {
      id: 'children',
      icon: Shield,
      title: 'Children\'s Privacy',
      color: 'from-slate-500 to-slate-600',
      content: `We are committed to protecting the privacy of children:

Age Restrictions: Our services are not directed to children under the age of 16, and we do not knowingly collect personal information from children.

Parental Consent: If we become aware that we have collected information from a child without proper parental consent, we will take immediate steps to delete that information.

Educational Use: If our services are used in educational settings for children, we comply with applicable laws such as COPPA (Children's Online Privacy Protection Act) in the United States and similar regulations in other jurisdictions.

Notification: If you believe we have collected information from a child, please contact us immediately so we can take appropriate action.

Parents and guardians have the right to review, delete, and refuse further collection of their child's information by contacting our privacy team.`
    },
    {
      id: 'international',
      icon: Globe,
      title: 'International Data Transfers',
      color: 'from-slate-500 to-slate-600',
      content: `Your information may be transferred to and processed in countries other than your own:

Cross-Border Transfers: We operate globally and may transfer your data to servers located in different countries to provide our services efficiently.

Data Protection Standards: When transferring data internationally, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission or other approved transfer mechanisms.

Regional Compliance: We comply with applicable data protection laws in the regions where we operate, including GDPR (Europe), CCPA (California), and other regional privacy regulations.

Data Localization: Where required by local law, we store data within specific geographic boundaries.

Third-Party Transfers: Our service providers who process data on our behalf are also required to implement appropriate safeguards for international transfers.

By using our services, you consent to the transfer of your information as described in this Privacy Policy.`
    },
    {
      id: 'changes',
      icon: Bell,
      title: 'Policy Updates',
      color: 'from-slate-500 to-slate-600',
      content: `We may update this Privacy Policy from time to time:

Notification: We will notify you of material changes through email, in-app notifications, or by posting a prominent notice on our website.

Review Period: You will have an opportunity to review changes before they take effect. Significant changes may require your renewed consent.

Effective Date: Each version of this Privacy Policy will include an effective date at the top of the document.

Continued Use: Your continued use of our services after changes become effective constitutes acceptance of the updated Privacy Policy.

Version History: We maintain a history of previous versions of this Privacy Policy for reference.

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-lg p-5 rounded-3xl shadow-2xl">
              <Shield className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-center mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-center text-white/90 max-w-3xl mx-auto leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="mt-10 text-center">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium">
              Last Updated: October 27, 2025
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search privacy topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Commitment to Your Privacy</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            At our company, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. We are committed to maintaining the confidentiality, integrity, and security of your personal information.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Please read this Privacy Policy carefully. By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-3xl p-8 mb-12 border border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Navigation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex items-center space-x-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`bg-gradient-to-br ${section.color} p-2 rounded-lg text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {section.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {filteredSections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div
                id={section.id}
                key={section.id}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 transition-all duration-300 ${
                  isActive ? 'border-indigo-500 shadow-2xl' : 'border-transparent'
                }`}
              >
                <div className={`bg-gradient-to-r ${section.color} p-8`}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-white/80 text-sm font-medium mb-1">
                        Section {index + 1}
                      </div>
                      <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    {section.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-600 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to contact us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:privacy@company.com"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Email Our Privacy Team</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-2">
            © 2025 Appointroll. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">
            This Privacy Policy is effective as of October 27, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;