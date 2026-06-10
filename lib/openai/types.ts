export type OpenAIRole = 'system' | 'user' | 'assistant';

export type OpenAIChatMessage = {
    role: OpenAIRole;
    content: string;
};
