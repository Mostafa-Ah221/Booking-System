import React from 'react';
import { Search } from 'lucide-react';
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { TiSocialYoutube } from "react-icons/ti";

const Footer = () => {
  const buyerGuideLinks = [
    { title: 'Why Zoho Bookings', href: '#' },
    { title: 'Calendly alternatives', href: '#' },
    { title: 'Online scheduling app features', href: '#' },
    { title: 'Contact forms vs Zoho Bookings', href: '#' },
    { title: 'The 15 best calendar apps', href: '#' },
  ];

  const compareWithLinks = [
    { title: 'Calendly', href: '#' },
    { title: 'Acuity Scheduling', href: '#' },
    { title: 'Setmore', href: '#' },
    { title: 'Doodle', href: '#' },
  ];

  const integrationsLinks = [
    { title: 'Zoho CRM', href: '#' },
    { title: 'Zoho Desk', href: '#' },
    { title: 'Zoho SalesIQ', href: '#' },
    { title: 'Zoho Flow', href: '#' },
    { title: 'Zoho Meeting', href: '#' },
    { title: 'Zoho Asset', href: '#' },
    { title: 'Zoho Sites', href: '#' },
    { title: 'All integrations', href: '#' },
  ];

  const nextMoveLinks = [
    { title: 'Request a demo', href: '#' },
    { title: 'Start free trial', href: '#' },
    { title: 'Check pricing plans', href: '#' },
  ];

  const bottomLinks = [
    { title: 'Zoho Home', href: '#' },
    { title: 'Contact Us', href: '#' },
    { title: 'Security', href: '#' },
    { title: 'Compliance', href: '#' },
    { title: 'IPR Complaints', href: '#' },
    { title: 'Anti-spam Policy', href: '#' },
    { title: 'Terms of Service', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Cookie Policy', href: '#' },
    { title: 'GDPR Compliance', href: '#' },
    { title: 'Abuse Policy', href: '#' },
  ];

  return (
    <footer className="max-w-screen overflow-x-hidden bg-white py-8 px-4 md:px-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section with Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            <div>
                <img src="https://www.zoho.com/sites/zweb/images/bookings/zbs-schedule-demo-footer-brands.webp" alt="" />
            </div>
          {/* Buyer's Guide */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Buyer's guide</h3>
            <ul className="space-y-2">
              {buyerGuideLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-slate-700 hover:text-blue-800 hover:border-b border-black ">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare with */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Compare with</h3>
            <ul className="space-y-2">
              {compareWithLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-slate-700 hover:text-blue-800 hover:border-b border-black ">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Integrations</h3>
            <ul className="space-y-2">
              {integrationsLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-slate-700 hover:text-blue-800 hover:border-b border-black ">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Next move */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Next move</h3>
            <ul className="space-y-2">
              {nextMoveLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.href} className="text-slate-700 hover:text-blue-800 hover:border-b border-black ">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
<div className='flex justify-between items-center'> 
    <div className="flex items-center mb-8">
          <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
            <span className="mr-2">✉️</span>
            support@zohobookings.com
          </a>
        </div>

        {/* App Store Badges */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <a href="#" className="w-32">
            <img src="https://www.nuffieldhealth.com/local/ea/89/8e7aba9f4b0c96409c88e65d08ff/apple-page-4col-roundel.png" alt="App Store" className="w-full" />
          </a>
          <a href="#" className="w-32">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="w-full" />
          </a>
        </div>

        {/* Social Media */}
        <div className="flex gap-4 mb-8">
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <FaInstagramSquare className='w-6 h-6'/>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <FaLinkedin className='w-6 h-6'/>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <BsTwitterX className='w-6 h-6'/>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <TiSocialYoutube className='w-6 h-6'/>
          </a>
        </div>
</div>
        {/* Support Email */}
       
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search for product overviews, FAQs, and more..."
            className="w-full px-4 py-2 border rounded-lg pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <select className="px-4 py-2 border rounded-lg">
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Bottom Links */}
        <div className="border-t pt-6">
          <ul className="flex flex-wrap gap-4 mb-4">
            {bottomLinks.map((link) => (
              <li key={link.title}>
                <a href={link.href} className="text-sm text-gray-600 hover:text-gray-800">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            © 2025, Zoho Corporation Pvt. Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;