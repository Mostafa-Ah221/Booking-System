import React, { useState } from 'react';
import { Scissors, Heart, Dumbbell, GraduationCap, Briefcase, Stethoscope, Palette, Wrench, Users, CheckCircle, ArrowRight } from 'lucide-react';

const IndustriesPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const industries = [
          {
      id: 'salon',
      icon: Scissors,
      title: 'Salons & Spas',
      description: 'Perfect for hair salons, beauty spas, nail studios, and wellness centers',
      color: 'from-rose-400 to-pink-400',
      image: '💇',
      features: [
        'Staff scheduling and management',
        'Service menu customization',
        'Client profile and history',
        'Product inventory tracking',
        'Automated appointment reminders',
        'Package and membership management'
      ],
      benefits: [
        'Reduce no-shows by 80%',
        'Increase bookings by 40%',
        'Save 10+ hours per week'
      ]
    },
          {
      id: 'healthcare',
      icon: Stethoscope,
      title: 'Healthcare & Medical',
      description: 'Designed for clinics, dental offices, physiotherapy, and medical practices',
      color: 'from-sky-400 to-blue-400',
      image: '🏥',
      features: [
        'Patient management system',
        'Medical history tracking',
        'HIPAA compliant security',
        'Insurance information storage',
        'Prescription and treatment notes',
        'Multi-location support'
      ],
      benefits: [
        'Streamline patient flow',
        'Reduce administrative time',
        'Improve patient satisfaction'
      ]
    },
          {
      id: 'fitness',
      icon: Dumbbell,
      title: 'Fitness & Wellness',
      description: 'Ideal for gyms, yoga studios, personal trainers, and fitness centers',
      color: 'from-orange-400 to-amber-400',
      image: '🏋️',
      features: [
        'Class scheduling and capacity management',
        'Membership and package tracking',
        'Personal trainer booking',
        'Waitlist management',
        'Attendance tracking',
        'Equipment and room scheduling'
      ],
      benefits: [
        'Maximize class capacity',
        'Increase member engagement',
        'Automate payment collection'
      ]
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Education & Training',
      description: 'Great for tutors, language schools, music lessons, and training centers',
      color: 'from-purple-500 to-indigo-500',
      image: '📚',
      features: [
        'Student enrollment management',
        'Course and lesson scheduling',
        'Progress tracking and notes',
        'Group and private sessions',
        'Parent communication tools',
        'Resource and material sharing'
      ],
      benefits: [
        'Organize multiple courses easily',
        'Track student progress',
        'Simplify parent communication'
      ]
    },
    {
      id: 'consulting',
      icon: Briefcase,
      title: 'Consulting & Professional Services',
      description: 'Built for consultants, lawyers, accountants, and professional advisors',
      color: 'from-gray-600 to-gray-800',
      image: '💼',
      features: [
        'Client relationship management',
        'Meeting scheduling and video calls',
        'Document sharing and storage',
        'Time tracking and billing',
        'Project milestone tracking',
        'Secure communication channels'
      ],
      benefits: [
        'Professional client experience',
        'Streamline billing process',
        'Manage multiple clients efficiently'
      ]
    },
    {
      id: 'home',
      icon: Wrench,
      title: 'Home Services',
      description: 'Perfect for plumbers, electricians, cleaners, and maintenance services',
      color: 'from-yellow-500 to-orange-500',
      image: '🔧',
      features: [
        'Service area and radius settings',
        'Technician routing and scheduling',
        'Before/after photo capture',
        'Service history and notes',
        'Urgent booking options',
        'Equipment and supplies tracking'
      ],
      benefits: [
        'Optimize technician routes',
        'Reduce travel time',
        'Increase daily appointments'
      ]
    },
    {
      id: 'creative',
      icon: Palette,
      title: 'Creative Services',
      description: 'Designed for photographers, designers, artists, and creative professionals',
      color: 'from-teal-500 to-green-500',
      image: '🎨',
      features: [
        'Portfolio and work showcase',
        'Project booking and planning',
        'Client collaboration tools',
        'Deposit and payment scheduling',
        'Digital contract signing',
        'Gallery and file sharing'
      ],
      benefits: [
        'Showcase your work professionally',
        'Streamline project workflow',
        'Secure online payments'
      ]
    },
    {
      id: 'therapy',
      icon: Heart,
      title: 'Therapy & Counseling',
      description: 'Tailored for therapists, psychologists, counselors, and mental health professionals',
      color: 'from-green-500 to-emerald-500',
      image: '🧠',
      features: [
        'Confidential session management',
        'Progress notes and documentation',
        'Insurance billing support',
        'Crisis management protocols',
        'Recurring appointment scheduling',
        'Secure messaging system'
      ],
      benefits: [
        'Maintain client confidentiality',
        'Organize session documentation',
        'Focus on patient care'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">
              Built for Your Industry
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Appoint Roll adapts to your specific business needs with industry-tailored features
            </p>
            <p className="text-lg text-white/80">
              Trusted by thousands of businesses across multiple industries
            </p>
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Industry</h2>
          <p className="text-xl text-gray-600">Discover how Appoint Roll works for your business</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  selectedIndustry === industry.id
                    ? 'bg-gradient-to-br ' + industry.color + ' text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg'
                }`}
              >
                <Icon className={`w-10 h-10 mb-4 ${selectedIndustry === industry.id ? 'text-white' : 'text-gray-700'}`} />
                <h3 className={`text-lg font-bold mb-2 ${selectedIndustry === industry.id ? 'text-white' : 'text-gray-900'}`}>
                  {industry.title}
                </h3>
                <p className={`text-sm ${selectedIndustry === industry.id ? 'text-white/90' : 'text-gray-600'}`}>
                  {industry.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Details */}
        {selectedIndustry && (
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-10 border-2 border-indigo-100 animate-fadeIn">
            {industries
              .filter((industry) => industry.id === selectedIndustry)
              .map((industry) => {
                const Icon = industry.icon;
                return (
                  <div key={industry.id}>
                    <div className="flex items-center justify-center mb-8">
                      <div className={`bg-gradient-to-br ${industry.color} p-6 rounded-3xl text-white shadow-2xl`}>
                        <Icon className="w-16 h-16" />
                      </div>
                    </div>

                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">{industry.title}</h2>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{industry.description}</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                      {/* Features */}
                      <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <CheckCircle className="w-6 h-6 text-indigo-600 mr-3" />
                          Key Features
                        </h3>
                        <ul className="space-y-3">
                          {industry.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                              <span className="text-indigo-600 mr-3 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <ArrowRight className="w-6 h-6 text-indigo-600 mr-3" />
                          Benefits
                        </h3>
                        <div className="space-y-4">
                          {industry.benefits.map((benefit, index) => (
                            <div key={index} className="bg-indigo-50 rounded-xl p-4">
                              <p className="text-gray-800 font-semibold">{benefit}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 text-center">
                          <div className="text-6xl mb-4">{industry.image}</div>
                          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                            Get Started
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {!selectedIndustry && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">👆</div>
            <p className="text-xl text-gray-600">Select an industry above to see detailed features and benefits</p>
          </div>
        )}
      </div>

      {/* All Industries Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted Across Industries</h2>
            <p className="text-xl text-gray-600">See how businesses like yours use Appoint Roll</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div key={industry.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-br ${industry.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{industry.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{industry.description}</p>
                  <button
                    onClick={() => setSelectedIndustry(industry.id)}
                    className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 flex items-center"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Appoint Roll to streamline their booking process
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Start Free Trial
          </button>
          <p className="text-sm text-white/80 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Appoint Roll. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndustriesPage;