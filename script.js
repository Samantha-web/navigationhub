

      // Password validation and user mapping
      const userCredentials = {
        samantha: "1830",
        atik: "0010",
        ali: "7012",
        nazrul: "6022",
        abser: "0024",
        subas: "0015",
      };

      let accessLog = [];
      let attempts = 0;
      const maxAttempts = 5;

      document.addEventListener("DOMContentLoaded", function () {
        const loginModal = document.getElementById("loginModal");
        const mainContent = document.getElementById("mainContent");
        const usernameInput = document.getElementById("usernameInput");
        const passwordInput = document.getElementById("passwordInput");
        const submitBtn = document.getElementById("submitBtn");
        const errorMessage = document.getElementById("errorMessage");
        const loggedInUser = document.getElementById("loggedInUser");
        const accessLogElement = document.getElementById("accessLog");

        // Focus on username input when modal appears
        usernameInput.focus();

        // Submit credentials on button click
        submitBtn.addEventListener("click", validateCredentials);

        // Also submit on Enter key
        passwordInput.addEventListener("keyup", function (event) {
          if (event.key === "Enter") {
            validateCredentials();
          }
        });

        function validateCredentials() {
          const username = usernameInput.value.trim().toLowerCase();
          const password = passwordInput.value.trim();

          if (username && password) {
            if (
              userCredentials[username] &&
              userCredentials[username] === password
            ) {
              // Correct credentials

              // Log access
              const loginTime = new Date();
              const logEntry = {
                username: username,
                time: loginTime.toLocaleString(),
                action: "Login successful",
              };

              accessLog.push(logEntry);
              updateAccessLog();

              // Store in session
              sessionStorage.setItem("authenticated", "true");
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("accessLog", JSON.stringify(accessLog));

              // Show username
              loggedInUser.textContent = username;

              // Hide modal and show content
              loginModal.style.display = "none";
              mainContent.classList.remove("hidden");
            } else {
              // Incorrect credentials
              handleFailedAttempt();
            }
          } else {
            errorMessage.textContent =
              "Please enter both username and password.";
            usernameInput.classList.add("shake");
            passwordInput.classList.add("shake");

            setTimeout(() => {
              usernameInput.classList.remove("shake");
              passwordInput.classList.remove("shake");
            }, 500);
          }
        }

        function handleFailedAttempt() {
          attempts++;
          errorMessage.textContent =
            "Invalid credentials. Please try again.";
          usernameInput.classList.add("shake");
          passwordInput.classList.add("shake");
          passwordInput.value = "";

          // Clear animation class after animation completes
          setTimeout(() => {
            usernameInput.classList.remove("shake");
            passwordInput.classList.remove("shake");
          }, 500);

          // After max attempts, disable the inputs temporarily
          if (attempts >= maxAttempts) {
            errorMessage.textContent =
              "Too many failed attempts. Please try again in 30 seconds.";
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            submitBtn.disabled = true;

            setTimeout(() => {
              usernameInput.disabled = false;
              passwordInput.disabled = false;
              submitBtn.disabled = false;
              errorMessage.textContent = "";
              attempts = 0;
              usernameInput.value = "";
              passwordInput.value = "";
              usernameInput.focus();
            }, 30000); // 30-second lockout
          }
        }

        function updateAccessLog() {
          accessLogElement.innerHTML = "";
          accessLog
            .slice()
            .reverse()
            .forEach((entry) => {
              const logItem = document.createElement("div");
              logItem.className = "mb-2 last:mb-0";
              logItem.innerHTML = `
                        <div class="font-medium">${entry.username}</div>
                        <div class="text-xs text-slate-400">${entry.time}</div>
                        <div class="text-xs text-green-400">${entry.action}</div>
                    `;
              accessLogElement.appendChild(logItem);
            });
        }

        // Check if already authenticated in this session
        if (sessionStorage.getItem("authenticated") === "true") {
          const username = sessionStorage.getItem("username");
          loggedInUser.textContent = username;

          // Retrieve access log
          const storedLog = sessionStorage.getItem("accessLog");
          if (storedLog) {
            accessLog = JSON.parse(storedLog);
            updateAccessLog();
          }

          loginModal.style.display = "none";
          mainContent.classList.remove("hidden");
        }
      });

      // Add hover effects for mobile touch
      document.querySelectorAll(".nav-button").forEach((button) => {
        button.addEventListener("touchstart", function () {
          this.classList.add("hover:translate-y-[-8px]");
          setTimeout(() => {
            this.classList.remove("hover:translate-y-[-8px]");
          }, 300);
        });
      });
