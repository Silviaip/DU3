// reviews.js

export async function fetchAndDisplayReviews() {
  try {
    // Anta att servern har endpoints /meal-reviews och /drink-reviews som returnerar JSON-array med recensioner
    const mealRes = await fetch("/meal-reviews");
    const drinkRes = await fetch("/drink-reviews");

    if (!mealRes.ok || !drinkRes.ok) {
      throw new Error("Misslyckades att hämta recensioner");
    }

    const mealReviews = await mealRes.json();
    const drinkReviews = await drinkRes.json();

    displayReviews("meal-reviews", mealReviews, "Måltidsrecensioner");
    displayReviews("drink-reviews", drinkReviews, "Dryckrecensioner");
  } catch (err) {
    console.error("Fel vid hämtning av recensioner:", err);
    document.getElementById("error").textContent = "Kunde inte ladda recensioner.";
  }
}

function displayReviews(containerId, reviews, title) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Rensa

  if (!reviews || reviews.length === 0) {
    container.textContent = `Inga ${title.toLowerCase()} hittades.`;
    return;
  }

  const ul = document.createElement("ul");

  reviews.forEach(review => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${review.name}</strong> – Betyg: ${review.rating} (${review.votes} röster)<br>
      <em>${review.review.reviewer} (${review.review.date})</em><br>
      <p>${review.review.text}</p>
    `;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}

// Kör automatiskt när modulen laddas
fetchAndDisplayReviews();
