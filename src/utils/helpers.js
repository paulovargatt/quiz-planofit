const CHALLENGE_CONFIG = {
    restrictive_diets: {
        iconName: 'RotateCcw',
        headline: 'Ciclo de Dietas Restritivas',
        problem: 'Seu corpo entra em "modo economia" e você recupera tudo depois.',
        solution: 'PlanoFit calcula suas calorias exatas sem passar fome.',
        gradient: 'from-rose-500/10 to-pink-500/5',
        borderColor: 'border-rose-200/50',
        iconBg: 'from-rose-500 to-pink-600',
        iconColor: 'text-white',
        titleColor: 'text-slate-900',
        badgeGradient: 'from-rose-500 to-pink-600',
    },
    no_time: {
        iconName: 'Clock',
        headline: 'Falta de Tempo',
        problem: 'Na correria, você come qualquer coisa e perde o controle.',
        solution: 'IA planeja tudo em segundos + registro por foto.',
        gradient: 'from-amber-500/10 to-orange-500/5',
        borderColor: 'border-amber-200/50',
        iconBg: 'from-amber-500 to-orange-600',
        iconColor: 'text-white',
        titleColor: 'text-slate-900',
        badgeGradient: 'from-amber-500 to-orange-600',
    },
    confusion: {
        iconName: 'HelpCircle',
        headline: 'Informação Demais',
        problem: 'Muita informação confusa e você não sabe o que fazer.',
        solution: 'Passo a passo, com um método simples e fácil com um assistente que diz exatamente o que fazer.',
        gradient: 'from-violet-500/10 to-purple-500/5',
        borderColor: 'border-violet-200/50',
        iconBg: 'from-violet-500 to-purple-600',
        iconColor: 'text-white',
        titleColor: 'text-slate-900',
        badgeGradient: 'from-violet-500 to-purple-600',
    },
    emotional_eating: {
        iconName: 'Heart',
        headline: 'Fome Emocional',
        problem: 'Ansiedade vira calorias extras sem perceber.',
        solution: 'Identificar gatilhos e quebrar o ciclo.',
        gradient: 'from-pink-500/10 to-rose-500/5',
        borderColor: 'border-pink-200/50',
        iconBg: 'from-pink-500 to-rose-600',
        iconColor: 'text-white',
        titleColor: 'text-slate-900',
        badgeGradient: 'from-pink-500 to-rose-600',
    },
};

const BENEFITS_BY_SYMPTOM = {
    fatigue: {
        iconName: 'Zap',
        gradient: 'from-amber-500 to-orange-600',
        text: 'Mais energia no dia'
    },
    low_self_esteem: {
        iconName: 'TrendingUp',
        gradient: 'from-emerald-500 to-teal-600',
        text: 'Autoestima lá em cima'
    },
    uncontrolled_hunger: {
        iconName: 'Target',
        gradient: 'from-blue-500 to-indigo-600',
        text: 'Fome sob controle'
    },
    sleep_issues: {
        iconName: 'Moon',
        gradient: 'from-violet-500 to-purple-600',
        text: 'Sono mais profundo'
    },
};

const CTA_BY_COMMITMENT = {
    full_transformation: {
        text: 'Quero minha transformação agora',
        iconName: 'Flame',
        gradient: 'from-rose-500 to-pink-500'
    },
    gradual_change: {
        text: 'Começar no meu ritmo',
        iconName: 'TrendingUp',
        gradient: 'from-blue-500 to-indigo-500'
    },
    default: {
        text: 'Ver como funciona',
        iconName: 'Sparkles',
        gradient: 'from-emerald-500 to-teal-500'
    },
};

function headerSection() {
    return '' +
        '<div class="mb-5 text-center">' +
        '<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">' +
        '<span>🔍</span><span>Seu diagnóstico</span>' +
        '</div>' +
        '<h3 class="mt-2 text-[18px] leading-tight font-bold text-slate-900">' +
        'Entendemos seu bloqueio' +
        '</h3>' +
        '<p class="mt-1 text-slate-600 text-[13px]">' +
        'Veja por que está difícil emagrecer e como destravar com o menor esforço.' +
        '</p>' +
        '</div>';
}

function mainCardSection(cfg) {
    return '' +
        '<div class="rounded-2xl border ' + cfg.cardClass + ' shadow-sm p-4 mb-5">' +
        '<div class="flex items-start gap-3">' +
        '<div class="shrink-0 w-11 h-11 rounded-xl bg-white shadow-sm grid place-items-center text-[22px]">' + cfg.icon + '</div>' +
        '<div class="flex-1">' +
        '<div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full ' + cfg.badgeClass + ' text-[11px] font-semibold mb-1.5">' +
        '<span>Prioridade</span>' +
        '</div>' +
        '<h4 class="text-[15px] font-semibold ' + cfg.titleClass + ' leading-snug">' + cfg.headline + '</h4>' +
        '<div class="mt-2 text-[13px] text-slate-700">' +
        '<p><span class="font-semibold text-slate-900">Problema:</span> ' + cfg.problem + '</p>' +
        '</div>' +
        '<div class="mt-3 bg-white rounded-xl p-3 border-l-4 ' + cfg.accentClass + ' shadow-xs">' +
        '<p class="text-[13px] text-slate-800"><span class="font-semibold">Solução:</span> ' + cfg.solution + '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function attemptsSection(type) {
    if (type === 'many_times' || type === 'constant_struggle') {
        return '' +
            '<div class="rounded-2xl border bg-rose-50 border-rose-200 p-4 mb-5">' +
            '<div class="flex items-start gap-3">' +
            '<div class="shrink-0 w-10 h-10 grid place-items-center text-[20px]">💔</div>' +
            '<div class="flex-1">' +
            '<p class="text-rose-900 text-[13px] font-semibold">Você já tentou várias vezes.</p>' +
            '<p class="text-rose-800 text-[12px] mt-0.5">Agora vai com ferramentas certas e sem depender de força de vontade infinita.</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    }
    if (type === 'first_time') {
        return '' +
            '<div class="rounded-2xl border bg-emerald-50 border-emerald-200 p-4 mb-5">' +
            '<div class="flex items-start gap-3">' +
            '<div class="shrink-0 w-10 h-10 grid place-items-center text-[20px]">🌟</div>' +
            '<div class="flex-1">' +
            '<p class="text-emerald-900 text-[13px] font-semibold">Ótima hora pra começar.</p>' +
            '<p class="text-emerald-800 text-[12px] mt-0.5">Ciência + automação desde o início = resultado mais rápido.</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    }
    return '';
}

function renderBenefit(b) {
    return '' +
        '<div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white ring-1 ring-slate-100 shadow-xs">' +
        '<span class="' + b.colorClass + ' text-[18px]">' + b.icon + '</span>' +
        '<span class="text-slate-700 font-medium text-[13px]">' + b.text + '</span>' +
        '</div>';
}

function benefitsSection(benefitItems) {
    if (!benefitItems || benefitItems.length === 0) return '';
    return '' +
        '<div class="rounded-2xl border bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 p-4 mb-5">' +
        '<h4 class="text-indigo-900 text-[13px] font-semibold mb-3 text-center">Também vamos te ajudar a:</h4>' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">' + benefitItems.join('') + '</div>' +
        '</div>';
}

function ctaSection(cfg) {
    return '' +
        '<div class="text-center space-y-3">' +
        '<div class="w-full bg-gradient-to-r ' + cfg.gradient + ' text-white rounded-2xl p-4 shadow-md active:scale-[0.99] transition-transform">' +
        '<div class="text-[24px] mb-1">' + cfg.emoji + '</div>' +
        '<p class="text-[15px] font-bold">' + cfg.text + '</p>' +
        '<p class="text-[12px] opacity-90 mt-0.5">Sem enrolação: veja o passo a passo em 60 segundos</p>' +
        '</div>' +
        '<div class="flex items-center justify-center gap-2 text-[11px] text-slate-500">' +
        '<span class="text-emerald-600">✓</span>' +
        '<span>Plano 100% personalizado</span>' +
        '<span class="text-slate-300">•</span>' +
        '<span>Sem passar fome</span>' +
        '</div>' +
        '</div>';
}

/**
 
@param {Answers} answers
@returns {string}
*/
export function getPersonalizedMessage(answers) {
    const a = answers || {};
    const mainChallenge = a.main_challenge || 'confusion';
    const symptoms = Array.isArray(a.symptoms) ? a.symptoms : [];
    const commitment = a.commitment || 'curious';
    const attempts = a.weight_loss_attempts || 'none';
    const baseCfg = CHALLENGE_CONFIG[mainChallenge] || CHALLENGE_CONFIG.confusion;

    const benefitItems = symptoms
        .filter(function (s) { return !!BENEFITS_BY_SYMPTOM[s]; })
        .map(function (s) { return renderBenefit(BENEFITS_BY_SYMPTOM[s]); });

    const ctaCfg = CTA_BY_COMMITMENT[commitment] || CTA_BY_COMMITMENT.default;

    return '' +
        '<div class="mx-auto max-w-[560px] px-4">' +
        headerSection() +
        mainCardSection(baseCfg) +
        attemptsSection(attempts) +
        benefitsSection(benefitItems) +
        ctaSection(ctaCfg) +
        '<div class="h-6"></div>' +
        '</div>';
}