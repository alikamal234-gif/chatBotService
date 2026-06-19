export interface AiInterface {
    chat(messages: Array<object>, apiKey?: string): Promise<Array<object>>;
}
