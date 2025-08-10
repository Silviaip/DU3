/*export class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    const response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log("Registrering lyckades:", data);
    } else {
      console.log("Registrering misslyckades:", response.status, data);
    }
    return data;
  }

  async login() {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log("Inloggning lyckades:", data);
    } else {
      console.log("Inloggning misslyckades:", response.status, data);
    }
    return data;
  }
}
*/
export class RandomFetcher {
  constructor() {
    this.drinkAPI = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    this.mealAPI = "https://www.themealdb.com/api/json/v1/1/random.php";
  }

  async fetchRandomDrink() {
    try {
      const response = await fetch(this.drinkAPI);
      const data = await response.json();
      const drink = data.drinks[0];
      console.log("Slumpmässig drink:", drink.strDrink);
      return drink;
    } catch (error) {
      console.error("Fel vid hämtning av drink:", error);
    }
  }

  async fetchRandomMeal() {
    try {
      const response = await fetch(this.mealAPI);
      const data = await response.json();
      const meal = data.meals[0];
      console.log("Slumpmässig maträtt:", meal.strMeal);
      return meal;
    } catch (error) {
      console.error("Fel vid hämtning av maträtt:", error);
    }
  }
}
