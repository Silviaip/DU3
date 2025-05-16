import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleApiRequest } from "../../Server/api.js";

console.log("✅ Servern körs på http://localhost:8000");

serve(async (req) => {
  return await handleApiRequest(req);
});