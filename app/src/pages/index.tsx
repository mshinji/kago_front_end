import { Howl } from 'howler';
import React, { useEffect, useState } from 'react';
import { Context, defaultGameInfo, GameInfoType, NoticeType } from 'src/components/Context';
import { Template } from 'src/components/Template';
import { IMessageEvent, w3cwebsocket } from 'websocket';

type DataType = {
  type: string;
  body: any;
};

const url: string = process.env.BACKEND_URL || 'ws://localhost:8000';
const ws = new w3cwebsocket(`${url}/ws/mahjong/`);
// const tsumohoSound = new Howl({ src: ['/static/sounds/tsumoho.m4a'] });
// const ronhoSound = new Howl({ src: ['/static/sounds/ronho.m4a'] });
const richiSound = new Howl({ src: ['/static/sounds/richi.m4a'] });
const kanSound = new Howl({ src: ['/static/sounds/kan.m4a'] });
const ponSound = new Howl({ src: ['/static/sounds/pon.m4a'] });
const chiSound = new Howl({ src: ['/static/sounds/chi.m4a'] });

// 変数
let token = '';
let myPrevAction = '';

const Page = () => {
  const [gameInfo, setGameInfo] = useState<GameInfoType>(defaultGameInfo);
  const [isModeSelected, setIsModeSelected] = useState<boolean>(false);
  const [richiNotices, setRichiNotices] = useState<NoticeType>([]);
  const [ankanNotices, setAnkanNotices] = useState<NoticeType>([]);
  const [minkanNotices, setMinkanNotices] = useState<NoticeType>([]);
  const [ponNotices, setPonNotices] = useState<NoticeType>([]);
  const [chiNotices, setChiNotices] = useState<NoticeType>([]);
  const [isRichiDeclaration, setIsRichiDeclaration] = useState<boolean>(false);
  const [isAnkanNoticeNested, setIsAnkanNoticeNested] = useState<boolean>(
    false
  );
  const [isChiNoticeNested, setIsChiNoticeNested] = useState<boolean>(false);
  const [isPonNoticeNested, setIsPonNoticeNested] = useState<boolean>(false);

  useEffect(() => {
    // WebSocket
    ws.onmessage = async (event: IMessageEvent) => await onMessage(event);
    ws.onclose = async () => await onClose();

    // ビルド用
    setMinkanNotices([]);
  }, []);

  // 便利関数群
  const send = async (data: any): Promise<void> => {
    data.token = token;
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

  const onReady = async (mode: number): Promise<void> => {
    if (isModeSelected) return;

    await setIsModeSelected(true);
    await send({ type: 'ready', mode: mode });
  };

  const onMessage = async (event: IMessageEvent): Promise<void> => {
    const datas: DataType[] = JSON.parse(event.data as string);
    if (datas.length === 0) return;
    console.log('receive:', datas);

    // 通知リセット
    await resetNotices();

    for (const data of datas) {
      // 受信対応
      if (data.type === 'start_game') {
        await startGame(data.body);
      }
      if (data.type === 'start_kyoku_message') {
        await startKyoku(data.body);
      }
      if (data.type === 'tsumo_message') {
        if (myPrevAction !== 'cancel') await wait(300);
        await tsumo(data.body);
      }
      if (data.type === 'richi_notice_message') {
        await richiNotice(data.body);
      }
      if (data.type === 'ankan_notice_message') {
        await ankanNotice(data.body);
      }
      if (data.type === 'pon_notice_message') {
        await ponNotice(data.body);
      }
      if (data.type === 'chi_notice_message') {
        await chiNotice(data.body);
      }
      if (data.type === 'ankan_message') {
        await ankan(data.body);
      }
      if (data.type === 'pon_message') {
        await wait(300);
        await pon(data.body);
        await wait(300);
      }
      if (data.type === 'chi_message') {
        await wait(300);
        await chi(data.body);
        await wait(300);
      }
      if (data.type === 'open_dora_message') {
        await openDora(data.body);
      }
      if (data.type === 'dahai_message') {
        if (data.body.who != 0) await wait(300);
        await dahai(data.body);
      }
    }

    await send({ type: 'next' });
  };

  const onClose = async (): Promise<void> => console.log('WebSocketClosed...');

  const onClickRichiNotice = async (): Promise<void> => {
    await setIsRichiDeclaration(true);
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
    await send({
      type: 'dahai',
      body: {
        pai: dahai,
        richi: isRichiDeclaration,
      },
    });
  };

  // 局進行関数群
  const resetNotices = async (): Promise<void> => {
    await setRichiNotices([]);
    await setAnkanNotices([]);
    await setPonNotices([]);
    await setChiNotices([]);
    await resetIsNoticeNested();
  };

  const resetIsNoticeNested = async (): Promise<void> => {
    await setIsAnkanNoticeNested(false);
    await setIsPonNoticeNested(false);
    await setIsChiNoticeNested(false);
  };

  const startGame = async (body: { token: string }): Promise<void> => {
    token = body.token;
  };

  const startKyoku = async (body: GameInfoType): Promise<void> => {
    await setGameInfo(body);
  };

  const tsumo = async (body: {
    pai: number;
    dummy: number;
    who: number;
    rest: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who].push(body?.pai || body?.dummy);
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const richiNotice = async (body: NoticeType): Promise<void> => {
    await setRichiNotices(body);
  };

  const ankanNotice = async (body: NoticeType): Promise<void> => {
    await setAnkanNotices(body);
  };

  const ponNotice = async (body: NoticeType): Promise<void> => {
    await setPonNotices(body);
  };

  const chiNotice = async (body: NoticeType): Promise<void> => {
    await setChiNotices(body);
  };

  const ankan = async (body: {
    pais: number[];
    dummies: number[];
    who: number;
  }): Promise<void> => {
    await kanSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => !body.pais.includes(n) && !body.dummies.includes(n)
      );
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

  const pon = async (body: {
    pai: number;
    pais: number[];
    dummies: number[];
    who: number;
    fromWho: number;
  }): Promise<void> => {
    await ponSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
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
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
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
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.dora = tmpGameInfo.dora.map((n) =>
        n === body.dummy ? body.pai : n
      );
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const dahai = async (body: {
    pai: number;
    dummy: number;
    who: number;
    richi: boolean;
  }): Promise<void> => {
    if (body.richi) {
      await setIsRichiDeclaration(false);
      await richiSound.play();
    }
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => n !== body.pai && n !== body.dummy
      );
      tmpGameInfo.tehais[body.who].sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[body.who].push(body.pai);
      if (body.richi) {
        tmpGameInfo.richiDeclarationPais.push(body.pai);
      }
      return tmpGameInfo;
    });
  };

  return (
    <Context.Provider
      value={{
        gameInfo,
        richiNotices,
        ankanNotices,
        minkanNotices,
        ponNotices,
        chiNotices,
        isRichiDeclaration,
        isAnkanNoticeNested,
        isPonNoticeNested,
        isChiNoticeNested,
        onReady,
        onClickRichiNotice,
        onClickAnkanNotice,
        onClickNestedAnkanNotice,
        onClickPonNotice,
        onClickNestedPonNotice,
        onClickChiNotice,
        onClickNestedChiNotice,
        onClickCancelNotice,
        onClickDahai,
      }}
    >
      <Template></Template>;
    </Context.Provider>
  );
};

export default Page;
