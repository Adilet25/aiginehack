import { createContext, useContext } from 'react';

export const MotionContext = createContext<{ paused: boolean; setPaused: (value: boolean) => void }>({ paused: false, setPaused: () => {} });
export const useMotion = () => useContext(MotionContext);
