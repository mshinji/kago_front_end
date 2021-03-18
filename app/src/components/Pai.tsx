import React from 'react';
import styled from 'styled-components';

interface PaiProps {
  no: number;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export const Pai = (props: PaiProps) => {
  let no;
  if (props.no >= 136) {
    no = 38;
  } else if (props.no == 16) {
    no = 35;
  } else if (props.no == 52) {
    no = 36;
  } else if (props.no == 88) {
    no = 37;
  } else {
    no = Math.floor(props.no / 4);
  }

  return (
    <Wrapper {...props}>
      <img src={`/static/images/pai${no}.png`} height={props.height} />
    </Wrapper>
  );
};

const Wrapper = styled.div.attrs((props: PaiProps) => {
  return {
    width: props.width,
    height: props.height,
  };
})`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  &:hover {
    cursor: pointer;
  }
`;
