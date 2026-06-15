import type { Fuente } from "@/lib/ai/types";

export interface Mensaje {
  rol: "usuario" | "asistente";
  contenido: string;
  fuentes?: Fuente[];
}
