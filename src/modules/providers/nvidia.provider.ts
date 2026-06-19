import { AiInterface } from "../interfaces/ai.interfaces";
import OpenAI from "openai";
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root of the project
dotenv.config({ path: path.join(__dirname, '../../../.env') });
class NvidiaProvider implements AiInterface {
    async chat(messages: any[], apiKey?: string): Promise<any[]> {
        const openai = new OpenAI({
            apiKey: apiKey || process.env.NVIDIA_API_KEY,
            baseURL: 'https://integrate.api.nvidia.com/v1',
        })


        const completion: any = await openai.chat.completions.create({
            model: "nvidia/nemotron-3-ultra-550b-a55b",
            messages: messages,
            temperature: 1,
            top_p: 0.95,
            max_tokens: 1024,
        })

        return completion.choices[0].message.content;

    }
}

export { NvidiaProvider };
