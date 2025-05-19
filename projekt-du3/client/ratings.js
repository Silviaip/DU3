import { v4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";

const DATA_FILE = "ratings.json";

export async function loadRatings() {
  try {
    return JSON.parse(await Deno.readTextFile(DATA_FILE));
  } catch {
    return [];
  }
}

export async function saveRatings(ratings) {
  await Deno.writeTextFile(DATA_FILE, JSON.stringify(ratings, null, 2));
}

export async function addRating(data) {
  const all = await loadRatings();
  const newRating = {
    id: v4.generate(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  all.push(newRating);
  await saveRatings(all);
  return newRating;
}

    // Läs in befintliga ratings, lägg till den nya och spara tillbaka
    /*const ratings = await loadRatings();
    ratings.push(newRating);
    await saveRatings(ratings);

    return new Response(JSON.stringify(newRating), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }*/