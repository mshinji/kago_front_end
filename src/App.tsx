import { Howl } from 'howler';
import { useCallback, useEffect, useState } from 'react';
import { IMessageEvent, w3cwebsocket } from 'websocket';
import { Constants } from '~/src/components/Constants';
import {
  AgariInfoType,
  Context,
  defaultAgariInfo,
  defaultGameInfo,
  defaultRyukyokuInfo,
  defaultSyukyokuInfo,
  GameInfoType,
  NoticeType,
  RyukyokuInfoType,
  SyukyokuInfoType,
} from '~/src/components/Context';
import { Template } from '~/src/components/Template';

type DataType = {
  type: string;
  body: any;
};

const url: string = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:8000';
const ws = new w3cwebsocket(`${url}/ws/mahjong/`);
const tsumohoSound = new Howl({ src: ['./sounds/tsumoho.m4a'] });
const ronhoSound = new Howl({ src: ['./sounds/ronho.m4a'] });
const richiSound = new Howl({ src: ['./sounds/richi.m4a'] });
const kanSound = new Howl({ src: ['./sounds/kan.m4a'] });
const ponSound = new Howl({ src: ['./sounds/pon.m4a'] });
const chiSound = new Howl({ src: ['./sounds/chi.m4a'] });

const { AutoMode } = Constants;

// 変数
let myPrevAction = '';
let selectedMode: null | number = null;

const Page = () => {
  const [gameInfo, setGameInfo] = useState<GameInfoType>(defaultGameInfo);
  const [agariInfo, setAgariInfo] = useState<AgariInfoType>(defaultAgariInfo);
  const [ryukyokuInfo, setRyukyokuInfo] =
    useState<RyukyokuInfoType>(defaultRyukyokuInfo);
  const [syukyokuInfo, setSyukyokuInfo] =
    useState<SyukyokuInfoType>(defaultSyukyokuInfo);
  const [isModeSelected, setIsModeSelected] = useState<boolean>(false);
  const [tsumohoNotices, setTsumohoNotices] = useState<boolean>(false);
  const [ronhoNotices, setRonhoNotices] = useState<boolean>(false);
  const [richiNotices, setRichiNotices] = useState<boolean>(false);
  const [richiDeclareNotices, setRichiDeclareNotices] = useState<NoticeType>(
    []
  );
  const [ankanNotices, setAnkanNotices] = useState<NoticeType>([]);
  const [minkanNotices, setMinkanNotices] = useState<NoticeType>([]);
  const [ponNotices, setPonNotices] = useState<NoticeType>([]);
  const [chiNotices, setChiNotices] = useState<NoticeType>([]);
  const [isAnkanNoticeNested, setIsAnkanNoticeNested] =
    useState<boolean>(false);
  const [isChiNoticeNested, setIsChiNoticeNested] = useState<boolean>(false);
  const [isPonNoticeNested, setIsPonNoticeNested] = useState<boolean>(false);

  // 便利関数群
  const send = async (data: any): Promise<void> => {
    myPrevAction = data.type;

    if (ws.readyState === 1) {
      await ws.send(JSON.stringify(data));
    } else {
      ws.onopen = async () => await ws.send(JSON.stringify(data));
    }
    console.log('send:', data);
    console.log('---------');
  };

  const wait = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // イベント関数
  const startGame = async (mode: number): Promise<void> => {
    if (isModeSelected) return;

    selectedMode = mode;
    await setIsModeSelected(true);
    await send({ type: 'start_game', mode: mode });
  };

  const onClose = async (): Promise<void> => console.log('WebSocketClosed...');

  const onClickTsumohoNotice = async (): Promise<void> => {
    await send({ type: 'tsumoho' });
  };
  const onClickRonhoNotice = async (): Promise<void> => {
    await send({ type: 'ronho' });
  };

  const onClickRichiNotice = async (): Promise<void> => {
    await send({ type: 'richi_declare' });
    await resetNotices();
  };

  const onClickAnkanNotice = async (): Promise<void> => {
    if (ankanNotices.length === 0) {
      return;
    } else if (ankanNotices.length === 1) {
      await send({
        type: 'ankan',
        body: { pais: ankanNotices[0].pais },
      });
    } else {
      await resetIsNoticeNested();
      await setIsAnkanNoticeNested(true);
    }
  };

  const onClickNestedAnkanNotice = async (i: number): Promise<void> => {
    await send({
      type: 'ankan',
      body: { pais: ankanNotices[i].pais },
    });
  };

  const onClickPonNotice = async (): Promise<void> => {
    if (ponNotices.length === 0) {
      return;
    } else if (ponNotices.length === 1) {
      await send({
        type: 'pon',
        body: { pai: ponNotices[0].pai, pais: ponNotices[0].pais },
      });
    } else {
      await resetIsNoticeNested();
      await setIsPonNoticeNested(true);
    }
  };

  const onClickNestedPonNotice = async (i: number): Promise<void> => {
    await send({
      type: 'pon',
      body: { pai: ponNotices[i].pai, pais: ponNotices[i].pais },
    });
  };

  const onClickChiNotice = async (): Promise<void> => {
    if (chiNotices.length === 0) {
      return;
    } else if (chiNotices.length === 1) {
      await send({
        type: 'chi',
        body: { pai: chiNotices[0].pai, pais: chiNotices[0].pais },
      });
    } else {
      await resetIsNoticeNested();
      await setIsChiNoticeNested(true);
    }
  };

  const onClickNestedChiNotice = async (i: number): Promise<void> => {
    await send({
      type: 'chi',
      body: { pai: chiNotices[i].pai, pais: chiNotices[i].pais },
    });
  };

  const onClickCancelNotice = async (): Promise<void> => {
    await resetNotices();
    await send({
      type: 'cancel',
      body: {},
    });
  };

  const onClickDahai = async (dahai: number): Promise<void> => {
    await send({ type: 'cancel' });
    await send({
      type: 'dahai',
      body: {
        pai: dahai,
      },
    });
  };

  const onClickNextKyoku = async (): Promise<void> => {
    await send({ type: 'next_kyoku' });
  };

  // 局進行関数群
  const resetNotices = useCallback(async () => {
    await setGameInfo;
    await setTsumohoNotices(false);
    await setRonhoNotices(false);
    await setRichiNotices(false);
    await setRichiDeclareNotices([]);
    await setAnkanNotices([]);
    await setMinkanNotices([]);
    await setPonNotices([]);
    await setChiNotices([]);
    await resetIsNoticeNested();
  }, []);

  const resetIsNoticeNested = async (): Promise<void> => {
    await setIsAnkanNoticeNested(false);
    await setIsPonNoticeNested(false);
    await setIsChiNoticeNested(false);
  };

  const startKyoku = async (body: GameInfoType): Promise<void> => {
    await setGameInfo(body);
    await setAgariInfo(defaultAgariInfo);
    await setRyukyokuInfo(defaultRyukyokuInfo);
  };

  const tsumohoNotice = async (): Promise<void> => {
    await setTsumohoNotices(true);
  };

  const richiNotice = async (): Promise<void> => {
    await setRichiNotices(true);
  };

  const richiDeclareNotice = async (body: NoticeType): Promise<void> => {
    await setRichiDeclareNotices(body);
  };

  const ankanNotice = async (body: NoticeType): Promise<void> => {
    await setAnkanNotices(body);
  };

  const ronhoNotice = async (): Promise<void> => {
    await setRonhoNotices(true);
  };

  const ponNotice = async (body: NoticeType): Promise<void> => {
    await setPonNotices(body);
  };

  const chiNotice = async (body: NoticeType): Promise<void> => {
    await setChiNotices(body);
  };

  const tsumoho = async (body: AgariInfoType): Promise<void> => {
    await tsumohoSound.play();
    await setAgariInfo(body);
  };

  const tsumo = async (body: {
    pai: number;
    dummy: number;
    who: number;
    rest: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      body.pai !== undefined
        ? tmpGameInfo.tehais[body.who].push(body.pai)
        : tmpGameInfo.tehais[body.who].push(body.dummy);
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const dahai = async (body: {
    pai: number;
    dummy: number;
    who: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => n !== body.pai && n !== body.dummy
      );
      tmpGameInfo.tehais[body.who].sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[body.who].push(body.pai);
      return tmpGameInfo;
    });
  };

  const richiBend = async (body: {
    pai: number;
    voice: boolean;
  }): Promise<void> => {
    if (body.voice) {
      await richiSound.play();
    }
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.richiPais.push(body.pai);
      return tmpGameInfo;
    });
  };

  const richiComplete = async (body: {
    scores: number[];
    richis: boolean[];
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.scores = body.scores;
      tmpGameInfo.richis = body.richis;
      return tmpGameInfo;
    });
  };

  const ankan = async (body: {
    pais: number[];
    dummies: number[];
    who: number;
  }): Promise<void> => {
    await kanSound.play();
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who]
        .filter((n) => !body.pais.includes(n) && !body.dummies.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[body.who].push({
        type: 'ankan',
        pai: -1,
        pais: [body.pais[0], body.dummies[1], body.dummies[2], body.pais[3]],
        who: body.who,
        fromWho: body.who,
      });
      return tmpGameInfo;
    });
  };

  const ronho = async (body: AgariInfoType): Promise<void> => {
    await ronhoSound.play();
    await setAgariInfo(body);
  };

  const pon = async (body: {
    pai: number;
    pais: number[];
    dummies: number[];
    who: number;
    fromWho: number;
  }): Promise<void> => {
    await ponSound.play();
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who]
        .filter((n) => !body.pais.includes(n) && !body.dummies.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[body.fromWho].pop();
      tmpGameInfo.huros[body.who].push({
        type: 'pon',
        pai: body.pai,
        pais: body.pais,
        who: body.who,
        fromWho: body.fromWho,
      });
      return tmpGameInfo;
    });
  };

  const chi = async (body: {
    pai: number;
    pais: number[];
    dummies: number[];
    who: number;
    fromWho: number;
  }): Promise<void> => {
    await chiSound.play();
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who]
        .filter((n) => !body.pais.includes(n) && !body.dummies.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[body.fromWho].pop();
      tmpGameInfo.huros[body.who].push({
        type: 'chi',
        pai: body.pai,
        pais: body.pais,
        who: body.who,
        fromWho: body.fromWho,
      });
      return tmpGameInfo;
    });
  };

  const openDora = async (body: {
    pai: number;
    dummy: number;
    rest: number;
  }) => {
    await setGameInfo((preGameInfo) => {
      const tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.dora = tmpGameInfo.dora.map((n) =>
        n === body.dummy ? body.pai : n
      );
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const ryukyoku = async (body: RyukyokuInfoType): Promise<void> => {
    await setRyukyokuInfo(body);
  };

  const syukyoku = async (body: SyukyokuInfoType): Promise<void> => {
    await setAgariInfo(defaultAgariInfo);
    await setRyukyokuInfo(defaultRyukyokuInfo);
    await setSyukyokuInfo(body);
  };

  const onMessage = useCallback(
    async (event: IMessageEvent): Promise<void> => {
      const datas: DataType[] = JSON.parse(event.data as string);
      if (datas.length === 0) return;
      console.log('receive:', datas);

      // 通知リセット
      await resetNotices();

      for (const data of datas) {
        // 受信対応
        switch (data.type) {
          case 'start_kyoku_message':
            await startKyoku(data.body);
            break;
          case 'tsumoho_message':
            await wait(300);
            await tsumoho(data.body);
            break;
          case 'tsumo_message':
            if (myPrevAction !== 'cancel') {
              await wait(300);
            }
            await tsumo(data.body);
            break;
          case 'ankan_message':
            await ankan(data.body);
            break;
          case 'dahai_message':
            if (data.body.who != 0 && selectedMode !== AutoMode) {
              await wait(300);
            }
            await dahai(data.body);
            break;
          case 'richi_bend_message':
            await richiBend(data.body);
            break;
          case 'richi_complete_message':
            await richiComplete(data.body);
            break;
          case 'ronho_message':
            await wait(300);
            await ronho(data.body);
            break;
          case 'pon_message':
            await wait(300);
            await pon(data.body);
            await wait(300);
            break;
          case 'chi_message':
            await wait(300);
            await chi(data.body);
            await wait(300);
            break;
          case 'open_dora_message':
            await openDora(data.body);
            break;
          case 'ryukyoku_message':
            await wait(300);
            await ryukyoku(data.body);
            break;
          case 'syukyoku_message':
            await syukyoku(data.body);
            break;
          // 通知
          case 'tsumoho_notice_message':
            await tsumohoNotice();
            break;
          case 'ronho_notice_message':
            await ronhoNotice();
            break;
          case 'richi_notice_message':
            await richiNotice();
            break;
          case 'richi_declare_notice_message':
            await richiDeclareNotice(data.body);
            break;
          case 'ankan_notice_message':
            await ankanNotice(data.body);
            break;
          case 'pon_notice_message':
            await ponNotice(data.body);
            break;
          case 'chi_notice_message':
            await chiNotice(data.body);
            break;
        }
      }

      await send({ type: 'next' });
    },
    [resetNotices]
  );

  useEffect(() => {
    // WebSocket
    ws.onmessage = async (event: IMessageEvent) => await onMessage(event);
    ws.onclose = async () => await onClose();
  }, [onMessage]);

  return (
    <Context.Provider
      value={{
        gameInfo,
        agariInfo,
        ryukyokuInfo,
        syukyokuInfo,
        tsumohoNotices,
        ronhoNotices,
        richiNotices,
        richiDeclareNotices,
        ankanNotices,
        minkanNotices,
        ponNotices,
        chiNotices,
        isAnkanNoticeNested,
        isPonNoticeNested,
        isChiNoticeNested,
        startGame,
        onClickTsumohoNotice,
        onClickRonhoNotice,
        onClickRichiNotice,
        onClickAnkanNotice,
        onClickNestedAnkanNotice,
        onClickPonNotice,
        onClickNestedPonNotice,
        onClickChiNotice,
        onClickNestedChiNotice,
        onClickCancelNotice,
        onClickDahai,
        onClickNextKyoku,
      }}
    >
      <Template />
    </Context.Provider>
  );
};

export default Page;
