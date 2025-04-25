"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
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
import axios from "axios"

export const AnimatedHeroContent = () => {
  const [donationAmount, setDonationAmount] = useState("10")
  const [donationError, setDonationError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    <div className="relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className="flex justify-center items-center mt-5">
          <h1 className="text-5xl">
            <span className="text-purple-700 font-semibold">MATH</span>
            <span className="text-orange-600 font-semibold">Pi</span>
          </h1>
          <Image src="/bot.png" height={40} width={40} alt="bot image" />
        </div>

        <motion.h1
          className="text-2xl md:text-4xl font-light mb-6 mt-10 leading-tight text-gray-900"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Master Math With AI Powered Learning
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Struggling with tricky equations? MathPi is your personal Al tutor, offering step-by-step guidance, instant
          problem-solving, and interactive lessons tailored just for you. Whether youre taking algebra or tackling
          calculus, MathPi adapts to your learning style to make math easier and more fun.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Login →
            </Button>
          </Link>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none"
              >
                Support MathPi
              </Button>
            </DialogTrigger>
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
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="w-full max-w-4xl mx-auto mt-12 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm border border-purple-100"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-purple-800">Support MathPi</h2>
            <p className="text-slate-600">
              Help us improve our platform and make math education accessible to everyone
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Donate Now
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </motion.div>
    </div>
  )
}