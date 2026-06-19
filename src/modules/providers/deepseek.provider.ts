import { AiInterface } from "../interfaces/ai.interfaces";
import OpenAI from "openai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });
class DeepSeekProvider implements AiInterface {
    async chat(messages: Array<any>, apiKey?: string): Promise<Array<any>> {
        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        });
        const completion: any = await openai.chat.completions.create({
            messages: messages,
            model: "deepseek-v4-pro",
            stream: false,
        });

        return [completion.choices[0].message.content];
    }
}

export { DeepSeekProvider };