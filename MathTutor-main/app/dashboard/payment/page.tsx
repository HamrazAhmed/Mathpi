"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/dashboard/navigation"
import { GradientRing } from "@/components/ui/gradient-ring"
import axios from "axios"
import CreditsWrapper from "@/app/creditsWrapper"
import { successToast } from "@/helpers/toasts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SubscriptionPage() {
  const [currentSubscription, setCurrentSubscription] = useState<string | null>("")
  const [credits, setCredits] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState<string>("10")
  const [donationError, setDonationError] = useState<string | null>(null)

  const plans = [
    {
      id: "basic",
      name: "MathPi Basic",
      price: "$5",
      credits: 50,
      description: "Perfect for beginners starting their math journey",
      features: ["50 Credits", "Assistant Guidance", "Gamified Learning", "Practice Problems", "Personalized Learning"],
      icon: Sparkles,
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      activeColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      borderColor: "border-blue-200",
      activeBorderColor: "border-blue-400",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "gold",
      name: "MathPi Gold",
      price: "$10",
      credits: 120,
      description: "Our most popular plan for dedicated learners",
      features: [
        "120 Credits",
        "Assistant Guidance",
        "Gamified Learning",
        "Practice Problems",
        "Personalized Learning",
        "Priority Support",
      ],
      icon: Star,
      color: "bg-gradient-to-br from-amber-50 to-amber-100",
      activeColor: "bg-gradient-to-br from-amber-100 to-amber-200",
      borderColor: "border-amber-200",
      activeBorderColor: "border-amber-400",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      popular: true,
    },
    {
      id: "platinum",
      name: "MathPi Platinum",
      price: "$20",
      credits: 300,
      description: "Ultimate learning experience with maximum resources",
      features: [
        "300 Credits",
        "Assistant Guidance",
        "Gamified Learning",
        "Practice Problems",
        "Personalized Learning",
        "Priority Support",
        "1-on-1 Tutoring Sessions",
        "Advanced Problem Sets",
      ],
      icon: Crown,
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      activeColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      borderColor: "border-purple-200",
      activeBorderColor: "border-purple-400",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  const fetchCurrentPlan = () => {
    const token = localStorage.getItem("mathTutorToken")
    if (!token) {
      console.error("No token found")
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/userdetails`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentSubscription(res.data.plan)
        sessionStorage.setItem("credits", res.data.credits)
        setCredits(res.data.credits)
      })
      .catch(() => {
        alert("error")
      })
  }

  useEffect(() => {
    fetchCurrentPlan()
  }, [])

  const handleSubscribe = (planId: string) => {
    const token = localStorage.getItem("mathTutorToken")
    if (!token) {
      console.error("No token found")
      return
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/stripe/checkout`,
        {
          planId: planId,
        },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        if (res.data.message) {
          successToast(res.data.message)
          return
        }
        window.location.href = res.data.sessionUrl
      })
      .catch(() => {
        alert("error")
      })

    // setCurrentSubscription(planId)
    // console.log(`Subscribed to ${planId}`)
  }

  const handleCancel = () => {
    const token = localStorage.getItem("mathTutorToken")
    if (!token) {
      console.error("No token found")
      return
    }

    axios
      .delete(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/stripe/checkout`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.message) {
          successToast(res.data.message)
          setCurrentSubscription("")
          return
        }
      })
      .catch(() => {
        alert("error")
      })
  }

  const handleDonation = () => {
    const amount = Number.parseFloat(donationAmount)

    if (isNaN(amount) || amount < 1) {
      setDonationError("Please enter an amount greater than $1")
      return
    }

    setDonationError(null)
    const token = localStorage.getItem("mathTutorToken")
    if (!token) {
      console.error("No token found")
      return
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/stripe/payment`,
        {
          amount: amount,
        },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        window.location.href = res.data.paymentUrl;
      })
      .catch(() => {
        alert("Error processing donation")
      })
  }

  return (
    <CreditsWrapper>
      <div className="flex flex-col relative overflow-hidden lg:flex-row w-full min-h-screen">
        <GradientRing className="left-[-260px] top-[7%] pointer-events-none hidden md:block z-10" />
        <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

        <Navigation />

        <main className="flex-1 p-4 lg:p-8 w-full">
          <motion.div
            className="absolute top-4 right-4 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            <motion.div
              className="flex items-center justify-center w-auto px-4 h-12 rounded-full bg-white/90 text-purple-600 shadow-lg hover:shadow-md hover:cursor-pointer"
              style={{ border: "2px solid #7c3aed" }}
              whileHover={{
                scale: 1.05,
                borderColor: "#9f7aea",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  opacity: [1, 0.9, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                Credits Remaining: {credits}
              </motion.span>
            </motion.div>
          </motion.div>

          <main className="flex-1 p-4 flex flex-col items-center justify-center">
            <Dialog>
              <div className="w-full max-w-7xl mx-auto mb-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-800">Support MathPi</h2>
                    <p className="text-slate-600">
                      Help us improve our platform and make math education accessible to everyone
                    </p>
                  </div>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Donate Now
                    </Button>
                  </DialogTrigger>
                </div>
              </div>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Contribute to MathPi</DialogTitle>
                  <DialogDescription>
                    Your donation helps us improve our platform and create better learning experiences.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="donation" className="text-right">
                      Amount ($)
                    </Label>
                    <Input
                      id="donation"
                      type="number"
                      min="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  {donationError && <p className="text-sm text-red-500">{donationError}</p>}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleDonation}>
                    Donate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Choose Your <span className="text-primary">MathPi</span> Plan
                  </h1>
                  <p className="mt-5 max-w-xl mx-auto text-xl text-slate-600">
                    Unlock your mathematical potential with our flexible subscription plans
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
                  {plans.map((plan) => {
                    const isCurrentPlan = currentSubscription === plan.id

                    return (
                      <Card
                        key={plan.id}
                        className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${
                          isCurrentPlan ? plan.activeBorderColor : plan.borderColor
                        } ${isCurrentPlan ? plan.activeColor : plan.color}`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0">
                            <Badge className="m-2 bg-amber-500">Most Popular</Badge>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center mb-2">
                            <plan.icon className={`h-8 w-8 ${isCurrentPlan ? "text-primary" : "text-slate-600"}`} />
                            {isCurrentPlan && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                                Current Plan
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                          <div className="flex items-baseline mt-2">
                            <span className="text-3xl font-extrabold">{plan.price}</span>
                            <span className="ml-1 text-slate-600">/month</span>
                          </div>
                          <CardDescription className="mt-2">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">{plan.credits}</span>
                            </div>
                            <span className="ml-3 text-slate-700 font-medium">Credits per month</span>
                          </div>
                          <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          {isCurrentPlan ? (
                            <Button
                              variant="outline"
                              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={handleCancel}
                            >
                              Cancel Subscription
                            </Button>
                          ) : (
                            <Button className={`w-full ${plan.buttonColor}`} onClick={() => handleSubscribe(plan.id)}>
                              Subscribe Now
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>

                <div className="mt-16 text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Why Choose MathPi?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Interactive Learning</h3>
                      <p className="text-slate-600">
                        Engage with our gamified platform that makes learning math fun and effective
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Personalized Approach</h3>
                      <p className="text-slate-600">
                        Our AI adapts to your learning style and pace for maximum improvement
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Expert Guidance</h3>
                      <p className="text-slate-600">
                        Access to quality problems and guidance from math education experts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </main>
      </div>
    </CreditsWrapper>
  )
}

