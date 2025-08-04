export default function VideoProcessingBanner({ answers, currentWatchTime }) {
  // Função para calcular progresso com aceleração nos primeiros 60s
  const calculateProgress = (currentTime) => {
    const totalTime = 230; // Tempo total para liberação da página
    
    if (currentTime < 60) {
      // Progresso acelerado: 70% nos primeiros 60 segundos
      return (currentTime / 60) * 70;
    } else {
      // Progresso normal: 30% restantes nos 170 segundos seguintes (60s até 230s)
      const remainingTime = currentTime - 60;
      const remainingProgress = (remainingTime / 170) * 30;
      return Math.min(70 + remainingProgress, 100); // Corrigido: 70 + 30 = 100 aos 230s
    }
  };

  // Função para gerar mensagem personalizada baseada no tempo e respostas
  const getPersonalizedMessage = (answers, currentTime) => {
    const challenge = answers?.main_challenge || 'general';
    const progress = calculateProgress(currentTime);
    
    // Mensagens baseadas no tempo assistido com engajamento
    if (currentTime < 60) {
      switch (challenge) {
        case 'no_time':
          return {
            message: "🔍 Analisando sua rotina corrida para criar um plano que se encaixe perfeitamente...",
            progress,
            stage: "Análise inicial"
          };
        case 'confusion':
          return {
            message: "🧠 Organizando todas as informações para eliminar sua confusão...",
            progress,
            stage: "Mapeamento"
          };
        case 'motivation':
          return {
            message: "🎯 Identificando estratégias para manter sua motivação em alta...",
            progress,
            stage: "Diagnóstico"
          };
        case 'results':
          return {
            message: "⚙️ Analisando porque você não está vendo resultados...",
            progress,
            stage: "Investigação"
          };
        default:
          return {
            message: "📊 Processando suas respostas para criar algo personalizado...",
            progress,
            stage: "Processamento"
          };
      }
    } else if (currentTime < 120) {
      switch (challenge) {
        case 'no_time':
          return {
            message: "🔍 Descobri 3 'furos' na sua rotina... Criando soluções de 15min...",
            progress,
            stage: "Descobertas"
          };
        case 'confusion':
          return {
            message: "💡 Identifiquei o erro #1 que 73% das pessoas cometem... Corrigindo...",
            progress,
            stage: "Insights"
          };
        case 'motivation':
          return {
            message: "⚡ Achei o gatilho mental que vai manter você motivado sempre...",
            progress,
            stage: "Solução"
          };
        case 'results':
          return {
            message: "⚡ Achei exatamente o que está sabotando seus resultados...",
            progress,
            stage: "Diagnóstico"
          };
        default:
          return {
            message: "🔥 Descoberta importante sobre seu perfil... Organizando...",
            progress,
            stage: "Insights"
          };
      }
    } else if (currentTime < 180) {
      switch (challenge) {
        case 'no_time':
          return {
            message: "🎯 Seu perfil precisa de abordagem diferente de 90% das pessoas...",
            progress,
            stage: "Personalização"
          };
        case 'confusion':
          return {
            message: "📦 Preparando seu guia definitivo sem complicações...",
            progress,
            stage: "Preparação final"
          };
        case 'motivation':
          return {
            message: "🔥 Criando suas 'pílulas' de motivação personalizadas...",
            progress,
            stage: "Customização"
          };
        case 'results':
          return {
            message: "⚙️ Estruturando o método que finalmente vai funcionar para você...",
            progress,
            stage: "Montagem"
          };
        default:
          return {
            message: "✨ Quase pronto... preparando algo especial para seu perfil...",
            progress,
            stage: "Finalização"
          };
      }
    } else {
      return {
        message: "✨ Finalizando os últimos detalhes do seu plano personalizado...",
        progress,
        stage: "Últimos ajustes"
      };
    }
  };

  const messageData = getPersonalizedMessage(answers, currentWatchTime);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-5">
      {/* Cabeçalho com stage */}
      <div className="text-center mb-3">
        <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
          {messageData.stage}
        </span>
      </div>
      
      {/* Mensagem principal */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-5 h-5">
          <div className="w-5 h-5 border-2 border-emerald-400 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-emerald-700 font-medium text-base">
          {messageData.message}
        </p>
      </div>
      
      {/* Barra de progresso visual */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Progresso</span>
          <span className="text-xs text-emerald-600 font-semibold">
            {Math.round(messageData.progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${messageData.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
