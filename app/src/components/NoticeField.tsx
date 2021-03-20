import React, { useContext } from 'react';
import styled from 'styled-components';

import { Constants } from './Constants';
import { Context } from './Context';
import { Pai } from './Pai';

const {
  GameFieldWidth,
  GameFieldHeight,
  TehaiHeight,
  NoticeFieldWidth,
  NoticeFieldHeight,
  NoticeWidth,
  NoticeHeight,
} = Constants;

export const NoticeField = () => {
  return (
    <Wrapper>
      <NestedNoticeWrapper>
        <NestedAnkanNotice />
      </NestedNoticeWrapper>
      <NoticeWrapper>
        <AnkanNotice />
      </NoticeWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: absolute;
  width: ${NoticeFieldWidth}px;
  height: ${NoticeFieldHeight}px;
  transform: translate(
    ${(GameFieldWidth - NoticeFieldWidth) / 2}px,
    ${GameFieldHeight - TehaiHeight - NoticeFieldHeight}px
  );
  transform-origin: center center 0;
`;

const NoticeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: ${NoticeFieldWidth}px;
  height: ${NoticeHeight}px;
  margin: 5px 0;
`;

const NestedNoticeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: ${NoticeFieldWidth}px;
  height: ${NoticeHeight}px;
  margin: 5px 0;
`;

const Notice = styled.div.attrs((props: { visible: boolean }) => ({
  visible: props.visible,
}))`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  width: ${NoticeWidth}px;
  height: ${NoticeHeight}px;
  margin-left: 10px;
  background: grey;
  opacity: 0.7;
  transform-origin: center center 0;
  font-size: ${NoticeHeight - 25}px;
  line-height: ${NoticeHeight}px;
  color: black;
  text-align: center;
`;

const AnkanNotice = () => {
  const { ankanNotices, onClickAnkanNotice } = useContext(Context);
  return (
    <Notice
      visible={Object.keys(ankanNotices).length >= 1}
      onClick={() => onClickAnkanNotice()}
    >
      カン
    </Notice>
  );
};

const HuroWrapper = styled.div`
  display: flex;
  align-items: center;
  background: grey;
  opacity: 0.7;
  margin-left: 10px;
  padding: 5px;
`;

const NestedAnkanNotice = () => {
  const {
    ankanNotices,
    isAnkanNoticeNested,
    onClickNestedAnkanNotice,
  } = useContext(Context);
  console.log('ankaNotices', ankanNotices);
  return (
    <>
      {isAnkanNoticeNested ? (
        ankanNotices.map((ankanNotice, key) => (
          <HuroWrapper key={key} onClick={() => onClickNestedAnkanNotice(key)}>
            <Pai
              key={ankanNotice.pais[0]}
              no={ankanNotice.pais[0]}
              height={48}
            />
            <Pai
              key={ankanNotice.dummies[1]}
              no={ankanNotice.dummies[1]}
              height={48}
            />
            <Pai
              key={ankanNotice.dummies[2]}
              no={ankanNotice.dummies[2]}
              height={48}
            />
            <Pai
              key={ankanNotice.pais[3]}
              no={ankanNotice.pais[3]}
              height={48}
            />
          </HuroWrapper>
        ))
      ) : (
        <></>
      )}
    </>
  );
};
