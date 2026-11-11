
/*
=========================================================
 BE MESSAGE - USER SYSTEM
=========================================================

File:
js/user.js

Fungsi:
1. Mengelola dropdown username.
2. Mengirim pesan anonim.
3. Login pengguna.
4. Menampilkan inbox.
5. Menampilkan pesan ALL dan pesan pribadi.
6. Logout pengguna.
7. Show / Hide password.
8. Character counter.
9. Toast notifications.

Dependencies:
- storage.js

=========================================================
*/


// =======================================================
// 1. DOM ELEMENTS
// =======================================================

const recipientSelect = document.getElementById("recipient");

const messageForm = document.getElementById("messageForm");

const messageText = document.getElementById("messageText");

const characterCount = document.getElementById("characterCount");

const sendMessageStatus = document.getElementById("sendMessageStatus");

const sendMessageButton = document.getElementById("sendMessageButton");


const loginForm = document.getElementById("loginForm");

const loginUsername = document.getElementById("loginUsername");

const loginPassword = document.getElementById("loginPassword");

const togglePassword = document.getElementById("togglePassword");

const loginStatus = document.getElementById("loginStatus");

const openInboxButton = document.getElementById("openInboxButton");


const inboxResults = document.getElementById("inboxResults");

const inboxWelcome = document.getElementById("inboxWelcome");

const inboxDescription = document.getElementById("inboxDescription");

const inboxMessageCount = document.getElementById("inboxMessageCount");

const messageList = document.getElementById("messageList");

const logoutButton = document.getElementById("logoutButton");


const toastContainer = document.getElementById("toastContainer");


// =======================================================
// 2. CURRENT USER SESSION
// =======================================================

let currentUser = null;


// =======================================================
// 3. HELPER FUNCTIONS
// =======================================================


// Show form status

function showStatus(element, message, type) {

    if (!element) return;

    element.textContent = message;

    element.className = "form-status " + type;

}


// Clear form status

function clearStatus(element) {

    if (!element) return;

    element.textContent = "";

    element.className = "form-status";

}


// Show toast notification

function showToast(message, type = "success") {

    if (!toastContainer) return;

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    const icon = document.createElement("i");

    icon.setAttribute(
        "data-lucide",
        type === "success" ? "check-circle" : "alert-circle"
    );

    const text = document.createElement("span");

    text.textContent = message;

    toast.appendChild(icon);

    toast.appendChild(text);

    toastContainer.appendChild(toast);

    if (window.lucide) {
        lucide.createIcons({
            nodes: [toast]
        });
    }

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform = "translateX(20px)";

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);

}


// Format date

function formatMessageDate(dateValue) {

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleString("id-ID", {

        day: "numeric",

        month: "long",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    });

}


// Escape HTML to prevent HTML injection

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        };

        return entities[character];

    });

}


// Refresh Lucide icons

function refreshIcons() {

    if (window.lucide) {
        lucide.createIcons();
    }

}


// =======================================================
// 4. POPULATE RECIPIENT DROPDOWN
// =======================================================

function populateRecipientDropdown() {

    if (!recipientSelect) return;

    const users = UserManager.getAll();

    // Preserve ALL option
    recipientSelect.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.disabled = true;

    defaultOption.selected = true;

    defaultOption.textContent = "Choose a recipient...";

    recipientSelect.appendChild(defaultOption);


    const allOption = document.createElement("option");

    allOption.value = "ALL";

    allOption.textContent = "✨ ALL — Everyone";

    recipientSelect.appendChild(allOption);


    // Separator
    const separator = document.createElement("option");

    separator.disabled = true;

    separator.textContent = "──────────────";

    recipientSelect.appendChild(separator);


    // Add users
    users.forEach(user => {

        const option = document.createElement("option");

        option.value = user.username;

        option.textContent = user.username;

        recipientSelect.appendChild(option);

    });

}


// =======================================================
// 5. POPULATE LOGIN DROPDOWN
// =======================================================

function populateLoginDropdown() {

    if (!loginUsername) return;

    const users = UserManager.getAll();

    loginUsername.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.disabled = true;

    defaultOption.selected = true;

    defaultOption.textContent = "Select your username...";

    loginUsername.appendChild(defaultOption);


    users.forEach(user => {

        const option = document.createElement("option");

        option.value = user.username;

        option.textContent = user.username;

        loginUsername.appendChild(option);

    });

}


// =======================================================
// 6. CHARACTER COUNTER
// =======================================================

function updateCharacterCount() {

    if (!messageText || !characterCount) return;

    const currentLength = messageText.value.length;

    characterCount.textContent = currentLength + " / 1000";


    if (currentLength >= 900) {

        characterCount.style.color = "#dc5b72";

    } else {

        characterCount.style.color = "";

    }

}


// =======================================================
// 7. SEND ANONYMOUS MESSAGE
// =======================================================

function handleSendMessage(event) {

    event.preventDefault();

    clearStatus(sendMessageStatus);


    const recipient = recipientSelect.value;

    const message = messageText.value.trim();


    if (!recipient) {

        showStatus(
            sendMessageStatus,
            "Please choose a recipient.",
            "error"
        );

        return;

    }


    if (!message) {

        showStatus(
            sendMessageStatus,
            "Please write your message first.",
            "error"
        );

        return;

    }


    if (message.length > 1000) {

        showStatus(
            sendMessageStatus,
            "Message cannot exceed 1000 characters.",
            "error"
        );

        return;

    }


    sendMessageButton.disabled = true;

    const originalContent = sendMessageButton.innerHTML;

    sendMessageButton.textContent = "Sending...";


    const result = MessageManager.create(
        message,
        recipient
    );


    if (result.success) {

        messageForm.reset();

        updateCharacterCount();

        populateRecipientDropdown();

        showStatus(
            sendMessageStatus,
            "Your anonymous message has been sent successfully!",
            "success"
        );

        showToast(
            "Message sent successfully!",
            "success"
        );

    } else {

        showStatus(
            sendMessageStatus,
            result.message,
            "error"
        );

        showToast(
            result.message,
            "error"
        );

    }


    sendMessageButton.disabled = false;

    sendMessageButton.innerHTML = originalContent;

    refreshIcons();

}


// =======================================================
// 8. USER LOGIN
// =======================================================

function handleLogin(event) {

    event.preventDefault();

    clearStatus(loginStatus);


    const username = loginUsername.value;

    const password = loginPassword.value;


    if (!username || !password) {

        showStatus(
            loginStatus,
            "Please enter your username and password.",
            "error"
        );

        return;

    }


    const result = UserManager.authenticate(
        username,
        password
    );


    if (!result.success) {

        showStatus(
            loginStatus,
            result.message,
            "error"
        );

        showToast(
            result.message,
            "error"
        );

        return;

    }


    // Set current session
    currentUser = result.user;


    // Clear password
    loginPassword.value = "";


    // Hide login form
    loginForm.classList.add("hidden");


    // Show inbox
    inboxResults.classList.remove("hidden");


    // Display inbox
    renderInbox();


    // Scroll to inbox
    inboxResults.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    showToast(
        "Welcome, " + currentUser.username + "!",
        "success"
    );

}


// =======================================================
// 9. RENDER INBOX
// =======================================================

function renderInbox() {

    if (!currentUser) return;


    const username = currentUser.username;

    const messages = MessageManager.getForUser(username);


    inboxWelcome.textContent = "Hello, " + username + "!";

    inboxDescription.textContent =
        "Here are the messages waiting for you.";


    inboxMessageCount.textContent = messages.length;


    renderMessages(messages);

}


// =======================================================
// 10. RENDER MESSAGE CARDS
// =======================================================

function renderMessages(messages) {

    messageList.innerHTML = "";


    // Empty inbox
    if (messages.length === 0) {

        messageList.innerHTML = `

            <div class="empty-inbox">

                <div class="empty-inbox-icon">

                    <i data-lucide="mail-open"></i>

                </div>

                <h4>No messages yet</h4>

                <p>
                    There are no messages waiting for you.
                    Maybe someone will leave you a little surprise soon.
                </p>

            </div>

        `;

        refreshIcons();

        return;

    }


    messages.forEach((message, index) => {

        const card = document.createElement("article");

        card.className = "message-card";

        card.style.animationDelay = (index * 0.08) + "s";


        const recipientText =
            message.recipient.toUpperCase() === "ALL"
                ? "Sent to everyone"
                : "Personal message";


        card.innerHTML = `

            <div class="message-card-header">

                <span class="message-anonymous">

                    <i data-lucide="user-round"></i>

                    Anonymous

                </span>

                <span class="message-date">

                    ${escapeHTML(formatMessageDate(message.date))}

                </span>

            </div>


            <div class="message-content">

                ${escapeHTML(message.message)}

            </div>


            <div class="message-card-footer">

                <span class="message-recipient-tag">

                    <i data-lucide="mail"></i>

                    ${recipientText}

                </span>


                <span class="message-decoration">
                    ♡
                </span>

            </div>

        `;


        messageList.appendChild(card);

    });


    refreshIcons();

}


// =======================================================
// 11. USER LOGOUT
// =======================================================

function handleLogout() {

    currentUser = null;


    // Hide inbox
    inboxResults.classList.add("hidden");


    // Show login form
    loginForm.classList.remove("hidden");


    // Reset login form
    loginForm.reset();


    // Clear message list
    messageList.innerHTML = "";


    // Clear login status
    clearStatus(loginStatus);


    showToast(
        "You have logged out successfully.",
        "success"
    );


    loginForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// =======================================================
// 12. SHOW / HIDE PASSWORD
// =======================================================

function handleTogglePassword() {

    if (!loginPassword) return;


    const isPassword =
        loginPassword.type === "password";


    loginPassword.type =
        isPassword ? "text" : "password";


    togglePassword.innerHTML = isPassword
        ? '<i data-lucide="eye-off"></i>'
        : '<i data-lucide="eye"></i>';


    togglePassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
    );


    refreshIcons();

}


// =======================================================
// 13. PASSWORD INPUT VALIDATION
// =======================================================

function handlePasswordInput() {

    if (!loginPassword) return;

    // Allow numbers only
    loginPassword.value =
        loginPassword.value.replace(/\D/g, "").slice(0, 3);

}


// =======================================================
// 14. EVENT LISTENERS
// =======================================================


// Send message

if (messageForm) {

    messageForm.addEventListener(
        "submit",
        handleSendMessage
    );

}


// Character counter

if (messageText) {

    messageText.addEventListener(
        "input",
        updateCharacterCount
    );

}


// Login

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

}


// Logout

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        handleLogout
    );

}


// Password toggle

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        handleTogglePassword
    );

}


// Password numeric validation

if (loginPassword) {

    loginPassword.addEventListener(
        "input",
        handlePasswordInput
    );

}


// =======================================================
// 15. INITIALIZE USER PAGE
// =======================================================

function initializeUserPage() {

    console.log("Initializing Be Message User Page...");


    // Populate dropdowns
    populateRecipientDropdown();

    populateLoginDropdown();


    // Initialize counter
    updateCharacterCount();


    // Hide inbox initially
    if (inboxResults) {
        inboxResults.classList.add("hidden");
    }


    console.log("User page initialized.");

    console.log(
        "Available users:",
        UserManager.getAll().map(user => user.username)
    );

}


// =======================================================
// 16. START APPLICATION
// =======================================================

initializeUserPage();
