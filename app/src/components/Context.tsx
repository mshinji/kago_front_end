import { createContext } from 'react';

export type HuroType = {
  type: string;
  who: number;
  fromWho: number;
  pai: number;
  pais: number[];
  dummies?: number[];
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
  who: number;
  fromWho: number;
}[];

type ContextType = {
  gameInfo: GameInfoType;
  richiNotices: NoticeType;
  ankanNotices: NoticeType;
  minkanNotices: NoticeType;
  ponNotices: NoticeType;
  chiNotices: NoticeType;
  isAnkanNoticeNested: boolean;
  isChiNoticeNested: boolean;
  isPonNoticeNested: boolean;
  onReady: (mode: number) => Promise<void>;
  onClickAnkanNotice: () => Promise<void>;
  onClickNestedAnkanNotice: (i: number) => Promise<void>;
  onClickPonNotice: () => Promise<void>;
  onClickNestedPonNotice: (i: number) => Promise<void>;
  onClickChiNotice: () => Promise<void>;
  onClickNestedChiNotice: (i: number) => Promise<void>;
  onClickCancelNotice: () => Promise<void>;
  onClickDahai: (dahai: number) => Promise<void>;
};

export const Context = createContext({} as ContextType);
