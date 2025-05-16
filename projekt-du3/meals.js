import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
const RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const templatePath = "./server/index.html";

async function getRandomMealDetails() {
  const res = await fetch(RANDOM_URL);
  const data = await res.json();
  const id = data.meals[0].idMeal;

  const detailRes = await fetch(`${LOOKUP_URL}${id}`);
  const detailData = await detailRes.json();
  return detailData.meals[0];
}

serve(async (req) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/meal") {
    const meal = await getRandomMealDetails();
    return new Response(JSON.stringify(meal), {
      headers: { "Content-Type": "application/json" },
    });
  }

 if (pathname === "/") {
  const html = await Deno.readTextFile("./server/index.html");
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }, // ✅
  });
}


  // Statisk filserver för JS
  if (pathname === "/mealsfetch.js") {
    const js = await Deno.readTextFile("./server/mealsfetch.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  return new Response("404 Not Found", { status: 404 });
}, { port: 8080 });
