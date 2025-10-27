
import React from 'react';
import { Icon } from './icons';

interface HeaderProps {
    onOpenSettings: () => void;
}

const HeaderButton: React.FC<{ children: React.ReactNode, onClick?: () => void }> = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-white/90 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm transition-colors"
    >
        {children}
    </button>
);

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
    return (
        <header className="w-full max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-xl font-bold text-white">Pocus</h1>
                </div>
                <div className="flex items-center gap-2">
                    <HeaderButton>
                        <Icon name="report" className="w-4 h-4" />
                        Report
                    </HeaderButton>
                    <HeaderButton onClick={onOpenSettings}>
                        <Icon name="settings" className="w-4 h-4" />
                        Setting
                    </HeaderButton>
                    <HeaderButton>
                        <Icon name="user" className="w-4 h-4" />
                        Login
                    </HeaderButton>
                </div>
            </div>
        </header>
    );
};
