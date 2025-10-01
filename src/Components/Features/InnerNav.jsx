import React, { useState, useEffect } from 'react'
import MeetingTypes from './MeetingTypes'
import ManageAppoin from './ManageAppoin'
import IntegrationComponent from './IntegrationComponent'
import Customization from './customization'

export default function InnerNav() {
  const [activeSection, setActiveSection] = useState('meeting-types')
  const [showNavbar, setShowNavbar] = useState(false)

  const navItems = [
    { id: 'meeting-types', label: 'Meeting types' },
    { id: 'scheduling-rules', label: 'Scheduling rules' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'customization', label: 'Customization' },
  ]

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      setActiveSection(sectionId)
    }
  }

  // Track scroll position to highlight active section and show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      
      // Show navbar only after scrolling 400px
      if (scrollPosition >= 750) {
        setShowNavbar(true)
      } else {
        setShowNavbar(false)
      }

      // Track active section
      const scrollPositionWithOffset = scrollPosition + 100
      navItems.forEach(item => {
        const element = document.getElementById(item.id)
        if (element) {
          const elementTop = element.offsetTop
          const elementBottom = elementTop + element.offsetHeight

          if (scrollPositionWithOffset >= elementTop && scrollPositionWithOffset < elementBottom) {
            setActiveSection(item.id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Streamline meetings with
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          scheduling automation
        </h2>
      </div>

      {/* Inner Navigation - يظهر فقط بعد التمرير 400px */}
      <div className={`
        fixed top-10 left-1/2 -translate-x-1/2 mx-6 my-4 z-40 
        bg-black/35 border border-white/10 rounded-lg shadow-lg px-5 py-2 w-1/2
        transition-all duration-500 ease-in-out
        ${showNavbar 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 -translate-y-full invisible'
        }
      `}>
        <div className="">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex flex-wrap justify-center gap-2 py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    hover:bg-white/20 hover:scale-105 hover:shadow-lg
                    ${activeSection === item.id
                      ? 'bg-yellow-400 text-black shadow-lg scale-105'
                      : 'text-white border border-white/30 hover:border-white/50'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen">
        <div className=" mx-auto px-6 py-12">
          {navItems.map((item, index) => (
            <section 
              key={item.id} 
              id={item.id} 
              className="min-h-screen  flex items-center justify-center"
            >
              <div className="text-center">
                <div className="  rounded-2xl   ">
                  <h3 className="text-3xl font-bold text-white  ">
                    {item.label}
                  </h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-8"></div>
                  <p className="text-white/80 text-lg leading-relaxed ">
                    {item.id === 'meeting-types' &&<MeetingTypes/>}
                    {item.id === 'scheduling-rules' && <ManageAppoin />}
                    {item.id === 'integrations' && <IntegrationComponent />}
                    {item.id === 'customization' && <Customization />}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-yellow-400 text-black p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-110 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
}