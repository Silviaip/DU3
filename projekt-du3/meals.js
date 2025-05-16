import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const RANDOM_DRINK_URL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

async function getRandomMealDetails() {
  const res = await fetch(RANDOM_URL);
  const data = await res.json();
  const id = data.meals[0].idMeal;

  const detailRes = await fetch(`${LOOKUP_URL}${id}`);
  const detailData = await detailRes.json();
  return detailData.meals[0];
}

async function getRandomDrink() {
  const res = await fetch(RANDOM_DRINK_URL);
  const data = await res.json();
  return data.drinks[0];
}

serve(async (req) => {
  const { pathname } = new URL(req.url);

  
  if (pathname === "/meal") {
    const meal = await getRandomMealDetails();
    return new Response(JSON.stringify(meal), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname === "/drink") {
    const drink = await getRandomDrink();
    return new Response(JSON.stringify(drink), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname === "/") {
    const html = await Deno.readTextFile("./server/index.html");
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (pathname === "/style.css") {
    const css = await Deno.readTextFile("./client/style.css");
    return new Response(css, {
      headers: { "Content-Type": "text/css" },
    });
  }

  if (pathname === "/mealsfetch.js") {
    const js = await Deno.readTextFile("./server/mealsfetch.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  if (pathname === "/drinks.js") {
    const js = await Deno.readTextFile("./server/drinks.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  return new Response("404 Not Found", { status: 404 });
}, { port: 8080 });
