import { AiInterface } from '../interfaces/ai.interfaces';
import { GeminiProvider } from '../providers/gemini.provider';
import { GroqProvider } from '../providers/groq.provider';
import { OpenRouterProvider } from '../providers/openrouter.provider';
import { DeepSeekProvider } from '../providers/deepseek.provider';
import { NvidiaProvider } from '../providers/nvidia.provider';
export enum ProviderType {
    GEMINI = 'gemini',
    GROQ = 'groq',
    OPENROUTER = 'openrouter',
    DEEPSEEK = 'deepseek',
    NVIDIA = 'nvidia',
}

export class ProviderFactory {
    static getProvider(type: ProviderType | string): AiInterface {
        switch (type) {
            case ProviderType.GEMINI:
                return new GeminiProvider();
            case ProviderType.GROQ:
                return new GroqProvider();
            case ProviderType.OPENROUTER:
                return new OpenRouterProvider();
            case ProviderType.DEEPSEEK:
                return new DeepSeekProvider();
            case ProviderType.NVIDIA:
                return new NvidiaProvider();
            default:
                throw new Error(`Provider type '${type}' is not supported.`);
        }
    }
}
