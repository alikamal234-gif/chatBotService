import { ToolDefinition, ToolCallRequest } from '../interfaces/tool.interfaces';

export class ToolValidator {
    static isValidToolRequest(request: any): request is ToolCallRequest {
        return request 
            && request.action === 'tool_call' 
            && typeof request.tool === 'string'
            && typeof request.arguments === 'object';
    }

    static validateAllowedTool(request: ToolCallRequest, allowedTools: ToolDefinition[]): ToolDefinition | null {
        const tool = allowedTools.find(t => t.name === request.tool);
        return tool || null;
    }

    static tryParseToolCall(responseContent: any): ToolCallRequest | null {
        try {
            let contentString = '';
            if (typeof responseContent === 'string') {
                contentString = responseContent;
            } else if (Array.isArray(responseContent) && responseContent.length > 0) {
                contentString = typeof responseContent[0] === 'string' ? responseContent[0] : JSON.stringify(responseContent[0]);
            } else if (typeof responseContent === 'object' && responseContent !== null) {
                if (this.isValidToolRequest(responseContent)) {
                    return responseContent as ToolCallRequest;
                }
                contentString = JSON.stringify(responseContent);
            }

            if (!contentString) return null;

            const cleanContent = contentString.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanContent);
            if (this.isValidToolRequest(parsed)) {
                return parsed;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
}
