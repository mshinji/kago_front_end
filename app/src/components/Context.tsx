import { createContext } from 'react';

export type GameInfoType = {
  tehais: number[][];
  kawas: number[][];
  huros: number[][][];
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
  huros: [[], [], [], []],
  kyoku: 0,
  honba: 0,
  kyotaku: 0,
  dora: [],
  rest: 0,
  scores: [25000, 25000, 25000, 25000],
  richis: [false, false, false, false],
  kazes: ['', '', '', ''],
};

export type NoticeType = {
  pai: number[];
  dummy: number[];
}[];

type ContextType = {
  gameInfo: GameInfoType;
  richiNotice: boolean;
  ankanNotices: NoticeType;
  minkanNotice: NoticeType;
  ponNotice: NoticeType;
  chiNotice: NoticeType;
  isAnkanNoticeNested: boolean;
  onReady: (mode: number) => Promise<void>;
  onClickAnkanNotice: () => Promise<void>;
  onClickNestedAnkanNotice: (i: number) => Promise<void>;
  onClickDahai: (dahai: number) => Promise<void>;
};

export const Context = createContext({} as ContextType);
