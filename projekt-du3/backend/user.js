// funktion som lägger till användare permanent i en json-fil (databas där användarnamn och lösenord sparas)


console.log("hej")
async function registerUser() {
    const usernameInput = document.getElementById("username_input").value.trim();
    const passwordInput = document.getElementById("password_input").value.trim();
    const messageText = document.getElementById("message_text");

    if (!usernameInput || !passwordInput) {
        messageText.textContent = "Please fill in both fields!";
        return;
    }

    const response = await fetch("/user", { // Ändra URL till er server
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
    });

    const result = await response.json();

    if (result.error) {
        messageText.textContent = result.error;
    } else {
        messageText.textContent = "Account created!";
    }
}

document.getElementById("register_button").addEventListener("click", () => {
    console.log("Button clicked"); // Kontrollera om klick händer
    registerUser();
});
