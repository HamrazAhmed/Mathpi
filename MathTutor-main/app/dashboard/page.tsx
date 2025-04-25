// import { LayoutDashboard, Camera, BarChart2, User2, Settings } from 'lucide-react'
import { Metadata } from 'next'
import Dashboard from '@/components/dashboard/dashboard'
import CreditsWrapper from '../creditsWrapper'

export const metadata: Metadata = {
  title: 'Math Tutor Dashboard',
  description: 'Math Tutor is An AI Based Math Tutor which provides the ability to create and simplify your mathematical questions',
}

export default function Page() {
  return (
    <CreditsWrapper>
      <div className="flex min-h-screen">
        <Dashboard />
      </div>
    </CreditsWrapper>
  )
}