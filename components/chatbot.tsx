"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { MessageCircle, X, Send } from "lucide-react";
import  logo  from "@/public/logo.png";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const welcomeMessages = [
  "I am Aletheia, the Goddess of Truth. What would you like me to debug for you?",
"Greetings, seeker of truth! I am Aletheia. How can I assist in finding the flaw?",
"Welcome! I am Aletheia, here to unveil the truth. What needs debugging?",
"I am Aletheia, the one who reveals truth. Tell me what troubles your code.",
"The truth shall be revealed! I, Aletheia, will help you debug. What is the issue?"
];

export default function ChatBot() {
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setChatOpen(true);
        const randomWelcome =
          welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        setMessages([{ sender: "bot", text: "" }]);
        typeText(randomWelcome, 0, "bot");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typeText = (text: string, index: number, sender: "user" | "bot") => {
    if (index < text.length) {
      setTimeout(() => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.sender === sender) {
            return [
              ...prev.slice(0, -1),
              { sender, text: lastMessage.text + text[index] },
            ];
          } else {
            return [...prev, { sender, text: text[index] }];
          }
        });
        typeText(text, index + 1, sender);
      }, 25);
    }
  };

  const sendMessage = async (question: string) => {
    const newMessage: Message = { sender: "user", text: "" };
    setMessages((prev) => [...prev, newMessage]);

    typeText(question, 0, "user");
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
      typeText(
        data.answer || "I couldn't process that request. Try again.",
        0,
        "bot"
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting. Try again later." },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  };

  const formatMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-words"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed  bottom-4 right-4 z-50"
        >
          {!chatOpen && (
            <Button
              onClick={() => setChatOpen(true)}
              className="rounded-full shadow-lg"
              size="icon"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          )}
          {chatOpen && (
            <Card className="w-80 h-[28rem] bg-white shadow-2xl rounded-lg overflow-hidden">
              <div className="flex flex-row bg-emerald-800 justify-around items-center py-4">
                <CardTitle className="text-sm font-medium text-amber-50">Aletheia</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="border-[2px] rounded-lg border-gray-400"
                  onClick={() => setChatOpen(false)}
                >
                  <X className="h-4 w-4 p-0 m-0" />
                </Button>
              </div>
              <CardContent className="p-3">
                <div
                  className="h-64 overflow-y-auto space-y-2 pr-2"
                  onWheel={(e) => e.stopPropagation()} // Prevents page scroll
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-end space-x-2 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <Avatar className="h-6 w-6 rounded-full bg-gray-500">
                          <AvatarImage
                            src={logo.src}
                            alt="Capco Bot"
                            className="object-cover"
                          />
                          <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg text-sm px-3 py-2 max-w-[70%] whitespace-normal break-words ${
                          msg.sender === "user"
                            ? "bg-black text-white "
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {formatMessage(msg.text)}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center space-x-2 bg-white rounded-md p-2 shadow-inner"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow border-none rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
