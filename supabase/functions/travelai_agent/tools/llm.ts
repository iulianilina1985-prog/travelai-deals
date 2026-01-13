export class LLM {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = "gpt-4o-mini") {
        this.apiKey = apiKey;
        this.model = model;
    }

    async chat(
        messages: { role: string; content: string }[],
        response_format: any = null
    ): Promise<any> {
        const body: any = {
            model: this.model,
            messages: messages,
            temperature: 0.7,
        };

        if (response_format) {
            body.response_format = response_format;
        }

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const txt = await res.text();
            console.error("OpenAI Error:", res.status, txt);
            throw new Error(`OpenAI Error: ${res.status}`);
        }

        const json = await res.json();
        const content = json.choices[0].message.content;

        if (response_format?.type === "json_object") {
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return { reply: content };
            }
        }

        return content;
    }
}
