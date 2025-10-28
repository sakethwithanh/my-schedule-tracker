import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { getAiNewsChatResponse } from './services/geminiService';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: crypto.randomUUID(),
            text: "Hello! I'm DevNews AI. I can fetch the latest AI news, provide market updates on public companies, or answer your software development questions. How can I help you today?",
            sender: 'ai',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = useCallback(async (text: string) => {
        const userMessage: Message = {
            id: crypto.randomUUID(),
            text,
            sender: 'user',
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const aiResponse = await getAiNewsChatResponse(text);
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                text: aiResponse.text,
                sender: 'ai',
                sources: aiResponse.sources,
            };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`Failed to get response: ${errorMessage}`);
             const aiErrorMessage: Message = {
                id: crypto.randomUUID(),
                text: `Sorry, something went wrong. Please check the console for details. Error: ${errorMessage}`,
                sender: 'ai',
            };
            setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200 flex flex-col h-screen font-['Inter',_sans-serif]">
            <header className="bg-black/30 backdrop-blur-xl border-b border-blue-500/20 p-4 shadow-md sticky top-0 z-10">
                <h1 className="text-xl md:text-2xl font-bold text-center text-gray-100">
                    <i className="fas fa-brain mr-2 text-blue-400"></i>
                    DevNews AI Chatbot
                </h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4 my-6 justify-start">
                             <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-br from-gray-800 via-black to-gray-900">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div className="max-w-xs p-4 rounded-2xl shadow-md bg-gray-800 text-slate-400 rounded-bl-none">
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && <div className="text-red-500 text-center my-4">{error}</div>}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-4 bg-black/30 backdrop-blur-xl border-t border-blue-500/20 sticky bottom-0">
                <div className="max-w-4xl mx-auto">
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </footer>
        </div>
    );
};

export default App;