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
  richiPais: number[];
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
  richiPais: [],
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

export type AgariInfoType = {
  tehai: number[];
  huro: HuroType[];
  yakus: { name: string; han: number }[];
  doras: number[];
  uradoras: number[];
  scores: number[];
  scoreMovements: number[];
};

export const defaultAgariInfo: AgariInfoType = {
  tehai: [],
  huro: [],
  yakus: [],
  doras: [],
  uradoras: [],
  scores: [],
  scoreMovements: [],
};

export type RyukyokuInfoType = {
  scores: number[];
  scoreMovements: number[];
};

export const defaultRyukyokuInfo: RyukyokuInfoType = {
  scores: [],
  scoreMovements: [],
};

export type SyukyokuInfoType = {
  scores: number[];
  ranks: number[];
};

export const defaultSyukyokuInfo: SyukyokuInfoType = {
  scores: [],
  ranks: [],
};

export type NoticeType = {
  pai: number;
  pais: number[];
  dummies: number[];
  fromWho: number;
}[];

type ContextType = {
  gameInfo: GameInfoType;
  agariInfo: AgariInfoType;
  ryukyokuInfo: RyukyokuInfoType;
  syukyokuInfo: SyukyokuInfoType;
  tsumohoNotices: boolean;
  ronhoNotices: boolean;
  richiNotices: boolean;
  richiDeclareNotices: NoticeType;
  ankanNotices: NoticeType;
  minkanNotices: NoticeType;
  ponNotices: NoticeType;
  chiNotices: NoticeType;
  isAnkanNoticeNested: boolean;
  isChiNoticeNested: boolean;
  isPonNoticeNested: boolean;
  startGame: (mode: number) => Promise<void>;
  onClickTsumohoNotice: () => Promise<void>;
  onClickRonhoNotice: () => Promise<void>;
  onClickRichiNotice: () => Promise<void>;
  onClickAnkanNotice: () => Promise<void>;
  onClickNestedAnkanNotice: (i: number) => Promise<void>;
  onClickPonNotice: () => Promise<void>;
  onClickNestedPonNotice: (i: number) => Promise<void>;
  onClickChiNotice: () => Promise<void>;
  onClickNestedChiNotice: (i: number) => Promise<void>;
  onClickCancelNotice: () => Promise<void>;
  onClickDahai: (dahai: number) => Promise<void>;
  onClickNextKyoku: () => Promise<void>;
};

export const Context = createContext({} as ContextType);
