"use client"

import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import axios from 'axios'
import { errorToast, successToast } from "@/helpers/toasts"
import { GradientRing } from "@/components/ui/gradient-ring"

const authSchema = z.object({
  email: z.string({
    message: "Email Address is Required.",
  }).email({
    message: "Please enter a valid email address.",
  }),
  name: z.string({
    message: "Name is Required.",
  }),
})

export default function Page() {
  const router = useRouter()

  const formEmail = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      name: ''
    },
  })

  const handleEmailSubmit = async (values: z.infer<typeof authSchema>) => {
    axios.post(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/login`, {
      email: values.email,
      name: values.name
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      successToast("Successfully Subscribed")
      router.push('/')

    }).catch(err => {
      errorToast(err.response.data.error)
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      <GradientRing className="left-[-300px] top-[20%] pointer-events-none hidden md:block z-10" />
      <GradientRing className="right-[-300px] bottom-[20%] pointer-events-none hidden md:block z-10" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] space-y-8"
      >
        <div className="flex items-center justify-center">
          <Image src="/MathPi.png" height={130} width={130} alt="mathpi logo"></Image>
        </div>

        {
          <Card className="bg-white">
            <CardContent className="pt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                    <div className="flex justify-center items-center">
                      <h1 className="text-4xl">
                        <span className="text-purple-700 font-semibold">MATH</span>
                        <span className="text-orange-600 font-semibold">Pi</span>
                      </h1>
                        <Image src='/bot.png' height={40} width={40} alt="bot image"></Image>
                    </div>
                
                <h1 className="text-2xl font-semibold text-center">
                  Subscribe to MathPI Account
                </h1>

                <form
                  onSubmit={formEmail.handleSubmit(handleEmailSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...formEmail.register("email")}
                      placeholder="Enter your email address..."
                      className="w-full"
                    />
                    {formEmail.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {formEmail.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      {...formEmail.register("name")}
                      placeholder="Enter your Name"
                      className="w-full"
                    />
                    {formEmail.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {formEmail.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-5 bg-[#1a1d21] hover:bg-[#2c2f33]"
                  >
                    Subscribe
                  </Button>

                </form>

              </motion.div>
            </CardContent>
          </Card>
        }
      </motion.div>
    </div>
  )
}
