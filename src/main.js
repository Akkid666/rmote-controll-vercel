import "./style.css";

document.querySelector("#app").innerHTML = `
  <header>
    <h1>Remote PC</h1>
    <span id="status">● Disconnected</span>
  </header>

  <main>
    <section class="connection">
      <h2>Connect to PC</h2>

      <input
        id="hostCode"
        type="text"
        placeholder="Enter host code"
        maxlength="8"
      >

      <button id="connect">Connect</button>
    </section>

    <section class="screen">
      <div class="screen-header">
        <span>Host Screen</span>
        <span id="screenStatus">Waiting for host...</span>
      </div>

      <div id="screen">
        <p>No host connected</p>
      </div>
    </section>

    <section class="terminal">
      <h2>Terminal</h2>

      <div id="terminalOutput">
        Remote terminal is not connected.
      </div>

      <div class="terminal-input">
        <input
          id="command"
          type="text"
          placeholder="Command..."
        >
        <button id="sendCommand">Send</button>
      </div>
    </section>
  </main>
`;

const status = document.querySelector("#status");
const connectButton = document.querySelector("#connect");

connectButton.addEventListener("click", () => {
  const code = document.querySelector("#hostCode").value.trim();

  if (!code) {
    alert("Enter a host code.");
    return;
  }

  status.textContent = "● Connection requested";
  document.querySelector("#screenStatus").textContent =
    "Waiting for host approval...";
});