import React, { useState } from 'react';
import { Shield, Lock, Key, Eye, Server, CheckCircle, AlertTriangle, FileCheck, Users, Cloud, Activity, Smartphone } from 'lucide-react';

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Data Protection',
      description: 'Your data is encrypted and secured at every stage — ensuring maximum privacy and protection.'
    },
    {
      icon: Key,
      title: 'Secure Authentication Layers',
      description: 'Multiple authentication methods add extra layers of security to protect your account from unauthorized access.'
    },
    {
      icon: Server,
      title: 'Scalable & Secure Infrastructure',
      description: 'Hosted on reliable, enterprise-level environments designed for stability, performance, and security.'
    },
    {
      icon: Eye,
      title: 'Granular Access Management',
      description: 'Full control over user permissions, ensuring the right people access the right data — nothing more.'
    },
    {
      icon: Activity,
      title: 'Intelligent Security Monitoring',
      description: 'Advanced monitoring systems track activity and detect anomalies in real time.'
    },
    {
      icon: FileCheck,
      title: 'Ongoing Security Assessments',
      description: 'Continuous testing and security reviews to keep your platform protected against evolving threats.'
    }
  ];

  const certifications = [
    {
      title: 'ISO 27001',
      description: 'Information security management system certification'
    },
    {
      title: 'SOC 2 Type II',
      description: 'Service Organization Control compliance for security and availability'
    },
    {
      title: 'GDPR Compliant',
      description: 'Full compliance with EU data protection regulations'
    },
    {
      title: 'HIPAA Ready',
      description: 'Healthcare data protection standards compliance'
    }
  ];

  const bestPractices = [
    {
      icon: Smartphone,
      title: 'Use Strong & Secure Credentials',
      tips: [
        'Create passwords with high complexity (12+ characters) ',
        'Use a mix of letters, numbers, and symbols ',
        'Avoid predictable or personal information ',
        'Store passwords securely using a trusted manager ',
        'Update your credentials periodically '
      ]
    },
    {
      icon: Key,
      title: 'Enable Multi-Layer Authentication',
      tips: [
        'Activate two-factor authentication (2FA) for your account ',
        'Use trusted authenticator apps instead of SMS when possible ',
        'Store backup codes securely ',
        'Never share verification codes ',
        'Update authentication methods when switching devices '
      ]
    },
    {
      icon: Eye,
      title: 'Stay Alert & Proactive',
      tips: [
        'Be cautious of phishing attempts and suspicious links ',
        'Always verify the source before taking action ',
        'Avoid sharing sensitive data ',
        'Report unusual activity immediately ',
        'Keep your system and applications up to date '
      ]
    },
    {
      icon: Users,
      title: 'Control Access & Permissions',
      tips: [
        'Regularly review user roles and permissions ',
        'Remove access for inactive or former users ',
        'Limit administrative privileges to essential users only ',
        'Monitor login activity and unusual behavior ',
        'Apply role-based access for better control '
      ]
    }
  ];

  const incidentResponse = [
    {
      step: '1',
      title: 'Detection',
      description: 'Advanced monitoring systems track activity continuously to identify potential threats and anomalies in real time.'
    },
    {
      step: '2',
      title: 'Analysis',
      description: 'Our security team investigates alerts quickly and accurately to assess the nature, scope, and severity of the incident.'
    },
    {
      step: '3',
      title: 'Containment',
      description: 'Immediate actions are taken to isolate affected systems and prevent further exposure or damage.'
    },
    {
      step: '4',
      title: 'Remediation',
      description: 'We eliminate the threat, restore affected services, and ensure system stability with minimal disruption.'
    },
    {
      step: '5',
      title: 'Communication',
      description: 'We keep affected users informed with clear, timely updates and guidance throughout the process.'
    },
    {
      step: '6',
      title: 'Continuous Improvement',
      description: 'Every incident is reviewed to strengthen our defenses and improve future response strategies.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <Shield className="w-14 h-14" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-center mb-6">Security & Data Protection</h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Your security isn’t just a priority —
            it’s built into everything we do.
            We protect your data with advanced security measures designed to ensure privacy, reliability, and complete peace of mind.     
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Overview Section */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Security Commitment</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Security is the foundation of trust.
            That’s why Appoint Roll is designed to protect your data at every level — from infrastructure to application, and from user access to integrations

          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We continuously enhance our systems with modern security technologies, and industry best practices to stay ahead of evolving threats.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
           Our team monitors the platform around the clock —
           detecting, preventing, and responding to risks in real time.

          </p>
        </div>

        {/* Security Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Security Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                  <div className="bg-gray-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Security Best Practices</h2>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Protect Your Account - Stay in Control.</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Follow these best practices to keep your data secure and your account protected at all times.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-gray-800 text-white p-3 rounded-xl mr-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{practice.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {practice.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Response */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-16">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">Incident Response Protocol<br />Prepared. Responsive. Reliable.
          </h2>
          <p className="text-gray-600 mb-10 text-lg text-center">
            In the rare event of a security incident, Appoint Roll follows a structured response protocol to protect your data, minimize impact, and restore operations seamlessly and affectionally .
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidentResponse.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-xl p-6 h-full border-2 border-gray-200">
                  <div className="bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Encryption Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-gray-700 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Data in Transit</h3>
            </div>
            <p className="text-gray-600 mb-4">
             All data exchanged between your device and Appoint Roll is fully encrypted using advanced security protocols to ensure maximum protection while transferring.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>TLS 1.3 encryption across all connections </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Strong 256-bit encryption standards </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>HTTPS enforced platform-wide </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Secure certificate validation for mobile applications </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Server className="w-8 h-8 text-gray-700 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Data at Rest</h3>
            </div>
            <p className="text-gray-600 mb-4">
              All stored data is encrypted and managed with strict security controls to ensure long-term protection and integrity.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>AES-256 encryption for all stored data </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Encrypted backups for added protection </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Secure key management system </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Regular key rotation for enhanced security </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Report Security Issue */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-10 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">Responsible Disclosure</h2>
      
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Help us keep Appoint Roll secure.
            <br />
            If you discover a vulnerability, please report it responsibly.
            <br />
            Our security team investigates every report with priority and responds quickly to protect our users and systems.
          </p>
          <a
            href="mailto:support@egydesigner.com"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Security Team
          </a>
          <p className="text-sm text-gray-400 mt-6">
            support@egydesigner.com • PGP Key Available
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-2">
            © 2026 Appoint Roll. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">
            Last updated: October 27, 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;