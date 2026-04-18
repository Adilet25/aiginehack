import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../../types'

const dictionary = {
  kg: {
    home: 'Башкы бет',
    map: 'Карта',
    museum: 'Музей',
    lootbox: 'Чүко',
    profile: 'Профиль',
    scanStone: 'Ташты сканерлөө',
    selectedPlace: 'Тандалган жер',
    noPlace: 'Картадан объект тандаңыз',
    nearbyWarning: 'Сиз корголуучу аймакка жакындадыңыз',
    sacredRules: 'Эрежелер',
    collect: 'Жыйноо',
    startExploring: 'Изилдөөнү баштоо',
  },
  ru: {
    home: 'Главная',
    map: 'Карта',
    museum: 'Музей',
    lootbox: 'Чүко',
    profile: 'Профиль',
    scanStone: 'Сканировать камень',
    selectedPlace: 'Выбранное место',
    noPlace: 'Выберите объект на карте',
    nearbyWarning: 'Вы вошли в охранную зону',
    sacredRules: 'Правила поведения',
    collect: 'Собрать',
    startExploring: 'Начать исследование',
  },
  en: {
    home: 'Home',
    map: 'Map',
    museum: 'Museum',
    lootbox: 'Chüko',
    profile: 'Profile',
    scanStone: 'Scan stone',
    selectedPlace: 'Selected place',
    noPlace: 'Select a place on the map',
    nearbyWarning: 'You entered a protected zone',
    sacredRules: 'Respect guidelines',
    collect: 'Collect',
    startExploring: 'Start exploring',
  },
}

type LanguageContextType = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: typeof dictionary.ru
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru')

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: dictionary[lang],
    }),
    [lang]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}