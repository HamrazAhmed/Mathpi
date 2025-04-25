import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Mail, BookOpen, Shield } from "lucide-react"

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-4xl font-bold tracking-tight">MathPi</h1>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Terms of Use</h2>
          <div className="flex items-center justify-center text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <p>Effective Date: March 2025</p>
          </div>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome to MathPi!</CardTitle>
            <CardDescription>
              These Terms of Use ("Terms") govern your use of our website, mobile applications, learning tools, and
              related services (collectively, "Services"). By accessing or using MathPi, you agree to these Terms. If
              you do not agree, please do not use the Services.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {termsData.map((term) => (
            <Card key={term.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{term.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {term.content.map((paragraph, idx) => (
                    <div key={idx}>
                      {Array.isArray(paragraph) ? (
                        <ul className="list-disc pl-6 space-y-1">
                          {paragraph.map((item, itemIdx) => (
                            <li key={itemIdx} className="text-muted-foreground">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="my-8 shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Thank You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Thank you for using MathPi to support your learning journey. We're committed to providing a safe, secure,
              and empowering platform for all learners.
            </p>
          </CardContent>
        </Card>

        <footer className="text-center pt-6 pb-12">
          <Separator className="mb-6" />
          <h3 className="text-lg font-medium mb-2">Contact Us</h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions or concerns about these Terms, please contact us:
          </p>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Mail className="h-4 w-4" />
            <a href="mailto:MathPiTeam@gmail.com" className="hover:underline">
              MathPiTeam@gmail.com
            </a>
          </div>
          <div className="mt-2">
            <a href="https://www.mathpi.ai" className="text-primary hover:underline">
              https://www.mathpi.ai
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

const termsData = [
  {
    id: "eligibility",
    title: "1. Eligibility",
    content: [
      "You must be at least 13 years old to use MathPi unless authorized by a school, parent, or legal guardian. If you are under 18, you may only use the Services with appropriate consent. By using MathPi, you represent and warrant that you meet these requirements.",
    ],
  },
  {
    id: "use-of-services",
    title: "2. Use of the Services",
    content: [
      "You agree to:",
      [
        "Use the Services only for lawful, non-commercial, educational purposes.",
        "Comply with all applicable local, state, national, and international laws.",
        "Respect the rights and safety of other users, instructors, and platform administrators.",
      ],
      "You may not:",
      [
        "Post or transmit any content that is offensive, harmful, threatening, abusive, or illegal.",
        "Attempt to interfere with the operation or integrity of the platform.",
        "Use automated tools (bots, scrapers) to extract content or data.",
      ],
    ],
  },
  {
    id: "user-accounts",
    title: "3. User Accounts",
    content: [
      [
        "Certain features of MathPi require registration and creation of a user account.",
        "You agree to provide accurate, current, and complete information during the registration process.",
        "You are solely responsible for maintaining the confidentiality of your account credentials and for any activity under your account.",
        "MathPi reserves the right to suspend or terminate accounts that violate these Terms.",
      ],
    ],
  },
  {
    id: "freemium-paid-services",
    title: "4. Freemium & Paid Services",
    content: [
      [
        "MathPi offers a freemium model: core features are available free of charge to all users.",
        "Premium features, including advanced AI tutoring, step-by-step solutions, and additional practice sets, are available for purchase via credits.",
        "Payments are handled securely through third-party providers. MathPi does not store credit card or billing information.",
        "Subscription terms or credit-based purchases are subject to their respective payment provider's terms.",
      ],
    ],
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property",
    content: [
      [
        "All materials, including but not limited to software, graphics, logos, problem sets, and content, are owned or licensed by MathPi and protected by copyright and other intellectual property laws.",
        "You are granted a limited, non-exclusive, non-transferable license to use the Services for personal or academic purposes only.",
        "You may not modify, reproduce, distribute, or reverse engineer any part of the Services without explicit written consent.",
      ],
    ],
  },
  {
    id: "privacy",
    title: "6. Privacy",
    content: [
      [
        "Your use of MathPi is also governed by our Privacy Policy, which explains how we collect, use, and safeguard your data.",
        "MathPi complies with relevant laws, including:",
        "FERPA (Family Educational Rights and Privacy Act)",
        "COPPA (Children's Online Privacy Protection Act)",
        "GDPR (General Data Protection Regulation)",
        "We do not sell, trade, or misuse your personal information.",
      ],
    ],
  },
  {
    id: "third-party-services",
    title: "7. Third-Party Services",
    content: [
      [
        "MathPi may include links or integrations with third-party tools (e.g., Google Classroom, school LMS, payment processors).",
        "MathPi is not responsible for the privacy practices, terms, or performance of third-party services.",
      ],
    ],
  },
  {
    id: "termination",
    title: "8. Termination",
    content: [
      [
        "MathPi reserves the right to suspend or terminate your access to the Services at any time for conduct that we believe violates these Terms or is harmful to other users or our platform.",
        "You may cancel your account or stop using the Services at any time. Upon termination, your right to access MathPi will immediately cease.",
      ],
    ],
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers and Limitation of Liability",
    content: [
      [
        'MathPi is provided on an "as-is" and "as-available" basis without warranties of any kind.',
        "We do not guarantee uninterrupted access, error-free content, or specific academic outcomes.",
        "MathPi is not liable for any indirect, incidental, or consequential damages arising from the use of the platform.",
      ],
    ],
  },
  {
    id: "changes-to-terms",
    title: "10. Changes to Terms",
    content: [
      [
        "MathPi may update these Terms from time to time. Changes will be posted on our website with a revised effective date.",
        "Continued use of the Services after changes become effective constitutes your acceptance of the updated Terms.",
      ],
    ],
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    content: [
      "These Terms are governed by and construed in accordance with the laws of the jurisdiction in which MathPi operates, without regard to conflict of law principles.",
    ],
  },
]