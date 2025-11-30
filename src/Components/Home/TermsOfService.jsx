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
      title: 'Beta Experimental Service',
      color: 'from-orange-500 to-red-500',
      content: `Some Services may be offered as "Experimental Services" or "Beta Services" (collectively, "Experimental Services"). These services are provided for testing and evaluation purposes only. We make no warranties regarding the availability, performance, or evaluation of these Experimental Services. As such, we may modify, suspend, or discontinue these services at any time without prior notice. You acknowledge that you will use these services at your own risk, and Appoint Roll shall not be responsible for any damages, losses, or consequences arising from your use of the Experimental Services without limitation.`
    },
    {
      id: 'trial',
      icon: Clock,
      title: 'Free Trial Period',
      color: 'from-blue-500 to-cyan-500',
      content: `To access the free trial, you must register for a Appoint Roll account. By registering, you agree to provide accurate, current, and complete information. The trial period begins when you subscribe to the Service through your Organization Account and will remain active until the subscription expires. We reserve the right to suspend or terminate your access to the Service if we suspect unauthorized use, violation of terms, or fraudulent activity. The trial may not be reactivated if terminated, and we are not liable for any damages resulting from suspension or termination. You may register for a trial only once per service.`
    },
    {
      id: 'usage',
      icon: Shield,
      title: 'Acceptable Use Restrictions',
      color: 'from-purple-500 to-pink-500',
      content: `You must comply with all applicable laws, regulations, and these Terms in addition to our other policies. You agree not to access or use the Services in any manner that violates any applicable law. The Services must only be used for lawful business purposes. Additionally, you agree not to engage in any unauthorized or improper use, including but not limited to transmitting harmful code, interfering with system integrity, attempting unauthorized access, or any activity that disrupts service availability or violates intellectual property rights.`
    },
    {
      id: 'commitment',
      icon: Scale,
      title: 'Registration Requirements',
      color: 'from-green-500 to-teal-500',
      content: `You may register for a free trial account to access certain services provided by Appoint Roll. By registering, you agree to: (1) provide accurate, truthful, current, and complete information as required during registration; (2) maintain and promptly update your registration information to keep it accurate and current; (3) maintain the security and confidentiality of your password and account; (4) be fully responsible for all activities conducted through your account; and (5) immediately notify Appoint Roll of any unauthorized use or security breach. Appoint Roll reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`
    },
    {
      id: 'acceptance',
      icon: FileText,
      title: 'Agreement Acceptance',
      color: 'from-indigo-500 to-blue-500',
      content: `By accessing and using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. This agreement constitutes a binding legal contract between you (or the entity you represent) and Appoint Roll Corporation. If you do not agree to these terms, you must not access or use the Services. Your continued use of the Services following any modifications to these Terms constitutes acceptance of those changes. We reserve the right to modify these Terms at any time, and modifications become effective immediately upon posting.`
    },
    {
      id: 'description',
      icon: FileText,
      title: 'Service Description',
      color: 'from-yellow-500 to-orange-500',
      content: `Appoint Roll provides various software applications and services accessible via the Internet for business use. These Services may include features such as data storage, collaboration tools, communication platforms, and business management solutions. The Services are provided "as is" and may be subject to modifications, updates, or changes at Appoint Roll's discretion. We strive to maintain high availability and reliability but do not guarantee uninterrupted access. Certain features may require additional subscriptions or may be subject to usage limits. You are responsible for maintaining compatible hardware, software, and internet connectivity to access the Services.`
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
            This Terms of Service agreement ("Agreement" or "Terms") is between you (or the entity you represent) and Appoint Roll Corporation ("Appoint Roll" or "Company"). By accessing or using Appoint Roll's services through our production and testing websites, you agree to be bound by these Terms and all applicable laws and regulations. Your use of the Services constitutes acceptance of this Agreement.
          </p>
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
                Please read these Terms of Service carefully before using our Services. By accessing or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our Services.
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