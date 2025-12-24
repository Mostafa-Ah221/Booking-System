import React from 'react'
import Header from './Header'
import Steps from './Steps'
import SchedulingApp from './SchedulingApp'
import Trusted from './Trusted'
import Slider from './Slider'
import TestimonialSlider from './TestimonialSlider'
import AppointmentManagementApp from './AppointmentManagementApp'

export default function Home() {
  return (
    <div>
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <Header/>   
        <Steps/> 
    </div>
        <SchedulingApp/> 
         <div style={{
            backgroundImage: "url('https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-bottom-cta-img.svg')",
            backgroundPosition: "center",
            height: "100%", 
            width: "100%" 
        }}>
            <Trusted/>
            <Slider/>
            <TestimonialSlider />
        </div>
        <AppointmentManagementApp/>
      
    </div>
  )
}
