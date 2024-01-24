import { AgariInfoType, GameInfoType, NoticeType, RyukyokuInfoType, SyukyokuInfoType } from '~/components/Context'

export type Response =
  | StartKyokuResponse
  | TsumohoResponse
  | TsumoResponse
  | AnkanResponse
  | DahaiResponse
  | RichiBendResponse
  | RichiCompleteResponse
  | RonhoResponse
  | PonResponse
  | ChiResponse
  | OpenDoraResponse
  | RyukyokuResponse
  | SyukyokuResponse
  | TsumohoNoticeResponse
  | RonhoNoticeResponse
  | RichiNoticeResponse
  | RichiDeclareNoticeResponse
  | AnkanNoticeResponse
  | PonNoticeResponse
  | ChiNoticeResponse

export type StartKyokuResponse = {
  type: 'start_kyoku_message'
  body: GameInfoType
}

export type TsumohoResponse = {
  type: 'tsumoho_message'
  body: AgariInfoType
}

export type TsumoResponse = {
  type: 'tsumo_message'
  body: { pai: number; dummy: number; who: number; rest: number }
}

export type AnkanResponse = {
  type: 'ankan_message'
  body: { pais: number[]; dummies: number[]; who: number }
}

export type DahaiResponse = {
  type: 'dahai_message'
  body: { pai: number; dummy: number; who: number }
}

export type RichiBendResponse = {
  type: 'richi_bend_message'
  body: { pai: number; voice: boolean }
}

export type RichiCompleteResponse = {
  type: 'richi_complete_message'
  body: { scores: number[]; richis: boolean[] }
}

export type RonhoResponse = {
  type: 'ronho_message'
  body: AgariInfoType
}

export type PonResponse = {
  type: 'pon_message'
  body: { pai: number; pais: number[]; dummies: number[]; who: number; fromWho: number }
}

export type ChiResponse = {
  type: 'chi_message'
  body: { pai: number; pais: number[]; dummies: number[]; who: number; fromWho: number }
}

export type OpenDoraResponse = {
  type: 'open_dora_message'
  body: { pai: number; dummy: number; rest: number }
}

export type RyukyokuResponse = {
  type: 'ryukyoku_message'
  body: RyukyokuInfoType
}

export type SyukyokuResponse = {
  type: 'syukyoku_message'
  body: SyukyokuInfoType
}

export type TsumohoNoticeResponse = {
  type: 'tsumoho_notice_message'
}

export type RonhoNoticeResponse = {
  type: 'ronho_notice_message'
}

export type RichiNoticeResponse = {
  type: 'richi_notice_message'
}

export type RichiDeclareNoticeResponse = {
  type: 'richi_declare_notice_message'
  body: NoticeType
}

export type AnkanNoticeResponse = {
  type: 'ankan_notice_message'
  body: NoticeType
}

export type PonNoticeResponse = {
  type: 'pon_notice_message'
  body: NoticeType
}

export type ChiNoticeResponse = {
  type: 'chi_notice_message'
  body: NoticeType
}
