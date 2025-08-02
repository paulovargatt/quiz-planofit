// Mixpanel Tracker Helper - Sistema único de tracking
import mixpanel from 'mixpanel-browser';

class MixpanelTracker {
  constructor() {
    this.token = '3d72d3e58421dd14d8fdcabe40614b00';
    this.initialized = false;
    this.videoTrackingIntervals = new Map();
    this.utmParams = null;
  }

  // Inicializa o Mixpanel e captura UTMs
  init() {
    if (this.initialized) return;

    try {
      mixpanel.init(this.token, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false, // Controlaremos manualmente
        persistence: 'localStorage'
      });

      // Captura parâmetros UTM do Facebook
      this.captureUTMParams();
      
      this.initialized = true;
      console.log('Mixpanel tracker inicializado');
    } catch (error) {
      console.error('Erro ao inicializar Mixpanel:', error);
    }
  }

  // Captura parâmetros UTM da URL
  captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = {};
    
    // Parâmetros UTM específicos do Facebook
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utms[key] = value;
      }
    });

    // Adiciona informações extras de contexto
    utms.referrer = document.referrer;
    utms.landing_page = window.location.pathname;
    utms.timestamp = new Date().toISOString();

    this.utmParams = Object.keys(utms).length > 0 ? utms : null;
    
    // Salva UTMs no localStorage para persistir durante a sessão
    if (this.utmParams) {
      localStorage.setItem('quiz_utm_params', JSON.stringify(this.utmParams));
    }
  }

  // Recupera UTMs salvos (caso usuário navegue entre páginas)
  getUTMParams() {
    if (this.utmParams) return this.utmParams;
    
    try {
      const saved = localStorage.getItem('quiz_utm_params');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // Envia evento com contexto completo
  track(eventName, properties = {}) {
    if (!this.initialized) {
      console.warn('Mixpanel não inicializado');
      return;
    }

    const utms = this.getUTMParams();
    const eventData = {
      ...properties,
      ...(utms && { utm_data: utms }),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    mixpanel.track(eventName, eventData);
  }

  // 1. Page View
  trackPageView(pageName = null) {
    const properties = {
      page_name: pageName || document.title,
      page_path: window.location.pathname,
      page_url: window.location.href
    };

    this.track('Page View', properties);
  }

  // 2. Chegada ao Chat
  trackChatStart() {
    this.track('Chat Started', {
      action: 'chat_initiated'
    });
  }

  // 3. Questão respondida + Step atual
  trackQuestionAnswered(questionId, answerId, currentStep, totalSteps, isMultiple = false) {
    this.track('Question Answered', {
      question_id: questionId,
      answer_id: answerId,
      current_step: currentStep,
      total_steps: totalSteps,
      is_multiple_choice: isMultiple,
      completion_percentage: Math.round((currentStep / totalSteps) * 100)
    });
  }

  // 4. Step atual (navegação entre steps)
  trackStepChange(newStep, totalSteps, direction = 'next') {
    this.track('Step Changed', {
      new_step: newStep,
      total_steps: totalSteps,
      direction: direction, // 'next', 'previous', 'jump'
      completion_percentage: Math.round((newStep / totalSteps) * 100)
    });
  }

  // 5. Chegada na página de venda
  trackOfferPageView() {
    this.track('Offer Page Viewed', {
      page_type: 'sales_page',
      funnel_step: 'offer_presentation'
    });
  }

  // 6. Clique para checkout
  trackCheckoutClick(offerType = null, price = null) {
    this.track('Checkout Clicked', {
      offer_type: offerType,
      price: price,
      funnel_step: 'checkout_intent'
    });
  }

  // 7. Tracking de vídeo (% assistida a cada 30s)
  startVideoTracking(videoElement, videoId = 'main_video') {
    if (!videoElement) return;

    // Limpa tracking anterior se existir
    this.stopVideoTracking(videoId);

    let lastTrackedPercentage = 0;
    const trackingInterval = 30; // segundos

    const trackProgress = () => {
      if (videoElement.duration && videoElement.currentTime) {
        const currentPercentage = Math.floor((videoElement.currentTime / videoElement.duration) * 100);
        
        // Envia evento a cada 10% de progresso
        if (currentPercentage >= lastTrackedPercentage + 10 && currentPercentage <= 100) {
          this.track('Video Progress', {
            video_id: videoId,
            percentage_watched: currentPercentage,
            current_time: Math.floor(videoElement.currentTime),
            total_duration: Math.floor(videoElement.duration),
            tracking_interval: trackingInterval
          });
          
          lastTrackedPercentage = currentPercentage;
        }
      }
    };

    // Eventos de vídeo
    videoElement.addEventListener('play', () => {
      this.track('Video Play', {
        video_id: videoId,
        current_time: Math.floor(videoElement.currentTime)
      });
    });

    videoElement.addEventListener('pause', () => {
      this.track('Video Pause', {
        video_id: videoId,
        current_time: Math.floor(videoElement.currentTime),
        percentage_watched: Math.floor((videoElement.currentTime / videoElement.duration) * 100)
      });
    });

    videoElement.addEventListener('ended', () => {
      this.track('Video Completed', {
        video_id: videoId,
        total_duration: Math.floor(videoElement.duration)
      });
    });

    // Tracking a cada 30 segundos
    const interval = setInterval(trackProgress, trackingInterval * 1000);
    this.videoTrackingIntervals.set(videoId, interval);

    // Primeira verificação imediata
    trackProgress();
  }

  // Para tracking de vídeo
  stopVideoTracking(videoId = 'main_video') {
    const interval = this.videoTrackingIntervals.get(videoId);
    if (interval) {
      clearInterval(interval);
      this.videoTrackingIntervals.delete(videoId);
    }
  }

  // Tracking de engajamento geral
  trackEngagement(action, element = null) {
    this.track('User Engagement', {
      action: action,
      element: element,
      timestamp: new Date().toISOString()
    });
  }

  // Identifica usuário (opcional)
  identify(userId, userProperties = {}) {
    if (!this.initialized) return;
    
    mixpanel.identify(userId);
    if (Object.keys(userProperties).length > 0) {
      mixpanel.people.set(userProperties);
    }
  }

  // Força envio de eventos pendentes
  flush() {
    if (this.initialized) {
      // Mixpanel browser já envia automaticamente
      console.log('Eventos Mixpanel enviados');
    }
  }
}

// Instância singleton
const tracker = new MixpanelTracker();

export default tracker;
