import { AiInterface } from "../interfaces/ai.interfaces";


import { OpenAI } from "openai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../../../.env') });

class GroqProvider implements AiInterface {

    async chat(messages: Array<any>): Promise<Array<object>> {
        const client = new OpenAI({
            apiKey: process.env.GROA_AI_API,
            baseURL: "https://api.groq.com/openai/v1",
        });

        const response: any = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
        });

        let content = response.choices[0].message.content;

        // Clean up trailing dashes and empty lines
        content = content.replace(/(\n\s*-\s*)*$/g, '');
        content = content.replace(/-+$/g, '');

        return content.trim();
    }
}


export { GroqProvider };
