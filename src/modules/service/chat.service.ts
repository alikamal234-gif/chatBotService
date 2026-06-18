import { ProviderFactory, ProviderType } from '../factory/provider.factory';
import fs from 'fs';
import path from 'path';
import { AiRouterService } from './ai-router.service';



export class ChatService {
    async sendMessage(providerType: ProviderType | string, messages: Array<object>): Promise<Array<object>> {
        const provider = ProviderFactory.getProvider(providerType);
        return await provider.chat(messages);
    }
}




(async () => {
    try {
        const router = new AiRouterService();

        const fallbackChain = [
            ProviderType.GROQ,
            ProviderType.DEEPSEEK,
            ProviderType.GEMINI,
            ProviderType.OPENROUTER,
            ProviderType.NVIDIA,
        ];

        console.log("request sent to providers...");

        const personaPath = path.join(__dirname, '../../config/persona.txt');
        let systemPrompt = "You are a helpful assistant.";
        try {
            systemPrompt = fs.readFileSync(personaPath, 'utf-8');
            console.log(`[Config] Persona read successfully from: ${personaPath}`);
        } catch (e: any) {
            console.log(`[Config] persona.txt not found : ${personaPath}`);
        }

        const fullMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "quelles sont les services de rizk design ? " }
        ];

        const response: any = await router.routeRequestWithFallback(fallbackChain, fullMessages);

        console.log("Final Response:", response);
    } catch (error) {
        console.error("Error:", error);
    }
})();

