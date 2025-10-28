import React, { useState } from 'react';
import type { Message } from '../types';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="bg-black/30 rounded-lg my-2 overflow-hidden border border-gray-700/50">
            <div className="flex justify-between items-center px-4 py-1 bg-black/20">
                <span className="text-xs text-gray-400 font-sans">Code Example</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                    aria-label="Copy code to clipboard"
                >
                    {isCopied ? (
                        <>
                            <i className="fas fa-check text-green-400"></i>
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <i className="far fa-copy"></i>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="text-sm text-gray-200 p-4 overflow-x-auto font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
};


const ParsedContent: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const code = part.slice(3, -3).trim();
                    return <CodeBlock key={index} code={code} />;
                } else {
                    const boldParts = part.split(/(\*\*.*?\*\*)/g);
                    return (
                        <span key={index}>
                            {boldParts.map((boldPart, boldIndex) => {
                                if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                                    return <strong key={boldIndex}>{boldPart.slice(2, -2)}</strong>;
                                }
                                return boldPart.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < boldPart.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ));
                            })}
                        </span>
                    );
                }
            })}
        </>
    );
};


const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';

    const Avatar = ({ children }: { children: React.ReactNode }) => (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg ${isUser ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-gray-800 via-black to-gray-900'}`}>
            {children}
        </div>
    );

    return (
        <div className={`flex items-start gap-4 my-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <Avatar><i className="fas fa-robot"></i></Avatar>}
            <div className={`max-w-xs md:max-w-md lg:max-w-3xl p-4 rounded-2xl shadow-md ${isUser ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none' : 'bg-gray-800 text-gray-300 rounded-bl-none'}`}>
                <div className="prose prose-invert max-w-none text-white whitespace-pre-wrap font-sans text-gray-300 prose-strong:text-gray-100">
                    <ParsedContent text={message.text} />
                </div>
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">Sources</h4>
                        <ul className="list-none p-0 m-0 space-y-1.5">
                            {message.sources.map((source, index) => (
                                <li key={index} className="text-sm truncate">
                                    <a
                                        href={source.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2 transition-colors"
                                        title={source.title}
                                    >
                                        <i className="fas fa-link fa-xs opacity-70"></i>
                                        <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isUser && <Avatar><i className="fas fa-user"></i></Avatar>}
        </div>
    );
};

export default ChatMessage;