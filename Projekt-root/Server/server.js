import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const url = "https://www.themealdb.com/api/json/v1/1/random.php";
const templatePath = "./template.html";

async function fetchRandomMeal() {
  const res = await fetch(url);
  const data = await res.json();
  return data.meals[0];
}

function fillTemplate(template, meal) {
  return template
    .replaceAll("{{mealName}}", meal.strMeal)
    .replaceAll("{{mealThumb}}", meal.strMealThumb)
    .replaceAll("{{mealCategory}}", meal.strCategory)
    .replaceAll("{{mealArea}}", meal.strArea)
    .replaceAll("{{mealSource}}", meal.strSource || "#");
}

serve(async (req) => {
  const meal = await fetchRandomMeal();

  const template = await Deno.readTextFile(templatePath);
  const html = fillTemplate(template, meal);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}, { port: 8080 });
