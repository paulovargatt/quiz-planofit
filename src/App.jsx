import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { CheckCircle, Zap, ChevronLeft } from 'lucide-react'
import OfferSection from './components/OfferSection.jsx'
import FBTracker from './lib/facebookTracker.js'
import mixpanelTracker from './utils/mixpanelTracker.js'
import ageImg1 from './assets/18.webp'
import ageImg2 from './assets/26.webp'
import ageImg3 from './assets/36.webp'
import ageImg4 from './assets/46.webp'
import './App.css'

function App() {
  const QUIZ_STEP_KEY = 'planofit-quiz-step'
  const QUIZ_ANSWERS_KEY = 'planofit-quiz-answers'
  const QUIZ_LOADING_KEY = 'planofit-quiz-loading'


  useEffect(() => {
    // Inicializa o tracker do Facebook
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

    // Inicializa o Mixpanel tracker
    mixpanelTracker.init();

    // Track page view inicial
    mixpanelTracker.trackPageView('Quiz - Início');

  }, []);

  const loadQuizState = () => {
    try {
      const savedStep = localStorage.getItem(QUIZ_STEP_KEY)
      const savedAnswers = localStorage.getItem(QUIZ_ANSWERS_KEY)
      const savedLoading = localStorage.getItem(QUIZ_LOADING_KEY)
      return {
        step: savedStep ? parseInt(savedStep) : 1,
        answers: savedAnswers ? JSON.parse(savedAnswers) : {},
        loading: savedLoading === 'true'
      }
    } catch (error) {
      console.warn('Erro ao carregar estado do quiz:', error)
      return { step: 1, answers: {}, loading: false }
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
      id: 'age_range',
      type: 'age',
      title: 'Plano personalizado para emagrecer com Inteligência Artificial',
      subtitle: 'De acordo com sua idade',
      options: [
        { id: '18_25', text: '18 a 25 anos', image: ageImg1 },
        { id: '26_35', text: '26 a 35 anos', image: ageImg2 },
        { id: '36_45', text: '36 a 45 anos', image: ageImg3 },
        { id: '46_plus', text: '+46 anos', image: ageImg4 }
      ]
    },
    {
      id: 'main_challenge',
      title: 'O que você acha que mais te trava hoje?',
      subtitle: 'Escolha uma opção',
      options: [
        { id: 'restrictive_diets,', text: 'Desisto das dietas e engordo de novo', emoji: '😔' },
        { id: 'no_time', text: 'Sem tempo → como qualquer coisa ', emoji: '⏰' },
        { id: 'confusion', text: 'Confusão: não sei o que fazer ou comer', emoji: '🤔' },
        { id: 'emotional_eating', text: 'Ansiedade e estresse vira comida', emoji: '😰' }
      ]
    },
    {
      id: 'symptoms',
      title: 'Quais desses sintomas você mais sente?',
      subtitle: '',
      multiple: false,
      options: [
        { id: 'fatigue', text: 'Cansaço / pouca energia', emoji: '😴' },
        { id: 'metabolism', text: 'Dificuldade para emagrecer', emoji: '🔴' },
        { id: 'low_self_esteem', text: 'Autoestima baixa', emoji: '😞' },
        { id: 'hair_nails', text: 'Queda de cabelo, unhas fracas ou pele ressecada', emoji: '💇‍♀️' },
        { id: 'uncontrolled_hunger', text: 'Fome descontrolada ou compulsão alimentar', emoji: '🍽️' },
        { id: 'sleep_issues', text: 'Sono ruim', emoji: '🌙' }
      ]
    },
    {
      id: 'commitment',
      title: 'Quão comprometida você está?',
      subtitle: 'Seja sincera 🙂',
      options: [
        { id: 'full_transformation', text: 'Quero mudar tudo e ter mais saúde já!', emoji: '🔥' },
        { id: 'gradual_change', text: 'Quero começar aos poucos', emoji: '📈' },
        { id: 'easy_path', text: 'Preciso de algo muito fácil de seguir', emoji: '✨' }
      ]
    },
    {
      id: 'weight_loss_attempts',
      title: 'Quantas vezes você já tentou emagrecer nos últimos 2 anos?',
      subtitle: '',
      options: [
        { id: 'first_time', text: 'É minha primeira tentativa', emoji: '🆕' },
        { id: 'few_times', text: '2–3 vezes, sem sucesso', emoji: '🔄' },
        { id: 'many_times', text: 'Perdi a conta', emoji: '😓' },
        { id: 'constant_struggle', text: 'Luto constante com a balança', emoji: '⚖️' }
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

      // Track questão respondida
      mixpanelTracker.trackQuestionAnswered(
        questionId,
        answerId,
        currentStep + 1,
        questions.length,
        isMultiple
      );
    } else {
      const updatedAnswers = { ...answers, [questionId]: answerId }
      setAnswers(updatedAnswers)
      saveQuizState(currentStep, updatedAnswers, isLoading)

      // Track questão respondida
      mixpanelTracker.trackQuestionAnswered(
        questionId,
        answerId,
        currentStep + 1,
        questions.length,
        isMultiple
      );

      setTimeout(nextStep, 300)
    }
  }

  const nextStep = () => {
    if (currentStep < questions.length) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      saveQuizState(newStep, answers, isLoading)

      // Track mudança de step
      mixpanelTracker.trackStepChange(newStep, questions.length, 'next');
    } else {
      startLoading()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      saveQuizState(newStep, answers, isLoading)
    }
  }

  const startLoading = () => {
    setIsLoading(true)
    saveQuizState(currentStep, answers, true)
    setLoadingProgress(0)

    // Track conclusão do quiz
    mixpanelTracker.track('Quiz Completed', {
      total_questions: questions.length,
      answers_given: Object.keys(answers).length
    });

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          saveQuizState(currentStep + 1, answers, false)
          setCurrentStep(currentStep + 1)

          // Track chegada na página de venda
          mixpanelTracker.trackOfferPageView();

          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const getCurrentQuestion = () => questions[currentStep - 1]
  const isAnswered = (question) => {
    if (question.multiple) {
      return answers[question.id] && answers[question.id].length > 0
    }
    return answers[question.id]
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
  const progress = (currentStep / questions.length) * 100

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
      <Card className="w-full max-w-lg shadow-xl sm:shadow-2xl border-0 rounded-2xl mx-auto">
        <CardHeader className="pb-0 sm:pb-6 px-4 sm:px-6">
          <div className="flex items-center mb-2">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar</span>
              </button>
            )}
          </div>
          <div className="mb-2 sm:mb-2">
            <Progress value={progress} className="h-1.5 sm:h-2 rounded-full" />
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
              <span> {currentStep} de {questions.length}</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-700 
          text-center mb-2 leading-tight tracking-tight max-w-[330px] mx-auto">
            {question.title}
          </CardTitle>
          <p className="text-orange-700 font-bold text-center text-sm sm:text-base">{question.subtitle}</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          {question.type === 'age' ? (
            <div className="space-y-3 sm:space-y-4">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(question.id, option.id, false)}
                    className={[
                      'w-full p-3 sm:p-4 rounded-2xl border transition-all duration-200',
                      'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60',
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-teal-400'
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base sm:text-lg font-medium">{option.text}</span>
                      <img src={option.image} alt={option.text} 
                      className="w-20 h-20 sm:w-20 sm:h-20 rounded-lg object-contain" />
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
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
          )}


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