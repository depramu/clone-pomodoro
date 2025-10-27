
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mode, Task, Settings } from './types';
import { DEFAULT_SETTINGS, MODE_CONFIG } from './constants';
import { Header } from './components/Header';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const storedSettings = localStorage.getItem('pomofocus_settings');
            return storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
        } catch (error) {
            return DEFAULT_SETTINGS;
        }
    });

    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const storedTasks = localStorage.getItem('pomofocus_tasks');
            return storedTasks ? JSON.parse(storedTasks) : [];
        } catch (error) {
            return [];
        }
    });
    
    const [mode, setMode] = useState<Mode>(Mode.Pomodoro);
    const [isActive, setIsActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(settings.pomodoro * 60);
    const [pomodorosInCycle, setPomodorosInCycle] = useState(0);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(tasks.find(t => !t.completed)?.id || null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const alarmRef = useRef<HTMLAudioElement>(null);

    const switchMode = useCallback((newMode: Mode) => {
        setIsActive(false);
        setMode(newMode);
        switch (newMode) {
            case Mode.Pomodoro:
                setTimeRemaining(settings.pomodoro * 60);
                break;
            case Mode.ShortBreak:
                setTimeRemaining(settings.shortBreak * 60);
                break;
            case Mode.LongBreak:
                setTimeRemaining(settings.longBreak * 60);
                break;
        }
    }, [settings]);

    useEffect(() => {
        switchMode(mode);
    }, [settings, switchMode, mode]);

    useEffect(() => {
        localStorage.setItem('pomofocus_settings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('pomofocus_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        // Fix: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (isActive && timeRemaining === 0) {
            if (alarmRef.current) {
                alarmRef.current.volume = settings.alarmVolume;
                alarmRef.current.play();
            }

            if (mode === Mode.Pomodoro) {
                setPomodorosInCycle(prev => prev + 1);
                 if (selectedTaskId) {
                    setTasks(prevTasks => prevTasks.map(task =>
                        task.id === selectedTaskId
                            ? { ...task, actPomodoros: task.actPomodoros + 1 }
                            : task
                    ));
                }
                const nextPomodoroCount = pomodorosInCycle + 1;
                const isLongBreakTime = nextPomodoroCount % settings.longBreakInterval === 0;
                switchMode(isLongBreakTime ? Mode.LongBreak : Mode.ShortBreak);
                if(settings.autoStartBreaks) setIsActive(true);
            } else {
                switchMode(Mode.Pomodoro);
                 if(settings.autoStartPomodoros) setIsActive(true);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, timeRemaining, mode, settings, pomodorosInCycle, selectedTaskId, switchMode]);

    useEffect(() => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      if (isActive) {
        document.title = `${timeString} - ${MODE_CONFIG[mode].name}`;
      } else {
        document.title = 'Pomofocus Clone';
      }
    }, [timeRemaining, isActive, mode]);

    const handleStartStop = () => {
        setIsActive(!isActive);
    };

    const handleSetMode = (newMode: Mode) => {
        if (isActive) {
            if (window.confirm("The timer is still running, are you sure you want to switch?")) {
                switchMode(newMode);
            }
        } else {
            switchMode(newMode);
        }
    };
    
    const totalDuration = (
        mode === Mode.Pomodoro ? settings.pomodoro :
        mode === Mode.ShortBreak ? settings.shortBreak :
        settings.longBreak
    ) * 60;
    
    const currentModeConfig = MODE_CONFIG[mode];

    return (
        <div className={`min-h-screen font-sans text-white transition-colors duration-500 ${currentModeConfig.color}`}>
            <Header onOpenSettings={() => setIsSettingsOpen(true)} />
            <main className="container mx-auto px-4 py-8">
                <Timer
                    mode={mode}
                    setMode={handleSetMode}
                    timeRemaining={timeRemaining}
                    isActive={isActive}
                    onStartStop={handleStartStop}
                    totalDuration={totalDuration}
                />
                <TaskList 
                    tasks={tasks} 
                    setTasks={setTasks} 
                    selectedTaskId={selectedTaskId}
                    setSelectedTaskId={setSelectedTaskId}
                />
            </main>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSave={setSettings}
            />
            <audio ref={alarmRef} src={settings.alarmSound} preload="auto" />
        </div>
    );
};

export default App;
