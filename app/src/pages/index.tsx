import React, { useState } from 'react';
import { Context, defaultGameInfo, GameInfoType, NoticeType } from 'src/components/Context';
import { Template } from 'src/components/Template';

type DataType = {
  type: 'start_game' | 'start_kyoku';
  body: any;
};

const Page = () => {
  // ステート定義
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
  const url: string = process.env.BACKEND_URL || 'ws://localhost:8000';
  const ws: WebSocket = new WebSocket(`${url}/ws/mahjong/`);

  ws.onmessage = (event: MessageEvent) => onmessage(event);
  ws.onclose = () => onclose();

  // 便利関数群
  const send = async (data: any): Promise<void> => {
    await setToken((token) => {
      data.token = token;
      return token;
    });
    ws.send(JSON.stringify(data));
    console.log('send:', data);
  };

  const onclose = (): void => {
    console.log('WebSocketClosed');
  };

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
        body: { ankan: ankanNotices[0].pai },
      });
    } else {
      setIsAnkanNoticeNested(true);
    }
  };

  const onClickNestedAnkanNotice = async (i: number): Promise<void> => {
    await send({
      type: 'ankan',
      body: { ankan: ankanNotices[i].pai },
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
  const onmessage = (event: MessageEvent): void => {
    const datas: DataType[] = JSON.parse(event.data);
    console.log('receive:', datas);
    datas.map((data) => {
      if (data.type === 'start_game') {
        start_game(data.body);
      } else if (data.type == 'start_kyoku') {
        start_kyoku(data.body);
      } else if (data.type == 'my_tsumo') {
        my_tsumo(data.body);
      } else if (data.type == 'other_tsumo') {
        other_tsumo(data.body);
      } else if (data.type == 'my_before_ankan') {
        my_before_ankan(data.body);
      } else if (data.type == 'my_ankan') {
        my_ankan(data.body);
      } else if (data.type == 'other_ankan') {
        other_ankan(data.body);
      } else if (data.type == 'my_dahai') {
        my_dahai(data.body);
      } else if (data.type == 'other_dahai') {
        other_dahai(data.body);
      } else if (data.type == 'skip') {
        skip();
      }
    });
  };

  const start_game = async (body: { token: string }): Promise<void> => {
    await setToken(body.token);
    console.log(token);
    await send({ type: 'start_game' });
  };

  const start_kyoku = async (body: GameInfoType): Promise<void> => {
    setGameInfo(body);
    await send({ type: 'start_kyoku' });
  };

  const my_tsumo = async (body: {
    tsumo: number;
    rest: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0].push(body.tsumo);
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
    await send({ type: 'next' });
  };

  const other_tsumo = async (body: {
    tsumo: number;
    who: number;
    rest: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who].push(body.tsumo);
      tmpGameInfo.rest = body.rest;
      return tmpGameInfo;
    });
    await send({ type: 'next' });
  };

  const my_before_ankan = async (body: {
    ankan: NoticeType;
  }): Promise<void> => {
    await setAnkanNotices(body.ankan);
  };

  const my_ankan = async (body: {
    pai: number[];
    dummy: number[];
  }): Promise<void> => {
    console.log('body.pai:', body.pai);
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0].filter(
        (n) => !body.pai.includes(n)
      );
      console.log(tmpGameInfo);
      tmpGameInfo.huros[0].push([
        body.pai[0],
        body.dummy[1],
        body.dummy[2],
        body.pai[3],
      ]);
      return tmpGameInfo;
    });
  };

  const other_ankan = async (body: {
    pai: number[];
    dummy: number[];
    who: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => !body.pai.includes(n)
      );
      tmpGameInfo.huros[body.who].push([
        body.pai[0],
        body.dummy[1],
        body.dummy[2],
        body.pai[3],
      ]);
      return tmpGameInfo;
    });
  };

  const my_dahai = async (body: { dahai: number }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[0] = tmpGameInfo.tehais[0].filter(
        (n) => n !== body.dahai
      );
      tmpGameInfo.tehais[0].sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[0].push(body.dahai);
      return tmpGameInfo;
    });
    await send({ type: 'next' });
  };

  const other_dahai = async (body: {
    dahai: number;
    dummy: number;
    who: number;
  }): Promise<void> => {
    await setGameInfo((preGameInfo) => {
      let tmpGameInfo: GameInfoType = JSON.parse(JSON.stringify(preGameInfo));
      tmpGameInfo.tehais[body.who] = tmpGameInfo.tehais[body.who].filter(
        (n) => n !== body.dummy
      );
      tmpGameInfo.tehais[body.who].sort((a, b) => (a > b ? 1 : -1));
      tmpGameInfo.kawas[body.who].push(body.dahai);
      return tmpGameInfo;
    });
    await send({ type: 'next' });
  };

  const skip = async (): Promise<void> => {
    await send({ type: 'next' });
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
