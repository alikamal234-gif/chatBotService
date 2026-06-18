export interface AiInterface {
    chat(messages: Array<object>): Promise<Array<object>>;
}
