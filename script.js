// Referencias y variables globales
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById("themeToggle");
const moonLogo = document.getElementById("moon-logo");
const sunLogo = document.getElementById("sun-logo");
const moods = document.querySelectorAll(".mood-btn");
const sleepInput = document.getElementById("sleepTime");
const wakeInput = document.getElementById("wakeTime");
const adviceScreen = document.getElementById("adviceScreen");
const adviceText = document.getElementById("adviceText");
const closeBtn = document.getElementById("closeBtn");
const weeklyChart = document.getElementById("weeklyChart");
const weeklyAvg = document.getElementById("weeklyAvg");

let selectedMood = null;
let currentCalculatedHours = 0;

// Cambio de modo y logo
themeToggleBtn.addEventListener("click", () => {
    htmlElement.classList.toggle("dark");
    if (htmlElement.classList.contains("dark")) {
        moonLogo.style.display = "block";
        sunLogo.style.display = "none";
    } else {
        moonLogo.style.display = "none";
        sunLogo.style.display = "block";
    }
});

// Función para mostrar el consejo
function showAdvice(message) {
    adviceText.textContent = message;
    adviceScreen.classList.remove("opacity-0", "pointer-events-none", "scale-105");
    adviceScreen.classList.add("opacity-100", "pointer-events-auto", "scale-100");
    document.body.style.overflow = 'hidden';
}

// Función para ocultar el consejo
function hideAdvice() {
    adviceScreen.classList.remove("opacity-100", "pointer-events-auto", "scale-100");
    adviceScreen.classList.add("opacity-0", "pointer-events-none", "scale-105");
    document.body.style.overflow = '';

    // Aquí puedes guardar los datos si quieres al cerrar
    saveTodayData();

    // Opcional: limpiar inputs y estado
    sleepInput.value = '';
    wakeInput.value = '';
    selectedMood = null;
    moods.forEach(b => {
        b.classList.remove("border-gray-800", "dark:border-moon-light", "bg-gray-100", "dark:bg-moon-section", "scale-110", "shadow-md");
        b.classList.add("border-gray-200", "dark:border-gray-700");
    });
}

// Evento cerrar consejo
closeBtn.addEventListener("click", hideAdvice);

// Función para calcular y generar el consejo
function generateAdvice() {
    const sleep = sleepInput.value;
    const wake = wakeInput.value;
    const sleepHour = Number(sleep.split(":")[0]);
    const wakeHour = Number(wake.split(":")[0]);
    let hours = wakeHour - sleepHour;
    if (hours < 0) hours += 24;

    // Guardamos las horas para guardarlas al cerrar
    currentCalculatedHours = hours;

    let message = '';

    // Mensajes según horas de sueño
    if (hours < 6) {
        message = "You slept very little. Try going to bed earlier for better energy.";
    } else if (hours < 8) {
        message = "Your sleep is okay, but getting closer to 8 hours could improve your mood.";
    } else {
        message = "Great job! You are getting healthy sleep hours.";
    }

    // Mensajes según estado de ánimo
    let moodMsg = '';
    if (selectedMood === "happy") {
        moodMsg = "Keep maintaining these healthy habits!";
    } else if (selectedMood === "okay") {
        moodMsg = "You're doing fine, but a bit more rest would be better.";
    } else if (selectedMood === "tired") {
        moodMsg = "Feeling tired might mean your sleep quality needs improvement.";
    } else if (selectedMood === "stressed") {
        moodMsg = "Since you're feeling stressed, relaxing before bed might help.";
    }

    message += " " + moodMsg;

    showAdvice(message);
}

// Función para guardar los datos en la semana
function saveTodayData() {
    const weeklyData = JSON.parse(localStorage.getItem('sleepTrackerData')) || [null, null, null, null, null, null, null];
    const todayIndex = new Date().getDay();

    if (currentCalculatedHours > 0 && selectedMood) {
        weeklyData[todayIndex] = {
            hours: currentCalculatedHours,
            mood: selectedMood
        };
        localStorage.setItem('sleepTrackerData', JSON.stringify(weeklyData));
        renderChart();
    }
}

// Función para dibujar el gráfico semanal
function renderChart() {
    const weeklyData = JSON.parse(localStorage.getItem('sleepTrackerData')) || [null, null, null, null, null, null, null];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDay = new Date().getDay();

    weeklyChart.innerHTML = '';

    let totalHours = 0;
    let count = 0;

    weeklyData.forEach((data, index) => {
        const container = document.createElement('div');
        container.className = "flex flex-col items-center gap-2 w-full";

        if (data) {
            totalHours += data.hours;
            count++;
            const heightPercent = Math.min((data.hours / 12) * 100, 100);
            let colorClass = "bg-gray-400";
            if(data.mood === "happy") colorClass = "bg-green-400";
            if(data.mood === "okay") colorClass = "bg-blue-400";
            if(data.mood === "stressed") colorClass = "bg-orange-400";
            if(data.mood === "tired") colorClass = "bg-red-400";

            container.innerHTML = `
                <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400">${data.hours}h</span>
                <div class="w-full bg-gray-200 dark:bg-moon-section rounded-full h-full flex items-end overflow-hidden">
                    <div class="${colorClass} rounded-full transition-all duration-1000" style="height: ${heightPercent}%;"></div>
                </div>
                <span class="text-xs font-bold ${index === currentDay ? 'text-gray-900 dark:text-moon-light' : 'text-gray-400'}">${dayNames[index]}</span>
            `;
        } else {
            container.innerHTML = `
                <span class="text-[10px] font-bold text-transparent">-</span>
                <div class="w-full bg-gray-200 dark:bg-moon-section rounded-full h-full border border-dashed border-gray-300 dark:border-gray-700"></div>
                <span class="text-xs font-bold ${index === currentDay ? 'text-gray-900 dark:text-moon-light' : 'text-gray-400'}">${dayNames[index]}</span>
            `;
        }

        weeklyChart.appendChild(container);
    });

    if (count > 0) {
        const avg = (totalHours / count).toFixed(1);
        weeklyAvg.textContent = `Avg: ${avg} h`;
    }
}

// Cargar gráfico al inicio
renderChart();

// Evento para los botones de mood
moods.forEach(btn => {
    btn.addEventListener("click", () => {
        moods.forEach(b => {
            b.classList.remove("border-gray-800", "dark:border-moon-light", "bg-gray-100", "dark:bg-moon-section", "scale-110", "shadow-md");
            b.classList.add("border-gray-200", "dark:border-gray-700");
        });
        btn.classList.remove("border-gray-200", "dark:border-gray-700");
        btn.classList.add("border-gray-800", "dark:border-moon-light", "bg-gray-100", "dark:bg-moon-section", "scale-110", "shadow-md");
        selectedMood = btn.dataset.mood;
        checkInputs();
    });
});

// Validar inputs
sleepInput.addEventListener("change", checkInputs);
wakeInput.addEventListener("change", checkInputs);

function checkInputs() {
    if (sleepInput.value && wakeInput.value && selectedMood) {
        generateAdvice();
    }
}

// Generar consejo
function generateAdvice() {
    const sleep = sleepInput.value;
    const wake = wakeInput.value;
    const sleepHour = Number(sleep.split(":")[0]);
    const wakeHour = Number(wake.split(":")[0]);
    let hours = wakeHour - sleepHour;
    if (hours < 0) hours += 24;

    // guardar horas para usar al cerrar
    currentCalculatedHours = hours;

    let message = '';

    if (hours < 6) {
        message = "You slept very little. Try going to bed earlier for better energy.";
    } else if (hours < 8) {
        message = "Your sleep is okay, but getting closer to 8 hours could improve your mood.";
    } else {
        message = "Great job! You are getting healthy sleep hours.";
    }

    // Frases según estado de ánimo
    let moodMsg = '';
    if (selectedMood === "happy") {
        moodMsg = "Keep maintaining these healthy habits!";
    } else if (selectedMood === "okay") {
        moodMsg = "You're doing fine, but a bit more rest would be better.";
    } else if (selectedMood === "tired") {
        moodMsg = "Feeling tired might mean your sleep quality needs improvement.";
    } else if (selectedMood === "stressed") {
        moodMsg = "Since you're feeling stressed, relaxing before bed might help.";
    }

    message += " " + moodMsg;

    showAdvice(message);
}

// Mostrar consejo
function showAdvice(message) {
    adviceText.textContent = message;
    adviceScreen.classList.remove("opacity-0", "pointer-events-none", "scale-105");
    adviceScreen.classList.add("opacity-100", "pointer-events-auto", "scale-100");
    document.body.style.overflow = 'hidden';
}

// Ocultar consejo
function hideAdvice() {
    adviceScreen.classList.remove("opacity-100", "pointer-events-auto", "scale-100");
    adviceScreen.classList.add("opacity-0", "pointer-events-none", "scale-105");
    document.body.style.overflow = '';

    // Guardar datos en la semana
    saveTodayData();

    // Reset inputs
    sleepInput.value = '';
    wakeInput.value = '';
    selectedMood = null;
    moods.forEach(b => {
        b.classList.remove("border-gray-800", "dark:border-moon-light", "bg-gray-100", "dark:bg-moon-section", "scale-110", "shadow-md");
        b.classList.add("border-gray-200", "dark:border-gray-700");
    });
}

closeBtn.addEventListener("click", hideAdvice);