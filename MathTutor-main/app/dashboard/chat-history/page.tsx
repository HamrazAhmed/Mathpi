"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, ArrowRight, Search } from "lucide-react";
import { Navigation } from "@/components/dashboard/navigation";
import { GradientRing } from "@/components/ui/gradient-ring";

export default function ChatHistoryPage() {
    const [chats, setChats] = useState([]);
    const [newChatName, setNewChatName] = useState("");
    const [newChatDescription, setNewChatDescription] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem("mathTutorToken");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.get("/api/users/chat", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setChats(response.data.chats);
            } catch (error) {
                console.error("Failed to fetch chats:", error);
            }
        };

        fetchChats();
    }, []);

    const handleCreateChat = async () => {
        if (!newChatName.trim() || !newChatDescription.trim()) {
            setError("Name and description are required!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("mathTutorToken");
            const response = await axios.post(
                "/api/users/chat",
                { name: newChatName, description: newChatDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setChats([...chats, response.data.chat]);

            setNewChatName("");
            setNewChatDescription("");
            setIsOpen(false);
            router.push("/dashboard");
        } catch {
            setError("Failed to create chat. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = chats.filter(
        (chat) =>
            chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row relative overflow-hidden w-full min-h-screen">
            <GradientRing className="left-[-260px] top-[3%] pointer-events-none hidden md:block z-10" />
            <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

            <Navigation />

            <main className="flex-1 p-4 flex flex-col items-center w-full">
                <div className="min-h-screen w-full p-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Chat History</h1>

                        <div className="mb-6 relative">
                            <Input
                                style={{ border: "2px solid #999" }}
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-full focus:border-gray-400 transition-colors"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>

                        <AnimatePresence>
                            {filteredChats?.map((chat, index) => (
                                <motion.div
                                    onClick={() => { router.push(`/dashboard/chat/${chat._id}`); }}
                                    key={chat._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="mb-4"
                                >
                                    <motion.div
                                        style={{ border: "2px solid #999" }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-gray-200 p-2 rounded-full">
                                                <MessageCircle className="text-gray-600" size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800">{chat.name}</h2>
                                                <p className="text-sm text-gray-500">{chat.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xs text-gray-400">{new Date(chat.createdAt).toLocaleString()}</span>
                                            <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-800 hover:bg-gray-200">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Create Chat Button & Modal */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button className="px-6 py-3 text-lg bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Create New Chat
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-gray-800">New Chat</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <label htmlFor="chatName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Chat Name
                                            </label>
                                            <Input
                                                id="chatName"
                                                type="text"
                                                placeholder="Enter chat name..."
                                                value={newChatName}
                                                onChange={(e) => setNewChatName(e.target.value)}
                                                className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="chatDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                                Chat Description
                                            </label>
                                            <Textarea
                                                id="chatDescription"
                                                placeholder="Enter chat description..."
                                                value={newChatDescription}
                                                onChange={(e) => setNewChatDescription(e.target.value)}
                                                className="w-full border-2 border-gray-200 focus:border-gray-400 rounded-lg"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <Button onClick={handleCreateChat} disabled={loading} className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition duration-300">
                                        {loading ? "Creating..." : "Create Chat"}
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
