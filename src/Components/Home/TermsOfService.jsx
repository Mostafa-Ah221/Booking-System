import React, { useState } from 'react';
import { FileText, AlertCircle, Scale, Shield, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const TermsOfService = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: 'beta',
      icon: AlertCircle,
      title: 'Beta & Experimental Services',
      color: 'from-orange-500 to-red-500',
      content: `Some features may be offered as Beta or Experimental Services, provided for testing and evaluation purposes.
      These services may be limited, unstable, or subject to change.
       Appoint Roll does not guarantee their availability, performance, or continuity, and may modify, suspend, or discontinue them at any time without prior notice.
      By using these services, you acknowledge that they are provided “as is” and that use is at your own risk.
      `
    },
    {
      id: 'trial',
      icon: Clock,
      title: 'Free Trial Period',
      color: 'from-blue-500 to-cyan-500',
      content: `To access the free trial, you must create an Appoint Roll account and provide accurate and complete information.
The trial begins upon activation and remains valid until its expiration.
 We reserve the right to suspend or terminate access in cases of misuse, violations, or suspicious activity.
Each user may register for a free trial once per service, and terminated trials cannot be reactivated.
`
    },
    {
      id: 'usage',
      icon: Shield,
      title: 'Acceptable Use Policy',
      color: 'from-purple-500 to-pink-500',
      content: `You agree to use Appoint Roll only for lawful business purposes and in compliance with all applicable laws and regulations.
        You must not misuse the platform, including but not limited to:
        •	Attempting unauthorized access 
        •	Disrupting system performance 
        •	Transmitting harmful or malicious content 
        •	Violating intellectual property rights 
        Any misuse may result in suspension or termination of access.
        `
    },
    {
      id: 'commitment',
      icon: Scale,
      title: 'Registration & Account Responsibility',
      color: 'from-green-500 to-teal-500',
      content: `By registering for an account, you agree to:
          •	Provide accurate and up-to-date information 
          •	Maintain the security and confidentiality of your account 
          •	Take full responsibility for all activities under your account 
          •	Notify us immediately of any unauthorized access or security breach 
          Appoint Roll reserves the right to suspend or terminate accounts that violate these terms.
          `
    },
    {
      id: 'acceptance',
      icon: FileText,
      title: 'Agreement Acceptance',
      color: 'from-indigo-500 to-blue-500',
      content: `By accessing or using Appoint Roll, you confirm that you have read, understood, and agreed to these Terms.
      This Agreement forms a binding legal relationship between you (or your organization) and Appoint Roll.
      If you do not agree to these Terms, you must not use the Services.
      We may update these Terms at any time, and continued use of the platform constitutes acceptance of any changes.
      `
    },
    {
      id: 'description',
      icon: FileText,
      title: 'Service Description',
      color: 'from-yellow-500 to-orange-500',
      content: `Appoint Roll provides cloud-based software solutions designed to support business scheduling, communication, and workflow management.
      The Services are provided “as is” and may be updated, modified, or enhanced at any time.
      While we strive to ensure reliability and availability, uninterrupted access is not guaranteed.
      Some features may require additional subscriptions or be subject to usage limits.
      You are responsible for maintaining the necessary devices, software, and internet connection to access the Services.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <FileText className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Terms of Service</h1>
          <p className="text-xl text-center text-white/90 max-w-2xl mx-auto">
            Beta Experimental Service Agreement
          </p>
          <div className="mt-8 text-center">
            <p className="text-sm text-white/80">Last Updated: March 2, 2022</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Agreement Overview</h2>
          <p className="text-gray-600 leading-relaxed">
By using <strong>Appoint Roll</strong>, you agree to these Terms and all applicable laws.<br />This Agreement forms a binding relationship between you and <strong>Appoint Roll</strong> .          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSections[section.id];
            
            return (
              <div 
                key={section.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`bg-gradient-to-br ${section.color} p-3 rounded-xl text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Section {index + 1}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">Important Notice</h3>
              <p className="text-amber-800 leading-relaxed">
                Important Notice
                Please review these Terms of Service carefully before using Appoint Roll.
                By accessing or using the platform, you confirm that you have read, understood, and agreed to these Terms.
                If you do not agree with any part of them, you must not use the Services.

              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © Appoint Roll Corporation. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            For questions regarding these Terms, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;