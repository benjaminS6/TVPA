async function translateText(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result[0][0][0];  // Google Translate API isubiza text yahinduwe
    } catch (error) {
        console.error("Translation Error:", error);
        return text; // Niba translation itagenze neza, dusubiza text y'inyuma
    }
}

// Function yo guhindura amagambo ari kuri page yose
async function translatePage(targetLang) {
    const elements = document.querySelectorAll("[data-translate]");

    for (let element of elements) {
        const originalText = element.getAttribute("data-original-text") || element.innerText;

        if (!element.getAttribute("data-original-text")) {
            element.setAttribute("data-original-text", originalText);
        }

        const translatedText = await translateText(originalText, targetLang);
        element.innerText = translatedText;
    }

    // Kubika ururimi user yahisemo muri LocalStorage
    localStorage.setItem("selectedLang", targetLang);
}

// Iyo user ahinduye ururimi, duhita duhinduira page
document.querySelectorAll('input[name="language"]').forEach((radio) => {
    radio.addEventListener("change", function () {
        translatePage(this.value);
    });
});

// Iyo page ifunguwe, tureba niba hari ururimi user yari yahisemo mbere
document.addEventListener("DOMContentLoaded", function () {
    let savedLang = localStorage.getItem("selectedLang") || "en";

    // Gushiraho radio button yari yahiswemo mbere
    let langRadio = document.querySelector(`input[name="language"][value="${savedLang}"]`);
    if (langRadio) {
        langRadio.checked = true;
    }

    translatePage(savedLang);
});

// ✅ Function yo gusubiza ururimi kuri default (English)
function resetLanguage() {
    localStorage.setItem("selectedLang", "en"); // Tugarura English
    document.querySelector(`input[name="language"][value="en"]`).checked = true;
    translatePage("en"); // Dusubiza amagambo yose kuri English
}

// ✅ Gushyiraho event kuri button ya "Reset Language"
document.addEventListener("DOMContentLoaded", function () {
    let resetButton = document.getElementById("reset-language");
    if (resetButton) {
        resetButton.addEventListener("click", resetLanguage);
    }
});
