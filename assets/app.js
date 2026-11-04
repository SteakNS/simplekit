
// ==========================================
// SIMPLEKIT - MAIN JAVASCRIPT
// ==========================================

// Theme toggle: remembers light/dark preference
(function setupTheme() {
  const savedTheme = localStorage.getItem("simplekit-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  document.documentElement.dataset.theme = savedTheme || preferredTheme;

  document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.querySelector("#theme-toggle");

    function updateButton() {
      if (!themeButton) return;

      const isDark = document.documentElement.dataset.theme === "dark";
      themeButton.textContent = isDark ? "☀️ Light" : "🌙 Dark";
      themeButton.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }

    updateButton();

    themeButton?.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme;
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem("simplekit-theme", nextTheme);
      updateButton();
    });
  });
})();


// ==========================================
// HOMEPAGE SEARCH
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#tool-search");
  const toolCards = document.querySelectorAll(".tool-card");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    toolCards.forEach((card) => {
      const searchableText = card.textContent.toLowerCase();
      card.style.display = searchableText.includes(searchTerm) ? "" : "none";
    });
  });
});


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getNumber(id) {
  const element = document.getElementById(id);
  if (!element) return NaN;

  const value = element.value.trim();
  if (value === "") return NaN;

  return Number(value);
}

function showResult(message, elementId = "result") {
  const result = document.getElementById(elementId);
  if (!result) return;

  result.innerHTML = message;
  result.classList.add("show");
}

function formatNumber(number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6
  }).format(number);
}


// ==========================================
// PERCENTAGE CALCULATOR
// ==========================================

function calculatePercentage() {
  const mode = document.getElementById("percentage-mode")?.value || "percent-of";
  const first = getNumber("percentage-first");
  const second = getNumber("percentage-second");

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    showResult("Please enter both numbers.");
    return;
  }

  let answer;
  let label;

  if (mode === "percent-of") {
    answer = (first / 100) * second;
    label = `${formatNumber(first)}% of ${formatNumber(second)}`;
  } else if (mode === "what-percent") {
    if (second === 0) {
      showResult("The second number cannot be zero for this calculation.");
      return;
    }

    answer = (first / second) * 100;
    label = `${formatNumber(first)} is what percentage of ${formatNumber(second)}?`;
  } else {
    answer = second - first;
    label = "Percentage change";

    if (first === 0) {
      showResult("Percentage change cannot be calculated from a starting value of zero.");
      return;
    }

    answer = ((second - first) / Math.abs(first)) * 100;
  }

  showResult(`
    <div>${label}</div>
    <strong>${formatNumber(answer)}${mode === "percent-of" ? "" : "%"}</strong>
  `);
}


// ==========================================
// DISCOUNT CALCULATOR
// ==========================================

function calculateDiscount() {
  const price = getNumber("original-price");
  const discount = getNumber("discount-percent");

  if (!Number.isFinite(price) || !Number.isFinite(discount) ||
      price < 0 || discount < 0 || discount > 100) {
    showResult("Enter a valid price and a discount between 0 and 100.");
    return;
  }

  const savings = price * (discount / 100);
  const finalPrice = price - savings;

  showResult(`
    <div>You save</div>
    <strong>${formatNumber(savings)}</strong>
    <p>Final price: <strong>${formatNumber(finalPrice)}</strong></p>
  `);
}


// ==========================================
// AVERAGE CALCULATOR
// ==========================================

function calculateAverage() {
  const input = document.getElementById("average-numbers");

  if (!input || !input.value.trim()) {
    showResult("Please enter some numbers.");
    return;
  }

  const values = input.value
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number);

  if (!values.length || values.some((number) => !Number.isFinite(number))) {
    showResult("Please enter only valid numbers, separated by commas or spaces.");
    return;
  }

  const sum = values.reduce((total, number) => total + number, 0);
  const mean = sum / values.length;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  const median = sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];

  showResult(`
    <div class="stats-grid">
      <div class="stat">
        <strong>${formatNumber(mean)}</strong>
        <span>Mean (average)</span>
      </div>
      <div class="stat">
        <strong>${formatNumber(median)}</strong>
        <span>Median</span>
      </div>
      <div class="stat">
        <strong>${formatNumber(sum)}</strong>
        <span>Sum</span>
      </div>
      <div class="stat">
        <strong>${values.length}</strong>
        <span>Count</span>
      </div>
    </div>
  `);
}


// ==========================================
// WORD COUNTER
// ==========================================

function countWords() {
  const text = document.getElementById("word-text")?.value || "";

  const words = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const sentences = text.trim()
    ? (text.match(/[.!?]+(?=\s|$)/g) || []).length
    : 0;

  const paragraphs = text.trim()
    ? text.trim().split(/\n\s*\n/).filter(Boolean).length
    : 0;

  const readingTime = Math.ceil(words / 200);

  showResult(`
    <div class="stats-grid">
      <div class="stat">
        <strong>${words}</strong>
        <span>Words</span>
      </div>
      <div class="stat">
        <strong>${characters}</strong>
        <span>Characters</span>
      </div>
      <div class="stat">
        <strong>${charactersNoSpaces}</strong>
        <span>Characters without spaces</span>
      </div>
      <div class="stat">
        <strong>${sentences}</strong>
        <span>Sentences detected</span>
      </div>
      <div class="stat">
        <strong>${paragraphs}</strong>
        <span>Paragraphs</span>
      </div>
      <div class="stat">
        <strong>${readingTime} min</strong>
        <span>Estimated reading time</span>
      </div>
    </div>
  `);
}


// ==========================================
// UNIT CONVERTER
// ==========================================

const conversionUnits = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254
  },

  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.45359237,
    ounce: 0.028349523125
  },

  volume: {
    liter: 1,
    milliliter: 0.001,
    "cubic meter": 1000,
    "US gallon": 3.785411784,
    "US cup": 0.2365882365
  }
};

function updateUnitOptions() {
  const category = document.getElementById("unit-category")?.value;
  const fromSelect = document.getElementById("unit-from");
  const toSelect = document.getElementById("unit-to");

  if (!category || !fromSelect || !toSelect) return;

  const units = conversionUnits[category];

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  Object.keys(units).forEach((unit) => {
    fromSelect.add(new Option(unit, unit));
    toSelect.add(new Option(unit, unit));
  });

  if (Object.keys(units).length > 1) {
    toSelect.selectedIndex = 1;
  }
}

function convertUnits() {
  const category = document.getElementById("unit-category")?.value;
  const from = document.getElementById("unit-from")?.value;
  const to = document.getElementById("unit-to")?.value;
  const amount = getNumber("unit-value");

  if (!Number.isFinite(amount)) {
    showResult("Please enter a valid number.");
    return;
  }

  let answer;

  if (category === "temperature") {
    if (from === to) {
      answer = amount;
    } else if (from === "celsius" && to === "fahrenheit") {
      answer = (amount * 9 / 5) + 32;
    } else if (from === "fahrenheit" && to === "celsius") {
      answer = (amount - 32) * 5 / 9;
    } else if (from === "celsius" && to === "kelvin") {
      answer = amount + 273.15;
    } else if (from === "kelvin" && to === "celsius") {
      answer = amount - 273.15;
    } else if (from === "fahrenheit" && to === "kelvin") {
      answer = (amount - 32) * 5 / 9 + 273.15;
    } else if (from === "kelvin" && to === "fahrenheit") {
      answer = (amount - 273.15) * 9 / 5 + 32;
    }
  } else {
    const units = conversionUnits[category];

    if (!units || !units[from] || !units[to]) {
      showResult("Please choose valid units.");
      return;
    }

    answer = amount * units[from] / units[to];
  }

  if (!Number.isFinite(answer)) {
    showResult("That conversion could not be calculated.");
    return;
  }

  showResult(`
    <div>${formatNumber(amount)} ${from} equals</div>
    <strong>${formatNumber(answer)} ${to}</strong>
  `);
}

document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("unit-category");

  if (categorySelect) {
    categorySelect.addEventListener("change", updateUnitOptions);
    updateUnitOptions();
  }
});
