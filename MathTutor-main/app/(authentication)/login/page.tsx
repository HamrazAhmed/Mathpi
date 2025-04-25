"use client"

import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import logo from '@/assets/math-tutor-logo.png'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import axios from 'axios'
import EmailSent from "@/components/ui/emailSent"
import { errorToast, successToast } from "@/helpers/toasts"
import { GradientRing } from "@/components/ui/gradient-ring"

const authSchema = z.object({
  email: z.string({
    message: "Email Address is Required.",
  }).email({
    message: "Please enter a valid email address.",
  }),
  password: z.string({
    message: "Password is Required.",
  }).min(6, "Password must be at least 6 characters long."),
})

export default function Page() {
  const [isEmailVerified, setIsEmailVerified] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formEmail = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ''
    },
  })

  const handleEmailSubmit = async (values: z.infer<typeof authSchema>) => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/verify?email=${values.email}&password=${values.password}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      setLoading(false);

      if (response.data.emailSent) {
        setIsEmailVerified(false)
        return
      } else {
        successToast("Successfully logined")
        localStorage.setItem('mathTutorToken', response.data.token)
        router.push('/dashboard')
      }
    }).catch(err => {
      setLoading(false);
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
          isEmailVerified && <Card className="bg-white">
            <CardContent className="pt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-center items-center mb-5">
                  <h1 className="text-4xl">
                    <span className="text-purple-700 font-semibold">MATH</span>
                    <span className="text-orange-600 font-semibold">Pi</span>
                  </h1>
                  <Image src='/bot.png' height={40} width={40} alt="bot image"></Image>
                </div>

                <h1 className="text-2xl font-semibold text-center">
                  Sign in to Math Tutor Account
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
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      {...formEmail.register("password")}
                      placeholder="Enter your Password"
                      className="w-full"
                    />
                    {formEmail.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {formEmail.formState.errors.password.message}
                      </p>
                    )}
                    <p className="font-light text-xs text-gray-600 pr-3">Your password must contain at least 6 characters.</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-5 bg-[#1a1d21] hover:bg-[#2c2f33]"
                  >
                    {!loading ? "Sign In →" : "Signing In..."}
                  </Button>

{/* 
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full py-5"
                    onClick={() => console.log("Google sign up")}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </Button> */}

                  <p className="text-center text-sm text-muted-foreground mb-10">
                    <span className="font-semibold pr-1">Dont have an account?</span>
                    <Link href="/register" className="underline font-semibold">
                      Sign up
                    </Link>
                  </p>
                </form>

              </motion.div>
            </CardContent>
          </Card>
        }


        {!isEmailVerified && <EmailSent email={formEmail.getValues('email')} />}

      </motion.div>
    </div>
  )
}
