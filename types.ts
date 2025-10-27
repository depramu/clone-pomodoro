
export enum Mode {
  Pomodoro = 'pomodoro',
  ShortBreak = 'shortBreak',
  LongBreak = 'longBreak',
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estPomodoros: number;
  actPomodoros: number;
}

export interface Settings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  alarmSound: string;
  alarmVolume: number;
}
