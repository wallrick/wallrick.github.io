(function () {
  "use strict";

  var storageKey = "personal-blog-theme";
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Read the current root attribute so the button always reflects the rendered palette.
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  // Persist only an explicit visitor choice; an unset value continues following the system.
  function saveTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Private browsing modes can deny storage without preventing the toggle from working.
    }
  }

  // Keep the accessible label and pressed state synchronized with the selected theme.
  function updateButton(button) {
    var theme = currentTheme();
    var nextTheme = theme === "dark" ? "light" : "dark";

    button.textContent = nextTheme === "dark" ? "Dark mode" : "Light mode";
    button.setAttribute(
      "aria-label",
      nextTheme === "dark" ? "Switch to dark mode" : "Switch to light mode"
    );
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  // Add the control to Minima's existing header so no theme layout fork is required.
  function createToggle() {
    var header = document.querySelector(".site-header .wrapper");
    var button;

    if (!header || document.querySelector(".theme-toggle")) {
      return;
    }

    button = document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";
    button.addEventListener("click", function () {
      var nextTheme = currentTheme() === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      saveTheme(nextTheme);
      updateButton(button);
    });

    header.appendChild(button);
    updateButton(button);
  }

  // Follow later operating-system changes only when the visitor has not chosen a theme.
  function followSystemPreference(event) {
    var button;

    try {
      if (!window.localStorage.getItem(storageKey)) {
        document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light");
        button = document.querySelector(".theme-toggle");
        if (button) {
          updateButton(button);
        }
      }
    } catch (error) {
      document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light");
    }
  }

  document.addEventListener("DOMContentLoaded", createToggle);

  // Support both modern and older browser MediaQueryList event APIs.
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", followSystemPreference);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(followSystemPreference);
  }
}());
