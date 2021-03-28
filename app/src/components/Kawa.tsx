import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';
import { Pai } from './Pai';

const {
  GameFieldWidth,
  GameFieldHeight,
  KawaWidth,
  KawaHeight,
  HyojiWidth,
  HyojiHeight,
  KawaPaiHeight,
} = Constants;

interface KawaProps {
  who: number;
}

export const Kawa = (props: KawaProps) => {
  const { gameInfo } = useContext(Context);
  return (
    <Wrapper who={props.who}>
      {[0, 1, 2, 3].map((i) => (
        <Row key={i}>
          {gameInfo.kawas[props.who]
            .slice(6 * i, 6 * (i + 1))
            .map((pai) =>
              gameInfo.richiPais.includes(pai) ? (
                <Pai
                  key={pai}
                  no={pai}
                  height={KawaPaiHeight}
                  rotationType={'up'}
                />
              ) : (
                <Pai key={pai} no={pai} height={KawaPaiHeight} />
              )
            )}
        </Row>
      ))}
    </Wrapper>
  );
};

const calcTranslateX = (who: number) =>
  [
    (GameFieldWidth - HyojiWidth) / 2,
    (GameFieldWidth + HyojiWidth - (KawaWidth - KawaHeight)) / 2,
    (GameFieldWidth - HyojiWidth) / 2,
    (GameFieldWidth - HyojiWidth - (KawaWidth - KawaHeight)) / 2 - KawaHeight,
  ][who];

const calcTranslateY = (who: number) =>
  [
    (GameFieldHeight + HyojiHeight) / 2,
    (GameFieldHeight - HyojiHeight + (KawaWidth - KawaHeight)) / 2,
    (GameFieldHeight - HyojiHeight) / 2 - KawaHeight,
    (GameFieldHeight - HyojiHeight + (KawaWidth - KawaHeight)) / 2,
  ][who];

const calcRotateDegree = (who: number) => who * -90;

const Wrapper = styled.div.attrs((props: KawaProps) => ({
  who: props.who,
}))`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: ${KawaWidth}px;
  height: ${KawaHeight}px;
  /* background: gray; */
  transform: translate(
      ${(props) => calcTranslateX(props.who)}px,
      ${(props) => calcTranslateY(props.who)}px
    )
    rotate(${(props) => calcRotateDegree(props.who)}deg);
  transform-origin: center center 0;
`;

const Row = styled.div`
  display: flex;
  height: ${KawaPaiHeight}px;
`;
