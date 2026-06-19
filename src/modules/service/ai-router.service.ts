import { ChatService } from './chat.service';
import { ProviderType } from '../factory/provider.factory';

export class AiRouterService {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    async routeRequestWithFallback(fallbackChain: Array<ProviderType | string>, messages: Array<object>, apiKeys?: string[]) {
        let lastError = null;

        for (let i = 0; i < fallbackChain.length; i++) {
            const provider = fallbackChain[i];
            const apiKey = apiKeys && apiKeys.length > i ? apiKeys[i] : undefined;
            try {
                console.log(`[Router] sending l'request to provider: ${provider}...`);
                const response = await this.chatService.sendMessage(provider, messages, apiKey);
                console.log(`[Router] success with provider: ${provider} ✅`);
                return response;
            } catch (error: any) {
                console.log(`[Router] Provider ${provider} failed (Error: ${error.message || error}). Moving to the next provider 🔄`);
                lastError = error;
            }
        }

        throw new Error(`all providers failed: ${lastError?.message || lastError}`);
    }
}
