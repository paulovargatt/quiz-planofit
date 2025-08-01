import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { Play, Pause } from 'lucide-react'

export default function HLSPlayer({ 
  src, 
  onTimeUpdate, 
  autoplay = true,
  className = '',
  onLoadedData,
  onEnded 
}) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [watchedTime, setWatchedTime] = useState(0)
  const timeUpdateIntervalRef = useRef(null)
  const lastReportedSecond = useRef(-1)
  const lastSavedSecond = useRef(-1)
  const storageKey = `hls-player-time-${btoa(src).slice(0, 20)}` // Chave única baseada na URL

  // Carregar tempo salvo do localStorage
  const loadSavedTime = useCallback(() => {
    try {
      const savedTime = localStorage.getItem(storageKey)
      return savedTime ? parseFloat(savedTime) : 0
    } catch (error) {
      console.warn('Erro ao carregar tempo do localStorage:', error)
      return 0
    }
  }, [storageKey])

  // Salvar tempo no localStorage
  const saveTimeToStorage = useCallback((time) => {
    try {
      localStorage.setItem(storageKey, time.toString())
    } catch (error) {
      console.warn('Erro ao salvar tempo no localStorage:', error)
    }
  }, [storageKey])

  // Limpar tempo salvo do localStorage
  const clearSavedTime = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Erro ao limpar tempo do localStorage:', error)
    }
  }, [storageKey])

  // Função para controlar o tempo assistido - OTIMIZADA + PERSISTÊNCIA
  const startTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) return
    
    timeUpdateIntervalRef.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = videoRef.current.currentTime
        const currentSecond = Math.floor(currentTime)
        
        // Só atualiza se mudou de segundo para reduzir chamadas
        if (currentSecond > lastReportedSecond.current) {
          lastReportedSecond.current = currentSecond
          
          setWatchedTime(prev => {
            const newTime = Math.max(prev, currentTime)
            
            // Salva no localStorage a cada 4 segundos
            if (currentSecond % 4 === 0 && currentSecond > lastSavedSecond.current) {
              lastSavedSecond.current = currentSecond
              saveTimeToStorage(newTime)
            }
            
            // Só chama onTimeUpdate a cada segundo novo
            if (onTimeUpdate) {
              onTimeUpdate(newTime, videoRef.current.duration || 0)
            }
            
            return newTime
          })
        }
      }
    }, 500) // Reduzido para 500ms - menos overhead
  }, [onTimeUpdate, saveTimeToStorage])

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }
  }, [])

  // Inicializar HLS - CORRIGIDO
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    let isMounted = true
    let hlsInstance = null

    const initializePlayer = async () => {
      try {
        if (Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: false,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 600,
            maxMaxBufferLength: 1200,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
          })

          hlsRef.current = hlsInstance
          hlsInstance.loadSource(src)
          hlsInstance.attachMedia(video)

          hlsInstance.on(Hls.Events.MANIFEST_PARSED, async () => {
            if (!isMounted) return
            
            setIsLoaded(true)
            if (onLoadedData) onLoadedData()
            
            // Aguardar um pouco para o vídeo estar pronto
            await new Promise(resolve => setTimeout(resolve, 100))
            
            if (!isMounted) return
            
            // Restaurar tempo salvo
            const savedTime = loadSavedTime()
            if (savedTime > 0) {
              video.currentTime = savedTime
              setWatchedTime(savedTime)
            }
            
            if (autoplay && isMounted) {
              try {
                await video.play()
                if (isMounted) {
                  setIsPlaying(true)
                  startTimeTracking()
                }
              } catch (playError) {
                // Erro silencioso para autoplay bloqueado
                if (playError.name !== 'AbortError') {
                  console.warn('Autoplay falhou:', playError.message)
                }
              }
            }
          })

          hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('HLS Fatal Error:', data)
            }
          })

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari nativo HLS
          const handleLoadedData = async () => {
            if (!isMounted) return
            
            setIsLoaded(true)
            if (onLoadedData) onLoadedData()
            
            // Aguardar um pouco para o vídeo estar pronto
            await new Promise(resolve => setTimeout(resolve, 100))
            
            if (!isMounted) return
            
            // Restaurar tempo salvo
            const savedTime = loadSavedTime()
            if (savedTime > 0) {
              video.currentTime = savedTime
              setWatchedTime(savedTime)
            }
            
            if (autoplay && isMounted) {
              try {
                await video.play()
                if (isMounted) {
                  setIsPlaying(true)
                  startTimeTracking()
                }
              } catch (playError) {
                // Erro silencioso para autoplay bloqueado
                if (playError.name !== 'AbortError') {
                  console.warn('Autoplay falhou:', playError.message)
                }
              }
            }
          }
          
          video.src = src
          video.addEventListener('loadeddata', handleLoadedData, { once: true })
        }
      } catch (error) {
        console.error('Erro ao inicializar player:', error)
      }
    }

    initializePlayer()

    return () => {
      isMounted = false
      stopTimeTracking()
      
      // Salvar tempo final antes de destruir
      if (video && watchedTime > 0) {
        saveTimeToStorage(watchedTime)
      }
      
      if (hlsInstance) {
        hlsInstance.destroy()
        hlsInstance = null
      }
      hlsRef.current = null
    }
  }, [src])

  // Event listeners do vídeo
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      startTimeTracking()
    }

    const handlePause = () => {
      setIsPlaying(false)
      stopTimeTracking()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      stopTimeTracking()
      // Limpar localStorage quando o vídeo terminar
      clearSavedTime()
      if (onEnded) onEnded()
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [startTimeTracking, stopTimeTracking, onEnded])

  const togglePlayPause = (e) => {
    // Prevenir propagação para evitar duplo clique
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const video = videoRef.current
    if (!video || !isLoaded) return

    // Se o vídeo terminou (está no final), resetar para o início
    if (video.ended) {
      video.currentTime = 0
      setWatchedTime(0)
      clearSavedTime()
      lastReportedSecond.current = -1
      lastSavedSecond.current = -1
    }

    // Usar o estado atual do vídeo, não o estado React para decisão
    if (video.paused || video.ended) {
      video.play().catch(console.error)
    } else {
      video.pause()
    }
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Vídeo */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        muted={false}
        preload="metadata"
      />
      
      {/* Overlay com controles - clicável */}
      <div 
        className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
        onClick={togglePlayPause}
      >
        {/* Botão Play/Pause centralizado */}
        <div
          className={`
            bg-black/70 hover:bg-black/90 text-white rounded-full p-4 
            transition-all duration-200 transform hover:scale-110 active:scale-95 pointer-events-none
            ${!isLoaded ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </div>
      </div>

      {/* Indicador de carregamento */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

  
    </div>
  )
}
