import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const bottomLinks = [
    { title: 'Appoint Roll Home', href: '/' },
    { title: 'Webinars', href: '/Webinars' },
    { title: 'Security', href: '/security' },
    { title: 'Terms of Service', href: '/termsOf-service' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Abuse Policy', href: '/abuse-policy' },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Section */}
        <div className="py-8 lg:py-12">
          
          {/* Footer Links */}
          <div className="mb-8">
         <div className="flex flex-wrap gap-x-3 gap-y-2 items-center justify-center">
            {bottomLinks.map((link, index) => (
              <a 
                key={link.title}
                href={link.href} 
                className="group text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out py-2 px-1 rounded-md hover:bg-white/50 hover:shadow-sm"
              >
                <span className="border-b border-transparent group-hover:border-blue-600 transition-all duration-300">
                  {link.title}
                </span>
                {index < bottomLinks.length - 1 && (
                  <span className='ml-3'> |</span>
                )}
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
                <span className="font-medium text-gray-800">© 2026 Appoint Roll</span>
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
                  href="https://www.facebook.com/appointrolls" 
                  target="_blank"
                  className="group p-2 rounded-full hover:bg-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="https://www.instagram.com/appointrolls"
                   target="_blank" 
                  className="group p-2 rounded-full hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/appointrolls" 
                   target="_blank"
                  className="group p-2 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="https://x.com/appointrolls" 
                   target="_blank"
                  className="group p-2 rounded-full hover:bg-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="https://www.youtube.com/@appointrolls" 
                   target="_blank"
                  className="group p-2 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="https://alllinks.one/appointroll"
                  target="_blank"
                  className="group p-2 rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="All Links"
                >
                  <svg
                    viewBox="0 0 114.07 111.12"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                  >
                    <g>
                      <rect width="12.69" height="12.69" x="89.04" y="88.86" />
                      <rect width="12.69" height="12.69" x="89.04" y="76.17" />
                      <rect width="12.69" height="12.69" x="89.04" y="63.49" />
                      <rect width="12.69" height="12.69" x="89.04" y="50.8" />
                      <rect width="12.69" height="12.69" x="89.04" y="38.12" />
                      <polygon points="89.04 25.43 101.73 25.43 89.04 12.74" />

                      <rect width="12.69" height="12.69" x="63.67" y="88.86" />
                      <rect width="12.69" height="12.69" x="63.67" y="76.17" />
                      <rect width="12.69" height="12.69" x="63.67" y="63.49" />
                      <rect width="12.69" height="12.69" x="63.67" y="50.8" />
                      <rect width="12.69" height="12.69" x="63.67" y="38.12" />
                      <rect width="12.69" height="12.69" x="63.67" y="25.43" />
                      <rect width="12.69" height="12.69" x="63.67" y="12.74" />

                      <rect width="12.69" height="12.69" x="38.3" y="88.86" />
                      <rect width="12.69" height="12.69" x="38.3" y="76.17" />
                      <rect width="12.69" height="12.69" x="38.3" y="63.49" />
                      <rect width="12.69" height="12.69" x="38.3" y="50.8" />
                      <rect width="12.69" height="12.69" x="38.3" y="38.12" />
                      <rect width="12.69" height="12.69" x="38.3" y="25.43" />
                      <rect width="12.69" height="12.69" x="38.3" y="12.74" />

                      <rect width="12.69" height="12.69" x="12.93" y="88.86" />
                      <rect width="12.69" height="12.69" x="12.93" y="76.17" />
                      <rect width="12.69" height="12.69" x="12.93" y="63.49" />
                      <rect width="12.69" height="12.69" x="12.93" y="50.8" />
                      <rect width="12.69" height="12.69" x="12.93" y="38.12" />
                      <rect width="12.69" height="12.69" x="12.93" y="25.43" />
                      <rect width="12.69" height="12.69" x="12.93" y="12.74" />
                    </g>
                  </svg>
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