'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const activities = [
  {
    project: 'Project 1',
    description: 'New images added to dataset',
    time: '2h ago'
  },
  {
    project: 'Project 2',
    description: 'New images added to dataset',
    time: '2h ago'
  },
  {
    project: 'Project 3',
    description: 'New images added to dataset',
    time: '2h ago'
  }
]

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-base lg:text-lg">Important Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0">
        <div className="space-y-6 flex justify-center items-center">
          <h1 className='text-xl font-semibold'>Comming Soon</h1>
          {/* {activities.map((activity, index) => (
            <motion.div
              key={activity.project}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start justify-between space-x-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.project}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
                {activity.time}
              </div>
            </motion.div>
          ))} */}
        </div>
      </CardContent>
    </Card>
  )
}

