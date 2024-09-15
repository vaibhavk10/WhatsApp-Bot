<!DOCTYPE html>
<html>
<head>
    <title>Knight WhatsApp Bot</title>
</head>
<body>

<h1>🤖 Knight WhatsApp Bot</h1>

<p>This is a WhatsApp bot built using the Baileys library for group management, including features like tagging all members, muting/unmuting, and many more. It's designed to help admins efficiently manage WhatsApp groups.</p>

<h2>⚙️ Features</h2>
<ul>
    <li><strong>Tag all group members</strong> with the <code>.tagall</code> command</li>
    <li><strong>Admin restricted usage</strong> (Only group admins can use certain commands)</li>
    <li><strong>Games</strong> like Tic-Tac-Toe for interactive group engagement</li>
    <li><strong>Text-to-Speech</strong> with <code>.tts</code></li>
    <li><strong>Sticker creation</strong> with <code>.sticker</code></li>
    <li><strong>Anti-link detection</strong> for group safety</li>
    <li><strong>Warn and manage group members</strong> with admin control</li>
</ul>

<hr>

<h2>📖 About</h2>
<p>The Knight WhatsApp Bot assists group admins by providing them with tools to efficiently manage large WhatsApp groups. The bot uses the Baileys library to interact with the WhatsApp Web API and supports multi-device features.</p>

<p>It is lightweight and can be easily customized to add more commands as per your requirements. The bot runs in a Node.js environment and provides QR code-based authentication to link your WhatsApp account.</p>

<hr>

<h2>One-click Deployment on Replit</h2>
<p>You can easily deploy this WhatsApp bot on Replit with one click. Replit will automatically install the necessary dependencies and give you a web environment to run the bot.</p>

<a href="https://replit.com/github/vaibhavk10/Whatsapp-TagAll-Bot"><img src="https://replit.com/badge/github/vaibhavk10/Whatsapp-TagAll-Bot" alt="Run on Replit"></a>

<hr>

<h2>🛠️ Setup & Installation</h2>

<h3>Prerequisites</h3>
<ul>
    <li>Node.js installed on your system</li>
    <li>Git installed (for cloning the repository)</li>
</ul>

<h3>Step-by-Step Setup</h3>
<ol>
    <li><strong>Clone the repository:</strong>
        <pre><code>git clone https://github.com/vaibhavk10/Whatsapp-TagAll-Bot.git
cd Whatsapp-TagAll-Bot
</code></pre>
    </li>
    <li><strong>Install the dependencies:</strong>
        <pre><code>npm install</code></pre>
    </li>
    <li><strong>Run the bot:</strong>
        <pre><code>node index.js</code></pre>
    </li>
    <li><strong>Scan the QR code:</strong>
        <p>Once the bot starts, a QR code will appear in the terminal. Scan this QR code using the Linked Devices feature in WhatsApp to connect your WhatsApp account with the bot.</p>
    </li>
</ol>

<hr>

<h2>📝 Commands</h2>

<h3>General Commands:</h3>
<ul>
    <li><code>.help</code> or <code>.menu</code></li>
    <li><code>.tts &lt;text&gt;</code></li>
    <li><code>.sticker</code> or <code>.s</code></li>
    <li><code>.owner</code></li>
</ul>

<h3>Admin Commands:</h3>
<ul>
    <li><code>.ban @user</code></li>
    <li><code>.promote @user</code></li>
    <li><code>.demote @user</code></li>
    <li><code>.mute &lt;minutes&gt;</code></li>
    <li><code>.unmute</code></li>
    <li><code>.delete</code> or <code>.del</code></li>
</ul>

<h3>Game Commands:</h3>
<ul>
    <li><code>.tictactoe @user</code></li>
    <li><code>.move &lt;position&gt;</code></li>
</ul>

<h3>Group Management:</h3>
<ul>
    <li><code>.tagall</code></li>
</ul>

<h3>Other:</h3>
<ul>
    <li><code>.topmembers</code></li>
</ul>

<hr>

<h2>📄 License</h2>

<p>This project is licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a> - see the <a href="https://github.com/vaibhavk10/Whatsapp-TagAll-Bot/blob/main/LICENSE" target="_blank">LICENSE</a> file for details.</p>

<hr>

<h2>🙌 Contributions</h2>
<p>Contributions, issues, and feature requests are welcome! Feel free to check the <a href="https://github.com/vaibhavk10/Whatsapp-TagAll-Bot/issues" target="_blank">issues page</a>.</p>

<hr>

<h2>🌟 Show your support</h2>
<p>If you like this project, please give it a <a href="https://github.com/vaibhavk10/Whatsapp-TagAll-Bot" target="_blank">⭐️ star on GitHub</a>!</p>

</body>
</html>
