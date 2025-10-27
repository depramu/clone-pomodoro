
import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { Icon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };
  
  const handleNumericChange = (field: keyof Settings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [field]: Number(value) }));
  }

  const handleToggleChange = (field: keyof Settings, value: boolean) => {
      setLocalSettings(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#303030] text-white w-full max-w-lg rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-bold">Timer Setting</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </header>
        
        <main className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-white/70 mb-2">Time (minutes)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1">Pomodoro</label>
                <input type="number" value={localSettings.pomodoro} onChange={e => handleNumericChange('pomodoro', e.target.value)} className="w-full p-2 bg-white/10 rounded-md" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Short Break</label>
                <input type="number" value={localSettings.shortBreak} onChange={e => handleNumericChange('shortBreak', e.target.value)} className="w-full p-2 bg-white/10 rounded-md" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Long Break</label>
                <input type="number" value={localSettings.longBreak} onChange={e => handleNumericChange('longBreak', e.target.value)} className="w-full p-2 bg-white/10 rounded-md" />
              </div>
            </div>
          </section>

          <section className="flex justify-between items-center border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white/70">Auto start Breaks?</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localSettings.autoStartBreaks} onChange={e => handleToggleChange('autoStartBreaks', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </section>

          <section className="flex justify-between items-center border-t border-white/10 pt-4">
            <h3 className="font-semibold text-white/70">Auto start Pomodoros?</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localSettings.autoStartPomodoros} onChange={e => handleToggleChange('autoStartPomodoros', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </section>

          <section className="border-t border-white/10 pt-4">
             <h3 className="font-semibold text-white/70 mb-2">Long Break interval</h3>
             <input type="number" value={localSettings.longBreakInterval} onChange={e => handleNumericChange('longBreakInterval', e.target.value)} className="w-24 p-2 bg-white/10 rounded-md" />
          </section>
        </main>
        
        <footer className="p-4 bg-white/5 flex justify-end">
          <button onClick={handleSave} className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-md hover:bg-white transition-colors">
            OK
          </button>
        </footer>
      </div>
    </div>
  );
};
