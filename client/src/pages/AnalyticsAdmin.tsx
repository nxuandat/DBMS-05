import React from 'react'

import UserAnalytics from '../components/Analytics/UserAnalytics'
import InvoiceAnalytics from '../components/Analytics/InvoiceAnalytics'
import AppointmentAnalytics from '../components/Analytics/AppointmentAnalytics'
import RevenueAnalytics from '../components/Analytics/RevenueAnalytics'


const AnalyticsAdmin = () => {
  return (
    <div>
        <div className="flex">
            <div className="w-[85%]">
               <UserAnalytics />
               <InvoiceAnalytics/>
               <AppointmentAnalytics/>
               <RevenueAnalytics/>
            </div>
        </div>
    </div>
  )
}

export default AnalyticsAdmin