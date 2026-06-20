import React, { useState } from 'react';
import { Mail, Phone, Facebook, Instagram, Linkedin, Check } from 'lucide-react';
import { RiSnapchatLine } from "react-icons/ri";
import { PiTiktokLogoLight } from "react-icons/pi";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdWhatsapp } from 'react-icons/md';

const BookingFooter = ({ theme, textColor }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(theme.footer_phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      icon: copied
        ? <span className="text-xs text-green-400 w-10 text-center">Copied!</span>
        : <Phone className="w-4 h-4" />,
      href: null,
      key: 'phone',
      onClick: handleCopyPhone
    },
    theme?.show_email === "1" && theme?.footer_email && {
      icon: <Mail className="w-4 h-4" />,
      href: `mailto:${theme.footer_email}`,
      key: 'email'
    },
  ].filter(Boolean);

  return (
    <div className='flex flex-col items-center mt-7 md:mt-11 w-full pb-4 ' style={{ color: textColor }}>

      {socialLinks.length > 0 && (
        <div className="flex gap-3 items-center justify-center flex-wrap px-2">
          {socialLinks.map((link, index) => (
            <React.Fragment key={link.key}>
              {link.onClick ? (
                <button
                  onClick={link.onClick}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  style={{ color: copied ? undefined : textColor }}
                  title="Click to copy phone"
                >
                  {link.icon}
                </button>
              ) : (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: textColor }}
                >
                  {link.icon}
                </a>
              )}
              {index < socialLinks.length - 1 && (
                <span className="text-xs" style={{ color: textColor }}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
     {theme?.remove_brand !== "1" &&(<h2 className='text-sm mt-3'>Powered by Appoint Roll</h2>) }
      
    </div>
  );
};

export default BookingFooter;