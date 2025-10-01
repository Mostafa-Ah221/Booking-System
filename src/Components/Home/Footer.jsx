import { Search, Instagram, Linkedin, Twitter, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const bottomLinks = [
    { title: 'Appointroll Home', href: '#' },
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
    <footer className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Section */}
        <div className="py-8 lg:py-12">
          
          {/* Footer Links */}
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
              {bottomLinks.map((link, index) => (
                <a 
                  key={link.title}
                  href={link.href} 
                  className="group text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out py-2 px-1 rounded-md hover:bg-white/50 hover:shadow-sm"
                >
                  <span className="border-b border-transparent group-hover:border-blue-600 transition-all duration-300">
                    {link.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-600 text-sm leading-relaxed">
                <span className="font-medium text-gray-800">© 2025 Appointroll</span>
                <span className="mx-2">•</span>
                All Rights Reserved
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Powered by 
                <a 
                  href="http://egydesigner.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline"
                >
                  EGYdesigner
                </a>
              </p>
            </div>

            {/* Social Media */}
            <div className="flex justify-center lg:justify-end">
              <div className="flex items-center gap-1 bg-white rounded-full px-4 py-3 shadow-sm border border-gray-200">
                <span className="text-xs text-gray-500 mr-3 font-medium">Follow Us</span>
                <a 
                  href="#" 
                  className="group p-2 rounded-full hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="group p-2 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="group p-2 rounded-full hover:bg-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="group p-2 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;