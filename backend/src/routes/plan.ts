import type { FastifyInstance } from "fastify";

export async function planRoutes(app: FastifyInstance) {

    app.post("/plan", async (request, reply) => {
        return reply.send("Rota de plano de dieta");
    });

}