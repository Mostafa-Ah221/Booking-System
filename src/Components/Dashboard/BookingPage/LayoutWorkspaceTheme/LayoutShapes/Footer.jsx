// components/Footer.jsx
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = ({ themeData }) => {
  const { footer = {}, socialLinks = {} } = themeData;

  const color = themeData.color || '#4f46e5';
  const accentColor = color.includes('-') ? color.split('-')[0] : color;


  return (
    <div className="p-2 text-center text-xs  flex flex-col items-center gap-2 mt-auto">
      {/* Footer Text + Link */}
      <div style={{ color: accentColor }}>
        {footer.link ? (
          <a
            href={footer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            {footer.text}
          </a>
        ) : (
          footer.text
        )}
      </div>

      {/* Social Icons */}
      <div className="flex gap-2 mt-1">
        {socialLinks.facebook && socialLinks.visibleFacebook && (
          <>
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className=" hover:opacity-80">
            
            <Facebook style={{ color: themeData.textColor }} className="w-4 h-4"/>
          </a>
          <span style={{ color: themeData.textColor }}>|</span>
          </>
        )}

        {socialLinks.instagram && socialLinks.visibleInstagram && (
          <>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:opacity-80">
            <Instagram style={{ color: themeData.textColor }} className="w-4 h-4"/>
          </a>
          <span style={{ color: themeData.textColor }}>|</span>
          </>
        )}

        {socialLinks.x && socialLinks.visibleX && (
          <>
          <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-80">
            <svg style={{ color: themeData.textColor }} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            
          </a>
          <span style={{ color: themeData.textColor }}>|</span>
          </>
        )}

        {socialLinks.linkedin && socialLinks.visibleLinkedin && (
          <>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:opacity-80">
          
            <Linkedin style={{ color: themeData.textColor }} className="w-4 h-4"/>
          </a>
          <span style={{ color: themeData.textColor }}>|</span>
          </>
        )}

        {socialLinks.phone && socialLinks.visiblePhone && (
          <>
          <a href={`tel:${socialLinks.phone}`} className=" hover:opacity-80 flex">
            
            <Phone style={{ color: themeData.textColor }} className="w-4 h-4"/>
            <span style={{ color: themeData.textColor }}>{socialLinks.phone}</span>
          </a>
          <span style={{ color: themeData.textColor }}>|</span>
          </>
        )}

        {socialLinks.email && socialLinks.visibleEmail && (
          <a href={`mailto:${socialLinks.email}`} className="text-red-600 hover:opacity-80">
           
              <Mail style={{ color: themeData.textColor }} className="w-4 h-4"/>
          </a>
        )}
      </div>
      <p className='text-xs ' style={{ color: themeData.textColor }}>Powered by Appoint Roll</p>
    </div>
  );
};

export default Footer;