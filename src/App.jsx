import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, Heart, Zap, Star, Clock, Shield, Gift } from 'lucide-react'
import OfferSection from './components/OfferSection.jsx'
import FBTracker from './lib/facebookTracker.js'
import './App.css'

function App() {
  const QUIZ_STEP_KEY = 'planofit-quiz-step'
  const QUIZ_ANSWERS_KEY = 'planofit-quiz-answers'
  const QUIZ_LOADING_KEY = 'planofit-quiz-loading'


  useEffect(() => {
    // Inicializa o tracker
    if (window.FBTrackerInit) return;
    FBTracker.init({
      pixels: [
        { id: '1498606654291517' }
      ],
      debug: false, // Para desenvolvimento
      autoCapture: false, // Sem formulários
      enhancedDataCollection: true,
      engagementTracking: true,
      collectGeolocation: true
    });
    window.FBTrackerInit = true;

  }, []);

  const loadQuizState = () => {
    try {
      const savedStep = localStorage.getItem(QUIZ_STEP_KEY)
      const savedAnswers = localStorage.getItem(QUIZ_ANSWERS_KEY)
      const savedLoading = localStorage.getItem(QUIZ_LOADING_KEY)
      return {
        step: savedStep ? parseInt(savedStep) : 0,
        answers: savedAnswers ? JSON.parse(savedAnswers) : {},
        loading: savedLoading === 'true'
      }
    } catch (error) {
      console.warn('Erro ao carregar estado do quiz:', error)
      return { step: 0, answers: {}, loading: false }
    }
  }

  const saveQuizState = (step, answers, loading) => {
    try {
      localStorage.setItem(QUIZ_STEP_KEY, step.toString())
      localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(answers))
      localStorage.setItem(QUIZ_LOADING_KEY, loading.toString())
    } catch (error) {
      console.warn('Erro ao salvar estado do quiz:', error)
    }
  }

  const initialState = loadQuizState()
  const [currentStep, setCurrentStep] = useState(initialState.step)
  const [answers, setAnswers] = useState(initialState.answers)
  const [isLoading, setIsLoading] = useState(initialState.loading)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const questions = [
    {
      id: 'main_challenge',
      title: 'Qual dessas situações mais te impede de alcançar o corpo dos seus sonhos?',
      subtitle: 'Seja 100% sincera conosco',
      options: [
        { id: 'restrictive_diets,', text: 'Começo dietas, mas desisto rápido e engordo tudo de novo', emoji: '😔' },
        { id: 'no_time', text: 'Não tenho tempo para planejar refeições e acabo comendo qualquer coisa', emoji: '⏰' },
        { id: 'confusion', text: 'Fico perdida com tanta informação e não sei o que comer', emoji: '🤔' },
        { id: 'emotional_eating', text: 'Desconto a ansiedade e o estresse na comida', emoji: '😰' }
      ]
    },
    {
      id: 'symptoms',
      title: 'Além da dificuldade para emagrecer, você se identifica com algum desses sinais?',
      subtitle: 'Pode selecionar mais de um',
      multiple: true,
      options: [
        { id: 'fatigue', text: 'Cansaço constante e falta de energia', emoji: '😴' },
        { id: 'metabolism', text: 'Dificuldade para emagrecer', emoji: '🔴' },
        { id: 'low_self_esteem', text: 'Baixa autoestima e insatisfação com o corpo', emoji: '😞' },
        { id: 'hair_nails', text: 'Queda de cabelo, unhas fracas ou pele ressecada', emoji: '💇‍♀️' },
        { id: 'uncontrolled_hunger', text: 'Fome descontrolada ou compulsão alimentar', emoji: '🍽️' },
        { id: 'sleep_issues', text: 'Dificuldade para dormir ou sono de má qualidade', emoji: '🌙' }
      ]
    },
    {
      id: 'commitment',
      title: 'O quanto você está disposta a mudar seus hábitos para ter resultados reais e duradouros?',
      subtitle: 'Seja honesta sobre sua disposição',
      options: [
        { id: 'full_transformation', text: 'Estou pronta para uma transformação completa!', emoji: '🔥' },
        { id: 'gradual_change', text: 'Quero começar aos poucos, mas com resultados visíveis', emoji: '📈' },
        { id: 'easy_path', text: 'Preciso de algo muito fácil de seguir, sem complicação', emoji: '✨' }
      ]
    },
    {
      id: 'weight_loss_attempts',
      title: 'Quantas vezes você já tentou emagrecer nos últimos 2 anos?',
      subtitle: 'Seja honesta - isso vai ajudar no seu diagnóstico',
      options: [
        { id: 'first_time', text: 'Esta é minha primeira tentativa séria', emoji: '🆕' },
        { id: 'few_times', text: '2-3 tentativas sem sucesso duradouro', emoji: '🔄' },
        { id: 'many_times', text: 'Já perdi as contas de tantas tentativas', emoji: '😓' },
        { id: 'constant_struggle', text: 'Vivo em eterna luta com a balança', emoji: '⚖️' }
      ]
    }
  ]

  const handleAnswer = (questionId, answerId, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || []
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter(id => id !== answerId)
        : [...currentAnswers, answerId]
      const updatedAnswers = { ...answers, [questionId]: newAnswers }
      setAnswers(updatedAnswers)
      saveQuizState(currentStep, updatedAnswers, isLoading)
    } else {
      const updatedAnswers = { ...answers, [questionId]: answerId }
      setAnswers(updatedAnswers)
      saveQuizState(currentStep, updatedAnswers, isLoading)
      setTimeout(() => {
        nextStep()
      }, 500)
    }
  }

  const nextStep = () => {
    let newStep = currentStep
    if (currentStep === 0) {
      newStep = 1
      setCurrentStep(1)
    } else if (currentStep <= questions.length) {
      if (currentStep === questions.length) {
        startLoading()
        return
      } else {
        newStep = currentStep + 1
        setCurrentStep(newStep)
      }
    }
    saveQuizState(newStep, answers, isLoading)
  }

  const startLoading = () => {
    setIsLoading(true)
    const newStep = questions.length + 1
    setCurrentStep(newStep)
    saveQuizState(newStep, answers, true)


    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      setIsLoading(false)
      saveQuizState(newStep, answers, false)
    }, 5000)
  }

  const getCurrentQuestion = () => questions[currentStep - 1]
  const isAnswered = (question) => {
    if (question.multiple) {
      return answers[question.id] && answers[question.id].length > 0
    }
    return answers[question.id]
  }



  if (currentStep === 0) {
    return (
      <div className=" overflow-x-hidden min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center shadow-xl sm:shadow-2xl border-0 rounded-2xl backdrop-blur-sm">
          <CardHeader className="pb-8">

            <img src="https://i.imgur.com/K4PzvmK.jpeg" className='w-60 h-60 mx-auto mb-6' alt="" />
            <CardTitle className="text-3xl sm:text-4xl font-bold
             tracking-tight bg-gradient-to-r from-orange-600
              to-pink-500 bg-clip-text text-transparent mb-2">
              <b>Descubra:</b> Qual o Seu <span className="text-[#6b7280] "> Tipo Metabólico?</span>
            </CardTitle>

            <span className="font-semibold text-base text-lg sm:text-lg text-gray-800">E como saber se ele está ativo...</span>
            {/* <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
              Responda <span className="font-semibold text-pink-600">essas perguntas rápidas</span> e receba seu
              <span className="font-semibold text-purple-600"> diagnóstico personalizado</span>.
            </p> */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Leva menos de 2 minutos</span>
            </div>
          </CardHeader>
          <CardContent className="px-4">
            <Button
              onClick={nextStep}
              className="w-full py-8 pulse-animation text-lg font-bold 
              bg-gradient-to-r from-orange-500
               to-orange-600 hover:from-orange-600
                hover:to-orange-700 text-white rounded-xl
                 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center">
                Vamos Começar
                <Zap className="w-5 h-5 ml-2" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center shadow-xl sm:shadow-2xl border-0 rounded-2xl backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse shadow-lg ring-8 ring-white/60">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Preparando seu diagnóstico personalizado
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-700 mb-8">
              Estamos analisando suas respostas para criar um plano exclusivo e prático para você.
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-8">
            <div className="space-y-4">
              <Progress value={loadingProgress} className="h-2 sm:h-3 rounded-full" />
              <div className="text-sm text-gray-600 space-y-2">
                {loadingProgress < 30 && <p>🔍 Analisando seu perfil...</p>}
                {loadingProgress >= 30 && loadingProgress < 60 && <p>🧠 Processando com Inteligência Artificial...</p>}
                {loadingProgress >= 60 && loadingProgress < 90 && <p>📋 Montando seu plano personalizado...</p>}
                {loadingProgress >= 90 && <p>✨ Finalizando os últimos detalhes...</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === questions.length + 1) {
    return <OfferSection answers={answers} />
  }

  const question = getCurrentQuestion()
  const progress = currentStep === 0 ? 0 : ((currentStep) / questions.length) * 100

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center shadow-xl sm:shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-2xl shadow-xl sm:shadow-2xl border-0 rounded-2xl mx-auto">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="mb-4 sm:mb-6">
            <Progress value={progress} className="h-1.5 sm:h-2 rounded-full" />
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
              <span>Pergunta {currentStep} de {questions.length}</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2 leading-tight tracking-tight">
            {question.title}
          </CardTitle>
          <p className="text-gray-700 text-center text-sm sm:text-base">{question.subtitle}</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="space-y-3 sm:space-y-4">
            {question.options.map((option) => {
              const isSelected = question.multiple
                ? (answers[question.id] || []).includes(option.id)
                : answers[question.id] === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(question.id, option.id, question.multiple)}
                  className={[
                    'w-full p-4 sm:p-5 text-left rounded-xl border transition-all duration-200',
                    'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60',
                    'bg-white/90 backdrop-blur-sm',
                    isSelected
                      ? 'border-pink-500/70 bg-pink-50 shadow-md'
                      : 'border-gray-200 hover:border-pink-300'
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{option.emoji}</span>
                    <span className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">{option.text}</span>
                    {isSelected && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 ml-auto flex-shrink-0" />}
                  </div>
                </button>
              )
            })}
          </div>


          {question.multiple && isAnswered(question) && (
            <div className="mt-6 sm:mt-8">
              <Button
                onClick={nextStep}
                className="w-full py-9 pulse-animation sm:py-5 text-base sm:text-lg 
                font-semibold bg-gradient-to-r
                 from-orange-600
               to-orange-500 hover:from-orange-600 hover:to-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {currentStep === questions.length ? 'Ver Meu Diagnóstico' : 'Próxima Pergunta'}
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
              </Button>
            </div>
          )}

          {question.multiple && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {(answers[question.id] || []).length > 0
                  ? `${(answers[question.id] || []).length} ${(answers[question.id] || []).length === 1 ? 'opção selecionada' : 'opções selecionadas'}`
                  : 'Selecione uma ou mais opções'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App