import { useLang } from '../../app/providers/LanguageProvider';

const notices = {
  map: {
    ru: 'Прототип карты: есть сгенерированные демонстрационные места. Маршруты схематические, не предназначены для навигации.',
    en: 'Map prototype: includes generated demonstration places. Routes are schematic and are not intended for navigation.',
    kg: 'Карта — прототип: жасалма көрсөтмө жерлер бар. Маршруттар шарттуу жана навигация үчүн арналган эмес.',
  },
  community: {
    ru: 'Демонстрация сообщества: примеры работ и голосование хранятся только в текущем сеансе. Конкурс и приз — концепция прототипа.',
    en: 'Community demo: sample artwork and votes exist only in this session. The competition and prize are prototype concepts.',
    kg: 'Коомчулуктун үлгүсү: иштер жана добуштар ушул сеанста гана сакталат. Сынак жана сыйлык — прототиптин идеясы.',
  },
};
export default function PrototypeNotice({ kind }: { kind: keyof typeof notices }) {
  const { lang } = useLang();
  return <p className="heritage-prototype">{notices[kind][lang]}</p>;
}
