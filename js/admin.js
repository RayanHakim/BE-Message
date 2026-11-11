
/*
=========================================================
 BE MESSAGE - ADMIN DASHBOARD
 File: js/admin.js

 Fitur:
 1. Admin login dan logout.
 2. Dashboard statistics.
 3. User management (CRUD).
 4. Username dan password management.
 5. Message management.
 6. Search dan filter.
 7. Confirmation modal.
 8. Toast notification.
 9. Admin password settings.
=========================================================
*/


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

// Login

const adminLoginSection = document.getElementById(
    "adminLoginSection"
);

const adminDashboardSection = document.getElementById(
    "adminDashboardSection"
);

const adminLoginForm = document.getElementById(
    "adminLoginForm"
);

const adminUsernameInput = document.getElementById(
    "adminUsername"
);

const adminPasswordInput = document.getElementById(
    "adminPassword"
);

const adminTogglePassword = document.getElementById(
    "adminTogglePassword"
);

const adminLoginStatus = document.getElementById(
    "adminLoginStatus"
);


// Dashboard

const adminLogoutButton = document.getElementById(
    "adminLogoutButton"
);

const pageTitle = document.getElementById(
    "pageTitle"
);

const sidebarToggle = document.getElementById(
    "sidebarToggle"
);

const adminSidebar = document.getElementById(
    "adminSidebar"
);


// Statistics

const statTotalUsers = document.getElementById(
    "statTotalUsers"
);

const statTotalMessages = document.getElementById(
    "statTotalMessages"
);

const statAllMessages = document.getElementById(
    "statAllMessages"
);

const statDirectMessages = document.getElementById(
    "statDirectMessages"
);


// Overview

const dashboardDate = document.getElementById(
    "dashboardDate"
);

const recentMessagesList = document.getElementById(
    "recentMessagesList"
);

const usersSummaryList = document.getElementById(
    "usersSummaryList"
);


// User management

const usersTableBody = document.getElementById(
    "usersTableBody"
);

const userSearchInput = document.getElementById(
    "userSearchInput"
);

const userCountTotal = document.getElementById(
    "userCountTotal"
);

const emptyUsersState = document.getElementById(
    "emptyUsersState"
);


// User modal

const userModal = document.getElementById(
    "userModal"
);

const openAddUserModal = document.getElementById(
    "openAddUserModal"
);

const userForm = document.getElementById(
    "userForm"
);

const userModalTitle = document.getElementById(
    "userModalTitle"
);

const editOriginalUsername = document.getElementById(
    "editOriginalUsername"
);

const newUsernameInput = document.getElementById(
    "newUsername"
);

const newUserPasswordInput = document.getElementById(
    "newUserPassword"
);

const userFormStatus = document.getElementById(
    "userFormStatus"
);

const saveUserButton = document.getElementById(
    "saveUserButton"
);


// Messages

const messagesTableBody = document.getElementById(
    "messagesTableBody"
);

const messageSearchInput = document.getElementById(
    "messageSearchInput"
);

const messageRecipientFilter = document.getElementById(
    "messageRecipientFilter"
);

const deleteAllMessagesButton = document.getElementById(
    "deleteAllMessagesButton"
);

const emptyMessagesState = document.getElementById(
    "emptyMessagesState"
);


// Confirmation modal

const confirmModal = document.getElementById(
    "confirmModal"
);

const confirmTitle = document.getElementById(
    "confirmTitle"
);

const confirmMessage = document.getElementById(
    "confirmMessage"
);

const cancelConfirmButton = document.getElementById(
    "cancelConfirmButton"
);

const executeConfirmButton = document.getElementById(
    "executeConfirmButton"
);


// Settings

const adminPasswordForm = document.getElementById(
    "adminPasswordForm"
);

const currentAdminPassword = document.getElementById(
    "currentAdminPassword"
);

const newAdminPassword = document.getElementById(
    "newAdminPassword"
);

const confirmAdminPassword = document.getElementById(
    "confirmAdminPassword"
);

const adminPasswordStatus = document.getElementById(
    "adminPasswordStatus"
);


// Toast

const adminToastContainer = document.getElementById(
    "adminToastContainer"
);



/* =========================================================
   2. APPLICATION STATE
========================================================= */

let isAdminLoggedIn = false;

let pendingConfirmationAction = null;



/* =========================================================
   3. HELPER FUNCTIONS
========================================================= */


/*
---------------------------------------------------------
 Escape HTML
 Mencegah karakter HTML dari input pengguna
 ditampilkan sebagai elemen HTML.
---------------------------------------------------------
*/

function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        function (character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return entities[character];

        }
    );

}



/*
---------------------------------------------------------
 Refresh Lucide Icons
---------------------------------------------------------
*/

function refreshAdminIcons() {

    if (window.lucide) {

        window.lucide.createIcons();

    }

}



/*
---------------------------------------------------------
 Show Status
---------------------------------------------------------
*/

function showAdminStatus(element, message, type = "success") {

    if (!element) return;

    element.textContent = message;

    element.className = `admin-status ${type}`;

}


function clearAdminStatus(element) {

    if (!element) return;

    element.textContent = "";

    element.className = "admin-status";

}



/*
---------------------------------------------------------
 Show Toast
---------------------------------------------------------
*/

function showAdminToast(message, type = "success") {

    if (!adminToastContainer) return;

    const icons = {

        success: "check-circle",
        error: "alert-circle",
        info: "info"

    };

    const toast = document.createElement("div");

    toast.className = `admin-toast ${type}`;

    const iconName = icons[type] || icons.info;

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>

        <span>${escapeHTML(message)}</span>
    `;

    adminToastContainer.appendChild(toast);

    refreshAdminIcons();

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform = "translateX(20px)";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}



/*
---------------------------------------------------------
 Check Operation Result

 Mendukung hasil boolean dan object:
 { success: true, message: "..." }
---------------------------------------------------------
*/

function operationSucceeded(result) {

    if (typeof result === "boolean") {

        return result;

    }

    if (result && typeof result === "object") {

        return result.success === true;

    }

    return false;

}


function getOperationMessage(result, fallback) {

    if (
        result &&
        typeof result === "object" &&
        result.message
    ) {

        return result.message;

    }

    return fallback;

}



/*
---------------------------------------------------------
 Format Date
---------------------------------------------------------
*/

function formatAdminDate(dateValue) {

    if (!dateValue) {

        return "-";

    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {

        return "-";

    }

    return date.toLocaleString("id-ID", {

        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"

    });

}



/*
---------------------------------------------------------
 Get Initial
---------------------------------------------------------
*/

function getInitial(username) {

    return String(username || "?")
        .charAt(0)
        .toUpperCase();

}



/*
---------------------------------------------------------
 Close Mobile Sidebar
---------------------------------------------------------
*/

function closeMobileSidebar() {

    if (!adminSidebar) return;

    adminSidebar.classList.remove("show");

}



/* =========================================================
   4. ADMIN LOGIN
========================================================= */


/*
---------------------------------------------------------
 Handle Admin Login
---------------------------------------------------------
*/

function handleAdminLogin(event) {

    event.preventDefault();

    clearAdminStatus(adminLoginStatus);

    const username = adminUsernameInput.value.trim();

    const password = adminPasswordInput.value;

    if (!username || !password) {

        showAdminStatus(
            adminLoginStatus,
            "Please enter username and password.",
            "error"
        );

        return;

    }


    const authenticated = AdminManager.authenticate(
        username,
        password
    );


    if (!authenticated) {

        showAdminStatus(
            adminLoginStatus,
            "Incorrect admin username or password.",
            "error"
        );

        adminPasswordInput.value = "";

        return;

    }


    isAdminLoggedIn = true;

    adminLoginSection.classList.add("hidden");

    adminDashboardSection.classList.remove("hidden");

    adminLoginForm.reset();

    initializeAdminDashboard();

    showAdminToast(
        "Welcome to Be Message Admin Dashboard!",
        "success"
    );

}



/*
---------------------------------------------------------
 Admin Logout
---------------------------------------------------------
*/

function handleAdminLogout() {

    isAdminLoggedIn = false;

    closeAllModals();

    adminDashboardSection.classList.add("hidden");

    adminLoginSection.classList.remove("hidden");

    clearAdminStatus(adminLoginStatus);

    adminLoginForm.reset();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

    showAdminToast(
        "You have been logged out.",
        "info"
    );

}



/*
---------------------------------------------------------
 Toggle Admin Password Visibility
---------------------------------------------------------
*/

function handleAdminTogglePassword() {

    const isPassword =
        adminPasswordInput.type === "password";

    adminPasswordInput.type = isPassword
        ? "text"
        : "password";

    adminTogglePassword.innerHTML = isPassword
        ? '<i data-lucide="eye-off"></i>'
        : '<i data-lucide="eye"></i>';

    refreshAdminIcons();

}



/* =========================================================
   5. DASHBOARD INITIALIZATION
========================================================= */

function initializeAdminDashboard() {

    if (!isAdminLoggedIn) return;

    updateDashboardDate();

    refreshDashboardStatistics();

    renderRecentMessages();

    renderUsersSummary();

    renderUsersTable();

    renderMessagesTable();

    populateMessageRecipientFilter();

    refreshAdminIcons();

}



/*
---------------------------------------------------------
 Update Dashboard Date
---------------------------------------------------------
*/

function updateDashboardDate() {

    if (!dashboardDate) return;

    const today = new Date();

    dashboardDate.textContent = today.toLocaleDateString(
        "id-ID",
        {

            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"

        }
    );

}



/*
---------------------------------------------------------
 Refresh Dashboard Statistics
---------------------------------------------------------
*/

function refreshDashboardStatistics() {

    const statistics = AppStatistics.getData();

    statTotalUsers.textContent =
        statistics.totalUsers;

    statTotalMessages.textContent =
        statistics.totalMessages;

    statAllMessages.textContent =
        statistics.totalAllMessages;

    statDirectMessages.textContent =
        statistics.totalDirectMessages;

    userCountTotal.textContent =
        statistics.totalUsers;

}



/* =========================================================
   6. SIDEBAR NAVIGATION
========================================================= */

function switchAdminSection(sectionName) {

    if (!isAdminLoggedIn) return;

    const sections = document.querySelectorAll(
        ".admin-page-section"
    );

    const sidebarLinks = document.querySelectorAll(
        ".sidebar-link"
    );

    const sectionTitles = {

        overview: "Overview",
        users: "Manage Users",
        messages: "All Messages",
        settings: "Settings"

    };


    // Hide all sections

    sections.forEach(section => {

        section.classList.remove("active");

    });


    // Remove active navigation

    sidebarLinks.forEach(link => {

        link.classList.remove("active");

    });


    // Show selected section

    const selectedSection = document.getElementById(
        `section-${sectionName}`
    );

    if (!selectedSection) return;

    selectedSection.classList.add("active");


    // Activate sidebar link

    const selectedLink = document.querySelector(
        `.sidebar-link[data-section="${sectionName}"]`
    );

    if (selectedLink) {

        selectedLink.classList.add("active");

    }


    // Update page title

    pageTitle.textContent =
        sectionTitles[sectionName] || "Dashboard";


    // Refresh relevant content

    if (sectionName === "overview") {

        refreshDashboardStatistics();

        renderRecentMessages();

        renderUsersSummary();

    }

    if (sectionName === "users") {

        renderUsersTable();

    }

    if (sectionName === "messages") {

        populateMessageRecipientFilter();

        renderMessagesTable();

    }


    closeMobileSidebar();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



/*
---------------------------------------------------------
 Sidebar Navigation Events
---------------------------------------------------------
*/

document.querySelectorAll("[data-section]").forEach(
    button => {

        button.addEventListener("click", function () {

            const section = this.dataset.section;

            switchAdminSection(section);

        });

    }
);



/*
---------------------------------------------------------
 Mobile Sidebar Toggle
---------------------------------------------------------
*/

if (sidebarToggle) {

    sidebarToggle.addEventListener("click", () => {

        adminSidebar.classList.toggle("show");

    });

}



/* =========================================================
   7. OVERVIEW - RECENT MESSAGES
========================================================= */

function renderRecentMessages() {

    const messages = MessageManager.getAll();

    if (!messages.length) {

        recentMessagesList.innerHTML = "";

        return;

    }


    const recentMessages = [...messages]

        .sort((a, b) => {

            return (b.timestamp || 0) -
                (a.timestamp || 0);

        })

        .slice(0, 5);


    recentMessagesList.innerHTML = recentMessages.map(
        message => {

            const content = escapeHTML(message.message);

            const date = formatAdminDate(
                message.date
            );

            const recipient = message.recipient === "ALL"
                ? "Everyone"
                : escapeHTML(message.recipient);


            return `

                <div class="recent-message-item">

                    <div class="recent-message-icon">

                        <i data-lucide="message-circle"></i>

                    </div>


                    <div class="recent-message-content">

                        <p>${content}</p>

                        <span>
                            To: ${recipient} · ${date}
                        </span>

                    </div>

                </div>

            `;

        }
    ).join("");


    refreshAdminIcons();

}



/* =========================================================
   8. OVERVIEW - USERS SUMMARY
========================================================= */

function renderUsersSummary() {

    const users = UserManager.getAll();

    if (!users.length) {

        usersSummaryList.innerHTML = "";

        return;

    }


    const sortedUsers = [...users]

        .sort((a, b) => {

            return MessageManager.countForUser(b.username) -
                MessageManager.countForUser(a.username);

        })

        .slice(0, 5);


    usersSummaryList.innerHTML = sortedUsers.map(
        user => {

            const username = escapeHTML(user.username);

            const messageCount = MessageManager.countForUser(
                user.username
            );


            return `

                <div class="summary-user-item">

                    <div class="summary-user-avatar">

                        ${escapeHTML(getInitial(user.username))}

                    </div>


                    <div class="summary-user-info">

                        <strong>${username}</strong>

                        <span>Registered member</span>

                    </div>


                    <span class="summary-user-count">

                        ${messageCount} messages

                    </span>

                </div>

            `;

        }
    ).join("");


    refreshAdminIcons();

}



/* =========================================================
   9. USER MANAGEMENT - RENDER TABLE
========================================================= */

function renderUsersTable() {

    const users = UserManager.getAll();

    const keyword = userSearchInput.value
        .trim()
        .toLowerCase();


    const filteredUsers = users.filter(user => {

        return user.username
            .toLowerCase()
            .includes(keyword);

    });


    if (!filteredUsers.length) {

        usersTableBody.innerHTML = "";

        emptyUsersState.classList.remove("hidden");

        return;

    }


    emptyUsersState.classList.add("hidden");


    usersTableBody.innerHTML = filteredUsers.map(
        (user, index) => {

            const username = escapeHTML(user.username);

            const password = escapeHTML(user.password);


            return `

                <tr>

                    <td>${index + 1}</td>


                    <td>

                        <div class="user-table-name">

                            <div class="user-table-avatar">

                                ${escapeHTML(getInitial(user.username))}

                            </div>

                            <span>${username}</span>

                        </div>

                    </td>


                    <td>

                        <span class="password-cell">

                            ${password}

                        </span>

                    </td>


                    <td>

                        <span class="user-status-badge">

                            Active

                        </span>

                    </td>


                    <td>

                        <div class="table-actions">


                            <button
                                type="button"
                                class="table-action-button"
                                data-action="edit-user"
                                data-username="${username}"
                                title="Edit user"
                            >

                                <i data-lucide="pencil"></i>

                            </button>


                            <button
                                type="button"
                                class="table-action-button delete"
                                data-action="delete-user"
                                data-username="${username}"
                                title="Delete user"
                            >

                                <i data-lucide="trash-2"></i>

                            </button>


                        </div>

                    </td>

                </tr>

            `;

        }
    ).join("");


    refreshAdminIcons();

}



/*
---------------------------------------------------------
 User Search
---------------------------------------------------------
*/

if (userSearchInput) {

    userSearchInput.addEventListener("input", () => {

        renderUsersTable();

    });

}



/* =========================================================
   10. USER MODAL
========================================================= */


/*
---------------------------------------------------------
 Open Add User Modal
---------------------------------------------------------
*/

function openCreateUserModal() {

    userForm.reset();

    editOriginalUsername.value = "";

    userModalTitle.textContent = "Add New User";

    saveUserButton.innerHTML = `
        <i data-lucide="save"></i>
        Save User
    `;

    newUserPasswordInput.required = true;

    newUserPasswordInput.placeholder =
        "Enter 3-digit password";

    clearAdminStatus(userFormStatus);

    userModal.classList.remove("hidden");

    refreshAdminIcons();

    newUsernameInput.focus();

}



/*
---------------------------------------------------------
 Open Edit User Modal
---------------------------------------------------------
*/

function openEditUserModal(username) {

    const user = UserManager.getByUsername(username);

    if (!user) {

        showAdminToast(
            "User account was not found.",
            "error"
        );

        return;

    }


    userForm.reset();

    editOriginalUsername.value = user.username;

    newUsernameInput.value = user.username;

    newUserPasswordInput.value = "";

    newUserPasswordInput.required = false;

    newUserPasswordInput.placeholder =
        "Leave blank to keep current password";


    userModalTitle.textContent = "Edit User";

    saveUserButton.innerHTML = `
        <i data-lucide="save"></i>
        Update User
    `;


    clearAdminStatus(userFormStatus);

    userModal.classList.remove("hidden");

    refreshAdminIcons();

    newUsernameInput.focus();

}



/*
---------------------------------------------------------
 Close User Modal
---------------------------------------------------------
*/

function closeUserModal() {

    userModal.classList.add("hidden");

    userForm.reset();

    clearAdminStatus(userFormStatus);

    newUserPasswordInput.required = true;

}



/*
---------------------------------------------------------
 Add User Button
---------------------------------------------------------
*/

if (openAddUserModal) {

    openAddUserModal.addEventListener(
        "click",
        openCreateUserModal
    );

}



/*
---------------------------------------------------------
 Handle User Form
---------------------------------------------------------
*/

function handleUserFormSubmit(event) {

    event.preventDefault();

    clearAdminStatus(userFormStatus);


    const originalUsername =
        editOriginalUsername.value;

    const username = newUsernameInput.value.trim();

    const password = newUserPasswordInput.value.trim();

    const isEditing = Boolean(originalUsername);


    if (!username) {

        showAdminStatus(
            userFormStatus,
            "Username cannot be empty.",
            "error"
        );

        return;

    }


    if (username.toLowerCase() === "admin") {

        showAdminStatus(
            userFormStatus,
            "This username is reserved for the administrator.",
            "error"
        );

        return;

    }


    // CREATE USER

    if (!isEditing) {

        if (!/^\d{3}$/.test(password)) {

            showAdminStatus(
                userFormStatus,
                "Password must contain exactly 3 digits.",
                "error"
            );

            return;

        }


        const result = UserManager.create(
            username,
            password
        );


        if (!operationSucceeded(result)) {

            showAdminStatus(
                userFormStatus,
                getOperationMessage(
                    result,
                    "Failed to create user."
                ),
                "error"
            );

            return;

        }


        closeUserModal();

        refreshAllAdminData();

        showAdminToast(
            `User ${username} has been created.`,
            "success"
        );

        return;

    }



    // EDIT USER

    const existingUser = UserManager.getByUsername(
        originalUsername
    );

    if (!existingUser) {

        showAdminStatus(
            userFormStatus,
            "Original user account could not be found.",
            "error"
        );

        return;

    }


    if (password && !/^\d{3}$/.test(password)) {

        showAdminStatus(
            userFormStatus,
            "Password must contain exactly 3 digits.",
            "error"
        );

        return;

    }


    // Update username if changed

    if (username !== originalUsername) {

        const usernameResult = UserManager.updateUsername(
            originalUsername,
            username
        );


        if (!operationSucceeded(usernameResult)) {

            showAdminStatus(
                userFormStatus,
                getOperationMessage(
                    usernameResult,
                    "Failed to update username."
                ),
                "error"
            );

            return;

        }

    }


    // Update password if filled

    if (password) {

        const passwordResult = UserManager.updatePassword(
            username,
            password
        );


        if (!operationSucceeded(passwordResult)) {

            showAdminStatus(
                userFormStatus,
                getOperationMessage(
                    passwordResult,
                    "Username was updated, but password update failed."
                ),
                "error"
            );

            refreshAllAdminData();

            return;

        }

    }


    closeUserModal();

    refreshAllAdminData();

    showAdminToast(
        `User ${username} has been updated.`,
        "success"
    );

}



/* =========================================================
   11. USER TABLE ACTIONS
========================================================= */

function handleUserTableAction(event) {

    const button = event.target.closest(
        "[data-action]"
    );

    if (!button) return;


    const action = button.dataset.action;

    const username = button.dataset.username;


    if (action === "edit-user") {

        openEditUserModal(username);

    }


    if (action === "delete-user") {

        requestDeleteUser(username);

    }

}



/*
---------------------------------------------------------
 Delete User Confirmation
---------------------------------------------------------
*/

function requestDeleteUser(username) {

    const user = UserManager.getByUsername(username);

    if (!user) {

        showAdminToast(
            "User account was not found.",
            "error"
        );

        return;

    }


    openConfirmationModal({

        title: "Delete User?",

        message:
            `Are you sure you want to delete ${username}'s account? Associated messages will remain in storage.`,

        confirmText: "Delete User",

        action: () => {

            const result = UserManager.delete(username);

            if (!operationSucceeded(result)) {

                showAdminToast(
                    getOperationMessage(
                        result,
                        "Failed to delete user."
                    ),
                    "error"
                );

                return;

            }


            refreshAllAdminData();

            showAdminToast(
                `User ${username} has been deleted.`,
                "success"
            );

        }

    });

}



/* =========================================================
   12. MESSAGE MANAGEMENT - FILTER
========================================================= */


/*
---------------------------------------------------------
 Populate Recipient Filter
---------------------------------------------------------
*/

function populateMessageRecipientFilter() {

    if (!messageRecipientFilter) return;

    const previousValue = messageRecipientFilter.value;

    const users = UserManager.getAll();


    messageRecipientFilter.innerHTML = `

        <option value="ALL_FILTER">
            All recipients
        </option>

        <option value="ALL">
            Everyone (ALL)
        </option>

    `;


    users.forEach(user => {

        const option = document.createElement("option");

        option.value = user.username;

        option.textContent = user.username;

        messageRecipientFilter.appendChild(option);

    });


    const validOption = Array.from(
        messageRecipientFilter.options
    ).some(option => {

        return option.value === previousValue;

    });


    if (validOption) {

        messageRecipientFilter.value = previousValue;

    } else {

        messageRecipientFilter.value = "ALL_FILTER";

    }

}



/* =========================================================
   13. MESSAGE MANAGEMENT - RENDER TABLE
========================================================= */

function renderMessagesTable() {

    const messages = MessageManager.getAll();

    const keyword = messageSearchInput.value
        .trim()
        .toLowerCase();

    const recipientFilter =
        messageRecipientFilter.value;


    let filteredMessages = [...messages];


    // Recipient filter

    if (recipientFilter !== "ALL_FILTER") {

        filteredMessages = filteredMessages.filter(
            message => {

                return message.recipient === recipientFilter;

            }
        );

    }


    // Search message content and recipient

    if (keyword) {

        filteredMessages = filteredMessages.filter(
            message => {

                const content = String(
                    message.message || ""
                ).toLowerCase();

                const recipient = String(
                    message.recipient || ""
                ).toLowerCase();

                return content.includes(keyword) ||
                    recipient.includes(keyword);

            }
        );

    }


    // Sort newest first

    filteredMessages.sort((a, b) => {

        return (b.timestamp || 0) -
            (a.timestamp || 0);

    });


    if (!filteredMessages.length) {

        messagesTableBody.innerHTML = "";

        emptyMessagesState.classList.remove("hidden");

        return;

    }


    emptyMessagesState.classList.add("hidden");


    messagesTableBody.innerHTML = filteredMessages.map(
        (message, index) => {

            const content = escapeHTML(message.message);

            const recipient = escapeHTML(
                message.recipient
            );

            const date = formatAdminDate(
                message.date
            );


            const recipientClass =
                message.recipient === "ALL"
                    ? "everyone"
                    : "";


            const recipientLabel =
                message.recipient === "ALL"
                    ? "Everyone"
                    : recipient;


            return `

                <tr>

                    <td>${index + 1}</td>


                    <td>

                        <div class="message-text-cell">

                            ${content}

                        </div>

                    </td>


                    <td>

                        <span class="recipient-badge ${recipientClass}">

                            ${recipientLabel}

                        </span>

                    </td>


                    <td>

                        <span class="message-date-cell">

                            ${date}

                        </span>

                    </td>


                    <td>

                        <div class="table-actions">

                            <button
                                type="button"
                                class="table-action-button delete"
                                data-action="delete-message"
                                data-message-id="${escapeHTML(message.id)}"
                                title="Delete message"
                            >

                                <i data-lucide="trash-2"></i>

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }
    ).join("");


    refreshAdminIcons();

}



/*
---------------------------------------------------------
 Message Search
---------------------------------------------------------
*/

if (messageSearchInput) {

    messageSearchInput.addEventListener("input", () => {

        renderMessagesTable();

    });

}



/*
---------------------------------------------------------
 Message Recipient Filter
---------------------------------------------------------
*/

if (messageRecipientFilter) {

    messageRecipientFilter.addEventListener(
        "change",
        renderMessagesTable
    );

}



/* =========================================================
   14. DELETE MESSAGE
========================================================= */

function requestDeleteMessage(messageID) {

    openConfirmationModal({

        title: "Delete Message?",

        message:
            "Are you sure you want to permanently delete this anonymous message?",

        confirmText: "Delete Message",

        action: () => {

            const result = MessageManager.delete(
                messageID
            );


            if (!operationSucceeded(result)) {

                showAdminToast(
                    getOperationMessage(
                        result,
                        "Failed to delete message."
                    ),
                    "error"
                );

                return;

            }


            refreshAllAdminData();

            showAdminToast(
                "Message has been deleted.",
                "success"
            );

        }

    });

}



/*
---------------------------------------------------------
 Delete All Messages
---------------------------------------------------------
*/

function requestDeleteAllMessages() {

    const totalMessages = MessageManager.countAll();

    if (totalMessages === 0) {

        showAdminToast(
            "There are no messages to delete.",
            "info"
        );

        return;

    }


    openConfirmationModal({

        title: "Delete All Messages?",

        message:
            `You are about to delete ${totalMessages} messages. This action cannot be undone.`,

        confirmText: "Delete All",

        action: () => {

            const result = MessageManager.deleteAll();


            if (!operationSucceeded(result)) {

                showAdminToast(
                    getOperationMessage(
                        result,
                        "Failed to delete all messages."
                    ),
                    "error"
                );

                return;

            }


            refreshAllAdminData();

            showAdminToast(
                "All messages have been deleted.",
                "success"
            );

        }

    });

}



/* =========================================================
   15. MESSAGE TABLE ACTIONS
========================================================= */

function handleMessageTableAction(event) {

    const button = event.target.closest(
        '[data-action="delete-message"]'
    );

    if (!button) return;


    const messageID = button.dataset.messageId;

    requestDeleteMessage(messageID);

}



/* =========================================================
   16. CONFIRMATION MODAL
========================================================= */

function openConfirmationModal(options) {

    confirmTitle.textContent =
        options.title || "Are you sure?";

    confirmMessage.textContent =
        options.message || "This action cannot be undone.";

    executeConfirmButton.textContent =
        options.confirmText || "Confirm";


    pendingConfirmationAction = options.action;

    confirmModal.classList.remove("hidden");

}



/*
---------------------------------------------------------
 Close Confirmation Modal
---------------------------------------------------------
*/

function closeConfirmationModal() {

    confirmModal.classList.add("hidden");

    pendingConfirmationAction = null;

}



/*
---------------------------------------------------------
 Execute Confirmation
---------------------------------------------------------
*/

function executeConfirmation() {

    if (!pendingConfirmationAction) {

        closeConfirmationModal();

        return;

    }


    const action = pendingConfirmationAction;

    closeConfirmationModal();

    action();

}



/* =========================================================
   17. CLOSE ALL MODALS
========================================================= */

function closeAllModals() {

    userModal.classList.add("hidden");

    confirmModal.classList.add("hidden");

    pendingConfirmationAction = null;

}



/* =========================================================
   18. ADMIN PASSWORD SETTINGS
========================================================= */

function handleAdminPasswordChange(event) {

    event.preventDefault();

    clearAdminStatus(adminPasswordStatus);


    const currentPassword =
        currentAdminPassword.value;

    const newPassword =
        newAdminPassword.value;

    const confirmationPassword =
        confirmAdminPassword.value;


    // Validate empty fields

    if (
        !currentPassword ||
        !newPassword ||
        !confirmationPassword
    ) {

        showAdminStatus(
            adminPasswordStatus,
            "Please complete all password fields.",
            "error"
        );

        return;

    }


    // Verify current password

    const credentials = AdminManager.getCredentials();

    const authenticated = AdminManager.authenticate(
        credentials.username,
        currentPassword
    );


    if (!authenticated) {

        showAdminStatus(
            adminPasswordStatus,
            "Current password is incorrect.",
            "error"
        );

        return;

    }


    // Validate new password

    if (newPassword.length < 6) {

        showAdminStatus(
            adminPasswordStatus,
            "New password must contain at least 6 characters.",
            "error"
        );

        return;

    }


    // Confirm new password

    if (newPassword !== confirmationPassword) {

        showAdminStatus(
            adminPasswordStatus,
            "New password confirmation does not match.",
            "error"
        );

        return;

    }


    // Prevent reusing current password

    if (newPassword === currentPassword) {

        showAdminStatus(
            adminPasswordStatus,
            "New password must be different from the current password.",
            "error"
        );

        return;

    }


    // Update password

    const result = AdminManager.updatePassword(
        newPassword
    );


    if (!operationSucceeded(result)) {

        showAdminStatus(
            adminPasswordStatus,
            getOperationMessage(
                result,
                "Failed to update admin password."
            ),
            "error"
        );

        return;

    }


    adminPasswordForm.reset();

    showAdminStatus(
        adminPasswordStatus,
        "Admin password updated successfully.",
        "success"
    );


    showAdminToast(
        "Admin password has been changed.",
        "success"
    );

}



/* =========================================================
   19. REFRESH ALL ADMIN DATA
========================================================= */

function refreshAllAdminData() {

    if (!isAdminLoggedIn) return;


    refreshDashboardStatistics();

    renderRecentMessages();

    renderUsersSummary();

    renderUsersTable();

    populateMessageRecipientFilter();

    renderMessagesTable();

    refreshAdminIcons();

}



/* =========================================================
   20. EVENT LISTENERS
========================================================= */


// Admin login

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        handleAdminLogin
    );

}


// Admin logout

if (adminLogoutButton) {

    adminLogoutButton.addEventListener(
        "click",
        handleAdminLogout
    );

}


// Admin password visibility

if (adminTogglePassword) {

    adminTogglePassword.addEventListener(
        "click",
        handleAdminTogglePassword
    );

}


// User form

if (userForm) {

    userForm.addEventListener(
        "submit",
        handleUserFormSubmit
    );

}


// User table actions

if (usersTableBody) {

    usersTableBody.addEventListener(
        "click",
        handleUserTableAction
    );

}


// Message table actions

if (messagesTableBody) {

    messagesTableBody.addEventListener(
        "click",
        handleMessageTableAction
    );

}


// Delete all messages

if (deleteAllMessagesButton) {

    deleteAllMessagesButton.addEventListener(
        "click",
        requestDeleteAllMessages
    );

}


// Admin password settings

if (adminPasswordForm) {

    adminPasswordForm.addEventListener(
        "submit",
        handleAdminPasswordChange
    );

}


// Confirmation button

if (executeConfirmButton) {

    executeConfirmButton.addEventListener(
        "click",
        executeConfirmation
    );

}


// Cancel confirmation

if (cancelConfirmButton) {

    cancelConfirmButton.addEventListener(
        "click",
        closeConfirmationModal
    );

}


// Close user modal and confirmation modal

document.querySelectorAll("[data-close-modal]").forEach(
    element => {

        element.addEventListener(
            "click",
            closeUserModal
        );

    }
);


document.querySelectorAll("[data-close-confirm]").forEach(
    element => {

        element.addEventListener(
            "click",
            closeConfirmationModal
        );

    }
);



/* =========================================================
   21. KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        if (!userModal.classList.contains("hidden")) {

            closeUserModal();

        }

        if (!confirmModal.classList.contains("hidden")) {

            closeConfirmationModal();

        }

        closeMobileSidebar();

    }

});



/* =========================================================
   22. INITIALIZATION
========================================================= */

function initializeAdminApp() {

    // Make sure storage is initialized.

    if (typeof Storage === "undefined") {

        console.error(
            "Storage module is not available."
        );

        return;

    }


    // Start with login page.

    isAdminLoggedIn = false;

    adminLoginSection.classList.remove("hidden");

    adminDashboardSection.classList.add("hidden");


    // Initialize dashboard date.

    updateDashboardDate();


    // Render initial icons.

    refreshAdminIcons();


    console.log(
        "Be Message Admin JavaScript initialized."
    );

}


// Start application

initializeAdminApp();
