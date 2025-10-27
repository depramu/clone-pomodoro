
import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { Icon } from './icons';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
}

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
  onUpdate: (id: string, newTitle: string, newEst: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, onSelect, onToggleComplete, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [estPomodoros, setEstPomodoros] = useState(task.estPomodoros);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate(task.id, title, estPomodoros);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white/10 p-4 rounded-lg">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/5 p-2 rounded-md text-white placeholder-white/50 border border-transparent focus:border-white/30 outline-none"
        />
        <div className="mt-3 flex items-center gap-4">
          <label className="text-white/70">Est Pomodoros</label>
          <input
            type="number"
            value={estPomodoros}
            onChange={(e) => setEstPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
            onKeyDown={handleKeyDown}
            className="w-20 bg-white/5 p-2 rounded-md text-white text-center"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setIsEditing(false)} className="text-white/70 bg-black/20 px-4 py-2 rounded-md">Cancel</button>
          <button onClick={handleSave} className="text-white bg-gray-600 px-4 py-2 rounded-md">Save</button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`border-l-4 ${isSelected ? 'border-white bg-white/10' : 'border-transparent'} flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer transition-all`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
            task.completed ? 'bg-white border-white' : 'border-white/50 hover:border-white'
          }`}
        >
          {task.completed && <Icon name="check" className="w-4 h-4 text-gray-700" />}
        </button>
        <span className={`text-lg ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>{task.title}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white/70 text-lg font-semibold">{task.actPomodoros}</span>
        <span className="text-white/30 text-lg">/</span>
        <span className="text-white/50 text-lg">{task.estPomodoros}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="text-white/50 hover:text-white p-1 rounded-full"
        >
          <Icon name="more" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, selectedTaskId, setSelectedTaskId }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskEst, setNewTaskEst] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showAddTask) {
      inputRef.current?.focus();
    }
  }, [showAddTask]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      estPomodoros: newTaskEst,
      actPomodoros: 0,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    if (!selectedTaskId) {
      setSelectedTaskId(newTask.id);
    }
    setNewTaskTitle('');
    setNewTaskEst(1);
    setShowAddTask(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setShowAddTask(false);
    }
  }
  
  const updateTask = (id: string, newTitle: string, newEst: number) => {
      setTasks(tasks.map(t => t.id === id ? {...t, title: newTitle, estPomodoros: newEst} : t));
  }

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  const deleteTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  }

  const estTotal = tasks.reduce((sum, task) => sum + task.estPomodoros, 0);
  const actTotal = tasks.reduce((sum, task) => sum + task.actPomodoros, 0);
  const finishTime = new Date();
  finishTime.setMinutes(finishTime.getMinutes() + (estTotal - actTotal) * 25); // Rough estimate

  return (
    <div className="w-full max-w-lg mx-auto mt-6 text-white">
        <div className="flex justify-between items-center pb-3 border-b-2 border-white/20">
            <h2 className="text-xl font-bold">Tasks</h2>
            <button className="p-1 bg-white/10 rounded-md">
                <Icon name="more" className="w-5 h-5"/>
            </button>
        </div>
      <div className="mt-4 space-y-3">
        {tasks.filter(t => !t.completed).map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            onSelect={() => setSelectedTaskId(task.id)}
            onToggleComplete={() => toggleComplete(task.id)}
            onDelete={() => deleteTask(task.id)}
            onUpdate={updateTask}
          />
        ))}
        {tasks.filter(t => t.completed).length > 0 && tasks.filter(t => !t.completed).length > 0 && (
             <div className="border-b border-white/20"></div>
        )}
        {tasks.filter(t => t.completed).map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            onSelect={() => setSelectedTaskId(task.id)}
            onToggleComplete={() => toggleComplete(task.id)}
            onDelete={() => deleteTask(task.id)}
            onUpdate={updateTask}
          />
        ))}
      </div>
      
      {showAddTask && (
        <div className="bg-gray-700/50 p-4 rounded-lg mt-4">
          <input
            ref={inputRef}
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you working on?"
            className="w-full bg-gray-800 p-3 rounded-md text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
          />
          <div className="mt-3">
            <label className="text-white/80 font-semibold">Est Pomodoros</label>
            <input
              type="number"
              value={newTaskEst}
              onChange={(e) => setNewTaskEst(Math.max(1, parseInt(e.target.value) || 1))}
              onKeyDown={handleKeyDown}
              className="w-20 bg-gray-800 p-2 rounded-md text-white mt-1 ml-2 text-center"
            />
          </div>
           <div className="mt-4 flex justify-end gap-2 border-t border-white/10 pt-4">
              <button onClick={() => setShowAddTask(false)} className="text-white/70 bg-black/20 px-4 py-2 rounded-md">Cancel</button>
              <button onClick={handleAddTask} className="text-gray-800 bg-white px-4 py-2 rounded-md font-bold">Save</button>
            </div>
        </div>
      )}

      <button
        onClick={() => setShowAddTask(!showAddTask)}
        className="w-full flex items-center justify-center gap-2 text-white/70 bg-black/20 hover:bg-black/30 p-4 rounded-lg mt-4 border-2 border-dashed border-white/20 transition-colors"
      >
        <Icon name="plus" className="w-5 h-5" />
        Add Task
      </button>

      <div className="mt-6 flex justify-between items-center text-lg p-4 bg-white/5 rounded-lg">
          <div>
              <span className="text-white/60">Est: </span>
              <span className="font-bold">{estTotal}</span>
          </div>
           <div>
              <span className="text-white/60">Act: </span>
              <span className="font-bold">{actTotal}</span>
          </div>
           <div>
              <span className="text-white/60">Finish: </span>
              <span className="font-bold">{finishTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
      </div>
    </div>
  );
};
