import React, { useContext } from 'react';
import styled from 'styled-components';

import { Context } from './Context';

interface PaiProps {
  no: number;
  width?: number;
  height?: number;
}

export const Pai = (props: PaiProps) => {
  const { onClickDahai } = useContext(Context);
  let no;
  if (props.no >= 136) {
    no = 38;
  } else if (props.no == 19) {
    no = 35;
  } else if (props.no == 55) {
    no = 36;
  } else if (props.no == 91) {
    no = 37;
  } else {
    no = Math.floor(props.no / 4);
  }
  return (
    <Wrapper {...props} key={props.no} onClick={() => onClickDahai(props.no)}>
      <img
        src={`/static/images/pai${no}.png`}
        height={props.height}
        key={props.no}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div.attrs((props: PaiProps) => ({
  width: props.width,
  height: props.height,
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
