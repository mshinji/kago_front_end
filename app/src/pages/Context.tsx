import { createContext } from 'react';

export type GameInfoType = {
  tehais: number[][];
  kawas: number[][];
  kyoku: number;
  honba: number;
  kyotaku: number;
  dora: number[];
  rest: number;
  scores: number[];
  richis: boolean[];
  kazes: string[];
};

export const defaultGameInfo: GameInfoType = {
  tehais: [[], [], [], []],
  kawas: [[], [], [], []],
  kyoku: 0,
  honba: 0,
  kyotaku: 0,
  dora: [],
  rest: 0,
  scores: [25000, 25000, 25000, 25000],
  richis: [false, false, false, false],
  kazes: ['', '', '', ''],
};

type ContextType = {
  gameInfo: GameInfoType;
  onReady: (mode: number) => Promise<void>;
  onClickDahai: (dahai: number) => Promise<void>;
};

export const Context = createContext({} as ContextType);
