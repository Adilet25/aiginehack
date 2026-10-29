import { useLang } from '../../app/providers/LanguageProvider';

const notices = {
  map: {
    ru: 'Прототип карты: есть сгенерированные демонстрационные места. Автомобильные маршруты OSRM требуют интернета; доступность подъезда нужно проверить перед поездкой.',
    en: 'Map prototype: includes generated demonstration places. OSRM driving routes require internet; check access before travelling.',
    kg: 'Карта — прототип: жасалма көрсөтмө жерлер бар. OSRM унаа багыттары үчүн интернет керек; жолдун жеткиликтүүлүгүн сапар алдында текшериңиз.',
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
