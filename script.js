const weddingDate = new Date("2026-09-12T18:00:00+05:00");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const openInvite = document.getElementById("openInvite");

async function playMusic() {
  if (!bgMusic) return;

  try {
    bgMusic.volume = 0.5;
    await bgMusic.play();
    musicToggle?.classList.add("is-playing");
    musicToggle?.setAttribute("aria-label", "Музыканы өшіру");
  } catch {
    musicToggle?.classList.remove("is-playing");
  }
}

openInvite?.addEventListener("click", async () => {
  document.body.classList.add("invite-opened");
  document.body.classList.remove("is-locked");
  await playMusic();
});

musicToggle?.addEventListener("click", async () => {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    await playMusic();
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-label", "Музыканы қосу");
  }
});

const timerParts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function setTimerValue(element, value) {
  if (!element || element.textContent === value) return;

  element.textContent = value;
}

function updateTimer() {
  const difference = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setTimerValue(timerParts.days, String(days));
  setTimerValue(timerParts.hours, String(hours).padStart(2, "0"));
  setTimerValue(timerParts.minutes, String(minutes).padStart(2, "0"));
  setTimerValue(timerParts.seconds, String(seconds).padStart(2, "0"));
}

updateTimer();
setInterval(updateTimer, 1000);

const revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const form = document.getElementById("rsvpForm");
const result = document.getElementById("rsvpResult");
const whatsappLink = document.getElementById("whatsappLink");
const partnerField = document.getElementById("partnerField");
const partnerNameInput = document.getElementById("partnerName");
const guestNameInput = document.getElementById("guestName");

function getAttendance() {
  return new FormData(form).get("attendance");
}

function updatePartnerField() {
  const isWithPartner = getAttendance() === "Жұбайыммен келемін";
  partnerField.classList.toggle("is-visible", isWithPartner);
  partnerNameInput.required = isWithPartner;

  if (!isWithPartner) partnerNameInput.value = "";
}

function updateWhatsappLink() {
  const guestName = guestNameInput.value.trim();
  const attendance = getAttendance();
  const partnerName = partnerNameInput.value.trim();
  const needsPartnerName = attendance === "Жұбайыммен келемін";
  const isReady = guestName && (!needsPartnerName || partnerName);

  if (!isReady) {
    whatsappLink.href = "#";
    whatsappLink.setAttribute("aria-disabled", "true");
    return;
  }

  const partnerText = needsPartnerName
    ? ` Жұбайымның аты-жөні: ${partnerName}.`
    : "";
  const message =
    `Сәлеметсіз бе! Менің аты-жөнім: ${guestName}. ` +
    `Төлеген мен Даринаның үйлену тойына жауабым: ${attendance}.${partnerText}`;

  whatsappLink.href = `https://wa.me/77788181981?text=${encodeURIComponent(message)}`;
  whatsappLink.setAttribute("aria-disabled", "false");
  result.textContent = "";
}

form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("input", updateWhatsappLink);
form.addEventListener("change", () => {
  updatePartnerField();
  updateWhatsappLink();
});

whatsappLink.addEventListener("click", (event) => {
  updateWhatsappLink();

  if (whatsappLink.getAttribute("aria-disabled") !== "true") return;

  event.preventDefault();
  result.textContent = !guestNameInput.value.trim()
    ? "Алдымен аты-жөніңізді жазыңыз."
    : "Жұбайыңыздың аты-жөнін жазыңыз.";
});

updatePartnerField();

const scrollProgress = document.getElementById("scrollProgress");
let progressFrame = 0;

function updateScrollProgress() {
  progressFrame = 0;
  if (!scrollProgress) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

window.addEventListener(
  "scroll",
  () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);

window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();
