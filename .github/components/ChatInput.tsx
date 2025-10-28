import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-grow">
                 <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about AI news, company stocks, or coding questions..."
                    className="w-full p-3 pl-4 pr-12 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    disabled={isLoading}
                    aria-label="Chat input"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white h-12 w-12 rounded-lg font-semibold hover:opacity-90 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0"
                aria-label="Send message"
            >
                {isLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : (
                    <i className="fas fa-paper-plane"></i>
                )}
            </button>
        </form>
    );
};

export default ChatInput;