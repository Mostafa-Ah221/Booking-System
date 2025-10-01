import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../redux/apiCalls/RolesCallApli";
import { getPermissions } from "../redux/apiCalls/PermissionsCallApi";

export default function TestRoles() {
  const dispatch = useDispatch();

  // const { roles, loading, error } = useSelector((state) => state.roles);
  const permissions = useSelector((state) => state.permissions.permissions);


  useEffect(() => {
    dispatch(getPermissions());
  }, [dispatch]);

 

  return (
    <div>
      {/* <h2>Check console for roles data</h2>
      {loading && <p>Loading roles...</p>}
      {!loading && roles.length === 0 && <p>No roles found.</p>} */}
    </div>
  );
}
// import React from 'react';
// import { Search, Instagram, Linkedin, Twitter, Youtube, Mail } from 'lucide-react';

// const Footer = () => {
//   const buyerGuideLinks = [
//     { title: 'Why Zoho Bookings', href: '#' },
//     { title: 'Calendly alternatives', href: '#' },
//     { title: 'Online scheduling app features', href: '#' },
//     { title: 'Contact forms vs Zoho Bookings', href: '#' },
//     { title: 'The 15 best calendar apps', href: '#' },
//   ];

//   const compareWithLinks = [
//     { title: 'Calendly', href: '#' },
//     { title: 'Acuity Scheduling', href: '#' },
//     { title: 'Setmore', href: '#' },
//     { title: 'Doodle', href: '#' },
//   ];

//   const integrationsLinks = [
//     { title: 'Zoho CRM', href: '#' },
//     { title: 'Zoho Desk', href: '#' },
//     { title: 'Zoho SalesIQ', href: '#' },
//     { title: 'Zoho Flow', href: '#' },
//     { title: 'Zoho Meeting', href: '#' },
//     { title: 'Zoho Asset', href: '#' },
//     { title: 'Zoho Sites', href: '#' },
//     { title: 'All integrations', href: '#' },
//   ];

//   const nextMoveLinks = [
//     { title: 'Request a demo', href: '#' },
//     { title: 'Start free trial', href: '#' },
//     { title: 'Check pricing plans', href: '#' },
//   ];

//   const bottomLinks = [
//     { title: 'Zoho Home', href: '#' },
//     { title: 'Contact Us', href: '#' },
//     { title: 'Security', href: '#' },
//     { title: 'Compliance', href: '#' },
//     { title: 'IPR Complaints', href: '#' },
//     { title: 'Anti-spam Policy', href: '#' },
//     { title: 'Terms of Service', href: '#' },
//     { title: 'Privacy Policy', href: '#' },
//     { title: 'Cookie Policy', href: '#' },
//     { title: 'GDPR Compliance', href: '#' },
//     { title: 'Abuse Policy', href: '#' },
//   ];

//   return (
//     <footer className="w-full bg-white py-3 sm:py-8 lg:py-4  px-4 sm:px-6 lg:px-8 ">
//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto pt-9">
//         {/* Top Section with Links */}
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
//           {/* Logo Section - Full width on mobile, first column on desktop */}
//           {/* <div className="sm:col-span-2 lg:col-span-1 mb-6 sm:mb-0">
//             <img 
//               src="https://www.zoho.com/sites/zweb/images/bookings/zbs-schedule-demo-footer-brands.webp" 
//               alt="Zoho Bookings" 
//               className="w-32 sm:w-40 lg:w-full max-w-48"
//             />
//           </div> */}

//           {/* Buyer's Guide */}
//           {/* <div className="mb-6 sm:mb-0">
//             <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Buyer's guide</h3>
//             <ul className="space-y-1 sm:space-y-2">
//               {buyerGuideLinks.map((link) => (
//                 <li key={link.title}>
//                   <a 
//                     href={link.href} 
//                     className="text-sm sm:text-base text-slate-600 hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
//                   >
//                     {link.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div> */}

//           {/* Compare with */}
//           {/* <div className="mb-6 sm:mb-0">
//             <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Compare with</h3>
//             <ul className="space-y-1 sm:space-y-2">
//               {compareWithLinks.map((link) => (
//                 <li key={link.title}>
//                   <a 
//                     href={link.href} 
//                     className="text-sm sm:text-base text-slate-600 hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
//                   >
//                     {link.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div> */}

//           {/* Integrations */}
//           {/* <div className="mb-6 sm:mb-0">
//             <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Integrations</h3>
//             <ul className="space-y-1 sm:space-y-2">
//               {integrationsLinks.map((link) => (
//                 <li key={link.title}>
//                   <a 
//                     href={link.href} 
//                     className="text-sm sm:text-base text-slate-600 hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
//                   >
//                     {link.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div> */}

//           {/* Next move */}
//           {/* <div className="mb-6 sm:mb-0">
//             <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Next move</h3>
//             <ul className="space-y-1 sm:space-y-2">
//               {nextMoveLinks.map((link) => (
//                 <li key={link.title}>
//                   <a 
//                     href={link.href} 
//                     className="text-sm sm:text-base text-slate-600 hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
//                   >
//                     {link.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div> */}
//         {/* </div> */} 

//         {/* Middle Section - Contact, Apps, Social */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 py-6 sm:py-8 border-t border-gray-200">
        
//           <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-0">
//             <Mail className="w-5 h-5 text-blue-600 mr-2 mb-2 sm:mb-0 flex-shrink-0" />
//             <a href="mailto:support@zohobookings.com" className="text-blue-600 hover:text-blue-800 text-sm sm:text-base break-all">
//               support@zohobookings.com
//             </a>
//           </div>

//           {/* App Store Badges */}
//           {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-4 sm:mb-0">
//             <a href="#" className="block">
//               <img 
//                 src="https://www.nuffieldhealth.com/local/ea/89/8e7aba9f4b0c96409c88e65d08ff/apple-page-4col-roundel.png" 
//                 alt="Download on App Store" 
//                 className="h-10 sm:h-12 w-auto"
//               />
//             </a>
//             <a href="#" className="block">
//               <img 
//                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
//                 alt="Get it on Google Play" 
//                 className="h-10 sm:h-12 w-auto"
//               />
//             </a>
//           </div> */}

          
//         {/* </div> */} 

//         {/* Search Bar */}
//         {/* <div className="relative mb-6 sm:mb-8">
//           <input
//             type="text"
//             placeholder="Search for product overviews, FAQs, and more..."
//             className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//         </div> */}

//         {/* Language Selector */}
//         {/* <div className="mb-6 sm:mb-8">
//           <select className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//             <option value="en">English</option>
//             <option value="ar">العربية</option>
//             <option value="fr">Français</option>
//             <option value="es">Español</option>
//             <option value="de">Deutsch</option>
//           </select>
//         </div> */}

//         {/* Bottom Links */}
//         <div className="border-t border-gray-200 pt-6 sm:pt-8">
//           {/* Links Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
//             {bottomLinks.map((link) => (
//               <a 
//                 key={link.title}
//                 href={link.href} 
//                 className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors duration-200 py-1"
//               >
//                 {link.title}
//               </a>
              
//             ))}
//               {/* Social Media */}
//           <div className="flex gap-3 sm:gap-4 items-center justify-start ">
//             <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors duration-200">
//               <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
//             </a>
//             <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
//               <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
//             </a>
//             <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
//               <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
//             </a>
//             <a href="#" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
//               <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
//             </a>
//           </div>
//           </div>
          
//           {/* Copyright */}
//           <div className="text-center md:text-left">
//               <p className="text-gray-600">
//                 Copyright 2025 appointroll. All Rights Reserved | Powered by 
//                 <a 
//                   href="http://egydesigner.com/" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="ml-1 font-semibold text-purple-600 hover:text-purple-800 underline"
//                 >
//                   EGYdesigner
//                 </a>
//               </p>
//             </div>

//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;