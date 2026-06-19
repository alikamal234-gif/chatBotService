export interface ToolDefinition {
    name: string;
    description: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
}

export interface ToolCallRequest {
    action: 'tool_call';
    tool: string;
    arguments: Record<string, any>;
}

export interface ToolCallResult {
    tool: string;
    status: 'success' | 'error';
    data?: any;
    error?: string;
}
