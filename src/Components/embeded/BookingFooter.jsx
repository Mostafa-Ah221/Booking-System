import React from 'react';
import { Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import { RiSnapchatLine } from "react-icons/ri";
import { PiTiktokLogoLight } from "react-icons/pi";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdWhatsapp } from 'react-icons/md';

const BookingFooter = ({ theme, textColor }) => {
  // بناء array من الـ links المرئية فقط
  const socialLinks = [
    theme?.show_facebook === "1" && theme?.footer_facebook && {
      icon: <Facebook className="w-4 h-4" />,
      href: theme.footer_facebook,
      key: 'facebook'
    },
    theme?.show_instagram === "1" && theme?.footer_instagram && {
      icon: <Instagram className="w-4 h-4" />,
      href: theme.footer_instagram,
      key: 'instagram'
    },
    theme?.show_x === "1" && theme?.footer_x && {
      icon: <FaSquareXTwitter className="w-4 h-4" />,
      href: theme.footer_x,
      key: 'x'
    },
    theme?.show_linkedin === "1" && theme?.footer_linkedin && {
      icon: <Linkedin className="w-4 h-4" />,
      href: theme.footer_linkedin,
      key: 'linkedin'
    },
    theme?.show_tiktok === "1" && theme?.footer_tiktok && {
      icon: <PiTiktokLogoLight className="w-4 h-4" />,
      href: theme.footer_tiktok,
      key: 'tiktok'
    },
    theme?.show_snapchat === "1" && theme?.footer_snapchat && {
      icon: <RiSnapchatLine className="w-4 h-4" />,
      href: theme.footer_snapchat,
      key: 'snapchat'
    },
    theme?.show_whatsapp === "1" && theme?.footer_whatsapp && {
      icon: <MdWhatsapp className="w-4 h-4" />,
      href: `https://wa.me/${theme.footer_whatsapp.replace(/[^0-9]/g, '')}`,
      key: 'whatsapp'
    },
    theme?.show_phone === "1" && theme?.footer_phone && {
      icon: <span>{theme?.footer_phone}</span>,
      href: `tel:${theme.footer_phone}`,
      key: 'phone'
    },
    theme?.show_email === "1" && theme?.footer_email && {
      icon: <Mail className="w-4 h-4" />,
      href: `mailto:${theme.footer_email}`,
      key: 'email'
    },
  ].filter(Boolean); // إزالة الـ false values

  return (
    <div className='flex flex-col items-center mt-20 w-full mb-2' style={{ color: textColor }}>
      {socialLinks.length > 0 && (
        <div className="flex gap-3 items-center justify-center flex-wrap">
          {socialLinks.map((link, index) => (
            <React.Fragment key={link.key}>
              <a 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-70 transition-opacity"
                style={{ color: textColor }}
              >
                {link.icon}
              </a>
              {/* ✅ عرض الفاصل فقط لو مش آخر عنصر */}
              {index < socialLinks.length - 1 && (
                <span className="text-xs" style={{ color: textColor }}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div>
        <h2 className='text-sm'>Powered by Appoint Roll</h2>
      </div>
    </div>
  );
};

export default BookingFooter;