import { Clock} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useEffect, useRef, useState } from 'react'

import pack from '@/assets/pack.webp'
import mixpanelTracker from '../utils/mixpanelTracker.js'

import PersonalizedMessageModern from '../utils/PersonalizedMessageModern.jsx'
import FeaturesShowcase from './FeaturesShowcase.jsx'
// import VideoProcessingBanner from './VideoProcessingBanner.jsx'
import HLSPlayer from './HLSPlayer.jsx'




export default function OptimizedOfferSection({ answers }) {
  const videoRef = useRef(null);
  const [hasWatched170Seconds, setHasWatched170Seconds] = useState(false);
  const [currentWatchTime, setCurrentWatchTime] = useState(0);
  const COUNTDOWN_KEY = 'planofit-offer-countdown-start';
  const OFFER_DURATION_MS = 20 * 60 * 1000; // 20 minutos reais
  const [timeLeftMs, setTimeLeftMs] = useState(OFFER_DURATION_MS);
  const checkoutUrl = 'https://pay.kiwify.com.br/1nfKg8z'; // TODO: atualizar para o link de R$97

  // Formata mm:ss
  const formatTime = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  useEffect(() => {
    // Inicializa tracking de vídeo quando o componente montar
    const setupVideoTracking = () => {
      const videoElement = document.querySelector('video');
      if (videoElement && !videoElement.mixpanelTracked) {
        videoElement.mixpanelTracked = true;
        mixpanelTracker.startVideoTracking(videoElement, 'offer_video');
      }
    };

    // Pequeno delay para garantir que o vídeo foi renderizado
    const timer = setTimeout(setupVideoTracking, 1000);

    // Inicia/recupera contador real 20min
    let start = localStorage.getItem(COUNTDOWN_KEY);
    let startTime = start ? parseInt(start) : Date.now();
    if (!start) localStorage.setItem(COUNTDOWN_KEY, String(startTime));
    const updateTimer = () => {
      const remaining = Math.max(0, startTime + OFFER_DURATION_MS - Date.now());
      setTimeLeftMs(remaining);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      // Para o tracking quando o componente desmontar
      mixpanelTracker.stopVideoTracking('offer_video');
    };
  }, []);

  const handleTimeUpdate = (currentTime, duration) => {
    const watchedSeconds = Math.floor(currentTime);
    setCurrentWatchTime(watchedSeconds);


    // Libera a página quando atingir 230 segundos
    if (watchedSeconds >= 1 && !hasWatched170Seconds) {
      setHasWatched170Seconds(true);
    }
  }

  const handleCheckoutClick = () => {
    mixpanelTracker.trackCheckoutClick('planofit_unique', 97.0);
  }




  return (
    <div className=" overflow-x-hidden min-h-screen bg-white flex items-center
     justify-center p-2 sm:p-6 w-full">
      <div className="w-full max-w-4xl">
        {/* <img src={lightLogo} alt="Logo" className="w-24 mx-auto mb-2" /> */}

        {/* Vídeo HLS Player - MANTIDO */}
        <div className="mb-8 sm:mb-8">
          {/* <div style={{ position: 'relative', aspectRatio: '16/9' }}>
            <iframe
              loading="lazy" title="Gumlet video player"
              className='rounded-2xl'
              src="https://play.gumlet.io/embed/68957eedbcf5dc9e17329925?background=false&autoplay=false&loop=false&disableControls=false"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;">
            </iframe>
          </div> */}
           <HLSPlayer
            src="https://video.gumlet.io/667396f5edc68b774a04aebc/68957eedbcf5dc9e17329925/main.m3u8"
            onTimeUpdate={handleTimeUpdate}
            autoplay={false}
            className="w-full max-w-2xl mx-auto h-[200px] sm:h-[300px] md:h-[400px] shadow-2xl"
            onLoadedData={() => console.log('Vídeo carregado')}
            onEnded={() => console.log('Vídeo terminou')}
          />
        </div>

        {/* Banner discreto logo abaixo do vídeo */}
        {/* {!hasWatched170Seconds && (
          <VideoProcessingBanner 
            answers={answers} 
            currentWatchTime={currentWatchTime} 
          />
        )} */}

        <section id='offer' className={hasWatched170Seconds ? 'block' : 'block'}>
          {/* Header Principal - MANTIDO */}
          <div className="text-center mb-4 sm:mb-12">

            <PersonalizedMessageModern answers={answers} />
          </div>

          <div className=" rounded-2xl  p-2 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-emerald-600">
              Mais Saúde, <span className="text-orange-400">Mais Energia...</span>
            </h2>


            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-8 items-center">
              {/* Sem a PlanoFit */}
              <div className="text-center rounded-3xl p-3 sm:p-6 border border-gray-200 shadow-xs">
                {/* Círculo de progresso 30% */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                  <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Círculo de fundo */}
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Círculo de progresso 30% */}
                    <path
                      className="text-red-500"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="transparent"
                      strokeDasharray="30, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  {/* Texto no centro */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-600">30%</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Sem a </p>
                  <h3 className="text-sm font-bold text-gray-800 mb-4">PlanoFit</h3>
                  <ul className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
                    <li className="flex items-center gap-2">❌ <span>Tentativas sem resultado</span></li>
                    <li className="flex items-center gap-2">❌ <span>Luta constante para perder peso</span></li>
                    <li className="flex items-center gap-2">❌ <span>Efeito sanfona constante</span></li>
                    <li className="flex items-center gap-2">❌ <span>Cansaço que não passa nunca </span></li>
                    <li className="flex items-center gap-2">❌ <span>Ganha peso rápido, perde devagar </span></li>
                  </ul>
                </div>
              </div>

              {/* Com a PlanoFit */}
              <div className="text-center bg-green-50 rounded-3xl p-3 sm:p-6 border border-gray-200 shadow-xs">
                {/* Círculo de progresso 100% */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                  <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Círculo de fundo */}
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Círculo de progresso 100% */}
                    <path
                      className="text-green-500"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="transparent"
                      strokeDasharray="100, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  {/* Texto no centro */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-600">100%</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Com a </p>
                  <h3 className="text-sm font-bold text-gray-800 mb-4">PlanoFit.</h3>
                  <ul className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
                    <li className="flex items-center gap-2">✅ <span>Perda de peso sem passar fome</span></li>
                    <li className="flex items-center gap-2">✅ <span>Mais energia todos os dias</span></li>
                    <li className="flex items-center gap-2">✅ <span>Segue um plano que realmente funciona</span></li>
                    <li className="flex items-center gap-2">✅ <span>Tem certeza de cada passo</span></li>
                    <li className="flex items-center gap-2">✅ <span>Resultados consistentes</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <h4 className="text-center text-2xl font-bold mb-4 text-emerald-600">Tudo que <span className="text-orange-500">você precisa...</span></h4>

          <div style={{ position: 'relative', aspectRatio: '9/11' }} className='mb-2 rounded-2xl max-w-md mx-auto'>
            <iframe
              loading="lazy" title="Gumlet video player"
              className='rounded-2xl'
              src="https://play.gumlet.io/embed/68958af7aa43dddb5c57ac9c?background=false&autoplay=true&loop=true&disableControls=true"
              style={{ border: 'none',  position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;">
            </iframe>
          </div>

        

          {/* Gráfico de Velocidade Metabólica */}
          <section className="mb-1">
            <div className="max-w-md mx-auto no-shadow">
              <CardHeader className="pb-1">
                <CardTitle className="text-center">
                  <h3 className="text-2xl font-extrabold text-gray-600">
                    <span className="text-emerald-600">Para acelerar</span> seu metabolismo <span className="text-orange-500">em 21 dias</span>
                  </h3>
                </CardTitle>
              </CardHeader>
              <div className="relative h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: 'start', value: 15, label: '', x: 0 },
                        { name: 'p1', value: 29, label: '', x: 1 },
                        { name: 'p2', value: 38, label: '', x: 2 },
                        { name: 'p3', value: 48, label: '', x: 3 },
                        { name: 'middle', value: 50, label: 'Agora', x: 4 },
                        { name: 'p4', value: 65, label: '', x: 5 },
                        { name: 'p5', value: 75, label: '', x: 6 },
                        { name: 'p6', value: 85, label: '', x: 7 },
                        { name: 'end', value: 100, label: '3º semana', x: 8 }
                      ]}
                      margin={{ top: 8, right: 30, left: 30, bottom: 8 }}
                    >
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="25%" stopColor="#f97316" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="75%" stopColor="#84cc16" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="25%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="50%" stopColor="#eab308" stopOpacity={0.3} />
                          <stop offset="75%" stopColor="#84cc16" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        interval={0}
                        tickFormatter={(value) => value || ''}
                      />
                      <YAxis hide domain={[0, 100]} />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        fill="url(#areaGradient)"
                        dot={false}
                        activeDot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Marcadores */}
                  <div className="absolute top-9 left-[45%] -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                      Início
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500 mx-auto"></div>
                  </div>
                  <div className="absolute top-1 right-7">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
                  </div>
                </div>
            </div>
          </section>


          <img src={pack} className="w-full h-auto rounded-xl max-w-[290px] md:max-w-[390px] mx-auto" alt="" />



          <div className="mx-auto max-w-5xl px-4 mb-3 max-w-md" id="pricing">
            {/* Vaga reservada + contador real */}
            <div className="mb-6 flex items-center  justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold">
                ✅ Sua vaga foi reservada
              </div>
              <div className="inline-flex items-center flex-w gap-2 rounded-full bg-red-50 text-red-700 px-3 py-1.5 text-sm font-bold">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeftMs)}
              </div>
            </div>

            {/* Benefícios (único bloco acima dos cards) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50 via-white to-orange-50/40 p-5 ring-1 ring-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-x-0 -top-20 mx-auto h-44 w-44 rounded-full bg-orange-200/50 blur-3xl pointer-events-none"></div>

              <div className="text-center mb-4">
                <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  Acesse tudo agora
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5 text-[14px] text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]">✓</span>
                  <span>Plataforma completa</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]">✓</span>
                  <span>Protocolo Z21 exclusivo™</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]">✓</span>
                  <span>Diário Mágico com IA</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]">✓</span>
                  <span>Cardápios Alimentares</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]">✓</span>
                  <span>Bônus exclusivos</span>
                </div>

              </div>

              {/* Oferta única */}
              <div className="mt-6">
                <div className="group relative rounded-2xl border border-emerald-500/30 bg-white/80 backdrop-blur-sm p-6 ring-2 ring-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 shadow-xl">
                  
                  <div className="mb-3">
                    <h4 className="text-lg font-extrabold text-gray-700">Acesso por 6 meses</h4>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-extrabold text-gray-800 tracking-tight">R$ 97</span>
                      <span className="text-sm text-black/60">à vista</span>
                    </div>
                    <div className="mt-1">
                      <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
                        0,53 centavos / dia
                      </span>
                    </div>
                  </div>

                  <a
                    href={checkoutUrl}
                    target="_blank"
                    onClick={handleCheckoutClick}
                    className="mt-4 block pulse-animation text-center w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 shadow-lg shadow-emerald-600/30 hover:from-emerald-600 hover:to-green-600 active:scale-[0.99] transition-all"
                  >
                    Aproveitar agora
                  </a>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-black/60">
                    <span className="inline-flex items-center gap-1">🔒 Pagamento seguro</span>
                    <span className="h-1 w-1 rounded-full bg-black/20"></span>
                    <span>Acesso imediato</span>
                  </div>
                </div>
              </div>

              {/* Rodapé informativo */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-black/5 p-3 text-center">
                  <p className="text-[12px] text-black/70 font-bold">Sem mensalidade!</p>
                </div>
               
              </div>

              <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
                <div className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-[11px] text-black/70">
                  💳 Visa • Mastercard • Pix
                </div>
                <div className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-[11px] text-black/70">
                  🛡️ Garantia 7 dias
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
            </div>
          </div>

  

          <section id="bonus">
          <div className="content text break-words py-2 text-center">
            <h2 className="ql-align-center text-2xl font-bold">
              <span className="text-gray-500">Ainda tem </span><span
                className="text-orange-500 font-bold">muito mais...</span></h2></div>

          <div className="bg-green-100 text-green-700 p-3 mb-6 mt-6 rounded-2xl max-w-[333px] mx-auto">
            <h1 className="text-center">

              <strong className="text-[#16a34a] font-extrabold text-3xl">🎁&nbsp; Bônus inclusos!</strong>
            </h1>
            <p className="text-center text-green-700 text-lg mt-2">Para acelerar seus resultados</p>
          </div>

          <div className="bg-green-100 rounded-xl  p-2 mb-3 mt-3  max-w-[333px] mx-auto">
            <p className="text-center text-emerald-800 font-bold text-lg ">Guia Detox Turbo</p>
            <span className="text-center text-green-700 text-sm w-full block">Desinche já na Primeira Semana</span>
          </div>

          <div className="bg-green-100 rounded-xl  p-3 mb-3 mt-3  max-w-[333px] mx-auto">
            <p className="text-center text-emerald-800 font-bold text-lg ">Receitas AirFryer</p>
            <span className="text-center text-green-700 text-sm w-full block">Para Emagrecer Com Prazer</span>
          </div>

          <div className="bg-green-100 rounded-xl  p-3 mb-3 mt-3  max-w-[333px] mx-auto">
            <p className="text-center text-emerald-800 font-bold text-lg ">Biblioteca Premium</p>
            <span className="text-center text-green-700 text-sm w-full block">Vídeo Aulas completas passo a passo</span>
          </div>

          <div className="bg-green-100 rounded-xl  p-3 mb-3 mt-3  max-w-[333px] mx-auto">
            <p className="text-center text-emerald-800 font-bold text-lg ">Chá da Banana</p>
            <span className="text-center text-green-700 text-sm w-full block">Reduz Ansiedade e Gordura Abdominal</span>
          </div>
          </section>

          <a
                    href={checkoutUrl}
                    target="_blank"
                    onClick={handleCheckoutClick}
                    className="mt-4 mb-4 block pulse-animation text-center 
                    max-w-[333px] mx-auto w-full rounded-xl bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold py-3 shadow-lg shadow-emerald-600/30 hover:from-emerald-600 hover:to-green-600 active:scale-[0.99] transition-all"
                  >
                    Quero me inscrever
                  </a>


          <FeaturesShowcase />

          <a
                    href={checkoutUrl}
                    target="_blank"
                    onClick={handleCheckoutClick}
                    className="mt-4 block pulse-animation text-center 
                    max-w-[333px] mx-auto w-full rounded-xl bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold py-3 shadow-lg shadow-emerald-600/30 hover:from-emerald-600 hover:to-green-600 active:scale-[0.99] transition-all"
                  >
                    Quero me inscrever
                  </a>

        </section>

        <p className="text-center mt-20 text-xs text-gray-600 max-w-[450px] mx-auto">
        A PlanoFit é uma ferramenta de apoio criada com base científica para te ajudar na jornada de emagrecimento. Por cuidado com sua saúde, consulte sempre um médico antes de mudanças significativas na alimentação ou exercícios.</p>
      </div>
    </div>
  )
}