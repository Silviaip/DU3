document.getElementById("nightBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/drink");
    const drink = await res.json();
    const container = document.getElementById("drink");
    container.innerHTML = `
      <h2>${drink.strDrink}</h2>
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="300">
      <p><strong>Kategori:</strong> ${drink.strCategory}</p>
      <h3>Instruktioner</h3>
      <p>${drink.strInstructions}</p>
    `;
  } catch (err) {
    console.error("Kunde inte ladda drink:", err);
  }
});