import { env } from '../../config/env.js';

const DEFAULT_DISCLAIMER =
  'Esta interpretação é simbólica e reflexiva. Não substitui aconselhamento clínico, psicológico, espiritual ou médico.';

const NEUTRAL_PREFIX = 'Possível leitura simbólica: ';

const normalizeList = (items, maxItems = 5) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...new Set(items.map((item) => String(item || '').trim()).filter(Boolean))].slice(0, maxItems);
};

const enforceNeutralLanguage = (text) => {
  const normalized = String(text || '').trim();
  if (!normalized) {
    return '';
  }

  const softened = normalized
    .replace(/\bsempre\b/gi, 'frequentemente')
    .replace(/\bnunca\b/gi, 'raramente')
    .replace(/\bcerteza\b/gi, 'possibilidade')
    .replace(/\bdestino\b/gi, 'caminho')
    .replace(/\bdeve\b/gi, 'pode');

  return softened.startsWith(NEUTRAL_PREFIX) ? softened : `${NEUTRAL_PREFIX}${softened}`;
};

const localHeuristicAnalysis = (dream, context = {}) => {
  const content = `${dream.title || ''} ${dream.content || ''}`.toLowerCase();
  const detectedSymbols = [];
  const detectedArchetypes = [];

  const rules = [
    { keywords: ['agua', 'mar', 'oceano', 'river', 'water'], symbol: 'Água', archetype: 'Emoções profundas' },
    { keywords: ['voar', 'flying', 'céu', 'sky', 'asa'], symbol: 'Voo', archetype: 'Liberdade e expansão' },
    { keywords: ['casa', 'house', 'home', 'lar'], symbol: 'Casa', archetype: 'Self e pertencimento' },
    { keywords: ['sombra', 'shadow', 'dark'], symbol: 'Sombra', archetype: 'Integração da sombra' },
    { keywords: ['ouro', 'gold', 'sol', 'sun'], symbol: 'Luz dourada', archetype: 'Potencial criativo' },
    { keywords: ['ponte', 'bridge', 'porta', 'portal'], symbol: 'Passagem', archetype: 'Transição' }
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => content.includes(keyword))) {
      detectedSymbols.push(rule.symbol);
      detectedArchetypes.push(rule.archetype);
    }
  }

  const moodSummary = Array.isArray(dream.moodTags) && dream.moodTags.length
    ? `Humores reportados: ${dream.moodTags.join(', ')}.`
    : 'Sem tags de humor explícitas neste registro.';

  const temporalContext = Array.isArray(context.recentDreamThemes) && context.recentDreamThemes.length
    ? `Padrões recentes percebidos: ${context.recentDreamThemes.join(', ')}.`
    : 'Sem padrões históricos suficientes para comparação temporal.';

  return {
    status: 'processed',
    summary: enforceNeutralLanguage(
      'Este sonho sugere um movimento interno de transformação. Observe os símbolos recorrentes e conecte-os com situações reais da sua fase atual.',
    ),
    symbols: normalizeList(detectedSymbols, 6),
    archetypes: normalizeList(detectedArchetypes, 4),
    suggestedAction: enforceNeutralLanguage(
      `${moodSummary} ${temporalContext} Reserve 10 minutos hoje para registrar conexões entre este sonho e uma decisão prática que você deseja tomar.`,
    ),
    disclaimer: DEFAULT_DISCLAIMER,
    source: 'local-heuristic',
    model: 'heuristic-v1'
  };
};

const parseJsonFromText = (rawText) => {
  const text = String(rawText || '').trim();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      return null;
    }

    try {
      return JSON.parse(text.slice(startIndex, endIndex + 1));
    } catch {
      return null;
    }
  }
};

const requestOpenAiInterpretation = async (dream, context = {}) => {
  const model = env.openAiModel;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.openAiApiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Você interpreta sonhos de forma simbólica e não determinística. Produza JSON com: summary (string), symbols (array string), archetypes (array string), suggestedAction (string), disclaimer (string curta). Nunca use linguagem de verdade absoluta, previsão de futuro, diagnóstico clínico ou orientação médica/religiosa definitiva.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            title: dream.title,
            content: dream.content,
            moodTags: dream.moodTags || [],
            lucidityLevel: dream.lucidityLevel,
            dreamDate: dream.dreamDate,
            temporalContext: context
          })
        }
      ]
    })
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${bodyText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  const parsed = parseJsonFromText(content);

  if (!parsed) {
    throw new Error('OpenAI returned invalid JSON content for dream interpretation');
  }

  return {
    status: 'processed',
    summary: enforceNeutralLanguage(String(parsed.summary || '').trim()),
    symbols: normalizeList(parsed.symbols, 6),
    archetypes: normalizeList(parsed.archetypes, 4),
    suggestedAction: enforceNeutralLanguage(String(parsed.suggestedAction || '').trim()),
    disclaimer: String(parsed.disclaimer || DEFAULT_DISCLAIMER).trim(),
    source: 'openai',
    model
  };
};

export const resolveDreamInterpretation = async (dream, context = {}) => {
  if (!env.openAiApiKey) {
    return localHeuristicAnalysis(dream, context);
  }

  try {
    const interpreted = await requestOpenAiInterpretation(dream, context);
    return {
      ...interpreted,
      summary: interpreted.summary || localHeuristicAnalysis(dream, context).summary,
      suggestedAction:
        interpreted.suggestedAction || localHeuristicAnalysis(dream, context).suggestedAction,
      disclaimer: interpreted.disclaimer || DEFAULT_DISCLAIMER
    };
  } catch {
    return localHeuristicAnalysis(dream, context);
  }
};
