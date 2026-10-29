export const FREE_AI_OPTIONS = {
  local: ['ollama', 'lm-studio', 'llama.cpp', 'text-generation-webui'],
  browser: ['venice-ai'],
  cloudFallback: ['gemini'],
  swarm: ['autogen', 'crewai', 'openagents'],
  openSourceModels: ['llama3', 'qwen', 'mistral', 'phi3', 'deepseek-coder', 'codestral'],
} as const;

export function getAiProviderPriority() {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

  if (hasGemini) {
    return 'gemini';
  }

  if (hasOpenAI) {
    return 'openai';
  }

  if (hasAnthropic) {
    return 'anthropic';
  }

  return 'ollama';
}

export function getAiModeSummary() {
  return {
    preferred: 'ollama',
    fallbackOrder: ['ollama', 'venice-ai', 'gemini', 'openai', 'anthropic'],
    noKeyRequired: true,
    warnings: ['Venice and Gemini are free-tier and quota-dependent', 'Ollama is the best no-key default'],
  };
}
