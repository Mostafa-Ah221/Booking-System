import React, { useState } from 'react';
import { Shield, Lock, Key, Eye, Server, CheckCircle, AlertTriangle, FileCheck, Users, Cloud, Activity, Smartphone } from 'lucide-react';

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using industry-standard AES-256 encryption both in transit and at rest.'
    },
    {
      icon: Key,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account with 2FA using authenticator apps or SMS.'
    },
    {
      icon: Server,
      title: 'Secure Infrastructure',
      description: 'Our servers are hosted in certified data centers with 24/7 monitoring and physical security.'
    },
    {
      icon: Eye,
      title: 'Access Controls',
      description: 'Granular permissions and role-based access control to ensure data is only accessible by authorized users.'
    },
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Continuous monitoring of systems to detect and respond to security threats in real-time.'
    },
    {
      icon: FileCheck,
      title: 'Regular Audits',
      description: 'Independent security audits and penetration testing conducted regularly by third-party experts.'
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
      title: 'Use Strong Passwords',
      tips: [
        'Create passwords with at least 12 characters',
        'Use a mix of uppercase, lowercase, numbers, and symbols',
        'Avoid using personal information or common words',
        'Use a password manager to store passwords securely',
        'Change passwords regularly, especially after security incidents'
      ]
    },
    {
      icon: Key,
      title: 'Enable Two-Factor Authentication',
      tips: [
        'Activate 2FA on your account settings',
        'Use authenticator apps like Google Authenticator or Authy',
        'Keep backup codes in a secure location',
        'Never share your 2FA codes with anyone',
        'Update your authentication method if you change devices'
      ]
    },
    {
      icon: Eye,
      title: 'Be Vigilant',
      tips: [
        'Watch for phishing emails and suspicious links',
        'Verify sender addresses before clicking links',
        'Never share sensitive information via email',
        'Report suspicious activity immediately',
        'Keep your software and applications updated'
      ]
    },
    {
      icon: Users,
      title: 'Manage Access Carefully',
      tips: [
        'Review user permissions regularly',
        'Remove access for inactive users promptly',
        'Use role-based access control',
        'Limit admin privileges to necessary personnel',
        'Monitor login activity and unusual access patterns'
      ]
    }
  ];

  const incidentResponse = [
    {
      step: '1',
      title: 'Detection',
      description: 'Our automated systems continuously monitor for security threats and anomalies 24/7.'
    },
    {
      step: '2',
      title: 'Analysis',
      description: 'Security team investigates alerts to determine the nature and severity of potential incidents.'
    },
    {
      step: '3',
      title: 'Containment',
      description: 'Immediate action is taken to isolate affected systems and prevent further damage.'
    },
    {
      step: '4',
      title: 'Remediation',
      description: 'We eliminate the threat, restore services, and implement measures to prevent recurrence.'
    },
    {
      step: '5',
      title: 'Communication',
      description: 'Affected users are notified promptly with clear information about the incident and steps taken.'
    },
    {
      step: '6',
      title: 'Review',
      description: 'Post-incident analysis to improve our security measures and response procedures.'
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
            Your security is our top priority. We implement comprehensive measures to protect your data and maintain your trust.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Overview Section */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Security Commitment</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We understand that security is fundamental to earning and maintaining your trust. Our comprehensive security program is designed to protect your data at every level—from network infrastructure to application code, and from employee access to third-party integrations.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We continuously invest in security technologies, conduct regular assessments, and work with industry experts to stay ahead of emerging threats. Our security team operates 24/7 to monitor, detect, and respond to any potential security issues.
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
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Follow these guidelines to keep your account and data secure
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Incident Response Protocol</h2>
          <p className="text-gray-600 mb-10 text-lg">
            In the unlikely event of a security incident, we follow a rigorous protocol to protect your data and restore normal operations quickly.
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
              All data transmitted between your device and our servers is encrypted using TLS 1.3 protocol with perfect forward secrecy.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>TLS 1.3 encryption for all connections</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>256-bit encryption keys</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>HTTPS enforced across all services</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Certificate pinning for mobile apps</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Server className="w-8 h-8 text-gray-700 mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Data at Rest</h3>
            </div>
            <p className="text-gray-600 mb-4">
              All stored data is encrypted using AES-256 encryption with secure key management and regular key rotation.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>AES-256 encryption for all stored data</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Encrypted database backups</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Secure key management system</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>Regular key rotation policies</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Report Security Issue */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-10 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">Report a Security Vulnerability</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            We take security vulnerabilities seriously. If you discover a security issue, please report it to us immediately through our responsible disclosure program.
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