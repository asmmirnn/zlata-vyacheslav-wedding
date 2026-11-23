
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrBmeCUZL8fJnIs2X5n-FavSRFi5xN-8miXMcM5UliaSiAAS2ib6roxPsxS7zh73w/exec";

const form = document.getElementById("guest-form");
const message = document.getElementById("form-message");
const button = form.querySelector('button[type="submit"]');

const attendanceRadios = document.querySelectorAll(
    'input[name="attendance"]'
);

const plusOneLabel = document.querySelector(".plus-one");
const plusOneCheckbox = document.querySelector(
    'input[name="plusOne"]'
);

// Показываем +1 только если гость придёт
function updatePlusOne() {
    const attendance = document.querySelector(
        'input[name="attendance"]:checked'
    );

    const isComing = attendance?.value === "yes";

    plusOneLabel.style.display = isComing ? "flex" : "none";

    if (!isComing) {
        plusOneCheckbox.checked = false;
    }
}

attendanceRadios.forEach(radio => {
    radio.addEventListener("change", updatePlusOne);
});

updatePlusOne();

// Отправка анкеты
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const name = document.getElementById("guest-name")
        .value.trim();

    if (!name) {
        message.textContent = "Пожалуйста, укажите ФИО";
        return;
    }

    const attendance = document.querySelector(
        'input[name="attendance"]:checked'
    ).value;

    const plusOne = plusOneCheckbox.checked;

    const data = new URLSearchParams({
        guestName: name,
        attendance: attendance,
        plusOne: plusOne ? "yes" : "no"
    });

    button.disabled = true;
    button.textContent = "ОТПРАВКА...";
    message.textContent = "";

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: data
        });

        message.textContent =
            "Спасибо за ответ!";

        form.reset();
        updatePlusOne();

    } catch (error) {
        message.textContent =
            "Ошибка отправки. Попробуйте ещё раз.";
    } finally {
        button.disabled = false;
        button.textContent = "ОТПРАВИТЬ";
    }
});
