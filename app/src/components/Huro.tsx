import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';
import { Pai } from './Pai';

const {
  GameFieldWidth,
  GameFieldHeight,
  HuroWidth,
  HuroHeight,
  HuroPaiHeight,
} = Constants;

interface TehaiProps {
  who: number;
}

export const Huro = (props: TehaiProps) => {
  const { gameInfo } = useContext(Context);
  return (
    <Wrapper who={props.who}>
      {gameInfo.huros[props.who]
        .slice(0)
        .reverse()
        .map((huro, key) => (
          <HuroWrapper key={key}>
            {huro.type == 'ankan' &&
              huro.pais.map((pai) => (
                <Pai key={pai} no={pai} height={HuroPaiHeight} />
              ))}
            {huro.type == 'pon' && (
              <>
                <Pai
                  key={huro.pai}
                  no={huro.pai}
                  height={HuroPaiHeight}
                  rotate={'true'}
                />
                {huro.pais.map(
                  (pai) =>
                    pai != huro.pai && (
                      <Pai key={pai} no={pai} height={HuroPaiHeight} />
                    )
                )}
              </>
            )}
            {huro.type == 'chi' && (
              <>
                <Pai
                  key={huro.pai}
                  no={huro.pai}
                  height={HuroPaiHeight}
                  rotate={'true'}
                />
                {huro.pais.map(
                  (pai) =>
                    pai != huro.pai && (
                      <Pai key={pai} no={pai} height={HuroPaiHeight} />
                    )
                )}
              </>
            )}
          </HuroWrapper>
        ))}
    </Wrapper>
  );
};

const calcTranslateX = (who: number) =>
  [
    (GameFieldWidth - HuroWidth + HuroHeight) / 2,
    GameFieldWidth - (HuroWidth + HuroHeight) / 2,
    (GameFieldWidth - HuroWidth - HuroHeight) / 2,
    (HuroHeight - HuroWidth) / 2,
  ][who];

const calcTranslateY = (who: number) =>
  [
    GameFieldHeight - HuroHeight,
    GameFieldHeight - HuroWidth / 2 - HuroHeight * 1.5,
    0,
    (HuroWidth + HuroHeight) / 2,
  ][who];

const calcRotateDegree = (who: number) => who * -90;

const Wrapper = styled.div.attrs((props: TehaiProps) => ({
  who: props.who,
}))`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  z-index: -999;
  background: darkolivegreen;
  width: ${HuroWidth}px;
  height: ${HuroHeight}px;
  transform: translate(
      ${(props) => calcTranslateX(props.who)}px,
      ${(props) => calcTranslateY(props.who)}px
    )
    rotate(${(props) => calcRotateDegree(props.who)}deg);
  transform-origin: center center 0;
`;

const HuroWrapper = styled.div`
  display: felx;
  margin-left: 12px;
`;
