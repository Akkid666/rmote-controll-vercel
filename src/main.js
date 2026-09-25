import "./style.css";

document.querySelector("#app").innerHTML = `
  <header>
    <h1>Remote PC</h1>
    <span id="status">● Disconnected</span>
  </header>

  <main>
    <section class="connection">
      <h2>Connect</h2>

      <input
        id="host"
        placeholder="http://192.168.1.50:8080"
      >

      <input
        id="token"
        type="password"
        placeholder="Access token"
      >

      <button id="connect">Connect</button>
    </section>

    <section class="screen-panel">
      <div class="screen-header">
        <span>Host Screen</span>
        <span id="screenStatus">Disconnected</span>
      </div>

      <div id="screen">
        <span>Not connected</span>
      </div>
    </section>
  </main>
`;

const hostInput = document.querySelector("#host");
const tokenInput = document.querySelector("#token");
const connectButton = document.querySelector("#connect");

const status = document.querySelector("#status");
const screenStatus = document.querySelector("#screenStatus");
const screen = document.querySelector("#screen");

let timer = null;

connectButton.addEventListener("click", () => {
    const host = hostInput.value.trim().replace(/\/$/, "");
    const token = tokenInput.value.trim();

    if (!host || !token) {
        alert("Enter the host address and access token.");
        return;
    }

    if (timer) {
        clearInterval(timer);
    }

    status.textContent = "● Connecting...";
    screenStatus.textContent = "Connecting...";

    const updateScreen = async () => {
        try {
            const response = await fetch(
                `${host}/screen?token=${encodeURIComponent(token)}&t=${Date.now()}`
            );

            if (!response.ok) {
                throw new Error("Connection failed");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const oldImage = screen.querySelector("img");

            const img = document.createElement("img");
            img.src = url;

            img.onload = () => {
                if (oldImage) {
                    oldImage.remove();
                }

                screen.replaceChildren(img);
                URL.revokeObjectURL(url);
            };

            status.textContent = "● Connected";
            screenStatus.textContent = "Live";
        } catch (error) {
            status.textContent = "● Disconnected";
            screenStatus.textContent = "Connection failed";
        }
    };

    updateScreen();

    // Update approximately twice per second.
    timer = setInterval(updateScreen, 500);
});
