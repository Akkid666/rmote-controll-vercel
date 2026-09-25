import "./style.css";

document.querySelector("#app").innerHTML = `
  <header>
    <h1>Remote PC</h1>
    <div id="status">
      ● Waiting for host
    </div>
  </header>

  <main>
    <section class="screen-panel">
      <div class="panel-header">
        <span>Host Screen</span>
        <span id="screenStatus">Waiting...</span>
      </div>

      <div id="screen">
        <div class="waiting">
          <div class="spinner"></div>
          <p>Waiting for host...</p>
        </div>
      </div>
    </section>

    <section class="terminal-panel">
      <div class="panel-header">
        <span>Terminal</span>
        <span>Not connected</span>
      </div>

      <div id="terminal">
        Host has not connected.
      </div>
    </section>
  </main>
`;

const status = document.querySelector("#status");
const screenStatus = document.querySelector("#screenStatus");
const screen = document.querySelector("#screen");

let socket = null;

function connectToRelay() {
    /*
     * The actual WebSocket/relay URL goes here.
     *
     * Example:
     * const url = "wss://your-relay.example.com";
     */

    const url = "wss://YOUR-RELAY-SERVER";

    try {
        socket = new WebSocket(url);

        socket.addEventListener("open", () => {
            status.textContent = "● Connected";
            screenStatus.textContent = "Waiting for host";

            socket.send(JSON.stringify({
                type: "client",
                action: "discover-host"
            }));
        });

        socket.addEventListener("message", async (event) => {
            let message;

            try {
                message = JSON.parse(event.data);
            } catch {
                return;
            }

            if (message.type === "host-online") {
                status.textContent = "● Host found";
                screenStatus.textContent = "Connecting...";
            }

            if (message.type === "screen") {
                displayScreen(message.data);
            }
        });

        socket.addEventListener("close", () => {
            status.textContent = "● Disconnected";
            screenStatus.textContent = "Waiting for host";
        });

        socket.addEventListener("error", () => {
            status.textContent = "● Connection error";
        });

    } catch {
        status.textContent = "● Unable to connect";
    }
}

function displayScreen(data) {
    if (!data) return;

    const image = document.createElement("img");

    image.src = `data:image/jpeg;base64,${data}`;

    image.onload = () => {
        screen.replaceChildren(image);
        screenStatus.textContent = "Live";
    };
}

connectToRelay();
