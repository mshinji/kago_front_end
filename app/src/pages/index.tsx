import React, { useState } from 'react';
import { Context, defaultGameInfo, GameInfoType } from 'src/components/Context';
import { Template } from 'src/components/Template';

type DataType = {
  type: 'start_game' | 'start_kyoku';
  body: any;
};

const Page = () => {
  const [token, setToken] = useState<string>('');
  const [gameInfo, setGameInfo] = useState<GameInfoType>(defaultGameInfo);
  const [modeSelected, setModeSelected] = useState<boolean>(false);
  const url: string = process.env.BACKEND_URL || 'http://localhost:8000';
  const ws: WebSocket = new WebSocket(`ws://${url}/ws/mahjong/`);
  console.log(url);

  ws.onmessage = (event: MessageEvent) => onmessage(event);
  ws.onclose = () => onclose();

  const send = (data: any) => {
    data.token = token;
    ws.send(JSON.stringify(data));
    console.log('send:', data.type);
  };

  const onclose = (): void => {
    console.log('WebSocketClosed');
  };

  const onReady = async (mode: number): Promise<void> => {
    if (modeSelected) {
      return;
    }
    setModeSelected(false);

    await send({ type: 'ready', mode: mode });
  };

  const onClickDahai = async (dahai: number): Promise<void> => {
    await send({
      type: 'dahai',
      body: {
        dahai: dahai,
      },
    });
  };

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
      } else if (data.type == 'my_dahai') {
        my_dahai(data.body);
      } else if (data.type == 'other_dahai') {
        other_dahai(data.body);
      } else if (data.type == 'game_info') {
        game_info(/*data.body*/);
      } else if (data.type == 'skip') {
        skip();
      }
    });
  };

  const start_game = async (body: { token: string }): Promise<void> => {
    await setToken(body.token);
    await send({ type: 'start_game' });
  };

  const start_kyoku = async (body: GameInfoType): Promise<void> => {
    await setGameInfo(body);
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

  const game_info = async (): Promise<void> => {
    // setGameInfo(body);
  };

  const skip = async (): Promise<void> => {
    await send({ type: 'skip' });
  };

  return (
    <Context.Provider value={{ gameInfo, onReady, onClickDahai }}>
      <Template></Template>;
    </Context.Provider>
  );
};

export default Page;
