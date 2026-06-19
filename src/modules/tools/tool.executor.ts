import { ToolDefinition, ToolCallRequest, ToolCallResult } from '../interfaces/tool.interfaces';

export class ToolExecutor {
    private static readonly TIMEOUT_MS = 5000;

    async execute(toolDef: ToolDefinition, request: ToolCallRequest): Promise<ToolCallResult> {
        console.log(`[ToolExecutor] Executing ${toolDef.name} -> ${toolDef.url}`);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), ToolExecutor.TIMEOUT_MS);

            const options: RequestInit = {
                method: toolDef.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...toolDef.headers,
                },
                signal: controller.signal,
            };

            let targetUrl = toolDef.url;

            if (toolDef.method === 'GET' && request.arguments) {
                const params = new URLSearchParams(request.arguments as any).toString();
                if (params) {
                    targetUrl += `?${params}`;
                }
            } else if (toolDef.method !== 'GET') {
                options.body = JSON.stringify(request.arguments || {});
            }

            const response = await fetch(targetUrl, options);
            clearTimeout(timeoutId);

            const data = await response.text();
            let parsedData;
            try {
                // Truncate if too large to prevent AI processing hangs
                const truncatedData = data.length > 10000 ? data.substring(0, 10000) + '... [TRUNCATED]' : data;
                parsedData = JSON.parse(truncatedData);
            } catch (e) {
                parsedData = data.length > 10000 ? data.substring(0, 10000) + '... [TRUNCATED]' : data;
            }

            return {
                tool: toolDef.name,
                status: response.ok ? 'success' : 'error',
                data: parsedData,
                error: response.ok ? undefined : `HTTP Status ${response.status}`,
            };
        } catch (error: any) {
            console.error(`[ToolExecutor] Error executing ${toolDef.name}:`, error.message);
            return {
                tool: toolDef.name,
                status: 'error',
                error: error.name === 'AbortError' ? 'Timeout exceeded' : error.message,
            };
        }
    }
}
