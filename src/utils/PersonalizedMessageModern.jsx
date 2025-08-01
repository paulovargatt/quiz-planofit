import React from 'react'
import {
  RotateCcw,
  Clock,
  HelpCircle,
  Heart,
  Zap,
  TrendingUp,
  Target,
  Moon,
  Flame,
  Sparkles,
  CheckCircle,
  Star,
  WeightIcon
} from 'lucide-react'

const CHALLENGE_CONFIG = {
  restrictive_diets: {
    icon: RotateCcw,
    headline: 'Ciclo de Dietas Restritivas',
    problem: 'Seu corpo entra em "modo economia" e você recupera tudo depois.',
    solution: 'PlanoFit calcula suas calorias exatas sem passar fome.',
    gradient: 'from-rose-500/10 to-pink-500/5',
    borderColor: 'border-rose-200/50',
    iconBg: 'from-rose-500 to-pink-600',
    badgeGradient: 'from-rose-500 to-pink-600',
  },
  no_time: {
    icon: Clock,
    headline: 'Falta de Tempo',
    problem: 'Na correria, você come qualquer coisa e perde o controle.',
    solution: 'IA planeja tudo em segundos + registro por foto.',
    gradient: 'from-amber-500/10 to-orange-500/5',
    borderColor: 'border-amber-200/50',
    iconBg: 'from-amber-500 to-orange-600',
    badgeGradient: 'from-amber-500 to-orange-600',
  },
  confusion: {
    icon: HelpCircle,
    headline: 'Informação Demais',
    problem: 'Cada "expert" fala algo e você não sabe o que seguir.',
    solution: 'Assistente IA te diz exatamente o que comer.',
    gradient: 'from-violet-500/10 to-purple-500/5',
    borderColor: 'border-violet-200/50',
    iconBg: 'from-violet-500 to-purple-600',
    badgeGradient: 'from-violet-500 to-purple-600',
  },
  emotional_eating: {
    icon: Heart,
    headline: 'Fome Emocional',
    problem: 'Ansiedade vira calorias extras sem perceber.',
    solution: 'Identifique gatilhos e quebre o ciclo.',
    gradient: 'from-pink-500/10 to-rose-500/5',
    borderColor: 'border-pink-200/50',
    iconBg: 'from-pink-500 to-rose-600',
    badgeGradient: 'from-pink-500 to-rose-600',
  },
}

const BENEFITS_BY_SYMPTOM = {
  fatigue: {
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
    text: 'Mais energia no dia'
  },
  low_self_esteem: {
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-600',
    text: 'Autoestima lá em cima'
  },
  uncontrolled_hunger: {
    icon: Target,
    gradient: 'from-blue-500 to-indigo-600',
    text: 'Fome sob controle'
  },
  sleep_issues: {
    icon: Moon,
    gradient: 'from-violet-500 to-purple-600',
    text: 'Sono mais profundo'
  },
}

const CTA_BY_COMMITMENT = {
  full_transformation: {
    text: 'Quero minha transformação agora',
    icon: Flame,
    gradient: 'from-rose-500 to-pink-500'
  },
  gradual_change: {
    text: 'Começar no meu ritmo',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-indigo-500'
  },
  default: {
    text: 'Ver como funciona',
    icon: Sparkles,
    gradient: 'from-emerald-500 to-teal-500'
  },
}

const HeaderSection = () => (
  <div className="mb-6 text-center">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 text-slate-700 text-sm font-medium shadow-sm">
      <CheckCircle className="w-4 h-4 text-slate-500" />
      <span>Diagnóstico Personalizado</span>
    </div>
    <h3 className="mt-3 text-lg leading-tight font-bold text-slate-900">
      Identificamos seu principal bloqueio
    </h3>
    <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
      Baseado nas suas respostas, criamos uma estratégia específica para seu perfil.
    </p>
  </div>
)

const MainCardSection = ({ config }) => {
  const IconComponent = config.icon

  return (
    <div className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} border ${config.borderColor} shadow-lg p-6 mb-6 overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative">
        <div className="flex items-start gap-4">

          <div className="flex-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.badgeGradient} text-white text-xs font-semibold mb-3 shadow-sm`}>
              <span>Foco Principal</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 leading-tight mb-3">
              {config.headline}
            </h4>
            <div className="space-y-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold text-slate-900">O que está acontecendo:</span>
                </p>
                <p className="text-sm text-slate-700 mt-1">{config.problem}</p>
              </div>
              {/* <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold text-slate-900">Nossa abordagem:</span>
                </p>
                <p className="text-sm text-slate-700 mt-1">{config.solution}</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AttemptsSection = ({ type }) => {
  if (type === 'many_times' || type === 'constant_struggle') {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-11 h-11 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl grid place-items-center text-white shadow-md">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-rose-900 text-sm font-semibold mb-1">
              Sabemos que você já tentou antes
            </p>
            <p className="text-rose-800 text-sm leading-relaxed">
              Desta vez será diferente: ferramentas baseadas em ciência, sem depender só de força de vontade.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'first_time') {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl grid place-items-center text-white shadow-md">
            <Star className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-900 text-sm font-semibold mb-1">
              Momento perfeito para começar
            </p>
            <p className="text-emerald-800 text-sm leading-relaxed">
              Começar com as ferramentas certas desde o início acelera muito os resultados.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

const BenefitItem = ({ benefit }) => {
  const IconComponent = benefit.icon

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-md transition-all duration-200">
      <div className={`shrink-0 w-8 h-8 bg-gradient-to-br ${benefit.gradient} rounded-lg grid place-items-center text-white shadow-sm`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <span className="text-slate-700 font-medium text-sm">{benefit.text}</span>
    </div>
  )
}

const BenefitsSection = ({ symptoms }) => {
  const benefitItems = symptoms
    .filter(symptom => BENEFITS_BY_SYMPTOM[symptom])
    .map(symptom => BENEFITS_BY_SYMPTOM[symptom])

  if (benefitItems.length === 0) return null

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border
     border-indigo-200/50 p-6 mb-6 shadow-sm">
      <h4 className="text-indigo-900 text-sm font-semibold mb-4 text-center">
        Benefícios adicionais que você vai conquistar:
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {benefitItems.map((benefit, index) => (
          <BenefitItem key={index} benefit={benefit} />


        ))}

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-md transition-all duration-200">
          <div className={`shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-500 rounded-lg grid place-items-center text-white shadow-sm`}>
            <WeightIcon className="w-4 h-4" />
          </div>
          <span className="text-slate-700 font-medium text-sm">Emagrecer sem sofrimento</span>
        </div>

       
      </div>
    </div>
  )
}

const CTASection = ({ commitment }) => {
  const ctaConfig = CTA_BY_COMMITMENT[commitment] || CTA_BY_COMMITMENT.default
  const IconComponent = ctaConfig.icon

  return (
    <div className="text-center space-y-3">
      <button className={`w-full bg-gradient-to-r ${ctaConfig.gradient} text-white rounded-2xl p-4 shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <IconComponent className="w-6 h-6" />
        </div>
        <p className="text-base font-bold">{ctaConfig.text}</p>
        <p className="text-xs opacity-90 mt-1">
          Sem enrolação: veja o passo a passo em 60 segundos
        </p>
      </button>
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <CheckCircle className="w-3 h-3 text-emerald-600" />
        <span>Plano 100% personalizado</span>
        <span className="text-slate-300">•</span>
        <span>Sem passar fome</span>
      </div>
    </div>
  )
}

export const PersonalizedMessageModern = ({ answers }) => {
  const a = answers || {}
  const mainChallenge = a.main_challenge || 'confusion'
  const symptoms = Array.isArray(a.symptoms) ? a.symptoms : []
  const commitment = a.commitment || 'curious'
  const attempts = a.weight_loss_attempts || 'none'

  const challengeConfig = CHALLENGE_CONFIG[mainChallenge] || CHALLENGE_CONFIG.confusion

  return (
    <div className="mx-auto max-w-[560px] px-4">
      <HeaderSection />
      <MainCardSection config={challengeConfig} />
      <AttemptsSection type={attempts} />
      <BenefitsSection symptoms={symptoms} />
      
    </div>
  )
}

export default PersonalizedMessageModern
