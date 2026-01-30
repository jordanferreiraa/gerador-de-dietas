import OpenAI from "openai";
import { buildSystemPrompt, buildUserPrompt, buildDocsSystemPrompt } from "./prompt";
import type { DietPlanRequest } from "./types";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
    timeout: 2 * 60 * 1000, // 2 minutos
    logLevel: "debug"
})

// função* generator
export async function* generateDietPlan(input: DietPlanRequest) {
    const diretrizes = fs.readFileSync("knowledge/diretrizes.md", "utf-8")

    const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: buildUserPrompt(input) }
        ],
        temperature: 0.6, // quanto maior, mais criativo 
        stream: true, // true o modelo pensa e vai "digitando" a resposta (string de dados)
    })

    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if(delta) yield delta; // yield pode interromper a execução e retornar de onde parou. é como umm return, mas que pausa a função em vez de encerrá-la
    }
}