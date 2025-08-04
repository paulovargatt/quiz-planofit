import { CheckCircle, Camera, Calendar, Sparkles } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import foto from '@/assets/foto.webp'
import z21 from '@/assets/z21.webp'
import assistent from '@/assets/assistent.webp'

const FeaturesShowcase = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: true
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoplayTimer, setAutoplayTimer] = useState(null)

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  )

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  // Autoplay functionality
  useEffect(() => {
    if (!emblaApi || !isPlaying) return

    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000)

    setAutoplayTimer(timer)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [emblaApi, isPlaying])

  // Stop autoplay on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsPlaying(false)
    if (autoplayTimer) {
      clearInterval(autoplayTimer)
    }
  }, [autoplayTimer])

  // Resume autoplay after a delay
  const handleMouseLeave = useCallback(() => {
    setTimeout(() => {
      setIsPlaying(true)
    }, 3000) // Resume after 3 seconds of no interaction
  }, [])

  // Handle dot click with autoplay pause
  const handleDotClick = useCallback(
    (index) => {
      handleUserInteraction()
      scrollTo(index)
      setTimeout(() => {
        setIsPlaying(true)
      }, 5000) // Resume after 5 seconds
    },
    [scrollTo, handleUserInteraction],
  )

  const features = [
    {
      id: 'foto',
      icon: <Camera className="w-6 h-6 text-orange-600" />,
      iconBg: 'bg-orange-100',
      title: 'Registro',
      titleHighlight: 'por Foto',
      image: foto,
      imageCaption: 'IA identifica automaticamente!',
      description: 'Tirou foto, pronto! Nossa IA identifica cada alimento, calcula porções e registra tudo automaticamente. Sem pesar, sem anotar, sem calcular!',
      features: [
        'Reconhecimento automático',
        'Cálculo de porções: IA estima quantidade',
        'Macros detalhados: Proteína, carbo, gordura'
      ],
      imageOrder: 'order-2 md:order-1',
      contentOrder: 'order-1 md:order-2',
      border: 'border-1'
    },
    {
      id: 'z21',
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      iconBg: 'bg-green-100',
      title: 'Protocolo',
      titleHighlight: 'Z21',
      image: z21,
      imageCaption: '21 dias para acelerar seu metabolismo',
      description: 'Acelere seu metabolismo em 21 dias. Queime gordura mesmo dormindo e sinta mais energia durante o dia.',
      features: [
        'Acelera metabolismo: Queima até 30% mais calorias',
        'Cronômetro integrado: Controla horários automaticamente',
        'Passo a passo diário: Sabe exatamente o que fazer'
      ],
      imageOrder: '',
      contentOrder: '',
      border: 'border-1'
    },
    {
      id: 'assistant',
      icon: <Sparkles className="w-6 h-6 text-gray-600" />,
      iconBg: 'bg-gray-100',
      title: 'Assistente',
      titleHighlight: 'IA',
      image: assistent,
      imageCaption: '',
      description: 'Não é só um chat! É um sistema completo com módulos especializados para cada área da sua jornada de emagrecimento.',
      features: [
        'Registro Rápido: Exercício, refeição, água',
        'Nutrição Avançada: Proteínas, gorduras, densidade',
        'Bem-estar Mental: Fome emocional, hábitos'
      ],
      imageOrder: 'order-2 md:order-1',
      contentOrder: 'order-1 md:order-2',
      border: 'border-1'
    }
  ]

  return (
    <div className="mb-2">
      <h2 className="text-xl sm:text-2xl text-[#6b7280] font-semibold text-center mb-6">
        🎯 O que você encontrará<br></br><span className="text-orange-500 font-bold"> Dentro da PlanoFit</span>
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Confira como é <strong className="text-orange-500 font-bold">simples</strong> usar nossa plataforma
      </p>

      {/* Desktop: Grid layout */}
      <div className="hidden md:block">
        <div className="grid gap-8">
          {features.map((feature) => (
            <div key={feature.id} className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 ${feature.border}`}>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className={`rounded-xl p-0 text-center ${feature.imageOrder}`}>
                  <img 
                    src={feature.image} 
                    className="w-full h-auto rounded-xl max-w-[200px] md:max-w-[250px] mx-auto" 
                    alt="" 
                  />
                  {feature.imageCaption && (
                    <p className="text-xs text-gray-600 mt-2">{feature.imageCaption}</p>
                  )}
                </div>
                <div className={feature.contentOrder}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${feature.iconBg} p-3 rounded-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#4c525f]">
                      {feature.title} <span className="text-orange-500 font-bold">{feature.titleHighlight}</span>
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <strong>{feature.description}</strong>
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700"><strong>{item}</strong></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Swiper layout */}
      <div className="md:hidden">
        <div 
          className="overflow-hidden" 
          ref={emblaRef}
          onMouseEnter={handleUserInteraction}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleUserInteraction}
        >
          <div className="flex">
            {features.map((feature) => (
              <div key={feature.id} className="flex-none w-full px-2">
                <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 ${feature.border}`}>
                  <div className="space-y-6">
                    {/* Mobile layout - always image first */}
                    <div className="rounded-xl p-0 text-center">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`${feature.iconBg} p-3 rounded-lg`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-bold text-[#4c525f]">
                          {feature.title} <span className="text-orange-500 font-bold">{feature.titleHighlight}</span>
                        </h3>
                      </div>
                      <img 
                        src={feature.image} 
                        className="w-full h-auto rounded-xl max-w-[300px] mx-auto" 
                        alt="" 
                      />
                      {feature.imageCaption && (
                        <p className="text-xs text-gray-600 mt-2">{feature.imageCaption}</p>
                      )}
                    </div>
                    <div>
                      
                      <p className="text-gray-600 mb-4 text-sm">
                        <strong>{feature.description}</strong>
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-700"><strong>{item}</strong></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots navigation */}
        <div className="flex justify-center mt-6 gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === selectedIndex 
                  ? 'bg-orange-500' 
                  : 'bg-gray-300'
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
        
        
      </div>
    </div>
  )
}

export default FeaturesShowcase
