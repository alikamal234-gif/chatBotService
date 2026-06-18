import { ChatService } from './chat.service';
import { ProviderType } from '../factory/provider.factory';

export class AiRouterService {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    async routeRequestWithFallback(fallbackChain: Array<ProviderType | string>, messages: Array<object>) {
        let lastError = null;

        for (const provider of fallbackChain) {
            try {
                console.log(`[Router] sending l'request to provider: ${provider}...`);
                const response = await this.chatService.sendMessage(provider, messages);
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
