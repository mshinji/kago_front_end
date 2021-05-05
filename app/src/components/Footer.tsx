import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export const Footer = () => {
  return (
    <Wrapper>
      <GitHub>
        <Link href="https://github.com/mshinji/kago_frontend">
          GitHub[frontend]
        </Link>
      </GitHub>
      <GitHub>
        <Link href="https://github.com/mshinji/kago_backend">
          GitHub[backend]
        </Link>
      </GitHub>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const GitHub = styled.div``;
