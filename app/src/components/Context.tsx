import { createContext } from 'react';

type HuroType = {
  type: string;
  fromWho: number;
  pai: number;
  pais: number[];
};

export type GameInfoType = {
  tehais: number[][];
  kawas: number[][];
  huros: HuroType[][];
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
  pai: number;
  pais: number[];
  dummies: number[];
}[];

type ContextType = {
  gameInfo: GameInfoType;
  richiNotices: boolean;
  ankanNotices: NoticeType;
  minkanNotice: NoticeType;
  ponNotices: NoticeType;
  chiNotices: NoticeType;
  isAnkanNoticeNested: boolean;
  isChiNoticeNested: boolean;
  onReady: (mode: number) => Promise<void>;
  onClickAnkanNotice: () => Promise<void>;
  onClickNestedAnkanNotice: (i: number) => Promise<void>;
  onClickChiNotice: () => Promise<void>;
  onClickNestedChiNotice: (i: number) => Promise<void>;
  onClickDahai: (dahai: number) => Promise<void>;
};

export const Context = createContext({} as ContextType);
