
import { Settings, Mode } from './types';

export const DEFAULT_SETTINGS: Settings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  alarmSound: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
  alarmVolume: 0.5,
};

export const MODE_CONFIG = {
  [Mode.Pomodoro]: {
    name: 'Pomodoro',
    color: 'bg-[#C75351]',
    buttonColor: 'bg-[#c3605e]',
  },
  [Mode.ShortBreak]: {
    name: 'Short Break',
    color: 'bg-[#4C9195]',
    buttonColor: 'bg-[#5e9ca0]',
  },
  [Mode.LongBreak]: {
    name: 'Long Break',
    color: 'bg-[#457CA4]',
    buttonColor: 'bg-[#5789ad]',
  },
};
