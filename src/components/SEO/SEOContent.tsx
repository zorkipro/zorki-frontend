import { Link } from "react-router-dom";

/**
 * Расширенный SEO-контент для главной страницы
 * Оптимизирован под все ключевые запросы
 * Визуально скрыт от пользователей (под таблицей)
 */
export const SEOContent = () => {
  return (
    <div className="space-y-10 mt-12 mb-12">
      {/* Основной SEO-текст с топовыми запросами */}
      <section className="prose prose-sm max-w-none">
        <h2 className="text-2xl font-bold mb-4">Рейтинг блогеров Беларуси 2025 | Топ блогеров и инфлюенсеров</h2>
        <p className="text-base leading-relaxed mb-4">
          <strong>Zorki.pro</strong> — это крупнейший каталог <strong>блогеров Беларуси</strong> и 
          платформа для поиска <strong>инфлюенсеров</strong> для сотрудничества с брендами. 
          У нас вы найдете <strong>топ блогеров Беларуси</strong>, <strong>лучших блогеров</strong> и 
          <strong>популярных блогеров</strong> по всем популярным платформам: Instagram, TikTok, YouTube и Telegram.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Сколько стоит реклама у блогеров?</h3>
        <p className="text-base leading-relaxed mb-4">
          <strong>Стоимость рекламы у блогеров Беларуси</strong> зависит от количества подписчиков, платформы и 
          формата размещения. В нашем каталоге вы можете <strong>узнать цену рекламы у блогера</strong>, 
          посмотреть <strong>прайс блогеров Беларуси</strong> и сравнить цены. <strong>Цена рекламы у блогеров</strong> 
          начинается от 50 BYN для микро-блогеров и может достигать нескольких тысяч BYN для топовых инфлюенсеров. 
          Вы можете <strong>заказать рекламную интеграцию</strong> напрямую у блогера.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Где купить рекламу у блогера?</h3>
        <p className="text-base leading-relaxed mb-4">
          На <strong>Zorki.pro</strong> вы можете <strong>купить рекламу у блогера</strong> в один клик. 
          Наша платформа объединяет лучших <strong>блогеров Минска</strong>, Гродно, Бреста, Витебска, 
          Гомеля и Могилева. Используйте наш сервис для <strong>подбора блогеров для рекламы</strong> - 
          фильтруйте по городу, платформе, тематике и бюджету, чтобы найти идеального блогера для вашей рекламной кампании.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Как выбрать блогера для рекламы?</h3>
        <p className="text-base leading-relaxed mb-4">
          При выборе <strong>блогера для рекламы</strong> учитывайте: соответствие тематики блогера вашему продукту, 
          количество и качество подписчиков (ER - engagement rate), географию аудитории, бюджет на рекламу, 
          формат размещения. На Zorki.pro вы можете найти <strong>лучших блогеров для рекламы Беларусь</strong> и 
          <strong>топ блогеров для рекламы 2025</strong>. Мы помогаем с <strong>поиском блогеров для рекламы</strong> и 
          <strong>подбором блогеров</strong> под ваши задачи.
        </p>
      </section>

      {/* Блоки по платформам с ключевыми запросами */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Блогеры по платформам</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Instagram блогеры Беларуси</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Топ инстаграм блогеров Беларуси</strong> с ценами на рекламу. 
              Узнайте <strong>сколько стоит реклама в Instagram у блогера</strong>.
            </p>
            <Link to="/?platform=instagram" className="text-sm text-primary hover:underline">
              Смотреть всех инстаграм блогеров →
            </Link>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">TikTok блогеры Беларуси</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Топ тиктокеров Беларуси</strong> и <strong>популярные тиктокеры</strong> для рекламы. 
              Каталог <strong>тиктокеров Беларуси</strong> с прайсами.
            </p>
            <Link to="/?platform=tiktok" className="text-sm text-primary hover:underline">
              Смотреть всех тиктокеров →
            </Link>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">YouTube блогеры Беларуси</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Топ ютуберов Беларуси</strong> и <strong>белорусские ютуберы</strong> с прайсом на рекламу. 
              Узнайте <strong>стоимость рекламы у ютуб блогеров Беларуси</strong>.
            </p>
            <Link to="/?platform=youtube" className="text-sm text-primary hover:underline">
              Смотреть всех ютуберов →
            </Link>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Telegram каналы Беларуси</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Топ телеграм каналов Беларуси</strong> для рекламы. 
              Каталог <strong>рекламных каналов Беларусь</strong> с ценами.
            </p>
            <Link to="/?platform=telegram" className="text-sm text-primary hover:underline">
              Смотреть все каналы →
            </Link>
          </div>
        </div>
      </section>

      {/* Блоки по городам с гео-запросами */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Блогеры по городам Беларуси</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {[
            { city: "Минск", queries: ["блогеры минск", "топ блогеров минск", "инстаграм блогеры минск", "тикток блогеры минск", "сколько стоит реклама у минских блогеров"] },
            { city: "Гродно", queries: ["блогеры гродно"] },
            { city: "Брест", queries: ["блогеры брест"] },
            { city: "Витебск", queries: ["блогеры витебск"] },
            { city: "Гомель", queries: ["блогеры гомель"] },
            { city: "Могилев", queries: ["блогеры могилев"] },
          ].map(({ city, queries }) => (
            <Link
              key={city}
              to={`/?search=${encodeURIComponent(city)}`}
              className="text-sm p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-center"
              title={queries.join(", ")}
            >
              {city}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Найдите <strong>блогеров Минска</strong>, <strong>топ блогеров Минск</strong>, 
          <strong>инстаграм блогеров Минск</strong> и других городов Беларуси. 
          Узнайте <strong>сколько стоит реклама у минских блогеров</strong>.
        </p>
      </section>

      {/* Блоки по нишам */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Блогеры по тематикам и нишам</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { niche: "мамские блогеры", query: "мамские блогеры беларусь" },
            { niche: "travel блогеры", query: "travel блогеры беларусь" },
            { niche: "fashion блогеры", query: "fashion блогеры беларусь" },
            { niche: "beauty блогеры", query: "beauty блогеры беларусь" },
            { niche: "lifestyle блогеры", query: "lifestyle блогеры беларусь" },
            { niche: "food блогеры", query: "food блогеры беларусь" },
            { niche: "авто блогеры", query: "авто блогеры беларуси" },
            { niche: "бизнес блогеры", query: "бизнес блогеры беларусь" },
            { niche: "юмор блогеры", query: "юмор блогеры беларусь" },
          ].map(({ niche, query }) => (
            <Link
              key={niche}
              to={`/?category=${encodeURIComponent(niche)}`}
              className="text-sm px-4 py-2 bg-muted/30 rounded-full hover:bg-muted/50 transition-colors"
              title={query}
            >
              {niche}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Найдите <strong>мамские блогеры Беларусь</strong>, <strong>travel блогеры</strong>, 
          <strong>fashion блогеры</strong>, <strong>beauty блогеры</strong>, 
          <strong>lifestyle блогеры</strong>, <strong>food блогеры</strong>, 
          <strong>авто блогеры Беларуси</strong>, <strong>бизнес блогеры</strong> и 
          <strong>юмор блогеры</strong> для сотрудничества.
        </p>
      </section>

      {/* Блоки по аудитории */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Блогеры по типу аудитории</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Блогеры с женской аудиторией</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Найдите <strong>блогеров с женской аудиторией Беларусь</strong> для рекламы женских товаров и услуг.
            </p>
            <Link to="/?gender=женщина" className="text-sm text-primary hover:underline">
              Смотреть →
            </Link>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Блогеры с мужской аудиторией</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Найдите <strong>блогеров с мужской аудиторией Беларусь</strong> для рекламы мужских товаров.
            </p>
            <Link to="/?gender=мужчина" className="text-sm text-primary hover:underline">
              Смотреть →
            </Link>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Микро-блогеры</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Микро-блогеры Беларусь</strong> и <strong>блогеры до 100к подписчиков Беларусь</strong> 
              с высоким engagement rate.
            </p>
            <Link to="/?followersMax=100000" className="text-sm text-primary hover:underline">
              Смотреть →
            </Link>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Блогеры с высоким ER</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Найдите <strong>блогеров с высоким ER Беларусь</strong> для максимальной эффективности рекламы.
            </p>
            <Link to="/" className="text-sm text-primary hover:underline">
              Смотреть →
            </Link>
          </div>
        </div>
      </section>

      {/* Дополнительный SEO-текст с коммерческими запросами */}
      <section className="prose prose-sm max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">Реклама у блогеров Беларуси - цены и подбор</h3>
        <p className="text-base leading-relaxed mb-4">
          Если вы ищете <strong>рекламу у блогеров Беларусь</strong> или хотите <strong>заказать рекламу у блогеров</strong>, 
          наша платформа поможет вам найти идеального партнера. Мы предоставляем <strong>подбор блогеров Беларусь</strong> 
          с учетом вашего бюджета, целевой аудитории и тематики. <strong>Сотрудничество с блогерами Беларусь</strong> 
          становится проще с Zorki.pro - вы видите актуальные цены, статистику и контакты каждого блогера.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-4">Где искать блогеров для рекламы?</h3>
        <p className="text-base leading-relaxed mb-4">
          <strong>Где искать блогеров для рекламы</strong>? На Zorki.pro! Мы собрали каталог всех популярных 
          блогеров Беларуси в одном месте. Вы можете использовать наш <strong>поиск блогеров для рекламы</strong> 
          с фильтрами по платформе, городу, тематике, количеству подписчиков и бюджету. 
          <strong>Эффективная реклама у блогеров</strong> начинается с правильного выбора партнера - и мы помогаем вам его найти.
        </p>
      </section>
    </div>
  );
};
