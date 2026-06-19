import { ProviderFactory, ProviderType } from '../factory/provider.factory';
import fs from 'fs';
import path from 'path';

export class ChatService {
    async sendMessage(providerType: ProviderType | string, messages: Array<object>, apiKey?: string): Promise<Array<object>> {
        const provider = ProviderFactory.getProvider(providerType);
        return await provider.chat(messages, apiKey);
    }
}


