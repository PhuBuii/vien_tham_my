document.querySelectorAll(".tabs").forEach((tabGroup) => {
  const group = tabGroup.dataset.group;

  tabGroup.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      tabGroup
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(`[id^="${group}-"]`)
        .forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
});
