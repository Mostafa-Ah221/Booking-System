import React, { useState } from 'react';
import { Scissors, Heart, Dumbbell, GraduationCap, Briefcase, Stethoscope, Palette, Wrench, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustriesPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const industries = [
    {
      id: 'salon',
      icon: Scissors,
      title: 'Beauty & Wellness',
      description: 'For salons, spas, skincare clinics, and wellness centers',
      color: 'from-rose-400 to-pink-400',
      image: '💇',
      features: [
        'Online self-booking ',
        'Staff & service management ',
        'Automated reminders ',
        'Time slot control ',
      ],
      benefits: [
        'Reduce no-shows ',
        'Keep your schedule fully booked ',
        'Deliver a smooth client experience ',
        'Save time on manual booking  '
      ]
    },
    {
      id: 'Healthcare & Medical',
      icon: Stethoscope,
      title: 'Healthcare & Medical',
      description: 'For clinics, dental offices, physiotherapy, and medical practices',
      color: 'from-sky-400 to-blue-400',
      image: '🏥',
      features: [
        'Appointment scheduling system ',
        'Patient booking pages ',
        'Automated confirmations & reminders ',
        'Structured availability rules ',
      ],
      benefits: [
        'Better patient flow management ',
        'Fewer missed appointments ',
        'Organized daily schedule',
        'Improved patient experience '
      ]
    },
    {
      id: 'fitness',
      icon: Dumbbell,
      title: 'Fitness & Personal Training',
      description: 'For gyms, trainers, yoga studios, and fitness programs',
      color: 'from-orange-400 to-amber-400',
      image: '🏋️',
      features: [
        'Class & session scheduling ',
        'Group booking support ',
        'Recurring sessions ',
        'Availability management ',
      ],
      benefits: [
        'Maximize session bookings ',
        'Manage multiple clients seamlessly  ',
        'Keep your schedule organized ',
        'Increase client retention '
      ]
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Education & Coaching',
      description: 'For tutors, training centers, online classes, and coaches',
      color: 'from-purple-500 to-indigo-500',
      image: '📚',
      features: [
        'Session booking system ',
        'One-to-one & group scheduling ',
        'Calendar integration ',
        'Flexible time slots ',
      ],
      benefits: [
        'Easy student scheduling ',
        'Save time on coordination ',
        'Manage multiple sessions efficiently ',
        'Provide a better learning experience  '
      ]
    },
    {
      id: 'consulting',
      icon: Briefcase,
      title: 'Consulting & Professional Services',
      description: 'For consultants, lawyers, accountants, and business advisors',
      color: 'from-gray-600 to-gray-800',
      image: '💼',
      features: [
        'Consultation booking links ',
        'Custom availability ',
        '4 Meeting types ',
        'Calendar sync ',
      ],
      benefits: [
        'Professional booking experience ',
        'Reduce scheduling friction ',
        'Focus on delivering value',
        'Close more clients '
      ]
    },
    {
      id: 'home',
      icon: Wrench,
      title: 'Agencies & Creative Services',
      description: 'For designers, photographers, marketers, and creative teams',
      color: 'from-yellow-500 to-orange-500',
      image: '🔧',
      features: [
        'Client meeting scheduling ',
        'Team availability management ',
        'Booking links per service ',
        'Workflow automation ',
      ],
      benefits: [
        'Organize client communication ',
        'Reduce back-and-forth emails ',
        'Improve team coordination ',
        'Manage multiple projects seamlessly  '
      ]
    },
    {
      id: 'creative',
      icon: Palette,
      title: 'Home & Field Services',
      description: 'For maintenance, cleaning, technical services, and on-site teams',
      color: 'from-teal-500 to-green-500',
      image: '🎨',
      features: [
        'Service booking system ',
        'Time slot selection ',
        'Team scheduling ',
        'Location-based planning ',
      ],
      benefits: [
        'Simplify job bookings ',
        'Optimize team schedules ',
        'Reduce missed appointments',
        'Improve customer satisfaction '
      ]
    },
    {
      id: 'therapy',
      icon: Heart,
      title: 'Events & Group Sessions',
      description: 'For workshops, group bookings, events, and shared sessions',
      color: 'from-green-500 to-emerald-500',
      image: '🧠',
      features: [
        'Group booking system',
        'Capacity management ',
        'Shared availability ',
        'Automated confirmations ',
      ],
      benefits: [
        'Manage multiple attendees seamlessly  ',
        'Avoid overbooking ',
        'Organize events efficiently',
        'Deliver a seamless booking experience'
      ]
    }
  ];

  const notificationFeatures = [
    {
      id: 1,
      icon: '✅',
      title: 'Automated Booking Confirmation',
      desc: 'Automatically notify clients and team members when appointments are booked or updated.',
      accent: '#6366f1',
      lightBg: '#eef2ff',
    },
    {
      id: 2,
      icon: '📨',
      title: 'Smart Email & SMS Notifications',
      desc: 'Keep everyone informed with real-time updates across multiple channels.',
      accent: '#0ea5e9',
      lightBg: '#e0f2fe',
    },
    {
      id: 3,
      icon: '🎨',
      title: 'Custom Email Branding',
      desc: 'Send emails from your own domain with your logo, colors, and brand identity.',
      accent: '#ec4899',
      lightBg: '#fce7f3',
    },
    {
      id: 4,
      icon: '🙋',
      title: 'Personalized Communication',
      desc: 'Address clients by name and tailor messages for a more professional experience.',
      accent: '#f59e0b',
      lightBg: '#fef3c7',
    },
    {
      id: 5,
      icon: '🔗',
      title: 'Smart Booking Variables',
      desc: 'Include dynamic details like meeting links, reschedule, and cancellation options.',
      accent: '#10b981',
      lightBg: '#d1fae5',
    },
    {
      id: 6,
      icon: '⏰',
      title: 'Automated Appointment Reminders',
      desc: 'Reduce no-shows with scheduled reminders before every appointment.',
      accent: '#8b5cf6',
      lightBg: '#ede9fe',
    },
    {
      id: 7,
      icon: '🔔',
      title: 'Multi-Reminder Scheduling',
      desc: 'Set multiple reminders at different intervals for maximum attendance.',
      accent: '#f97316',
      lightBg: '#ffedd5',
    },
  ];

  const NotificationCard = ({ f, index }) => (
    <div
      className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group hover:-translate-y-1"
      // style={{ borderTop: `3px solid ${f.accent}` }}
    >
      {/* <p
        className="text-xs font-bold mb-5 tracking-widest"
        style={{ color: f.accent }}
      >
        {String(index + 1).padStart(2, '0')}
      </p> */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-200 group-hover:scale-110"
        style={{ background: f.lightBg }}
      >
        {f.icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
        {f.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {f.desc}
      </p>
    </div>
  );

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
              Appoint Roll adapts to your business with flexible scheduling designed to fit your workflow.
            </p>
            <p className="text-lg text-white/80">
              Trusted by modern businesses across multiple industries
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
                          <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                            Get Started
                          </Link>
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

      {/* ─── Smart Notifications & Automation Section ─── */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            {/* <span className="inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
              Notifications & Automation
            </span> */}
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Scheduling Workflow<br />
              Built to Reduce No-Shows
            </h2>
            {/* <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Automated, branded communication that keeps clients informed and your business running smoothly.
            </p> */}
          </div>

          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {notificationFeatures.slice(0, 4).map((f, i) => (
              <NotificationCard key={f.id} f={f} index={i} />
            ))}
          </div>

          {/* Row 2 — 3 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-24">
            {notificationFeatures.slice(4).map((f, i) => (
              <NotificationCard key={f.id} f={f} index={i + 4} />
            ))}
          </div>

        </div>
      </div>

      

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Transform How You Manage Your Time
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Appoint Roll helps you simplify scheduling,
            automate workflows, and run your business more efficiently.
          </p>
          <Link to="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Start Free Today
          </Link>
          <p className="text-sm text-white/80 mt-6">
           No credit card required • 30-day free trial • Cancel anytime
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