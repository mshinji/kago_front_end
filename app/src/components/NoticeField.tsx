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
  const { isRichiDeclaration } = useContext(Context);

  return (
    <Wrapper>
      <NestedNoticeWrapper>
        <NestedAnkanNotice />
        <NestedPonNotice />
        <NestedChiNotice />
      </NestedNoticeWrapper>
      <NoticeWrapper>
        {!isRichiDeclaration && (
          <>
            <RichiNotice />
            <AnkanNotice />
            <PonNotice />
            <ChiNotice />
            <CancelNotice />
          </>
        )}
      </NoticeWrapper>
    </Wrapper>
  );
};

// リーチ
const RichiNotice = () => {
  const { richiNotices, onClickRichiNotice } = useContext(Context);
  return (
    <Notice
      visible={richiNotices.length >= 1}
      onClick={() => onClickRichiNotice()}
    >
      リーチ
    </Notice>
  );
};

// 暗槓
const AnkanNotice = () => {
  const { ankanNotices, onClickAnkanNotice } = useContext(Context);
  return (
    <Notice
      visible={ankanNotices.length >= 1}
      onClick={() => onClickAnkanNotice()}
    >
      カン
    </Notice>
  );
};

const NestedAnkanNotice = () => {
  const {
    ankanNotices,
    isAnkanNoticeNested,
    onClickNestedAnkanNotice,
  } = useContext(Context);
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

// ポン
const PonNotice = () => {
  const { ponNotices, onClickPonNotice } = useContext(Context);
  return (
    <Notice visible={ponNotices.length >= 1} onClick={() => onClickPonNotice()}>
      ポン
    </Notice>
  );
};

const NestedPonNotice = () => {
  const { ponNotices, isPonNoticeNested, onClickNestedPonNotice } = useContext(
    Context
  );
  return (
    <>
      {isPonNoticeNested ? (
        ponNotices.map((ponNotice, key) => {
          const pais = ponNotice.pais.filter((pai) => pai != ponNotice.pai);
          pais.splice(3 - ponNotice.fromWho, 0, ponNotice.pai);
          return (
            <HuroWrapper key={key} onClick={() => onClickNestedPonNotice(key)}>
              {pais.map((pai) =>
                pai == ponNotice.pai ? (
                  <Pai
                    key={ponNotice.pai}
                    no={ponNotice.pai}
                    height={48}
                    rotationType={'down'}
                  />
                ) : (
                  <Pai key={pai} no={pai} height={48} />
                )
              )}
            </HuroWrapper>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

// チー
const ChiNotice = () => {
  const { chiNotices, onClickChiNotice } = useContext(Context);
  return (
    <Notice visible={chiNotices.length >= 1} onClick={() => onClickChiNotice()}>
      チー
    </Notice>
  );
};

const NestedChiNotice = () => {
  const { chiNotices, isChiNoticeNested, onClickNestedChiNotice } = useContext(
    Context
  );
  return (
    <>
      {isChiNoticeNested ? (
        chiNotices.map((chiNotice, key) => {
          const pais = chiNotice.pais.filter((pai) => pai != chiNotice.pai);
          pais.splice(3 - chiNotice.fromWho, 0, chiNotice.pai);
          return (
            <HuroWrapper key={key} onClick={() => onClickNestedChiNotice(key)}>
              {pais.map((pai) =>
                pai == chiNotice.pai ? (
                  <Pai
                    key={chiNotice.pai}
                    no={chiNotice.pai}
                    height={48}
                    rotationType={'down'}
                  />
                ) : (
                  <Pai key={pai} no={pai} height={48} />
                )
              )}
            </HuroWrapper>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

// キャンセル
const CancelNotice = () => {
  const {
    richiNotices,
    ankanNotices,
    minkanNotices,
    ponNotices,
    chiNotices,
    onClickCancelNotice,
  } = useContext(Context);
  return (
    <Notice
      visible={
        richiNotices.length >= 1 ||
        ankanNotices.length >= 1 ||
        minkanNotices.length >= 1 ||
        ponNotices.length >= 1 ||
        chiNotices.length >= 1
      }
      onClick={() => onClickCancelNotice()}
    >
      X
    </Notice>
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
  /* width: ${NoticeWidth}px; */
  height: ${NoticeHeight}px;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  background: grey;
  opacity: 0.7;
  transform-origin: center center 0;
  font-size: ${NoticeHeight - 25}px;
  line-height: ${NoticeHeight}px;
  color: black;
  text-align: center;
`;

const HuroWrapper = styled.div`
  display: flex;
  align-items: center;
  background: grey;
  opacity: 0.7;
  margin-left: 10px;
  padding: 5px;
`;
