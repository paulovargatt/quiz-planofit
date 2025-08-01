;(function(window, document) {
    'use strict';

    const FBTracker = {
        // Configurações
        config: {
            pixels: [],
            autoTrack: true,
            autoCapture: false,
            propagateParams: true,
            debug: false,
            collectGeolocation: false,
            enhancedDataCollection: true,
            engagementTracking: true
        },
        
        // Estado interno (usando variáveis em memória para React)
        state: {
            leadId: null,
            capturedParams: {},
            userInfo: {},
            ipData: null,
            geoData: null,
            initialized: false,
            dataQuality: {},
            engagementScore: 0,
            sessionStart: Date.now(),
            memoryStorage: {} // Substituindo localStorage para React
        },

        // Eventos padrão do Facebook
        STANDARD_EVENTS: [
            'PageView', 'Lead', 'ViewContent', 'AddToWishlist', 'AddToCart', 
            'AddPaymentInfo', 'InitiateCheckout', 'StartTrial', 'Subscribe', 
            'Purchase', 'Contact', 'CompleteRegistration', 'SubmitApplication',
            'Search', 'Schedule'
        ],

        // Parâmetros para capturar da URL
        URL_PARAMS: [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'fbclid', 'gclid', 'src', 'sck', 'af', 'ttclid',
            'email', 'phone', 'name', 'city', 'state', 'zip',
            'user_id', 'customer_id', 'lead_id'
        ],

        /**
         * Storage compatível com React (usa memória em vez de localStorage)
         */
        storage: {
            setItem: function(key, value) {
                FBTracker.state.memoryStorage[key] = value;
                // Tenta usar localStorage se disponível
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(key, value);
                    }
                } catch (e) {}
            },
            
            getItem: function(key) {
                // Primeiro tenta memória
                if (FBTracker.state.memoryStorage[key]) {
                    return FBTracker.state.memoryStorage[key];
                }
                // Depois tenta localStorage
                try {
                    if (typeof localStorage !== 'undefined') {
                        return localStorage.getItem(key);
                    }
                } catch (e) {}
                return null;
            }
        },

        /**
         * Inicializa o tracker para landing pages
         */
        init: async function(userConfig = {}) {
            if (this.state.initialized) return;
            
            this.log('🚀 Initializing FBTracker for React...');
            
            // Merge configurações
            Object.assign(this.config, userConfig);
            
            // Gera/recupera Lead ID
            this.state.leadId = this.getOrCreateLeadId();
            
            // Captura todos os dados possíveis
            this.captureUrlParams();
            this.loadStoredUserData();
            
            // Busca dados de localização
            await Promise.all([
                this.fetchUserIP(),
                this.config.enhancedDataCollection ? this.enhancedDataCollection() : Promise.resolve()
            ]);
            
            // Carrega Facebook Pixel
            await this.loadFacebookPixel();
            
            // Setup específico para landing pages
            if (this.config.propagateParams) this.setupParamPropagation();
            if (this.config.engagementTracking) this.setupEngagementTracking();
            if (this.config.autoCapture) this.setupFormCapture();
            
            // Inicializa pixels
            this.initializePixels();
            
            // Track inicial
            if (this.config.autoTrack) {
                this.track('PageView', {
                    page_type: 'landing_page',
                    traffic_source: this.getTrafficSource()
                });
            }
            
            // Setup de triggers automáticos para landing pages
            this.setupLandingPageTriggers();
            
            this.state.initialized = true;
            this.log('✅ FBTracker initialized successfully', this.state);
            this.validateAdvancedMatching();
        },

        /**
         * Setup de tracking de engajamento
         */
        setupEngagementTracking: function() {
            this.log('🎯 Setting up engagement tracking...');
            
            // Tracking de tempo na página
            const timeIntervals = [30, 60, 120, 300]; // 30s, 1min, 2min, 5min
            timeIntervals.forEach(seconds => {
                setTimeout(() => {
                    if (this.state.initialized) {
                        this.track('TimeOnPage', {
                            seconds_on_page: seconds,
                            engagement_level: this.calculateEngagementLevel(seconds)
                        });
                    }
                }, seconds * 1000);
            });
            
            // Tracking de scroll
          //  this.setupScrollTracking();
            
            // Tracking de CTAs
            this.setupCTATracking();
            
            // Exit intent
            this.setupExitIntent();
            
            // Media tracking
            this.setupMediaTracking();
        },

        /**
         * Coleta de dados melhorada para landing pages
         */
        enhancedDataCollection: async function() {
            this.log('🔍 Enhanced data collection starting...');
            
            try {
                // 1. Detecta dados de terceiros
                this.detectThirdPartyData();
                
                // 2. Recupera dados de sessões anteriores
                this.recoverPreviousSessionData();
                
                // 3. Analisa referrer
                this.analyzeReferrer();
                
                // 4. Coleta info do dispositivo
                this.collectDeviceInfo();
                
                this.log('✅ Enhanced data collection completed');
            } catch (e) {
                this.log('❌ Error in enhanced data collection:', e);
            }
        },

        /**
         * Detecta dados de terceiros
         */
        detectThirdPartyData: function() {
            try {
                // Google Analytics Client ID
                if (window.gtag || window.ga) {
                    const gaClientId = this.getGoogleAnalyticsClientId();
                    if (gaClientId) {
                        this.state.userInfo.ga_client_id = gaClientId;
                    }
                }
                
                // Cookies disponíveis
                if (typeof document !== 'undefined' && document.cookie) {
                    const cookies = document.cookie.split('; ');
                    
                    const gid = cookies.find(c => c.startsWith('_gid='))?.split('=')[1];
                    if (gid) this.state.userInfo.google_id = gid;
                    
                    const ymUid = cookies.find(c => c.startsWith('_ym_uid='))?.split('=')[1];
                    if (ymUid) this.state.userInfo.yandex_id = ymUid;
                }
                
                this.log('📊 Third party data detected:', this.state.userInfo);
            } catch (e) {
                this.log('Error detecting third party data:', e);
            }
        },

        /**
         * Recupera dados de sessões anteriores
         */
        recoverPreviousSessionData: function() {
            try {
                const userData = this.storage.getItem('user_data') || this.storage.getItem('customer_data');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    this.identifyFromData(parsed);
                }
                
                const crmData = this.storage.getItem('crm_data') || this.storage.getItem('lead_data');
                if (crmData) {
                    const parsed = JSON.parse(crmData);
                    this.identifyFromData(parsed);
                }
            } catch (e) {
                this.log('Error recovering session data:', e);
            }
        },

        /**
         * Analisa referrer
         */
        analyzeReferrer: function() {
            if (typeof document === 'undefined') return;
            
            const referrer = document.referrer;
            if (!referrer) return;
            
            try {
                const url = new URL(referrer);
                
                if (url.hostname.includes('google')) {
                    this.state.capturedParams.google_referrer = true;
                    this.state.capturedParams.search_query = url.searchParams.get('q');
                }
                
                if (url.hostname.includes('facebook') || url.hostname.includes('fb.')) {
                    this.state.capturedParams.facebook_referrer = true;
                }
                
                if (url.searchParams.has('email') || url.searchParams.has('user_id')) {
                    this.state.capturedParams.email_campaign = true;
                    const email = url.searchParams.get('email');
                    if (email) this.identify({ email: email });
                }
                
                this.log('🔗 Referrer analysis:', this.state.capturedParams);
            } catch (e) {}
        },

        /**
         * Coleta informações do dispositivo
         */
        collectDeviceInfo: function() {
            if (typeof window === 'undefined') return;
            
            this.state.deviceInfo = {
                screen_width: screen?.width || 0,
                screen_height: screen?.height || 0,
                viewport_width: window.innerWidth || 0,
                viewport_height: window.innerHeight || 0,
                device_pixel_ratio: window.devicePixelRatio || 1,
                touch_support: 'ontouchstart' in window,
                mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            };
        },

        /**
         * Obtém Google Analytics Client ID
         */
        getGoogleAnalyticsClientId: function() {
            try {
                // Via cookie _ga
                if (typeof document !== 'undefined' && document.cookie) {
                    const gaCookie = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('_ga='));
                        
                    if (gaCookie) {
                        const parts = gaCookie.split('.');
                        return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : null;
                    }
                }
            } catch (e) {}
            return null;
        },

        /**
         * Setup de triggers para landing pages
         */
        setupLandingPageTriggers: function() {
            this.log('🎯 Setting up landing page triggers...');
            
            // Já configurado no setupEngagementTracking
            // Aqui podemos adicionar triggers específicos extras
        },

        /**
         * Setup de tracking de scroll
         */
        setupScrollTracking: function() {
            if (typeof window === 'undefined') return;
            
            const scrollThresholds = [25, 50, 75, 90, 100];
            const fired = new Set();
            
            const trackScroll = () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !fired.has(threshold)) {
                        fired.add(threshold);
                        this.state.engagementScore += threshold === 100 ? 20 : 10;
                        
                        this.track('Scroll', {
                            scroll_depth: threshold,
                            engagement_score: this.state.engagementScore
                        });
                    }
                });
            };
            
            window.addEventListener('scroll', trackScroll, { passive: true });
        },

        /**
         * Setup de tracking de CTAs (simplificado)
         */
        setupCTATracking: function() {
            if (typeof document === 'undefined') return;
            
            const ctaSelectors = [
                'button[type="submit"]',
                '.btn-primary', '.btn-cta', '.cta-button',
                'a[href*="signup"]', 'a[href*="register"]', 'a[href*="buy"]',
                'a[href*="checkout-payment"]', // ← Seus links checkout
                'a[href*="lastlink.com"]',
                'a[href*="pay.kiwify.com.br"]',
                'a[href*="contact"]', 'a[href*="demo"]', 'a[href*="whatsapp"]',
                '[data-track="cta"]', '[class*="cta"]'
            ];
            
            document.addEventListener('click', (e) => {
                const target = e.target;
                const closestLink = target.closest('a[href]');
                
                const element = ctaSelectors.find(selector => 
                    target.matches?.(selector) || target.closest?.(selector)
                );
                
                if (element || closestLink) {
                    const href = closestLink?.href || '';
                    this.state.engagementScore += 30;
                    
                    // Evento baseado no tipo de link
                    let eventName = 'CtaClick';
                    
                    if (href.includes('checkout-payment') || href.includes('lastlink.com')) {
                        eventName = 'InitiateCheckout';
                    } else if (href.includes('whatsapp') || href.includes('wa.me')) {
                        eventName = 'Contact';
                    }
                    
                    this.track(eventName, {
                        cta_text: target.textContent?.trim() || 'Unknown',
                        engagement_score: this.state.engagementScore,
                        destination_type: href.includes('lastlink.com') ? 'external_checkout' : 'internal'
                    });
                    
                    this.log('🎯 CTA Click tracked:', eventName);
                }
            }, { passive: true });
        },

        /**
         * Setup de Exit Intent
         */
        setupExitIntent: function() {
            if (typeof document === 'undefined') return;
            
            let exitFired = false;
            
            document.addEventListener('mouseleave', (e) => {
                if (!exitFired && e.clientY <= 0) {
                    exitFired = true;
                    
                    this.track('ExitIntent', {
                        time_before_exit: Math.round((Date.now() - this.state.sessionStart) / 1000),
                        engagement_score: this.state.engagementScore
                    });
                }
            }, { passive: true });
        },

        /**
         * Setup de tracking de mídia
         */
        setupMediaTracking: function() {
            if (typeof document === 'undefined') return;
            
            // Vídeos HTML5
            document.querySelectorAll('video').forEach(video => {
                video.addEventListener('play', () => {
                    this.state.engagementScore += 25;
                    this.track('VideoPlay', {
                        video_title: video.title || video.src || 'Unknown',
                        engagement_score: this.state.engagementScore
                    });
                }, { passive: true });
                
                video.addEventListener('ended', () => {
                    this.state.engagementScore += 50;
                    this.track('VideoComplete', {
                        video_title: video.title || video.src || 'Unknown',
                        engagement_score: this.state.engagementScore
                    });
                }, { passive: true });
            });
        },

        /**
         * Calcula nível de engajamento
         */
        calculateEngagementLevel: function(secondsOnPage) {
            if (secondsOnPage < 30) return 'low';
            if (secondsOnPage < 120) return 'medium';
            if (secondsOnPage < 300) return 'high';
            return 'very_high';
        },

        /**
         * Determina fonte de tráfego
         */
        getTrafficSource: function() {
            const referrer = typeof document !== 'undefined' ? document.referrer : '';
            const params = this.state.capturedParams;
            
            if (params.utm_source) return params.utm_source;
            if (params.fbclid) return 'facebook';
            if (params.gclid) return 'google_ads';
            if (referrer.includes('google')) return 'google_organic';
            if (referrer.includes('facebook')) return 'facebook_organic';
            if (!referrer) return 'direct';
            return 'referral';
        },

        /**
         * Carrega dados do usuário armazenados
         */
        loadStoredUserData: function() {
            const fields = ['em', 'fn', 'ln', 'ph', 'ge', 'db', 'ct', 'st', 'zp'];
            fields.forEach(field => {
                const value = this.storage.getItem(`fb_user_${field}`);
                if (value) {
                    this.state.userInfo[field] = value;
                }
            });
        },

        /**
         * Identifica usuário a partir de dados diversos
         */
        identifyFromData: function(data) {
            const mappedData = {};
            
            const fieldMappings = {
                'email': ['email', 'e-mail', 'user_email', 'customer_email'],
                'firstName': ['firstName', 'first_name', 'fname', 'nome', 'name'],
                'lastName': ['lastName', 'last_name', 'lname', 'sobrenome'],
                'phone': ['phone', 'telefone', 'celular', 'mobile', 'whatsapp'],
                'city': ['city', 'cidade', 'location'],
                'state': ['state', 'estado', 'region'],
                'zipCode': ['zipCode', 'zip', 'cep', 'postal_code']
            };
            
            Object.entries(fieldMappings).forEach(([key, variations]) => {
                for (const variation of variations) {
                    if (data[variation]) {
                        mappedData[key] = data[variation];
                        break;
                    }
                }
            });
            
            if (Object.keys(mappedData).length > 0) {
                this.identify(mappedData);
            }
        },

        /**
         * Captura parâmetros da URL
         */
        captureUrlParams: function() {
            if (typeof window === 'undefined') return;
            
            const urlParams = new URLSearchParams(window.location.search);
            
            this.URL_PARAMS.forEach(param => {
                const value = urlParams.get(param);
                if (value) {
                    this.state.capturedParams[param] = value;
                    
                    // Auto-identificação via URL
                    if (['email', 'phone', 'name'].includes(param)) {
                        const userData = {};
                        userData[param] = value;
                        this.identify(userData);
                    }
                }
            });
            
            // fbclid no hash
            const fragment = window.location.hash;
            if (fragment.includes('fbclid=')) {
                const match = fragment.match(/fbclid=([^&]*)/);
                if (match) {
                    this.state.capturedParams.fbclid = match[1];
                }
            }
            
            // Salva parâmetros
            if (Object.keys(this.state.capturedParams).length > 0) {
                this.storage.setItem('fb_url_params', JSON.stringify(this.state.capturedParams));
                this.storage.setItem('fb_params_timestamp', Date.now().toString());
            }
            
            // Recupera parâmetros anteriores
            try {
                const saved = this.storage.getItem('fb_url_params');
                const timestamp = this.storage.getItem('fb_params_timestamp');
                
                if (saved && timestamp) {
                    const age = Date.now() - parseInt(timestamp);
                    if (age < 7 * 24 * 60 * 60 * 1000) {
                        const savedParams = JSON.parse(saved);
                        this.state.capturedParams = { ...savedParams, ...this.state.capturedParams };
                    }
                }
            } catch (e) {}
        },

        /**
         * Busca IP usando múltiplas APIs
         */
        fetchUserIP: async function() {
            const apis = [
                {
                    url: 'https://ipapi.co/json/',
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.country_code,
                        city: data.city,
                        region: data.region_code || data.region,
                        zipCode: data.postal,
                        timezone: data.timezone,
                        latitude: data.latitude,
                        longitude: data.longitude
                    })
                },
                {
                    url: 'https://api.ipgeolocation.io/v2/ipgeo?apiKey=ab4492459e834cc7a7b285cb11e251cd',
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.location.country_code2,
                        city: data.location.city,
                        region: data.location.state_prov,
                        zipCode: data.location.zipcode,
                        timezone: 'America/Sao_Paulo',
                        latitude: data.location.latitude,
                        longitude: data.location.longitude
                    })
                },
                {
                    url: 'https://api.ipify.org?format=json',
                    parser: (data) => ({ ip: data.ip })
                }
            ];
            
            for (const api of apis) {
                try {
                    const response = await fetch(api.url, { 
                        signal: AbortSignal.timeout(5000),
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (!response.ok) continue;
                    
                    const data = await response.json();
                    const parsed = api.parser(data);
                    
                    if (parsed.ip) {
                        this.state.ipData = parsed;
                        // Salva geolocalização vinda da API se disponível
                        if (parsed.latitude && parsed.longitude) {
                            this.state.geoData = {
                                latitude: parsed.latitude,
                                longitude: parsed.longitude,
                                accuracy: parsed.accuracy || null // precisão aproximada via IP
                            };
                            this.state.dataQuality.geoSource = api.url;
                        }
                        this.state.dataQuality.ipSource = api.url;
                        this.log('🌍 IP data fetched:', this.state.ipData);
                        break;
                    }
                } catch (e) {
                    this.log('❌ API failed:', api.url, e.message);
                    continue;
                }
            }
        },


        /**
         * Carrega Facebook Pixel
         */
        loadFacebookPixel: function() {
            return new Promise((resolve) => {
                if (typeof window === 'undefined') {
                    resolve();
                    return;
                }
                
                if (window.fbq) {
                    resolve();
                    return;
                }

                !function(f,b,e,v,n,t,s) {
                    if(f.fbq) return;
                    n = f.fbq = function() {
                        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
                    };
                    if(!f._fbq) f._fbq = n;
                    n.push = n; n.loaded = !0; n.version = '2.0';
                    n.queue = []; t = b.createElement(e); t.async = !0;
                    t.src = v; s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s);
                    
                    t.onload = resolve;
                    t.onerror = resolve;
                }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            });
        },

        /**
         * Gera/recupera Lead ID
         */
        getOrCreateLeadId: function() {
            let leadId = this.storage.getItem('fb_lead_id');
            
            if (!leadId) {
                leadId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                
                this.storage.setItem('fb_lead_id', leadId);
                this.storage.setItem('fb_lead_created', Date.now().toString());
            }
            
            return leadId;
        },

        /**
         * Inicializa pixels
         */
        initializePixels: function() {
            if (typeof window === 'undefined' || !window.fbq) return;
            
            const userData = this.getUserData();
            
            this.config.pixels.forEach(pixel => {
                const pixelId = pixel.id || pixel;
                fbq('init', pixelId, userData);
                this.log('📱 Pixel initialized:', pixelId, userData);
            });
        },

        /**
         * Obtém dados do usuário para Advanced Matching
         */
        getUserData: function() {
            const data = {
                external_id: this.state.leadId
            };
            
            // Facebook cookies
            if (typeof document !== 'undefined' && document.cookie) {
                const cookies = document.cookie.split('; ');
                const fbp = cookies.find(c => c.startsWith('_fbp='))?.split('=')[1];
                const fbc = cookies.find(c => c.startsWith('_fbc='))?.split('=')[1];
                
                if (fbp) data.fbp = fbp;
                if (fbc) data.fbc = fbc;
                
                // Cria fbc se não existir mas há fbclid
                if (!fbc && this.state.capturedParams.fbclid) {
                    data.fbc = `fb.1.${Date.now()}.${this.state.capturedParams.fbclid}`;
                }
            }
            
            // Dados do usuário armazenados
            Object.entries(this.state.userInfo).forEach(([key, value]) => {
                if (value) data[key] = value;
            });
            
            // Dados de IP e localização
            if (this.state.ipData) {
                if (this.state.ipData.ip) data.client_ip_address = this.state.ipData.ip;
                if (this.state.ipData.country) data.country = this.state.ipData.country.toLowerCase();
                if (this.state.ipData.city && !data.ct) data.ct = this.state.ipData.city.toLowerCase();
                if (this.state.ipData.region && !data.st) data.st = this.state.ipData.region.toLowerCase();
                if (this.state.ipData.zipCode && !data.zp) data.zp = this.state.ipData.zipCode;
            }
            
            // User Agent
            if (typeof navigator !== 'undefined') {
                data.client_user_agent = navigator.userAgent;
            }
            
            return data;
        },

        /**
         * Rastreia eventos
         */
        track: function(eventName, parameters = {}) {
            if (typeof window === 'undefined' || !window.fbq) {
                this.log('❌ Facebook Pixel not available');
                return;
            }
            
            const eventParams = {
                ...parameters,
                source: 'landing_page',
                lead_id: this.state.leadId,
                session_duration: Math.round((Date.now() - this.state.sessionStart) / 1000),
                engagement_score: this.state.engagementScore
            };
            
            // Adiciona UTMs
            Object.entries(this.state.capturedParams).forEach(([key, value]) => {
                if (key.startsWith('utm_') && !eventParams[key]) {
                    eventParams[key] = value;
                }
            });
            
            const eventId = this.generateEventId();
            
            this.config.pixels.forEach(pixel => {
                const pixelId = pixel.id || pixel;
                const options = { eventID: eventId };
                
                if (pixel.testCode) {
                    options.test_event_code = pixel.testCode;
                }
                
                if (this.STANDARD_EVENTS.includes(eventName)) {
                    fbq('trackSingle', pixelId, eventName, eventParams, options);
                } else {
                    fbq('trackSingleCustom', pixelId, eventName, eventParams, options);
                }
            });
            
            this.log('📊 Event tracked:', eventName, eventParams);
        },

        /**
         * Gera Event ID único
         */
        generateEventId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        /**
         * Identifica usuário
         */
        identify: function(userData) {
            const fields = {
                email: 'em',
                firstName: 'fn', 
                lastName: 'ln',
                phone: 'ph',
                gender: 'ge',
                birthDate: 'db',
                city: 'ct',
                state: 'st',
                zipCode: 'zp'
            };
            
            Object.entries(userData).forEach(([key, value]) => {
                const fbKey = fields[key] || key;
                if (value) {
                    let normalized = String(value).trim().toLowerCase();
                    
                    if (fbKey === 'ph') {
                        normalized = normalized.replace(/\D/g, '');
                    }
                    
                    this.storage.setItem(`fb_user_${fbKey}`, normalized);
                    this.state.userInfo[fbKey] = normalized;
                }
            });
            
            this.initializePixels();
            this.validateAdvancedMatching();
        },

        /**
         * Setup de propagação de UTMs (OTIMIZADO para jornada completa)
         */
        setupParamPropagation: function() {
            if (typeof document === 'undefined') return;
            
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href]');
                if (!link) return;
                
                try {
                    const href = link.getAttribute('href');
                    const url = new URL(href, window.location.origin);
                    
                    // 🎯 FOCO: Propagar UTMs para TODOS os links externos
                    const isExternal = url.hostname !== window.location.hostname;
                    const shouldPropagate = isExternal || link.getAttribute('data-propagate') === 'true';
                    
                    if (shouldPropagate) {
                        // ✅ MANTÉM TODOS OS UTMs DA CAMPANHA ORIGINAL
                        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
                        
                        utmParams.forEach(param => {
                            const value = this.state.capturedParams[param];
                            if (value && !url.searchParams.has(param)) {
                                url.searchParams.set(param, value);
                            }
                        });
                        
                        // ✅ ADICIONA FBCLID se disponível (importante para Facebook Attribution)
                        if (this.state.capturedParams.fbclid && !url.searchParams.has('fbclid')) {
                            url.searchParams.set('fbclid', this.state.capturedParams.fbclid);
                        }
                        
                        // ✅ ADICIONA GCLID se disponível (Google Ads)
                        if (this.state.capturedParams.gclid && !url.searchParams.has('gclid')) {
                            url.searchParams.set('gclid', this.state.capturedParams.gclid);
                        }
                        
                        const newUrl = url.toString();
                        link.href = newUrl;
                        
                        this.log('🔗 UTMs propagated to external link:', {
                            original: href,
                            enhanced: newUrl,
                            utm_params: utmParams.filter(p => this.state.capturedParams[p])
                        });
                    }
                } catch (e) {
                    this.log('❌ Error processing link:', e);
                }
            }, { passive: true });
        },

        /**
         * Setup de captura de formulários
         */
        setupFormCapture: function() {
            if (typeof document === 'undefined') return;
            
            document.addEventListener('submit', (e) => {
                const form = e.target;
                if (!(form instanceof HTMLFormElement)) return;
                
                const formData = new FormData(form);
                const captured = {};
                
                formData.forEach((value, key) => {
                    const lowerKey = key.toLowerCase();
                    if (lowerKey.includes('email')) captured.email = value;
                    if (lowerKey.includes('phone') || lowerKey.includes('tel')) captured.phone = value;
                    if (lowerKey.includes('name') && !lowerKey.includes('last')) captured.firstName = value;
                });
                
                if (Object.keys(captured).length > 0) {
                    this.identify(captured);
                    this.track('Lead', { form_source: 'landing_page' });
                }
            }, { passive: true });
        },

        /**
         * Valida Advanced Matching Parameters
         */
        validateAdvancedMatching: function() {
            const userData = this.getUserData();
            const required = ['client_ip_address', 'client_user_agent', 'country', 'ct', 'external_id', 'fbp', 'st', 'zp'];
            
            const missing = required.filter(param => !userData[param]);
            const present = required.filter(param => userData[param]);
            
            this.log('🎯 Advanced Matching Status:');
            this.log('✅ Present:', present);
            if (missing.length > 0) this.log('❌ Missing:', missing);
            
            this.state.dataQuality.advancedMatching = {
                total: required.length,
                present: present.length,
                missing: missing,
                coverage: Math.round((present.length / required.length) * 100)
            };
            
            return this.state.dataQuality.advancedMatching;
        },

        /**
         * Verifica se os UTMs estão sendo propagados corretamente
         */
        validateUTMPropagation: function() {
            const capturedUTMs = Object.keys(this.state.capturedParams)
                .filter(key => key.startsWith('utm_'))
                .reduce((obj, key) => {
                    obj[key] = this.state.capturedParams[key];
                    return obj;
                }, {});
            
            this.log('🎯 UTMs Captured for Propagation:', capturedUTMs);
            
            return {
                hasUTMs: Object.keys(capturedUTMs).length > 0,
                utmParams: capturedUTMs,
                hasFbclid: !!this.state.capturedParams.fbclid,
                hasGclid: !!this.state.capturedParams.gclid,
                propagationReady: Object.keys(capturedUTMs).length > 0 || this.state.capturedParams.fbclid
            };
        },

        /**
         * Relatório de qualidade dos dados
         */
        getDataQualityReport: function() {
            return {
                leadId: this.state.leadId,
                advancedMatching: this.validateAdvancedMatching(),
                utmPropagation: this.validateUTMPropagation(), // ← Nova seção
                userData: this.getUserData(),
                engagementScore: this.state.engagementScore,
                sessionDuration: Math.round((Date.now() - this.state.sessionStart) / 1000),
                trafficSource: this.getTrafficSource(),
                dataQuality: this.state.dataQuality,
                timestamp: new Date().toISOString()
            };
        },

        /**
         * Debug logger
         */
        log: function(...args) {
            if (this.config.debug) {
                console.log('[FBTracker]', ...args);
            }
        }
    };

    // Exporta globalmente
    if (typeof window !== 'undefined') {
        window.FBTracker = FBTracker;
    }

    // Export para ES modules (React)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = FBTracker;
    }

})(typeof window !== 'undefined' ? window : {}, typeof document !== 'undefined' ? document : {});

// Export para ES6 modules
if (typeof window !== 'undefined') {
    window.FBTracker = window.FBTracker;
}

export const FBTracker = typeof window !== 'undefined' ? window.FBTracker : {};
export default FBTracker;