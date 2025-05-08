import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact'
    },
    hero: {
      title: 'Luxe Japan Elite Escorts',
      subtitle: 'Experience the finest companionship in Japan',
      cta: 'Discover More'
    },
    features: {
      title: 'Our Services',
      subtitle: 'Exclusive experiences tailored for you'
    }
  },
  ja: {
    nav: {
      home: 'ホーム',
      about: '会社概要',
      services: 'サービス',
      contact: 'お問い合わせ'
    },
    hero: {
      title: 'ラグジュアリー ジャパン エリート エスコート',
      subtitle: '最高級のコンパニオンシップを体験',
      cta: '詳細を見る'
    },
    features: {
      title: 'サービス内容',
      subtitle: 'あなただけの特別な体験'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
}) 