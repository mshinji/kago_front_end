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
const tsumohoSound = new Howl({ src: ['/static/sounds/tsumoho.m4a'] });
const ronhoSound = new Howl({ src: ['/static/sounds/ronho.m4a'] });
const richiSound = new Howl({ src: ['/static/sounds/richi.m4a'] });
const kanSound = new Howl({ src: ['/static/sounds/kan.m4a'] });
const ponSound = new Howl({ src: ['/static/sounds/pon.m4a'] });
const chiSound = new Howl({ src: ['/static/sounds/chi.m4a'] });

const Page = () => {
  // ステート
  const [token, setToken] = useState<string>('');
  const [gameInfo, setGameInfo] = useState<GameInfoType>(defaultGameInfo);
  const [isModeSelected, setIsModeSelected] = useState<boolean>(false);
  const [richiNotice, setRichiNotice] = useState<boolean>(false);
  const [ankanNotices, setAnkanNotices] = useState<NoticeType>([]);
  const [minkanNotices, setMinkanNotices] = useState<NoticeType>([]);
  const [ponNotices, setPonNotices] = useState<NoticeType>([]);
  const [chiNotices, setChiNotices] = useState<NoticeType>([]);
  const [isAnkanNoticeNested, setIsAnkanNoticeNested] = useState<boolean>(
    false
  );
  const [isChiNoticeNested, setIsChiNoticeNested] = useState<boolean>(false);
  const [isPonNoticeNested, setIsPonNoticeNested] = useState<boolean>(false);

  useEffect(() => {
    // WebSocket
    ws.onmessage = async (event: IMessageEvent) => await onMessage(event);
    ws.onclose = async () => await onClose();
  }, []);

  // 便利関数群
  const send = async (data: any): Promise<void> => {
    await setToken((token) => {
      data.token = token;
      return token;
    });

    if (ws.readyState == 1) {
      await ws.send(JSON.stringify(data));
    } else {
      ws.onopen = async () => await ws.send(JSON.stringify(data));
    }
    console.log('send:', data);
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
    console.log('receive:', datas);
    if (datas === []) return;

    for (const data of datas) {
      // 通知リセット
      await resetNotices();

      // 受信対応
      if (data.type === 'start_game') {
        await startGame(data.body);
      } else if (data.type == 'start_kyoku') {
        await startKyoku(data.body);
      } else if (data.type == 'my_tsumo') {
        await wait(500);
        await myTsumo(data.body);
      } else if (data.type == 'other_tsumo') {
        await wait(500);
        await otherTsumo(data.body);
      } else if (data.type == 'my_ankan_notice') {
        await myAnkanNotice(data.body);
      } else if (data.type == 'my_pon_notice') {
        await myPonNotice(data.body);
      } else if (data.type == 'my_chi_notice') {
        await myChiNotice(data.body);
      } else if (data.type == 'my_ankan') {
        await myAnkan(data.body);
      } else if (data.type == 'other_ankan') {
        await otherAnkan(data.body);
      } else if (data.type == 'my_pon') {
        await myPon(data.body);
      } else if (data.type == 'other_pon') {
        await wait(500);
        await otherPon(data.body);
      } else if (data.type == 'my_chi') {
        await myChi(data.body);
      } else if (data.type == 'other_chi') {
        await wait(500);
        await otherChi(data.body);
      } else if (data.type == 'all_open_kan_dora') {
        await allOpenKanDora(data.body);
      } else if (data.type == 'my_dahai') {
        await myDahai(data.body);
      } else if (data.type == 'other_dahai') {
        await wait(500);
        await otherDahai(data.body);
      }
    }

    await send({ type: 'next' });
  };

  const onClose = async (): Promise<void> => console.log('WebSocketClosed...');

  const onClickAnkanNotice = async (): Promise<void> => {
    if (ankanNotices.length == 0) {
      return;
    } else if (ankanNotices.length == 1) {
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
    if (ponNotices.length == 0) {
      return;
    } else if (ponNotices.length == 1) {
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
    if (chiNotices.length == 0) {
      return;
    } else if (chiNotices.length == 1) {
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
      },
    });
  };

  // 局進行関数群
  const resetNotices = async (): Promise<void> => {
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
    await setToken(body.token);
    console.log('body.token', body.token);
  };

  const startKyoku = async (body: GameInfoType): Promise<void> => {
    await setGameInfo(body);
  };

  const myTsumo = async (body: {
    pai: number;
    rest: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0].push(body.pai);
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const otherTsumo = async (body: {
    dummy: number;
    who: number;
    rest: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who].push(body.dummy);
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const myAnkanNotice = async (body: NoticeType): Promise<void> => {
    await setAnkanNotices(body);
  };

  const myPonNotice = async (body: NoticeType): Promise<void> => {
    await setPonNotices(body);
  };

  const myChiNotice = async (body: NoticeType): Promise<void> => {
    await setChiNotices(body);
  };

  const myAnkan = async (body: {
    pais: number[];
    dummies: number[];
  }): Promise<void> => {
    await kanSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[0].push({
        type: 'ankan',
        fromWho: 0,
        pai: -1,
        pais: [body.pais[0], body.dummies[1], body.dummies[2], body.pais[3]],
      });
      return tmpGameInfo;
    });
  };

  const otherAnkan = async (body: {
    pais: number[];
    dummies: number[];
    who: number;
  }): Promise<void> => {
    await kanSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => !body.pais.includes(n)
      );
      tmpGameInfo.huros[body.who].push({
        type: 'ankan',
        fromWho: body.who,
        pai: -1,
        pais: [body.pais[0], body.dummies[1], body.dummies[2], body.pais[3]],
      });
      return tmpGameInfo;
    });
  };

  const myPon = async (body: {
    pai: number;
    pais: number[];
  }): Promise<void> => {
    await ponSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[0].push({
        type: 'pon',
        fromWho: 3,
        pai: body.pai,
        pais: [body.pai].concat(body.pais.filter((pai) => pai != body.pai)),
      });
      return tmpGameInfo;
    });
  };

  const otherPon = async (body: {
    pai: number;
    pais: number[];
    who: number;
  }): Promise<void> => {
    await ponSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[body.who].push({
        type: 'pon',
        fromWho: (body.who - 1) % 4,
        pai: body.pai,
        pais: [body.pai].concat(body.pais.filter((pai) => pai != body.pai)),
      });
      return tmpGameInfo;
    });
  };

  const myChi = async (body: {
    pai: number;
    pais: number[];
  }): Promise<void> => {
    await chiSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[0].push({
        type: 'chi',
        fromWho: 3,
        pai: body.pai,
        pais: [body.pai].concat(body.pais.filter((pai) => pai != body.pai)),
      });
      return tmpGameInfo;
    });
  };

  const otherChi = async (body: {
    pai: number;
    pais: number[];
    who: number;
  }): Promise<void> => {
    await chiSound.play();
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[body.who].push({
        type: 'chi',
        fromWho: (body.who - 1) % 4,
        pai: body.pai,
        pais: [body.pai].concat(body.pais.filter((pai) => pai != body.pai)),
      });
      return tmpGameInfo;
    });
  };

  const allOpenKanDora = async (body: {
    pai: number;
    dummy: number;
    rest: number;
  }) => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.dora = tmpGameInfo.dora.map((n) =>
        n == body.dummy ? body.pai : n
      );
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
  };

  const myDahai = async (body: { pai: number }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0].filter(
        (n) => n !== body.pai
      );
      tmpGameInfo.tehais[0].sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[0].push(body.pai);
      return tmpGameInfo;
    });
  };

  const otherDahai = async (body: {
    pai: number;
    dummy: number;
    who: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => n !== body.dummy
      );
      tmpGameInfo.tehais[body.who].sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[body.who].push(body.pai);
      return tmpGameInfo;
    });
  };

  return (
    <Context.Provider
      value={{
        gameInfo,
        richiNotice,
        ankanNotices,
        minkanNotices,
        ponNotices,
        chiNotices,
        isAnkanNoticeNested,
        isPonNoticeNested,
        isChiNoticeNested,
        onReady,
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
