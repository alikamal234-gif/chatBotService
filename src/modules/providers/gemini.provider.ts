import { AiInterface } from '../interfaces/ai.interfaces';
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API });

class GeminiProvider implements AiInterface {
    async chat(messages: Array<any>): Promise<Array<object>> {
        const systemMessage = messages.find(m => m.role === 'system')?.content;
        const userMessage = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');

        const response: any = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: userMessage,
            config: systemMessage ? { systemInstruction: systemMessage } : undefined
        });

        return response.text;
    }
}

export { GeminiProvider };