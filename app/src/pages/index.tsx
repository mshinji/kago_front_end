import React, { useState } from 'react';
import { Context, defaultGameInfo, GameInfoType, NoticeType } from 'src/components/Context';
import { Template } from 'src/components/Template';

type DataType = {
  type: string;
  body: any;
};

const Page = () => {
  // ステート
  const [token, setToken] = useState<string>('');
  const [gameInfo, setGameInfo] = useState<GameInfoType>(defaultGameInfo);
  const [isModeSelected, setIsModeSelected] = useState<boolean>(false);
  const [richiNotice, setRichiNotice] = useState<boolean>(false);
  const [ankanNotices, setAnkanNotices] = useState<NoticeType>([]);
  const [minkanNotice, setMinkanNotice] = useState<NoticeType>([]);
  const [ponNotice, setPonNotice] = useState<NoticeType>([]);
  const [chiNotice, setChiNotice] = useState<NoticeType>([]);
  const [isAnkanNoticeNested, setIsAnkanNoticeNested] = useState<boolean>(
    false
  );

  // WebSocket
  const url: string = process.env.BACKEND_URL || 'ws://localhost:8000';
  const ws: WebSocket = new WebSocket(`${url}/ws/mahjong/`);
  ws.onmessage = (event: MessageEvent) => onMessage(event);
  ws.onclose = () => onClose();

  // 便利関数群
  const send = async (data: any): Promise<void> => {
    await setToken((token) => {
      data.token = token;
      return token;
    });
    ws.send(JSON.stringify(data));
    console.log('send:', data);
  };

  const onClose = (): void => console.log('WebSocketClosed...');

  // イベント関数
  const onReady = async (mode: number): Promise<void> => {
    if (isModeSelected) {
      return;
    }
    setIsModeSelected(true);

    await send({ type: 'ready', mode: mode });
  };

  const onClickAnkanNotice = async (): Promise<void> => {
    if (ankanNotices.length == 0) {
      return;
    } else if (ankanNotices.length == 1) {
      await send({
        type: 'ankan',
        body: { ankan: ankanNotices[0].pais },
      });
    } else {
      setIsAnkanNoticeNested(true);
    }
  };

  const onClickNestedAnkanNotice = async (i: number): Promise<void> => {
    await send({
      type: 'ankan',
      body: { ankan: ankanNotices[i].pais },
    });
  };

  const onClickDahai = async (dahai: number): Promise<void> => {
    await send({
      type: 'dahai',
      body: {
        dahai: dahai,
      },
    });
  };

  // 局進行関数群
  const onMessage = (event: MessageEvent): void => {
    const datas: DataType[] = JSON.parse(event.data);
    console.log('receive:', datas);
    datas.map((data) => {
      // 通知リセット
      resetNotices();

      // 受信対応
      if (data.type === 'start_game') {
        startGame(data.body);
      } else if (data.type == 'start_kyoku') {
        startKyoku(data.body);
      } else if (data.type == 'my_tsumo') {
        myTsumo(data.body);
      } else if (data.type == 'other_tsumo') {
        otherTsumo(data.body);
      } else if (data.type == 'my_ankan_notice') {
        myAnkanNotice(data.body);
      } else if (data.type == 'my_ankan') {
        myAnkan(data.body);
      } else if (data.type == 'other_ankan') {
        otherAnkan(data.body);
      } else if (data.type == 'all_open_kan_dora') {
        allOpenKanDora(data.body);
      } else if (data.type == 'my_dahai') {
        myDahai(data.body);
      } else if (data.type == 'other_dahai') {
        otherDahai(data.body);
      }
    });
  };

  const resetNotices = async (): Promise<void> => {
    await setAnkanNotices([]);
    await setIsAnkanNoticeNested(false);
  };

  const startGame = async (body: { token: string }): Promise<void> => {
    await setToken(body.token);
  };

  const startKyoku = async (body: GameInfoType): Promise<void> => {
    setGameInfo(body);
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

  const myAnkan = async (body: {
    pais: number[];
    dummies: number[];
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0]
        .filter((n) => !body.pais.includes(n))
        .sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.huros[0].unshift([
        body.pais[0],
        body.dummies[1],
        body.dummies[2],
        body.pais[3],
      ]);
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
      tmpGameInfo.huros[body.who].unshift([
        body.pais[0],
        body.dummies[1],
        body.dummies[2],
        body.pais[3],
      ]);
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
        minkanNotice,
        ponNotice,
        chiNotice,
        isAnkanNoticeNested,
        onReady,
        onClickAnkanNotice,
        onClickNestedAnkanNotice,
        onClickDahai,
      }}
    >
      <Template></Template>;
    </Context.Provider>
  );
};

export default Page;
