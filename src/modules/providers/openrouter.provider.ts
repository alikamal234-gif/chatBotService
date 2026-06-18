import { AiInterface } from "../interfaces/ai.interfaces";
import { OpenRouter } from '@openrouter/sdk';

import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root of the project
dotenv.config({ path: path.join(__dirname, '../../../.env') });

class OpenRouterProvider implements AiInterface {
    async chat(messages: Array<any>): Promise<Array<object>> {
        const client = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY,
        });
        const completion = await client.chat.send({
            chatRequest: {
                model: 'openai/gpt-3.5-turbo',
                messages: messages,
            }
        });

        return completion.choices[0].message.content
    }
}

export { OpenRouterProvider };