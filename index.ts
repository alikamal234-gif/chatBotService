import express, { Request, Response } from 'express';
import cors from 'cors';
import { AiRouterService } from './src/modules/service/ai-router.service';
import { ProviderType } from './src/modules/factory/provider.factory';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

const router = new AiRouterService();

// Fallback chain for providers
const fallbackChain = [
    ProviderType.GROQ,
    ProviderType.DEEPSEEK,
    ProviderType.GEMINI,
    ProviderType.OPENROUTER,
    ProviderType.NVIDIA,
];

// Load persona
const personaPath = path.join(__dirname, 'src/config/persona.txt');
let systemPrompt = "You are a helpful assistant.";
try {
    systemPrompt = fs.readFileSync(personaPath, 'utf-8');
    console.log(`[Config] Persona read successfully`);
} catch (e: any) {
    console.log(`[Config] persona.txt not found : ${personaPath}`);
}

app.post('/api/chat', async (req: Request, res: Response): Promise<any> => {
    try {
        const userMessages = req.body.messages;

        if (!userMessages || !Array.isArray(userMessages)) {
            return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
        }

        // Add the persona as the system message at the beginning
        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...userMessages
        ];

        console.log("Incoming request, sending to providers...");
        const response: any = await router.routeRequestWithFallback(fallbackChain, fullMessages);

        return res.status(200).json({ response });
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to process chat request." });
    }
});

app.listen(port, () => {
    console.log(`ChatBot Service is running on http://localhost:${port}`);
});
