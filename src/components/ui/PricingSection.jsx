import React from 'react';



const PricingCard = ({
  planName,
  duration,
  price,
  originalPrice,
  savings,
  installments,
  features,
  ctaText = "Escolher Plano",
  ctaLink = "#",
  isRecommended = false,
}) => {
  const primaryColor = isRecommended ? 'blue' : 'gray';
  const primaryText = `text-${primaryColor}-600`;
  const CTA_BG = isRecommended ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-500 to-gray-600';
  const checkmarkBg = CTA_BG;

  return (
    <div className={`relative p-8 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl ${isRecommended ? 'border-blue-500 scale-105 shadow-xl' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform px-4 py-1.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md z-10">
          Mais Escolhido
        </div>
      )}
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className={`text-2xl font-extrabold ${primaryText} uppercase mb-1`}>{planName}</h3>
          <p className="text-base font-semibold text-gray-700">{duration}</p>

          <div className="mt-4 mb-6 text-center">
            {originalPrice && (
              <p className="text-gray-500 line-through text-lg">{originalPrice}</p>
            )}
            <div className="flex items-baseline justify-center gap-2">
              <span className={`text-5xl font-extrabold ${isRecommended ? 'text-blue-700' : 'text-gray-900'}`}>{price}</span>
            </div>
            {savings && <p className={`text-sm font-semibold mt-1 ${isRecommended ? primaryText : 'text-orange-500'}`}>{savings}</p>}
            {installments && <p className="text-sm font-semibold mt-1 text-gray-700">{installments}</p>}
          </div>

          <ul className="space-y-3 text-gray-700">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${checkmarkBg} text-white text-xs font-bold`}>
                  ✓
                </div>
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <a
            href={ctaLink}
            className={`group block w-full rounded-xl text-center font-extrabold py-3 transition-all duration-300 active:scale-[0.99] hover:shadow-lg ${CTA_BG} text-white`}
          >
            {ctaText}
          </a>
          <p className="mt-3 text-center text-xs text-gray-500">Pagamento seguro</p>
        </div>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const plans = [
    {
      planName: "Trimestral",
      duration: "3 Meses de Acesso",
      price: "R$ 49,90",
      originalPrice: "R$ 69,90",
      savings: "Economize 28%",
      installments: "ou 3x de R$ 16,63",
      features: [
        "Plataforma completa",
        "Protocolo Z21 exclusivo™",
        "Diário Mágico com IA",
        "Cardápios Alimentares",
        "Bônus exclusivos",
      ],
      isRecommended: false,
    },
    {
      planName: "Semestral",
      duration: "6 Meses de Acesso",
      price: "R$ 67,90",
      originalPrice: "R$ 139,90",
      savings: "Economize 51%",
      installments: "ou 6x de R$ 11,31",
      features: [
        "Plataforma completa",
        "Protocolo Z21 exclusivo™",
        "Diário Mágico com IA",
        "Cardápios Alimentares",
        "Bônus exclusivos",
      ],
      isRecommended: true,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Escolha o plano ideal</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Acesso completo aos nossos recursos em qualquer um dos planos. O plano semestral oferece maior economia.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.planName} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
