import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEO/SEOHead";
import { 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MessageCircle
} from "lucide-react";

const AdvertisingPage = () => {
  const telegramLink = "https://t.me/universal_adverts";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Реклама на Zorki.pro - Размещение в премиальном слайдере"
        description="Доступ к самым влиятельным блогерам и маркетологам Беларуси. Разместите рекламу в премиальном слайдере на главной странице Zorki.pro"
        keywords={["реклама zorki", "реклама блогеров", "инфлюенсер маркетинг", "реклама беларусь"]}
        url="https://zorki.pro/proads"
        type="website"
      />
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Star className="w-4 h-4 fill-primary" />
                <span className="text-sm font-medium">Премиальное размещение</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Разместите рекламу на главной странице{" "}
                <span className="text-primary">Zorki.pro</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Доступ к самым влиятельным блогерам и маркетологам Беларуси — каждый день
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6 h-auto group"
                  onClick={() => window.open(telegramLink, '_blank')}
                >
                  Забронировать место
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-base px-8 py-6 h-auto"
                  onClick={() => {
                    document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none text-center mb-12">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Zorki.pro</strong> — это центр инфлюенсер-рынка, место, куда блогеры и маркетологи заходят ежедневно.
                </p>
                <div className="mt-8 grid sm:grid-cols-2 gap-6 text-left">
                  <div className="p-6 rounded-lg bg-background border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Блогеры</h3>
                    <p className="text-muted-foreground">отслеживают рейтинг</p>
                  </div>
                  <div className="p-6 rounded-lg bg-background border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Маркетологи</h3>
                    <p className="text-muted-foreground">подбирают инфлюенсеров</p>
                  </div>
                </div>
                <p className="mt-8 text-lg sm:text-xl text-foreground font-medium">
                  Ваш бренд может находиться в самом видимом месте всей экосистемы — в премиальном слайдере на главной странице.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section id="why" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Почему реклама в Zorki.pro — это не баннер, а стратегическое преимущество
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {/* Аудитория */}
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Аудитория, которой нет ни в одной рекламной сети
                    </h3>
                    <div className="space-y-4 text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p><strong className="text-foreground">700+ блогеров</strong>, суммарно охватывающих <strong className="text-foreground">50 000 000 подписчиков</strong></p>
                      </div>
                      <p className="text-sm">Лидеры мнений, которые ежедневно формируют информационную повестку</p>
                      <p className="text-sm italic">В Zorki.pro они заходят сами — по доброй воле и ежедневно. И видят ваш слайд.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Маркетологи */}
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Маркетологи и бизнесы, которые принимают решения
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="text-sm">Каждый день на платформу заходят:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>маркетологи, распределяющие бюджеты</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>агентства</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>владельцы e-commerce проектов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>специалисты, работающие с блогерами</span>
                        </li>
                      </ul>
                      <p className="text-sm font-medium text-foreground mt-4">Это не случайный трафик. Это ядро инфлюенсер-рынка.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Формат */}
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Топовый формат, который гарантирует внимание
                    </h3>
                    <div className="space-y-4 text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p>Слайдер расположен на самом верху главной страницы</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p>Каждый блок показывается по <strong className="text-foreground">10 секунд</strong></p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p>Мест всего <strong className="text-foreground">три</strong> — никакого рекламного шума</p>
                      </div>
                      <p className="text-sm font-medium text-foreground mt-4">Элитный формат, который видит каждый посетитель сайта.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Стоимость размещения
                </h2>
                <p className="text-lg text-muted-foreground">Выберите место, которое подходит вашему бюджету</p>
              </div>

              {/* Monthly Pricing */}
              <div className="mb-16">
                <h3 className="text-xl font-semibold text-foreground mb-8 text-center">Размещение на месяц</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { place: "1-е место", price: "$2000", advantage: "Максимальная видимость, первый кадр", featured: true },
                    { place: "2-е место", price: "$1500", advantage: "Сбалансированная цена / охват", featured: false },
                    { place: "3-е место", price: "$1000", advantage: "Доступный вход в premium-рекламу", featured: false },
                  ].map((plan, index) => (
                    <Card 
                      key={index}
                      className={`relative ${plan.featured ? 'border-2 border-primary shadow-lg scale-105' : 'border'} hover:shadow-lg transition-all`}
                    >
                      {plan.featured && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                            Популярный
                          </span>
                        </div>
                      )}
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-primary fill-primary" />
                            <h4 className="text-2xl font-bold text-foreground">{plan.place}</h4>
                          </div>
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                            <span className="text-muted-foreground">/мес</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.advantage}</p>
                        </div>
                        <Button 
                          className="w-full" 
                          variant={plan.featured ? "default" : "outline"}
                          onClick={() => window.open(telegramLink, '_blank')}
                        >
                          Забронировать
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Packages */}
              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-semibold text-foreground">Пакеты со скидками</h3>
                  </div>
                  
                  {/* 3 months */}
                  <Card className="mb-8 border-2 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-xl font-semibold text-foreground mb-2">3 месяца — выгодный старт</h4>
                          <p className="text-sm text-muted-foreground">Экономия до $900</p>
                        </div>
                        <div className="px-4 py-2 bg-primary/10 rounded-lg">
                          <span className="text-primary font-semibold">-15%</span>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {[
                          { place: "1-е место", price: "$5100", savings: "$900" },
                          { place: "2-е место", price: "$3900", savings: "$600" },
                          { place: "3-е место", price: "$2550", savings: "$450" },
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-muted/50">
                            <div className="text-sm text-muted-foreground mb-1">{item.place}</div>
                            <div className="text-xl font-bold text-foreground mb-1">{item.price}</div>
                            <div className="text-xs text-success">экономия {item.savings}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 6 months */}
                  <Card className="mb-8 border-2 border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-xl font-semibold text-foreground mb-2">6 месяцев — максимальный ROI</h4>
                          <p className="text-sm text-muted-foreground">Экономия до $3600</p>
                        </div>
                        <div className="px-4 py-2 bg-primary/20 rounded-lg">
                          <span className="text-primary font-semibold">-30%</span>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {[
                          { place: "1-е место", price: "$8400", savings: "$3600" },
                          { place: "2-е место", price: "$6300", savings: "$2700" },
                          { place: "3-е место", price: "$4200", savings: "$1800" },
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-muted/50">
                            <div className="text-sm text-muted-foreground mb-1">{item.place}</div>
                            <div className="text-xl font-bold text-foreground mb-1">{item.price}</div>
                            <div className="text-xs text-success">экономия {item.savings}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Year */}
                  <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-background">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-xl font-semibold text-foreground mb-2">Год — индивидуальные условия</h4>
                          <p className="text-sm text-muted-foreground">Персональная скидка + бонусные форматы</p>
                        </div>
                        <div className="px-4 py-2 bg-primary rounded-lg">
                          <span className="text-primary-foreground font-semibold">VIP</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Для годовых контрактов мы предлагаем индивидуальные условия, максимальные скидки и дополнительные бонусные форматы размещения.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(telegramLink, '_blank')}
                      >
                        Обсудить условия
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Кому идеально подходит размещение?
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "SaaS и цифровые сервисы",
                  "Маркетинговые агентства",
                  "Партнерские программы",
                  "Обучающие продукты",
                  "Финтех",
                  "Бренды, работающие с блогерами",
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Как забронировать место</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Простой процесс бронирования
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-12 text-left">
                {[
                  { step: "1", title: "Напишите нам в Telegram", desc: "Свяжитесь с нами через удобный канал" },
                  { step: "2", title: "Выберите место", desc: "1, 2 или 3 — в зависимости от бюджета" },
                  { step: "3", title: "Укажите срок размещения", desc: "Месяц, квартал, полгода или год" },
                  { step: "4", title: "Отправьте материалы", desc: "Мы подготовим слайд для вашего бренда" },
                ].map((item, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-background rounded-2xl border-2 border-primary/20 p-8 mb-8">
                <p className="text-lg text-muted-foreground mb-6">
                  Мы подтверждаем слот — и ваш бренд начинает показываться топовой аудитории уже в ближайшие часы.
                </p>
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6 h-auto group"
                  onClick={() => window.open(telegramLink, '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Написать в Telegram
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Если вы хотите, чтобы блогеры и маркетологи видели ваш бренд каждый день — вы находитесь в правильном месте
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Три места. Ограниченный доступ.<br />
                  Максимальный эффект внутри профессиональной аудитории.
                </p>
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6 h-auto"
                  onClick={() => window.open(telegramLink, '_blank')}
                >
                  Забронировать свой слот сейчас
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdvertisingPage;

