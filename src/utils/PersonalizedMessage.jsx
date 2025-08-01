import { CheckCircle, AlertTriangle, Target, Zap, Heart, Clock, Brain, TrendingUp } from 'lucide-react'

export default function PersonalizedMessage(answers) {
  const mainChallenge = answers.main_challenge
  const symptoms = answers.symptoms || []
  const commitment = answers.commitment
  const attempts = answers.weight_loss_attempts

  // Configuração por desafio principal
  const challengeConfig = {
    restrictive_diets: {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Ciclo das Dietas Restritivas",
      problem: "Seu corpo entra em 'modo economia' e depois você recupera tudo + mais um pouco",
      solution: "A PlanoFit vai quebrar esse ciclo calculando EXATAMENTE suas calorias - sem passar fome!",
      color: "border-red-200 bg-red-50"
    },
    no_time: {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Falta de Tempo = Perda de Controle",
      problem: "Você acaba comendo qualquer coisa e perdendo o controle das calorias",
      solution: "Nossa IA planeja TUDO em segundos: calorias exatas + registro automático por foto!",
      color: "border-orange-200 bg-orange-50"
    },
    confusion: {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: "Perdida no Mar de Informações",
      problem: "Cada 'expert' fala uma coisa diferente e você não sabe em quem confiar",
      solution: "Nosso assistente IA será seu guia pessoal - te dizendo EXATAMENTE o que comer!",
      color: "border-purple-200 bg-purple-50"
    },
    emotional_eating: {
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      title: "Fome Emocional Sabotando Tudo",
      problem: "Ansiedade e estresse viram calorias extras que você nem percebe",
      solution: "Vamos te ajudar a identificar os gatilhos e quebrar esse ciclo!",
      color: "border-pink-200 bg-pink-50"
    }
  }

  const config = challengeConfig[mainChallenge] || challengeConfig.confusion

  // Benefícios específicos por sintoma
  const symptomBenefits = []
  if (symptoms.includes('fatigue')) {
    symptomBenefits.push({ icon: <Zap className="w-4 h-4" />, text: "Recuperar energia e disposição", color: "text-yellow-600" })
  }
  if (symptoms.includes('low_self_esteem')) {
    symptomBenefits.push({ icon: <TrendingUp className="w-4 h-4" />, text: "Elevar autoestima com resultados reais", color: "text-green-600" })
  }
  if (symptoms.includes('uncontrolled_hunger')) {
    symptomBenefits.push({ icon: <Target className="w-4 h-4" />, text: "Controlar a fome com calorias certas", color: "text-blue-600" })
  }

  // CTA personalizado
  const getPersonalizedCTA = () => {
    if (commitment === 'full_transformation') {
      return { text: "Estou pronta! Quero minha transformação AGORA!", emoji: "🔥", color: "from-red-500 to-pink-500" }
    } else if (commitment === 'gradual_change') {
      return { text: "Vamos começar! Quero ver como funciona!", emoji: "📈", color: "from-blue-500 to-purple-500" }
    } else {
      return { text: "Parece fácil! Quero conhecer o método!", emoji: "✨", color: "from-green-500 to-teal-500" }
    }
  }

  const cta = getPersonalizedCTA()

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          <h2 className="text-2xl font-bold mb-2">Seu Diagnóstico Personalizado</h2>
        </div>
        <p className="text-gray-600">Descobrimos exatamente por que você não consegue emagrecer:</p>
      </div>

      {/* Problema Principal */}
      <div className={`border-2 rounded-xl p-6 ${config.color}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm">
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{config.title}</h3>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">O problema:</span> {config.problem}
            </p>
            <div className="bg-white/80 rounded-lg p-4 border-l-4 border-orange-400">
              <p className="text-gray-800 font-semibold">{config.solution}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Tentativas */}
      {(attempts === 'many_times' || attempts === 'constant_struggle') && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💔</div>
            <div>
              <p className="text-red-700 font-semibold">Sabemos que você já tentou várias vezes...</p>
              <p className="text-red-600 text-sm">Mas desta vez será diferente porque você terá as ferramentas CERTAS!</p>
            </div>
          </div>
        </div>
      )}

      {attempts === 'first_time' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌟</div>
            <div>
              <p className="text-green-700 font-semibold">Que bom que chegou até aqui na primeira tentativa!</p>
              <p className="text-green-600 text-sm">Você vai começar do jeito certo, com ciência e tecnologia.</p>
            </div>
          </div>
        </div>
      )}

      {/* Benefícios Personalizados */}
      {symptomBenefits.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-purple-700 mb-4 text-center">E ainda vamos:</h4>
          <div className="grid gap-3">
            {symptomBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                <div className={`${benefit.color}`}>
                  {benefit.icon}
                </div>
                <span className="text-gray-700 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <div className={`bg-gradient-to-r ${cta.color} text-white rounded-xl p-6 shadow-lg`}>
          <div className="text-3xl mb-2">{cta.emoji}</div>
          <p className="text-xl font-bold mb-2">{cta.text}</p>
          <p className="text-sm opacity-90">Assista ao vídeo e descubra seu plano personalizado:</p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>100% personalizado para seu perfil</span>
        </div>
      </div>
    </div>
  )
}