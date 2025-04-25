"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Camera, User2, Settings, Menu, LogOut, PersonStanding, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { successToast } from "@/helpers/toasts";
import Image from "next/image";
import { HiQuestionMarkCircle } from "react-icons/hi";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "AI Learning", icon: Camera, href: "/dashboard/agent" },
  { title: "Gamified Learning", icon: User2, href: "/dashboard/roadmap" },
  { title: "Practice Problems", icon: HiQuestionMarkCircle, href: "/dashboard/quiz" },
  { title: "Personalized Learning", icon: PersonStanding, href: "/dashboard/learning" },
  { title: "Find Tutor", icon: FileDown, href: "/dashboard/tutor" },
  { title: "Manage Credits", icon: Settings, href: "/dashboard/payment" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // const handleCreateChat = async () => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("mathTutorToken");
  //     if (!token) throw new Error("Authentication token not found.");

  //     const chatName = `Chat-${generateRandomId(10)}`;
  //     const chatDescription = "New Chat";

  //     const response = await axios.post(
  //       "/api/users/chat",
  //       { name: chatName, description: chatDescription },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     successToast("Chat created successfully!");
  //     router.push(`/dashboard/chat/${response.data.chat._id}`);
  //   } catch (error) {
  //     console.error("Chat creation failed:", error);
  //     errorToast("Failed to create chat. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const NavContent = () => (
    <div className="flex h-full flex-col min-h-screen p-4 w-[250px]">
      <div className="px-6 py-3 flex justify-center">
        <Image src="/MathPi.png" height={100} width={100} alt="mathpi logo" />
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <div
            key={item.title}
            onClick={() => {
              setOpen(false);
              router.push(item.href);
            }}
            className={
              cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-purple-100 hover:text-purple-800 cursor-pointer",
                item.href === "/dashboard/chat/" && pathname.startsWith("/dashboard/chat/")
                  ? "bg-purple-200 text-purple-900" // Highlight "New Chat" dynamically
                  : pathname === item.href
                    ? "bg-purple-200 text-purple-900" // Highlight exact matches
                    : ""
              )
            }
          >
              <item.icon className="h-5 w-5 text-purple-500" />
            <p className="text-lg">{item.title}</p>
          </div>
        ))}
        <div
          onClick={() => {
              router.push('/');
              successToast("Successfully Logged Out");
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-muted-foreground transition-all duration-300 hover:bg-red-100 hover:text-red-600 cursor-pointer"
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <p className="text-lg">Log Out</p>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation with Hover Animation */}
      <motion.div
        initial={{ width: 250, opacity: 1 }}
        animate={{
          width: isHovered ? 250 : 250,
          opacity: isHovered ? 0.9 : 1,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden lg:block border-r bg-white shadow-lg h-screen fixed left-0 top-0 transition-all overflow-hidden relative"
      >
        <NavContent />
      </motion.div>
    </>
  );
}
