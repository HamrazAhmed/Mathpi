import { Navigation } from "@/components/dashboard/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GradientRing } from '@/components/ui/gradient-ring'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import React from 'react'

const Page = () => {
    return (
        <div className="flex flex-col lg:flex-row relative overflow-hidden w-full min-h-screen">
            <GradientRing className="left-[-260px] top-[3%] pointer-events-none hidden md:block z-10" />
            <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

            <Navigation />

            <main className="flex-1 p-4 flex flex-col items-center w-full">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold text-center text-purple-600 mb-10">Find Tutor</h1>
                </div>
                <Badge
            variant="outline"
            className="mb-4 py-1.5 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-full font-semibold text-md mb-10"
          >
            Feature coming soon...
          </Badge>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                    <div className="relative w-[600px] max-w-[600px]">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-indigo-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search for a tutor or mentor..."
                            className="pl-10 py-6 pr-4 rounded-full border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800 shadow-md focus-visible:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors">
                                <Search className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <div>
                        <h1 className="text-4xl font-bold text-center text-purple-600 mb-10">Tutor</h1>
                        <div className="aspect-video rounded-lg flex items-center justify-center">
                            <img
                                src="/tutor.webp"
                                alt="Gamified Learning"
                                className="rounded-lg object-cover"
                                width={250}
                                height={250}
                            />
                        </div>

                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-center text-purple-600 mb-10">Mentor</h1>
                        <div className="aspect-video rounded-lg flex items-center justify-center">
                            <img
                                src="/mentor.webp"
                                alt="Gamified Learning"
                                className="rounded-lg object-cover"
                                width={250}
                                height={250}
                            />
                        </div>

                    </div>
                </div>

            </main>
        </div>
    )
}

export default Page