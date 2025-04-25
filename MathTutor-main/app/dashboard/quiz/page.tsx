"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, Trophy, Brain, ChevronRight, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/dashboard/navigation"
import { GradientRing } from "@/components/ui/gradient-ring"
import axios from "axios"
import { errorToast } from "@/helpers/toasts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreditsWrapper from "@/app/creditsWrapper"

export default function QuizApp() {
    const [step, setStep] = useState<"topic" | "quiz" | "results">("topic")
    const [topic, setTopic] = useState("")
    const [QUIZ_DATA, setQUIZ_DATA] = useState([])
    const [currentAnswers, setCurrentAnswers] = useState<string[]>(new Array(QUIZ_DATA.length).fill(""))
    const [score, setScore] = useState(0)
    const [complexity, setComplexity] = useState("medium")

    useEffect(() => {
        const intervalId = setInterval(() => {
            const storedCredits = sessionStorage.getItem("credits");
            setCredits(storedCredits);
            if (storedCredits) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    const handleTopicSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleStart(topic);
    }

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        const newAnswers = [...currentAnswers]
        newAnswers[questionIndex] = answer
        setCurrentAnswers(newAnswers)
    }

    const handleQuizSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentAnswers.some((answer) => !answer)) {
            errorToast("Please answer all questions")
            return
        }

        let correctCount = 0
        QUIZ_DATA.forEach((question, index) => {
            if (question.correct === currentAnswers[index]) {
                correctCount++
            }
        })
        setScore(correctCount)
        setStep("results")
        scrollToTop();
    }
    const [started, setStarted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [credits, setCredits] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCredits = sessionStorage.getItem("credits");
            setCredits(storedCredits);
        }
    }, []);

    const progress = (currentAnswers.filter((answer) => answer).length / QUIZ_DATA.length) * 100

    const handleStart = async (topic1) => {
        const topic = topic1;
        if (topic) {
            setStarted(true)
            setLoading(true)

            const token = localStorage.getItem("mathTutorToken")

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/quiz`,
                    {
                        topic: topic,
                        complexity: complexity,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                const jsonString = res.data.quizData.match(/\[\s*\{.*\}\s*\]/s)[0]
                const jsonData = JSON.parse(jsonString)
                setQUIZ_DATA(jsonData)
                setCurrentAnswers(new Array(jsonData.length).fill(""))
                setScore(0)
                setCredits(res.data.credits)
                sessionStorage.setItem('credits', res.data.credits)        
                if (topic.trim()) {
                    setStep("quiz")
                }
                scrollToTop();
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Enables smooth scrolling animation
        });
    };


    return (
        <CreditsWrapper>

            <div className="flex flex-col lg:flex-row relative overflow-hidden w-full min-h-screen">
                <GradientRing className="left-[-260px] top-[3%] pointer-events-none hidden md:block z-10" />
                <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

                <Navigation />
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
                        <Loader2 className="animate-spin h-12 w-12 text-white" />
                    </div>
                )}


                <main className="flex-1 p-4 flex flex-col items-center w-full">

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

                        <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 w-full flex flex-col justify-center items-center">
                            <div className="max-w-2xl mx-auto w-full">
                                <AnimatePresence mode="wait">
                                    {step === "topic" && (
                                        <motion.div
                                            key="topic"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h1 className="text-4xl font-bold text-center text-purple-600 mb-10">Practice Problems</h1>

                                            <Card className="p-8 backdrop-blur-sm bg-white/80">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                                                >
                                                    <Brain className="w-8 h-8 text-white" />
                                                </motion.div>
                                                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                                                    Knowledge Quest
                                                </h1>
                                                <p className="text-center text-gray-500 mb-8">Begin your journey of discovery</p>
                                                <form onSubmit={handleTopicSubmit} className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">Enter Quiz Topic</label>
                                                        <Input
                                                            value={topic}
                                                            onChange={(e) => setTopic(e.target.value)}
                                                            placeholder="e.g., Trignometric Equation"
                                                            className="h-12"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">Complexity Level</label>
                                                        <Select value={complexity} onValueChange={setComplexity}>
                                                            <SelectTrigger className="h-12">
                                                                <SelectValue placeholder="Select complexity" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="easy">Easy</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="complex">Complex</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                                    >
                                                        Start Your Quest <ChevronRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </form>
                                            </Card>
                                        </motion.div>
                                    )}

                                    {step === "quiz" && (
                                        <motion.div
                                            key="quiz"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className="p-8 backdrop-blur-sm bg-white/80">
                                                <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                                                    {topic}
                                                </h1>
                                                <div className="mb-8">
                                                    <Progress value={progress} className="h-2" />
                                                    <p className="text-center text-sm text-gray-500 mt-2">
                                                        {currentAnswers.filter((answer) => answer).length} of {QUIZ_DATA.length} questions answered
                                                    </p>
                                                </div>

                                                <form onSubmit={handleQuizSubmit} className="space-y-6">
                                                    {QUIZ_DATA.map((question, qIndex) => (
                                                        <motion.div
                                                            key={qIndex}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: qIndex * 0.1 }}
                                                            className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                                                        >
                                                            <h3 className="font-medium mb-4 text-lg">
                                                                {qIndex + 1}. {question.title}
                                                            </h3>
                                                            <div className="space-y-3">
                                                                {Object.entries(question)
                                                                    .filter(([key]) => key.startsWith("option"))
                                                                    .map(([key, value]) => (
                                                                        <motion.label
                                                                            key={key}
                                                                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${currentAnswers[qIndex] === key ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
                                                                                }`}
                                                                            whileHover={{ scale: 1.01 }}
                                                                            whileTap={{ scale: 0.99 }}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name={`question-${qIndex}`}
                                                                                value={key}
                                                                                checked={currentAnswers[qIndex] === key}
                                                                                onChange={() => handleAnswerSelect(qIndex, key)}
                                                                                className="mr-3"
                                                                            />
                                                                            <span>{value}</span>
                                                                        </motion.label>
                                                                    ))}
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                                        <Button
                                                            type="submit"
                                                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                                        >
                                                            Submit Quiz
                                                        </Button>
                                                    </motion.div>
                                                </form>
                                            </Card>
                                        </motion.div>
                                    )}

                                    {step === "results" && (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className="p-8 backdrop-blur-sm bg-white/80">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 260,
                                                        damping: 20,
                                                    }}
                                                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                                                >
                                                    <Trophy className="w-10 h-10 text-white" />
                                                </motion.div>

                                                <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                                                    Quiz Complete!
                                                </h1>

                                                <motion.div
                                                    className="text-center mb-8"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                                                        {score} / {QUIZ_DATA.length}
                                                    </div>
                                                    <div className="text-gray-500">You got {score} questions correct</div>
                                                </motion.div>

                                                <div className="space-y-6">
                                                    {QUIZ_DATA.map((question, index) => {
                                                        const isCorrect = currentAnswers[index] === question.correct
                                                        return (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className={`border rounded-lg p-6 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}
                                                            >
                                                                <div className="flex gap-3">
                                                                    {isCorrect ? (
                                                                        <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                                                    ) : (
                                                                        <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                                                                    )}
                                                                    <div>
                                                                        <h3 className="font-medium text-lg">
                                                                            {index + 1}. {question.title}
                                                                        </h3>
                                                                        <div className="mt-3 space-y-2">
                                                                            <div className="font-medium">
                                                                                Your answer: {question[currentAnswers[index] as keyof typeof question]}
                                                                            </div>
                                                                            {!isCorrect && (
                                                                                <div className="text-green-600 font-medium">
                                                                                    Correct answer: {question[question.correct as keyof typeof question]}
                                                                                </div>
                                                                            )}
                                                                            <div className="mt-3 text-gray-600 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
                                                                                <span className="font-medium">Explanation:</span> {question.reason}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    })}
                                                </div>

                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                                    <Button
                                                        className="w-full mt-8 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                                        onClick={() => {
                                                            setTopic("")
                                                            setCurrentAnswers(new Array(QUIZ_DATA.length).fill(""))
                                                            setScore(0)
                                                            setStep("topic")
                                                            scrollToTop();
                                                        }}
                                                    >
                                                        Start New Quiz
                                                    </Button>
                                                </motion.div>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </main>
                </main>
            </div>
        </CreditsWrapper>
    )
}