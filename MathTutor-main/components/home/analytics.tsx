import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GradientRing } from "../ui/gradient-ring"

export default function Analytics() {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <GradientRing className="left-[-300px] top-[20%] pointer-events-none hidden md:block z-10" />
            <GradientRing className="right-[-300px] bottom-[20%] pointer-events-none hidden md:block z-10" />
            <main className="container w-full px-4 py-16 relative overflow-hidden">
                <div className="text-center mb-20">
                    <div className="text-sm text-gray-600 mb-4">Math Tutor App MAIN FEATURES</div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
                        AI-powered Learning for All Levels
                    </h1>
                    <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                        Unlock the power of AI to enhance your math learning experience. Simply capture a picture of your math question, and our AI analyzes it to provide the most accurate solution. Get detailed, step-by-step explanations, including video tutorials, tailored to your specific question, making complex problems easy to understand.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* AI-based Analysis Card */}
                    <Card className="p-8 text-center border-2">
                        <CardContent className="p-0">
                            <div className="text-4xl font-bold mb-4">AI Learning</div>
                            <h3 className="font-semibold mb-3 text-lg">Instant Problem Solving</h3>
                            <p className="text-gray-600">
                                Capture an image of your math question, and our AI will analyze it to provide the best solution and video explanation, helping you understand the steps involved.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Video Explanation Card */}
                    <Card className="p-8 text-center border-2">
                        <CardContent className="p-0">
                            <div className="text-4xl font-bold mb-4">Video Results</div>
                            <h3 className="font-semibold mb-3 text-lg">Step-by-Step Explanations</h3>
                            <p className="text-gray-600 mb-4">
                                Learn with video tutorials that break down every step of the problem-solving process, making it easier to follow and grasp mathematical concepts.
                            </p>
                            <Button variant="outline" className="rounded-full px-6">
                                Explore AI Learning
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    )
}
