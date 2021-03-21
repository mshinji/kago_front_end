import React, { useEffect, useState } from 'react';
import { Context, defaultGameInfo, GameInfoType, NoticeType } from 'src/components/Context';
import { Template } from 'src/components/Template';
import { IMessageEvent, w3cwebsocket } from 'websocket';

type DataType = {
  type: string;
  body: any;
};

const url: string = process.env.BACKEND_URL || 'ws://localhost:8000';
const ws: w3cwebsocket = new w3cwebsocket(`${url}/ws/mahjong/`);

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

  useEffect(() => {
    // WebSocket
    ws.onmessage = async (event: IMessageEvent) => await onMessage(event);
    ws.onclose = async () => await onClose();
  }, []);

  // 便利関数群
  const send = async (data: any): Promise<void> => {
    await setToken((token) => token);
    data.token = token;

    if (ws.readyState == 1) {
      await ws.send(JSON.stringify(data));
    } else {
      ws.onopen = async () => await ws.send(JSON.stringify(data));
    }
    console.log('send:', data);
  };

  const onClose = async (): Promise<void> => console.log('WebSocketClosed...');

  // イベント関数
  const onReady = async (mode: number): Promise<void> => {
    if (isModeSelected) return;

    await setIsModeSelected(true);
    await send({ type: 'ready', mode: mode });
  };

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
  const onMessage = async (event: IMessageEvent): Promise<void> => {
    const datas: DataType[] = JSON.parse(event.data as string);
    console.log('receive:', datas);
    datas.map(async (data) => {
      // 通知リセット
      await resetNotices();

      // 受信対応
      if (data.type === 'start_game') {
        await startGame(data.body);
      } else if (data.type == 'start_kyoku') {
        await startKyoku(data.body);
      } else if (data.type == 'my_tsumo') {
        await myTsumo(data.body);
      } else if (data.type == 'other_tsumo') {
        await otherTsumo(data.body);
      } else if (data.type == 'my_ankan_notice') {
        await myAnkanNotice(data.body);
      } else if (data.type == 'my_chi_notice') {
        await myChiNotice(data.body);
      } else if (data.type == 'my_ankan') {
        await myAnkan(data.body);
      } else if (data.type == 'other_ankan') {
        await otherAnkan(data.body);
      } else if (data.type == 'my_chi') {
        await myChi(data.body);
      } else if (data.type == 'other_chi') {
        await otherChi(data.body);
      } else if (data.type == 'all_open_kan_dora') {
        await allOpenKanDora(data.body);
      } else if (data.type == 'my_dahai') {
        await myDahai(data.body);
      } else if (data.type == 'other_dahai') {
        await otherDahai(data.body);
      }
    });
  };

  const resetNotices = async (): Promise<void> => {
    await setAnkanNotices([]);
    await setChiNotices([]);
    await resetIsNoticeNested();
  };

  const resetIsNoticeNested = async (): Promise<void> => {
    await setIsAnkanNoticeNested(false);
    await setIsChiNoticeNested(false);
  };

  const startGame = async (body: { token: string }): Promise<void> => {
    await setToken(body.token);
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

  const myChiNotice = async (body: NoticeType): Promise<void> => {
    await setChiNotices(body);
  };

  const myAnkan = async (body: {
    pais: number[];
    dummies: number[];
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[0].unshift({
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
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => !body.pais.includes(n)
      );
      tmpGameInfo.huros[body.who].unshift({
        type: 'ankan',
        fromWho: body.who,
        pai: -1,
        pais: [body.pais[0], body.dummies[1], body.dummies[2], body.pais[3]],
      });
      return tmpGameInfo;
    });
  };

  const myChi = async (body: {
    pai: number;
    pais: number[];
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[0].unshift({
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
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[body.who].unshift({
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
        isChiNoticeNested,
        onReady,
        onClickAnkanNotice,
        onClickNestedAnkanNotice,
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
