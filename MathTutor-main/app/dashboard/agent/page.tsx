'use client'

import { Navigation } from "@/components/dashboard/navigation";
import { motion } from "framer-motion"
import Markdown from "@/components/markdown";
import axios from "axios";
import { Loader, Send, User, Image as ImageIcon, XCircle, Mic, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { errorToast } from "@/helpers/toasts";
import logo from '@/assets/math-tutor-logo.png'
import Image from "next/image";
import { GradientRing } from "@/components/ui/gradient-ring";
import CreditsWrapper from "@/app/creditsWrapper";

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}

// Define the window augmentation for Speech Recognition
declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

interface Message {
    sender: string;
    text: string;
    type: string;
    isLoading: boolean;
    imageUrl?: string;
}

const Page = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [credits, setCredits] = useState<string | null>(null);

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

    const scrollToBottom = () => {
        const chatContainer = document.querySelector(".scrollable")
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }
      }
    
      useEffect(() => {
        // Scroll to bottom when messages change
        scrollToBottom()
        // Also set a small timeout to ensure scrolling happens after rendering
        const timeoutId = setTimeout(scrollToBottom, 100)
        return () => clearTimeout(timeoutId)
      }, [messages])
    

    const images = [
        {
            name: "Algebra",
            url: "/images/algebra.JPG",
        },
        {
            name: "Geometry",
            url: "/images/geometry.JPG",
        },
        {
            name: "Calculus",
            url: "/images/calculus.JPG",
        },
        {
            name: "Statistics",
            url: "/images/statistics.JPG",
        },
        {
            name: "Basic Maths",
            url: "/images/basicmath.JPG",
        },
        {
            name: "Pre Algebra",
            url: "/images/prealgebra.JPG",
        },
        {
            name: "Pre Calculus",
            url: "/images/precalculus.JPG",
        },
    ]


    const ImageGrid = () => {
        return (
            <div className="flex justify-center">
                <div className="flex items-center justify-center max-w-[500px] px-4 flex-wrap mx-auto gap-4 p-4">
                    {images.map((image, index) => (
                        <div key={index} className="flex flex-col items-center mx-auto justify-center">
                            <p className="mt-2 text-center font-medium text-xl mb-2 text-purple-500">{image.name}</p>
                            <Image
                                src={image.url}
                                alt={image.name}
                                width={100}
                                height={100}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const SpeechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;

            if (SpeechRecognitionConstructor) {
                recognitionRef.current = new SpeechRecognitionConstructor();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = "en-US";

                recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                    let transcriptText = "";
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcriptText += event.results[i][0].transcript;
                    }
                    setInputValue(transcriptText);
                };

                recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech Recognition Error:", event.error);
                };

                recognitionRef.current.start();
                setIsRecording(true);
            } else {
                console.error("Speech Recognition API not supported in this browser.");
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
        handleSendMessage();
    };
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return errorToast("Please select an image file");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "mathpi");
        formData.append("folder", "competition_submissions");

        try {
            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                formData,
            );

            setPreviewUrl(cloudinaryResponse.data.secure_url);
            setSelectedImage(file);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {
            console.error("Error uploading image:", error);
            errorToast("Upload failed. Please try again.");
        }
    };

    const removeImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() && !selectedImage) return;

        if (!previewUrl && !prompt) {
            return;
        }
        const newMessage: Message = {
            sender: "User",
            type: 'text',
            text: inputValue,
            isLoading: true,
            imageUrl: previewUrl || undefined,
        };

        const messagesList = [...messages, newMessage];
        const tempValue = inputValue;

        setMessages(messagesList);
        setInputValue("");
        setSelectedImage(null);
        setPreviewUrl(null);

        const token = localStorage.getItem("mathTutorToken");
        if (!token) {
            console.error("No token found");
            return;
        }

        axios.post(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/agent`, {
            prompt: inputValue,
            messages: messagesList,
            type: newMessage.imageUrl ? 'image' : 'text',
            imageLink: newMessage.imageUrl,
        }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        }).then((res) => {
            setMessages((prev) => [
                ...prev.filter(msg => msg !== newMessage),
                { sender: "User", type: 'text', text: tempValue, isLoading: false, imageUrl: previewUrl || undefined },
                { sender: "Assistant", type: 'text', text: res.data.choices[0].message.content, isLoading: false },
            ]);
            setCredits(res.data.checkCount)
            sessionStorage.setItem('credits', res.data.checkCount)
        }).catch(() => {
            setMessages((prev) => prev.map(msg => msg === newMessage ? { ...msg, isLoading: false } : msg));
        });
    };

    return (
        <CreditsWrapper>
            <div className="flex flex-col relative overflow-hidden lg:flex-row w-full max-h-screen">
                <GradientRing className="left-[-260px] top-[7%] pointer-events-none hidden md:block z-10" />
                <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

                <Navigation />
                <main className="flex-1 p-4 flex flex-col items-center justify-center relative">
                    {!messages.length ? (
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

                            <div className="w-full flex flex-col min-h-[500px] justify-center items-center px-3">
                                <h1 className="text-4xl font-bold text-center text-purple-600 mb-20">AI Learning</h1>
                                <div className="flex justify-center items-center">

                                    <Image className="mr-2" src="/bot.png" height={40} width={40} alt="mathpi logo"></Image>
                                    <h1 className="text-3xl font-semibold">What can I help with?</h1>

                                </div>
                                <div className="relative max-w-[700px] w-full mt-4">
                                    {previewUrl && (
                                        <div className="relative w-full flex items-center justify-start mt-4 mb-2">
                                            <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-lg" />
                                            <button className="absolute top-0 left-20 bg-white rounded-full shadow-md p-1 cursor-pointer" onClick={removeImage}>
                                                <XCircle className="text-red-500" size={18} />
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Message Math Tutor"
                                        style={{ border: "2px solid #777" }}
                                        className="w-full bg-[#F1F1F1] h-[60px] text-black outline-[#ccc] px-4 rounded-xl pr-16 pl-20"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    />
                                    <label htmlFor="file-upload" className="absolute left-3 bottom-5 cursor-pointer flex items-center">
                                        <ImageIcon size={20} className="text-gray-600 hover:text-black" />
                                        <input
                                            ref={fileInputRef}
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    <button
                                        className={`absolute left-8 bottom-5 ml-4 cursor-pointer flex items-center ${isRecording ? 'text-red-500' : 'text-gray-600 hover:text-black'}`}
                                        onClick={isRecording ? stopRecording : startRecording}
                                    >
                                        {isRecording ? <Square size={20} /> : <Mic size={20} />}
                                    </button>
                                    <div
                                        className={`absolute right-2 bottom-2 p-2 rounded-full cursor-pointer hover:opacity-70 ${inputValue.trim() || selectedImage ? "bg-blue-500" : "bg-gray-600"}`}
                                        onClick={handleSendMessage}
                                    >
                                        <Send className="text-white" size={17} />
                                    </div>
                                </div>
                                <ImageGrid />
                            </div>
                        </main>

                    ) : (
                        <main className="p-4 lg:p-8">
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

                            <div className="w-full flex flex-col min-h-[94vh] max-h-[94vh] overflow-y-auto max-w-[800px] w-full px-4 mt-10">
                                <div className="flex-1 overflow-x-hidden scrollable max-h-[500px]">
                                    {messages.map((message, index) => (
                                        <div key={index} className={`mb-4 flex items-start ${message.sender === "User" ? "justify-end" : "justify-start"}`}>
                                            {message.sender === "Assistant" && <Image
                                                src={logo}
                                                alt="Math Tutor Logo"
                                                width={80}
                                                height={80}
                                                className="h-10 w-auto"
                                            />
                                            }

                                            <div className={`inline-block p-3 max-w-[90%] rounded-lg ${message.sender === "User" ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-800"}`}>
                                                {message.isLoading ? <Loader className="animate-spin" size={16} /> : <Markdown markdown={message.text} />}
                                                {message.imageUrl && <img src={message.imageUrl} alt="User Attachment" className="mt-2 w-40 rounded-lg" />}
                                            </div>
                                            {message.sender === "User" && <User className="ml-2 p-2 rounded-full border" size={15} />}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className="relative max-w-[700px] w-full mt-4">
                                    {previewUrl && (
                                        <div className="relative w-full flex items-center justify-start mt-4 mb-2">
                                            <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-lg" />
                                            <button className="absolute top-0 left-20 bg-white rounded-full shadow-md p-1 cursor-pointer" onClick={removeImage}>
                                                <XCircle className="text-red-500" size={18} />
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Message Math Tutor"
                                        style={{ border: "2px solid #777" }}
                                        className="w-full bg-[#F1F1F1] h-[60px] text-black outline-[#ccc] px-4 rounded-xl pr-16 pl-20"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    />
                                    <label htmlFor="file-upload" className="absolute left-3 bottom-5 cursor-pointer flex items-center">
                                        <ImageIcon size={20} className="text-gray-600 hover:text-black" />
                                        <input
                                            ref={fileInputRef}
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    <button
                                        className={`absolute left-8 bottom-5 ml-4 cursor-pointer flex items-center ${isRecording ? 'text-red-500' : 'text-gray-600 hover:text-black'}`}
                                        onClick={isRecording ? stopRecording : startRecording}
                                    >
                                        {isRecording ? <Square size={20} /> : <Mic size={20} />}
                                    </button>
                                    <div
                                        className={`absolute right-2 bottom-2 p-2 rounded-full cursor-pointer hover:opacity-70 ${inputValue.trim() || selectedImage ? "bg-blue-500" : "bg-gray-600"}`}
                                        onClick={handleSendMessage}
                                    >
                                        <Send className="text-white" size={17} />
                                    </div>
                                </div>
                            </div>
                        </main>

                    )}
                </main>
            </div>
        </CreditsWrapper>
    );
};

export default Page;