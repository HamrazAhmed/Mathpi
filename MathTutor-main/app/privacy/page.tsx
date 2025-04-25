import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Mail, BookOpen, Shield, Lock } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-4xl font-bold tracking-tight">MathPi</h1>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h2>
          <div className="flex items-center justify-center text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <p>Effective Date: March 2025</p>
          </div>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Our Commitment to Privacy
            </CardTitle>
            <CardDescription>
              MathPi is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store,
              and safeguard personal information when students, parents, educators, or school districts use our
              services.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {privacyData.map((section) => (
            <Card key={section.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.content.map((paragraph, idx) => (
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
                  {section.subsections && (
                    <div className="mt-4 space-y-4">
                      {section.subsections.map((subsection, subIdx) => (
                        <div key={subIdx} className="ml-2">
                          <h4 className="font-medium mb-2">{subsection.title}</h4>
                          <ul className="list-disc pl-6 space-y-1">
                            {subsection.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-muted-foreground">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
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
            <p className="text-muted-foreground">Thank you for trusting MathPi to support your learning journey.</p>
          </CardContent>
        </Card>

        <footer className="text-center pt-6 pb-12">
          <Separator className="mb-6" />
          <h3 className="text-lg font-medium mb-2">Contact Us</h3>
          <p className="text-muted-foreground mb-4">
            If you have questions or concerns about this Privacy Policy, please reach out:
          </p>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Mail className="h-4 w-4" />
            <a href="mailto:mathpiteam@gmail.com" className="hover:underline">
              mathpiteam@gmail.com
            </a>
          </div>
          <div className="mt-2">
            <a href="https://www.mathpi.ai" className="text-primary hover:underline">
              www.mathpi.ai
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

const privacyData = [
  {
    id: "compliance",
    title: "1. Compliance with Privacy Laws",
    content: [
      "MathPi complies with the following data privacy regulations:",
      [
        "FERPA (Family Educational Rights and Privacy Act): We safeguard the privacy of student education records and only collect data necessary for educational purposes.",
        "COPPA (Children's Online Privacy Protection Act): We do not knowingly collect personal information from children under 13 without verifiable parental or school consent.",
        "GDPR (General Data Protection Regulation): We support user rights around data access, correction, deletion, and processing transparency.",
      ],
    ],
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    subsections: [
      {
        title: "a. For Students:",
        items: [
          "First name (optional)",
          "Grade level or course (if provided)",
          "Progress data (assignments completed, scores)",
          "Login identifier (e.g., school ID, Google sign-in)",
        ],
      },
      {
        title: "b. For Educators/Parents:",
        items: ["Name and email address", "School or organization affiliation"],
      },
    ],
    content: [],
  },
  {
    id: "information-use",
    title: "3. How We Use Your Information",
    content: [
      "We use collected information to:",
      [
        "Provide personalized learning experiences",
        "Track and report progress to educators and parents",
        "Improve MathPi platform functionality and content",
      ],
      "We do not sell or share personal information with third-party advertisers.",
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: [
      [
        "All data is encrypted in transit (HTTPS) and at rest",
        "Access is limited to authorized users with appropriate credentials",
        "Regular security audits and monitoring are conducted to maintain system integrity",
      ],
    ],
  },
  {
    id: "childrens-privacy",
    title: "5. Children's Privacy",
    content: [
      "For users under 13, MathPi requires verifiable parental consent or school authorization before collecting any personal data.",
      "Parents and schools may:",
      ["Review the child's data", "Request deletion of the data", "Withdraw consent at any time"],
    ],
  },
  {
    id: "data-sharing",
    title: "6. Data Sharing",
    content: [
      "We only share data with:",
      [
        "Authorized educators or school administrators",
        "Service providers under strict data protection agreements",
        "Government or legal entities when required by law",
      ],
      "We do not sell or lease user data under any circumstances.",
    ],
  },
  {
    id: "data-retention",
    title: "7. Data Retention and Deletion",
    content: [
      "MathPi retains user data only as long as necessary to provide services or comply with legal obligations.",
      "Users may request data deletion at any time by contacting us at: mathpiteam@gmail.com",
    ],
  },
  {
    id: "user-rights",
    title: "8. Your Rights",
    content: [
      "Users may:",
      [
        "Access their personal data",
        "Correct or update inaccurate data",
        "Request data deletion or a copy of their data",
        "Withdraw consent (where applicable)",
      ],
      "Requests can be made via email at mathpiteam@gmail.com",
    ],
  },
  {
    id: "policy-changes",
    title: "9. Changes to This Policy",
    content: [
      "We may update this Privacy Policy as necessary. Significant changes will be communicated via our website or email notification.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      "If you have questions or concerns about this Privacy Policy, please reach out:",
      "Email: mathpiteam@gmail.com",
      "Website: www.mathpi.ai",
    ],
  },
]