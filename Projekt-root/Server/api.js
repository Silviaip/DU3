import { fetchRandomMeal } from "./fetchMeals.js";
import { saveMeal, getAllMeals } from "./database.js";

export async function handleApiRequest(req) {
  const { pathname } = new URL(req.url);

  if (req.method === "POST" && pathname === "/api/save-random") {
    const meal = await fetchRandomMeal();
    await saveMeal(meal);

    return new Response(JSON.stringify({ success: true, meal }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "GET" && pathname === "/api/meals") {
    const meals = await getAllMeals();

    return new Response(JSON.stringify(meals), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("❌ Not found", { status: 404 });
}