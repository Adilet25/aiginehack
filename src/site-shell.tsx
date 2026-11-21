import { useEffect } from 'react'

export function App() {
  useEffect(() => {
    const controller = document.createElement('script')
    controller.type = 'module'
    controller.src = '/legacy/app.js'
    document.body.append(controller)
    return () => controller.remove()
  }, [])

  return (
    <>
      <header className="masthead">
        <a href="#home" className="brand" aria-label="Айгине">
          <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="20" cy="20" r="17" />
            <g transform="rotate(-35 20 20)">
              <path d="M13 5q7 15 0 30 M18 3q7 17 0 34 M23 4q7 16 0 32 M5 13q15 7 30 0 M3 18q17 7 34 0 M4 23q16 7 32 0" />
            </g>
          </svg>
          <span>АЙГИНЕ</span>
        </a>
        <span className="edition" data-copy="edition">Живая память Кыргызстана</span>
        <div className="masthead-controls">
          <button className="journey-sound" type="button" aria-pressed="false">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M3 10v4m4-8v12m5-15v18m5-15v12m4-8v4"/></svg> <span>Музыка</span>
          </button>
          <label className="language">
            <span className="sr-only" data-copy="language">Язык</span>
            <select id="language" defaultValue="ru">
              <option value="ru">РУ</option>
              <option value="ky">КЫ</option>
              <option value="en">EN</option>
            </select>
          </label>
        </div>
      </header>

      <main id="home">
        <section id="journey" className="journey" aria-labelledby="hero-title">
          <div className="stage" id="stage" data-inside="false" data-ready="false" data-loading="true">
            <div className="world" id="world" aria-hidden="true">
              <div className="hero-landscape" />
              <div className="fallback outside" />
              <div className="fallback inside" hidden />
            </div>
            <p className="scene-loading" role="status">Загружаем юрту…</p>
            <a href="#inside" className="yurt-entry" tabIndex={-1} aria-hidden="true" />
            <div className="door-stars" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
            </div>
            <div className="hero-copy">
              <p className="hero-kicker" data-copy="kicker">Культурное наследие Кыргызстана</p>
              <h1 id="hero-title" data-copy="title">Айгине</h1>
              <p className="hero-introduction" data-copy="caption">Три истории под одной крышей.</p>
              <a href="#inside" className="button enter">
                <span data-copy="enter">Войти в юрту</span>
              </a>
            </div>
            <p className="inside-prompt" data-copy="choose">Выберите предмет</p>
            <nav className="exhibits" aria-label="Разделы" inert={true}>
              <a className="exhibit exhibit-calendar" href="#calendar"><span className="object-ring" aria-hidden="true">+</span><span className="exhibit-label" data-copy="calendar">Кыргызский календарь</span></a>
              <a className="exhibit exhibit-places" href="#places"><span className="object-ring" aria-hidden="true">+</span><span className="exhibit-label" data-copy="places">Сакральные места</span></a>
              <a className="exhibit exhibit-stone" href="#stone"><span className="object-ring" aria-hidden="true">+</span><span className="exhibit-label" data-copy="stone">Петроглифы</span></a>
            </nav>
            <div className="stage-foot">
              <div className="chapter-index"><span id="current-stage">01</span><span className="chapter-line" aria-hidden="true" /><span>02</span></div>
              <p className="scroll-note"><span aria-hidden="true">↓</span> <span data-copy="scroll">Прокрутите, чтобы войти</span></p>
              <a href="#home" className="back-out" data-copy="outside" hidden>Выйти из юрты</a>
              <p className="stage-location" data-copy="location">Кыргызстан · Айгине</p>
            </div>
          </div>
        </section>
      </main>
      <main id="chapter" className="chapter" hidden />
      <noscript>Для интерактивной экскурсии нужен JavaScript.</noscript>
    </>
  )
}
