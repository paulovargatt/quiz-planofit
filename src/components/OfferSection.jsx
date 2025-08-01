import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, Heart, Zap, Star, Clock, Shield, Gift, Sparkles, BarChart3, Camera, Calendar } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import HLSPlayer from './HLSPlayer.jsx'
import lightLogo from '@/assets/logo.webp'
import foto from '@/assets/foto.jpg'
import z21 from '@/assets/z21.jpg'
import assistent from '@/assets/assistent.jpg'
import pack from '@/assets/pack.webp'

import PersonalizedMessageModern from '../utils/PersonalizedMessageModern.jsx'

export default function OptimizedOfferSection({ answers }) {
  const handleTimeUpdate = (currentTime, duration) => {
    console.log(`Tempo assistido: ${Math.floor(currentTime)}s de ${Math.floor(duration)}s`)
  }

  return (
    <div className=" overflow-x-hidden min-h-screen bg-white flex items-center
     justify-center p-2 sm:p-6 w-full">
      <div className="w-full max-w-4xl">
        <img src={lightLogo} alt="Logo" className="w-24 mx-auto mb-2" />

        {/* Vídeo HLS Player - MANTIDO */}
        <div className="mb-8 sm:mb-8">
          <HLSPlayer
            src="https://video.gumlet.io/667396f5edc68b774a04aebc/688c5a92f20742b35bb3cf1b/main.m3u8"
            onTimeUpdate={handleTimeUpdate}
            autoplay={true}
            className="w-full max-w-3xl mx-auto h-[200px] sm:h-[300px] md:h-[400px] shadow-2xl"
            onLoadedData={() => console.log('Vídeo carregado')}
            onEnded={() => console.log('Vídeo terminou')}
          />
        </div>

        {/* Header Principal - MANTIDO */}
        <div className="text-center mb-4 sm:mb-12">

          <PersonalizedMessageModern answers={answers} />
        </div>

        <div className=" rounded-2xl  p-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-[#6b7280]">
            Emagreça de forma inteligente
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
                <p className="text-sm text-gray-500 mb-1">Suas chances de</p>
                <h3 className="text-sm font-bold text-gray-800 mb-4">emagrecer <span className="text-red-500">antes</span> da<br />PlanoFit.</h3>
                <ul className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-2">❌ <span>Tentativas sem resultado</span></li>
                  <li className="flex items-center gap-2">❌ <span>Não sabe quantas calorias comer</span></li>
                  <li className="flex items-center gap-2">❌ <span>Efeito sanfona constante</span></li>
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
                <p className="text-sm text-gray-500 mb-1">Suas chances de</p>
                <h3 className="text-sm font-bold text-gray-800 mb-4">emagrecer <span className="text-green-500">depois</span> da<br />PlanoFit.</h3>
                <ul className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-2">✅ <span>IA calcula suas calorias</span></li>
                  <li className="flex items-center gap-2">✅ <span>Registro automático com foto</span></li>
                  <li className="flex items-center gap-2">✅ <span>Resultados consistentes</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* DEMONSTRAÇÃO COM PRINTS REAIS (Princípio da Mordomize) */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl text-[#6b7280] font-semibold text-center mb-6">
            🎯 O que você encontrará<br></br><span className="text-orange-500 font-bold"> Dentro da PlanoFit</span>
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Confira como é <strong className="text-orange-500 font-bold">simples</strong> usar nossa plataforma
          </p>

          <div className="grid gap-8">


            {/* IA por Foto - PRINT 4 (DESTAQUE) */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 ">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className=" rounded-xl p-0 text-center order-2 md:order-1">
                  <img src={foto} className="w-full h-auto rounded-xl max-w-[200px] mx-auto" alt="" />
                  <p className="text-xs text-gray-600 mt-2">IA identifica automaticamente!</p>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Camera className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[#4c525f]">Registro <span className="text-orange-500 font-bold">por Foto</span></h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <strong>Tirou foto, pronto!</strong> Nossa IA identifica cada alimento, calcula porções e registra tudo automaticamente. Sem pesar, sem anotar, sem calcular!
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Reconhecimento automático</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Cálculo de porções:</strong> IA estima quantidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Macros detalhados:</strong> Proteína, carbo, gordura</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Protocolo Z21 - PRINT 6 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[#4c525f]">Protocolo <span className="text-orange-500 font-bold">Z21</span></h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <strong>Acelere seu metabolismo em 21 dias</strong>. Queime gordura mesmo dormindo e sinta mais energia durante o dia.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Acelera metabolismo:</strong> Queima até 30% mais calorias</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Cronômetro integrado:</strong> Controla horários automaticamente</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Passo a passo diário:</strong> Sabe exatamente o que fazer</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl p-0 text-center">
                  <img src={z21} className="w-full h-auto rounded-xl max-w-[250px] mx-auto" alt="" />
                  <p className="text-xs text-gray-600 mt-2">21 dias para acelerar seu metabolismo</p>
                </div>
              </div>
            </div>

            {/* Assistente IA - PRINT 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="rounded-xl p-4 text-center order-2 md:order-1">
                  <img src={assistent} className="w-full h-auto rounded-xl max-w-[250px] mx-auto" />
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Sparkles className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[#4c525f]">Assistente <span className='text-orange-500 font-bold'>IA</span></h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Não é só um chat! É um sistema completo com módulos especializados para cada área da sua jornada de emagrecimento.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Registro Rápido:</strong> Exercício, refeição, água</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Nutrição Avançada:</strong> Proteínas, gorduras, densidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700"><strong>Bem-estar Mental:</strong> Fome emocional, hábitos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <div className="bg-green-100 rounded-xl  p-3 mb-3 mt-3  max-w-[333px] mx-auto">
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

          {/* Gráfico de Velocidade Metabólica */}
          <div className="bg-white rounded-2xl  p-3 mb-3 max-w-md mx-auto">

<div className="text-center mb-4">
  <h2 className="text-2xl font-bold text-gray-600 mb-2">
 <span className="text-orange-500"> Acelere</span> seu metabolismo 
  </h2>
  <p className="text-sm text-gray-500">
    Veja como a PlanoFit turbina seu metabolismo
  </p>
</div>

<div className="relative h-48">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={[
        { name: 'start', value: 15, label: '', x: 0 },
        { name: 'p1', value: 29, label: '', x: 1 },
        { name: 'p2', value: 38, label: '', x: 2 },
        { name: 'p3', value: 48, label: '', x: 3 },
        { name: 'middle', value: 50, label: '', x: 4 },
        { name: 'p4', value: 65, label: '', x: 5 },
        { name: 'p5', value: 75, label: '', x: 6 },
        { name: 'p6', value: 85, label: '', x: 7 },
        { name: 'end', value: 100, label: 'Queima', x: 8 }
      ]}
      margin={{ top: 20, right: 35, left: 0, bottom: 20 }}
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

  {/* Ponto "Você" destacado */}
  <div className="absolute top-10 left-[45%] transform -translate-x-1/2">
    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
     Início
    </div>
    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-500 mx-auto"></div>
  </div>
  {/* Pontos destacados nos extremos e meio */}
 
  <div className="absolute top-1 right-7">
    <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
  </div>
</div>



</div>


        <img src={pack} className="w-full h-auto rounded-xl max-w-[290px] mx-auto" alt="" />

      

        <div className="max-w-md mx-auto px-4" id="pricing"> <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50 via-white to-orange-50/40 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5"> <div className="absolute inset-x-0 -top-16 mx-auto h-44 w-44 rounded-full bg-orange-200/50 blur-3xl"></div>

<div className="flex items-center justify-between mb-2">
  <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 shadow-sm">
    🔥 Oferta Relâmpago
  </span>
  <span className="text-[12px] text-black/90">Termina hoje {new Date().toLocaleDateString()}</span>
</div>



<div className="text-center">


  <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
    1 ANO DE ACESSO
  </h3>
  <p className="text-[13px] text-black/60 -mt-0.9">Sem Mensalidades</p>

  <div className="mt-4">
    <div className="flex items-baseline justify-center gap-2">
      <span className="text-red-400 line-through text-md">R$ 147</span>
      <span className="text-4xl font-extrabold text-gray-900 tracking-tight">R$ 80,85</span>
    </div>
    <p className="text-[16px] font-semibold mt-1 text-orange-500">Economize 45% hoje</p>
    <p className="text-[19px] font-semibold text-green-900 mt-0.5">ou 12x de R$ 8,07</p>
  </div>
</div>

<div className="mt-5 grid grid-cols-1 gap-2.5 text-[15px] text-gray-600">
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

<div className="mt-6 space-y-2">
  <a
    href="https://pay.kiwify.com.br/TUZ8YDG?coupon=APENASHOJE"
    target="_blank"
    className="group block pulse-animation w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center font-extrabold py-3 shadow-lg shadow-emerald-600/30 hover:from-emerald-600 hover:to-green-600 active:scale-[0.99] transition-all"
  >
    Garantir meu acesso
  </a>


</div>

<div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-black/60">
  <span className="inline-flex items-center gap-1">🔒 Pagamento 100% seguro</span>
  <span className="h-1 w-1 rounded-full bg-black/20"></span>
  <span>Acesso imediato</span>
</div>

<div className="pointer-events-none absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>

<div className="mt-4 rounded-xl bg-gradient-to-r from-orange-100 to-orange-50 p-3 text-center ring-1 ring-orange-200">
  <p className="text-[12px] text-orange-700 font-medium">
    Cupom aplicado automaticamente
  </p>
</div>

<div className="mt-3 flex items-center justify-center gap-3">
  <div className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-[11px] text-black/70">
    💳 Visa • Mastercard • Pix
  </div>
  <div className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-[11px] text-black/70">
    🛡️ Garantia 7 dias
  </div>
</div>
</div> </div>
      </div>
    </div>
  )
}