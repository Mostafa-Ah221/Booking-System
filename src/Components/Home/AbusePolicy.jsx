import React, { useState } from 'react';
import { Shield, AlertTriangle, Ban, Flag, FileText, Mail, Phone, Clock, CheckCircle, XCircle, Info } from 'lucide-react';

const AbusePolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const prohibitedActivities = [
    {
      icon: Ban,
      title: 'Illegal Activities',
      description: 'Using our services for any illegal purpose or in violation of local, state, national, or international law',
      examples: [
        'Fraudulent activities or scams',
        'Money laundering or financial crimes',
        'Distribution of illegal content',
        'Violation of intellectual property rights',
        'Child exploitation or abuse material'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Harmful Content',
      description: 'Creating, distributing, or storing content that is harmful, offensive, or violates the rights of others',
      examples: [
        'Hate speech or discriminatory content',
        'Harassment, bullying, or threats',
        'Graphic violence or disturbing material',
        'Adult content or explicit material',
        'Misinformation or malicious content'
      ]
    },
    {
      icon: XCircle,
      title: 'System Abuse',
      description: 'Actions that compromise the security, integrity, or performance of our platform',
      examples: [
        'Attempting to gain unauthorized access',
        'Distributing malware or viruses',
        'DDoS attacks or network disruption',
        'Automated scraping or data mining',
        'Circumventing security measures'
      ]
    },
    {
      icon: Mail,
      title: 'Spam & Unwanted Communications',
      description: 'Sending unsolicited or bulk communications through our platform',
      examples: [
        'Mass unsolicited emails or messages',
        'Phishing attempts or scam messages',
        'Chain letters or pyramid schemes',
        'Automated bulk booking requests',
        'Misleading or deceptive marketing'
      ]
    }
  ];

  const reportingSteps = [
    {
      step: '1',
      title: 'Gather Information',
      description: 'Collect relevant details about the abuse including dates, times, usernames, and any supporting evidence such as screenshots or messages.'
    },
    {
      step: '2',
      title: 'Submit Report',
      description: 'Send your report to our abuse team via email at abuse@appointroll.com with all gathered information and documentation.'
    },
    {
      step: '3',
      title: 'Acknowledgment',
      description: 'You will receive an automated confirmation within 24 hours acknowledging receipt of your report.'
    },
    {
      step: '4',
      title: 'Investigation',
      description: 'Our team will thoroughly investigate the reported abuse within 3-5 business days, reviewing all provided evidence.'
    },
    {
      step: '5',
      title: 'Action Taken',
      description: 'Appropriate action will be taken based on our findings, which may include warnings, account suspension, or termination.'
    },
    {
      step: '6',
      title: 'Follow-up',
      description: 'We will notify you of the outcome when appropriate, though specific details may be limited due to privacy considerations.'
    }
  ];

  const consequences = [
    {
      severity: 'Minor Violation',
      actions: [
        'Written warning to the account holder',
        'Temporary restriction of certain features',
        'Mandatory review of policies',
        'Monitoring of account activity'
      ]
    },
    {
      severity: 'Moderate Violation',
      actions: [
        'Temporary account suspension (7-30 days)',
        'Removal of violating content',
        'Loss of certain privileges',
        'Required compliance training'
      ]
    },
    {
      severity: 'Severe Violation',
      actions: [
        'Permanent account termination',
        'Forfeiture of any paid services',
        'Reporting to law enforcement if applicable',
        'Legal action if necessary',
        'Ban from creating new accounts'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <Shield className="w-14 h-14" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-center mb-6">Acceptable Use & Abuse Policy</h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Our commitment to maintaining a safe, secure, and respectful platform for all users
          </p>
          <div className="mt-8 text-center">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium">
              Last Updated: October 27, 2025
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Commitment</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            At Appoint Roll, we are committed to providing a safe, secure, and respectful environment for all our users. This Acceptable Use and Abuse Policy outlines the activities that are prohibited on our platform and the consequences for violations.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            By using Appoint Roll, you agree to comply with this policy and all applicable laws and regulations. We reserve the right to investigate and take appropriate action against anyone who violates this policy, including but not limited to removing content, suspending or terminating accounts, and reporting violations to law enforcement authorities.
          </p>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
            <p className="text-xl text-gray-600">The following activities are strictly prohibited on our platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {prohibitedActivities.map((activity, index) => {
              const Icon = activity.icon;
              const isExpanded = expandedSection === index;
              
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gray-100 p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-800 text-white p-3 rounded-xl">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{activity.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
                    
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : index)}
                      className="text-gray-800 font-semibold text-sm hover:text-gray-900 mb-4"
                    >
                      {isExpanded ? 'Hide examples' : 'Show examples'}
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Examples include:</p>
                        <ul className="space-y-2">
                          {activity.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="text-gray-800 mr-2 mt-0.5">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reporting Process */}
        <div className="bg-gray-50 rounded-3xl p-10 mb-16 border border-gray-200">
          <div className="text-center mb-12">
            <Flag className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Report Abuse</h2>
            <p className="text-xl text-gray-600">Follow these steps to report policy violations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportingSteps.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enforcement & Consequences</h2>
            <p className="text-xl text-gray-600">Actions taken based on violation severity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {consequences.map((consequence, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div className="bg-gray-800 text-white p-6">
                  <h3 className="text-2xl font-bold">{consequence.severity}</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Possible Actions:</p>
                  <ul className="space-y-3">
                    {consequence.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <Mail className="w-10 h-10 text-gray-700 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Report by Email</h3>
            <p className="text-gray-600 mb-4">Send detailed reports to our abuse team</p>
            <a href="mailto:abuse@appointroll.com" className="text-gray-800 font-semibold hover:text-gray-900">
              abuse@appointroll.com
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <Clock className="w-10 h-10 text-gray-700 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Response Time</h3>
            <p className="text-gray-600 mb-4">Our commitment to you</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-gray-600 mr-2" />
                <span>24-hour acknowledgment</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-gray-600 mr-2" />
                <span>3-5 business days investigation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gray-100 border-l-4 border-gray-600 rounded-xl p-8 mb-12">
          <div className="flex items-start space-x-4">
            <Info className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Important Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>False reports or abuse of the reporting system may result in action against your account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>We may share information with law enforcement when legally required or when investigating serious violations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>This policy may be updated at any time. Continued use of our services constitutes acceptance of changes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>We reserve the right to take action beyond what is specified in this policy when circumstances warrant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Appeal Process */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Appeal Process</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you believe your account was suspended or terminated in error, you may submit an appeal within 30 days of the action. Your appeal should include:
          </p>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="space-y-3">
              <li className="flex items-start text-gray-700">
                <CheckCircle className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <span>Your account information and the reason for suspension/termination</span>
              </li>
              <li className="flex items-start text-gray-700">
                <CheckCircle className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <span>A detailed explanation of why you believe the action was taken in error</span>
              </li>
              <li className="flex items-start text-gray-700">
                <CheckCircle className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <span>Any supporting evidence or documentation</span>
              </li>
              <li className="flex items-start text-gray-700">
                <CheckCircle className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <span>Steps you have taken or will take to prevent future violations</span>
              </li>
            </ul>
            <p className="text-gray-600 mt-6">
              Submit appeals to: <a href="mailto:appeals@appointroll.com" className="text-gray-800 font-semibold hover:text-gray-900">appeals@appointroll.com</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">
            © 2025 Appoint Roll. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">
            This Abuse Policy is part of our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbusePolicy;