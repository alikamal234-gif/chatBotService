import express, { Request, Response } from 'express';
import cors from 'cors';
import { AiRouterService } from './src/modules/service/ai-router.service';
import { ProviderType } from './src/modules/factory/provider.factory';
import fs from 'fs';
import path from 'path';
import { ToolExecutor } from './src/modules/tools/tool.executor';
import { ToolValidator } from './src/modules/tools/tool.validator';
import { ToolDefinition } from './src/modules/interfaces/tool.interfaces';

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
        const apiKeys = req.body.apiKeys;
        const customPersonaPath = req.body.personaPath;
        const tools: ToolDefinition[] = req.body.tools;

        if (!userMessages || !Array.isArray(userMessages)) {
            return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
        }

        if (apiKeys && !Array.isArray(apiKeys)) {
            return res.status(400).json({ error: "Invalid request. 'apiKeys' must be an array." });
        }

        let currentSystemPrompt = systemPrompt;

        if (customPersonaPath) {
            try {
                currentSystemPrompt = fs.readFileSync(path.resolve(customPersonaPath), 'utf-8');
            } catch (e: any) {
                console.log(`[Config] Custom persona file not found at ${customPersonaPath}, falling back to default.`);
            }
        }

        if (tools && Array.isArray(tools) && tools.length > 0) {
            const toolDescriptions = tools.map(t => ({
                name: t.name,
                description: t.description
            }));
            currentSystemPrompt += `\n\nYou have access to the following tools: ${JSON.stringify(toolDescriptions)}. If you need to use a tool to fulfill the user's request, you MUST respond with ONLY a JSON object in this exact format, with no markdown formatting or other text:\n{"action": "tool_call", "tool": "tool_name", "arguments": { "arg1": "value" }}`;
        }

        // Add the persona as the system message at the beginning
        const fullMessages = [
            { role: 'system', content: currentSystemPrompt },
            ...userMessages
        ];

        console.log("Incoming request, sending to providers...");
        let response: any = await router.routeRequestWithFallback(fallbackChain, fullMessages, apiKeys);

        if (tools && Array.isArray(tools) && tools.length > 0) {
            const toolCall = ToolValidator.tryParseToolCall(response);
            
            if (toolCall) {
                console.log(`[Tool] AI requested to call tool: ${toolCall.tool}`);
                const allowedTool = ToolValidator.validateAllowedTool(toolCall, tools);
                
                if (allowedTool) {
                    const executor = new ToolExecutor();
                    const result = await executor.execute(allowedTool, toolCall);
                    
                    fullMessages.push({ role: 'assistant', content: JSON.stringify(toolCall) });
                    fullMessages.push({ 
                        role: 'user', 
                        content: `Tool Execution Result for ${toolCall.tool}:\n${JSON.stringify(result)}\n\nNow, generate the final response to the user based on this tool result.` 
                    });

                    console.log(`[Tool] Sending tool result back to AI...`);
                    response = await router.routeRequestWithFallback(fallbackChain, fullMessages, apiKeys);
                } else {
                    console.log(`[Tool] Tool ${toolCall.tool} is not allowed or not found.`);
                }
            }
        }

        return res.status(200).json({ response });
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Failed to process chat request." });
    }
});

app.listen(port, () => {
    console.log(`ChatBot Service is running on http://localhost:${port}`);
});
