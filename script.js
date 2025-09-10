

document.addEventListener("DOMContentLoaded", () => {
  const fromCurrency = document.getElementById("fromCurrency");
  const toCurrency = document.getElementById("toCurrency");
  const fromDatalist = document.getElementById("fromCurrencies");
  const toDatalist = document.getElementById("toCurrencies");
  const amountInput = document.getElementById("amount");
  const resultDiv = document.getElementById("result");
  const swapBtn = document.getElementById("swapBtn");
  const lastUpdatedDiv = document.getElementById("lastUpdated");
  const clearBtn = document.getElementById("clearBtn");

  let ratesData = {};
  let lastUpdatedTime = "";

  // Fetching currency rates
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(res => res.json())
    .then(data => {
      if (!data || !data.rates) {
        resultDiv.textContent = "Error loading currencies.";
        return;
      }

      ratesData = data.rates;
      lastUpdatedTime = data.time_last_update_utc;

      const currencies = Object.keys(ratesData);
      
      // Populate datalists
      currencies.forEach(code => {
        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.value = code;
        option2.value = code;
        fromDatalist.appendChild(option1);
        toDatalist.appendChild(option2);
      });

      // Default values
      fromCurrency.value = "USD";
      toCurrency.value = "EUR";

      if (amountInput.value) convertCurrency();
    })
    .catch(err => {
      console.error("Error fetching rates:", err);
      resultDiv.textContent = "Unable to load currency list.";
    });

  // Conversion function
  function convertCurrency() {
    const from = fromCurrency.value.toUpperCase();
    const to = toCurrency.value.toUpperCase();
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      resultDiv.textContent = "Please enter a valid amount.";
      lastUpdatedDiv.textContent = "";
      return;
    }

    if (!ratesData[from] || !ratesData[to]) {
      resultDiv.textContent = "Currency not supported.";
      lastUpdatedDiv.textContent = "";
      return;
    }

    const usdAmount = amount / ratesData[from];
    const converted = usdAmount * ratesData[to];

    resultDiv.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;

    const dateObj = new Date(lastUpdatedTime);
    const formatted = dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC"
    });

    lastUpdatedDiv.textContent = `Rates last updated (UTC): ${formatted}`;
  }

  // Auto-convert when typing or changing inputs
  amountInput.addEventListener("input", convertCurrency);
  fromCurrency.addEventListener("input", convertCurrency);
  toCurrency.addEventListener("input", convertCurrency);

  // Swappping currencies
  swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convertCurrency();
  });

  // Clearing inputs
  clearBtn.addEventListener("click", () => {
    amountInput.value = "";
    resultDiv.textContent = "";
    lastUpdatedDiv.textContent = "";
  });
});

