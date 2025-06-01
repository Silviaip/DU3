const API_TESTS = [
    {
        name: "CORS Preflight",
        method: "OPTIONS",
        endpoint: "/",
        expectStatus: 200,
        description: "Testar CORS preflight förfrågan"
    },
    {
        name: "Hämta startsida",
        method: "GET",
        endpoint: "/",
        expectStatus: 200,
        description: "Testar att hämta index.html"
    },
    {
        name: "Hämta slumpmässig måltid",
        method: "GET",
        endpoint: "/meal",
        expectStatus: 200,
        description: "Testar att hämta slumpmässig måltid från API"
    },
    {
        name: "Hämta slumpmässig drink",
        method: "GET",
        endpoint: "/drink",
        expectStatus: 200,
        description: "Testar att hämta slumpmässig drink från API"
    },
    {
        name: "Hämta topp måltider",
        method: "GET",
        endpoint: "/top-meals",
        expectStatus: 200,
        description: "Testar att hämta topp-rankade måltider"
    },
    {
        name: "Hämta topp drinkar",
        method: "GET",
        endpoint: "/top-drinks",
        expectStatus: 200,
        description: "Testar att hämta topp-rankade drinkar"
    },
    {
        name: "Hämta måltidsrecensioner",
        method: "GET",
        endpoint: "/meal-reviews",
        expectStatus: 200,
        description: "Testar att hämta alla måltidsrecensioner"
    },
    {
        name: "Hämta drinkrecensioner",
        method: "GET",
        endpoint: "/drink-reviews",
        expectStatus: 200,
        description: "Testar att hämta alla drinkrecensioner"
    },
    {
        name: "Hämta alla recensioner",
        method: "GET",
        endpoint: "/reviews",
        expectStatus: 200,
        description: "Testar att hämta kombinerade recensioner"
    },
    {
        name: "Hämta användare",
        method: "GET",
        endpoint: "/get-user",
        expectStatus: 200,
        description: "Testar att hämta användarinformation"
    },
    {
        name: "Skapa ny användare",
        method: "POST",
        endpoint: "/user",
        body: {
            username: `testuser_${Date.now()}`,
            password: "testpassword123"
        },
        expectStatus: [200, 201],
        description: "Testar att skapa ny användare"
    },
    {
        name: "Skapa användare - duplikat",
        method: "POST",
        endpoint: "/user",
        body: {
            username: "duplicate_user",
            password: "password123"
        },
        expectStatus: [400, 409],
        description: "Testar att skapa användare med samma namn (ska misslyckas)"
    },
    {
        name: "Skapa användare - ogiltiga data",
        method: "POST",
        endpoint: "/user",
        body: {
            username: "",
            password: ""
        },
        expectStatus: 400,
        description: "Testar att skapa användare utan data (ska misslyckas)"
    },
    {
        name: "Lägg till måltidsrecension",
        method: "POST",
        endpoint: "/add-review",
        body: {
            type: "meal",
            idMeal: "12345",
            name: "Test Meal",
            rating: 4.5,
            votes: 1,
            review: {
                reviewer: "TestUser",
                date: new Date().toISOString(),
                text: "Detta är en testrecension för måltid."
            }
        },
        expectStatus: 200,
        description: "Testar att lägga till en måltidsrecension"
    },
    {
        name: "Lägg till drinkrecension",
        method: "POST",
        endpoint: "/add-review",
        body: {
            type: "drink",
            idDrink: "67890",
            name: "Test Drink",
            rating: 3.8,
            votes: 1,
            review: {
                reviewer: "TestUser",
                date: new Date().toISOString(),
                text: "Detta är en testrecension för drink."
            }
        },
        expectStatus: 200,
        description: "Testar att lägga till en drinkrecension"
    },
    {
        name: "Lägg till recension - ogiltig data",
        method: "POST",
        endpoint: "/add-review",
        body: {
            type: "meal"
            // Saknar obligatoriska fält
        },
        expectStatus: 400,
        description: "Testar att lägga till recension med ogiltig data"
    },
    {
        name: "Hämta JavaScript fil",
        method: "GET",
        endpoint: "/user.js",
        expectStatus: 200,
        description: "Testar att hämta JavaScript-fil"
    },
    {
        name: "Hämta CSS fil",
        method: "GET",
        endpoint: "/style.css",
        expectStatus: 200,
        description: "Testar att hämta CSS-fil"
    },
    {
        name: "404 - Icke-existerande endpoint",
        method: "GET",
        endpoint: "/nonexistent-endpoint",
        expectStatus: 404,
        description: "Testar att icke-existerande endpoint returnerar 404"
    }
];

let currentTestIndex = 0;
let testResults = [];
let totalStartTime = 0;
let isRunning = false;

function createTestElement(test, index) {
    const div = document.createElement('div');
    div.className = 'test-item';
    div.id = `test-${index}`;
    
    const methodClass = `method-${test.method.toLowerCase()}`;
    
    div.innerHTML = `
        <div class="test-header">
            <div class="test-title">${test.name}</div>
            <div class="test-method ${methodClass}">${test.method}</div>
        </div>
        <div class="test-url">${test.endpoint}</div>
        <div class="test-status">
            <div class="status-icon status-pending">⏳</div>
            <span>Väntar...</span>
        </div>
        <div class="test-description">${test.description}</div>
        <div class="test-details" style="display: none;"></div>
    `;
    
    return div;
}

function updateTestStatus(index, status, data = {}) {
    const testElement = document.getElementById(`test-${index}`);
    const statusElement = testElement.querySelector('.test-status');
    const detailsElement = testElement.querySelector('.test-details');
    
    testElement.className = `test-item ${status}`;
    
    let statusIcon, statusText, statusClass;
    
    switch (status) {
        case 'pending':
            statusIcon = '<div class="spinner"></div>';
            statusText = 'Kör test...';
            statusClass = 'status-pending';
            break;
        case 'success':
            statusIcon = '<div class="status-icon status-success">✓</div>';
            statusText = `Lyckad (${data.status}) - ${data.timing}ms`;
            statusClass = 'status-success';
            break;
        case 'error':
            statusIcon = '<div class="status-icon status-error">✗</div>';
            statusText = `Misslyckad (${data.status || 'N/A'}) - ${data.timing}ms`;
            statusClass = 'status-error';
            break;
    }
    
    statusElement.innerHTML = `${statusIcon}<span>${statusText}</span>`;
    
    if (data.details) {
        detailsElement.style.display = 'block';
        detailsElement.innerHTML = `
            <strong>Detaljer:</strong><br>
            ${data.details}
            ${data.response ? `<div class="response-preview">${JSON.stringify(data.response, null, 2)}</div>` : ''}
        `;
    }
}

async function runTest(test, index) {
    const serverUrl = document.getElementById('serverUrl').value.trim() || 'http://localhost:8080';
    const startTime = Date.now();
    
    updateTestStatus(index, 'pending');
    
    try {
        const url = `${serverUrl}${test.endpoint}`;
        const options = {
            method: test.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (test.body) {
            options.body = JSON.stringify(test.body);
        }
        
        const response = await fetch(url, options);
        const timing = Date.now() - startTime;
        
        let responseData = null;
        const contentType = response.headers.get('content-type');
        
        try {
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                const text = await response.text();
                responseData = text.length > 100 ? text.substring(0, 100) + '...' : text;
            }
        } catch (e) {
            responseData = 'Kunde inte läsa response body';
        }
        
        const expectedStatuses = Array.isArray(test.expectStatus) ? test.expectStatus : [test.expectStatus];
        const isSuccess = expectedStatuses.includes(response.status);
        
        const result = {
            test: test.name,
            success: isSuccess,
            status: response.status,
            timing: timing,
            response: responseData
        };
        
        testResults.push(result);
        
        updateTestStatus(index, isSuccess ? 'success' : 'error', {
            status: response.status,
            timing: timing,
            details: isSuccess ? 
                `Förväntad status: ${test.expectStatus}, Fick: ${response.status}` :
                `Förväntad status: ${test.expectStatus}, Fick: ${response.status}`,
            response: typeof responseData === 'object' ? responseData : null
        });
        
        return result;
        
    } catch (error) {
        const timing = Date.now() - startTime;
        const result = {
            test: test.name,
            success: false,
            status: 'Network Error',
            timing: timing,
            error: error.message
        };
        
        testResults.push(result);
        
        updateTestStatus(index, 'error', {
            status: 'Network Error',
            timing: timing,
            details: `Fel: ${error.message}`
        });
        
        return result;
    }
}

async function startTests() {
    if (isRunning) return;
    
    isRunning = true;
    const startBtn = document.getElementById('startBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    startBtn.disabled = true;
    clearBtn.disabled = true;
    startBtn.textContent = 'Kör tester...';
    
    // Rensa tidigare resultat
    testResults = [];
    currentTestIndex = 0;
    totalStartTime = Date.now();
    
    // Skapa test-element
    const testResultsContainer = document.getElementById('testResults');
    testResultsContainer.innerHTML = '';
    
    API_TESTS.forEach((test, index) => {
        const testElement = createTestElement(test, index);
        testResultsContainer.appendChild(testElement);
    });
    
    // Kör tester sekventiellt
    for (let i = 0; i < API_TESTS.length; i++) {
        currentTestIndex = i;
        
        // Uppdatera progress
        const progress = ((i + 1) / API_TESTS.length) * 100;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
        
        // Uppdatera nuvarande test
        const currentTestDiv = document.getElementById('currentTest');
        currentTestDiv.textContent = `Kör test ${i + 1}/${API_TESTS.length}: ${API_TESTS[i].name}`;
        
        await runTest(API_TESTS[i], i);
        
        // Kort paus mellan tester
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Visa sammanfattning
    showSummary();
    
    // Återställ knappar
    isRunning = false;
    startBtn.disabled = false;
    clearBtn.disabled = false;
    startBtn.textContent = 'Starta tester';
    
    document.getElementById('currentTest').textContent = 'Alla tester slutförda! 🎉';
}

function showSummary() {
    const totalTests = testResults.length;
    const successTests = testResults.filter(r => r.success).length;
    const errorTests = totalTests - successTests;
    const totalTime = Date.now() - totalStartTime;
    
    document.getElementById('totalTests').textContent = totalTests;
    document.getElementById('successTests').textContent = successTests;
    document.getElementById('errorTests').textContent = errorTests;
    document.getElementById('totalTime').textContent = `${totalTime}ms`;
    
    document.getElementById('summary').style.display = 'block';
}

function clearResults() {
    if (isRunning) return;
    
    document.getElementById('testResults').innerHTML = '';
    document.getElementById('summary').style.display = 'none';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressBar').textContent = '0%';
    document.getElementById('currentTest').textContent = '';
    testResults = [];
    currentTestIndex = 0;
}

// Initiera sidan
document.addEventListener('DOMContentLoaded', function() {
    console.log('API Test Suite laddad och redo!');
});