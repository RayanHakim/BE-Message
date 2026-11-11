
/*
=========================================================
 BE MESSAGE - STORAGE SYSTEM
=========================================================

Fungsi:
1. Inisialisasi akun pengguna.
2. Mengelola username dan password.
3. Mengelola pesan anonim.
4. Mengatur penerima pesan (ALL / Username).
5. CRUD akun pengguna.
6. CRUD pesan.
7. Menyimpan data menggunakan Local Storage.

Admin:
Username : Admin
Password : 123

=========================================================
*/

// =======================================================
// 1. STORAGE KEYS
// =======================================================

const STORAGE_KEYS = {
    USERS: "be_message_users",
    MESSAGES: "be_message_messages",
    ADMIN: "be_message_admin",
    SETTINGS: "be_message_settings"
};


// =======================================================
// 2. DEFAULT USERS
// =======================================================

const DEFAULT_USERS = [
    { username: "Rayan", password: "103" },
    { username: "Shafa", password: "217" },
    { username: "Kinan", password: "324" },
    { username: "Bening", password: "435" },
    { username: "Gesyla", password: "546" },
    { username: "Putri", password: "658" },
    { username: "Salsa", password: "769" },
    { username: "Ade", password: "872" },
    { username: "Ajad", password: "184" },
    { username: "Alvin", password: "295" },
    { username: "Arwan", password: "306" },
    { username: "Eko", password: "417" },
    { username: "Fariz", password: "528" },
    { username: "Hanif", password: "639" },
    { username: "Naufal", password: "740" },
    { username: "Satrio", password: "851" },
    { username: "Zaid", password: "962" }
];


// =======================================================
// 3. DEFAULT ADMIN
// =======================================================

const DEFAULT_ADMIN = {
    username: "Admin",
    password: "123"
};


// =======================================================
// 4. DEFAULT SETTINGS
// =======================================================

const DEFAULT_SETTINGS = {
    appName: "Be Message",
    initialized: true,
    allowAllMessages: true
};


// =======================================================
// 5. STORAGE HELPER
// =======================================================

const Storage = {

    get(key, fallback = null) {
        try {
            const data = localStorage.getItem(key);

            if (data === null) {
                return fallback;
            }

            return JSON.parse(data);

        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;

        } catch (error) {
            console.error("Storage write error:", error);
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }

};


// =======================================================
// 6. INITIALIZE APPLICATION
// =======================================================

function initializeApp() {

    // Initialize users
    if (localStorage.getItem(STORAGE_KEYS.USERS) === null) {
        Storage.set(
            STORAGE_KEYS.USERS,
            DEFAULT_USERS
        );
    }

    // Initialize messages
    if (localStorage.getItem(STORAGE_KEYS.MESSAGES) === null) {
        Storage.set(
            STORAGE_KEYS.MESSAGES,
            []
        );
    }

    // Initialize admin
    if (localStorage.getItem(STORAGE_KEYS.ADMIN) === null) {
        Storage.set(
            STORAGE_KEYS.ADMIN,
            DEFAULT_ADMIN
        );
    }

    // Initialize settings
    if (localStorage.getItem(STORAGE_KEYS.SETTINGS) === null) {
        Storage.set(
            STORAGE_KEYS.SETTINGS,
            DEFAULT_SETTINGS
        );
    }

    console.log("Be Message initialized successfully.");
}


// =======================================================
// 7. USER MANAGEMENT
// =======================================================

const UserManager = {

    // Get all users
    getAll() {
        return Storage.get(STORAGE_KEYS.USERS, []);
    },

    // Get user by username
    getByUsername(username) {

        return this.getAll().find(
            user => user.username.toLowerCase() ===
                    username.trim().toLowerCase()
        ) || null;

    },

    // Create user
    create(username, password) {

        username = username.trim();
        password = String(password).trim();

        if (!username || !password) {
            return {
                success: false,
                message: "Username dan password wajib diisi."
            };
        }

        if (username.toLowerCase() === "admin") {
            return {
                success: false,
                message: "Username Admin tidak dapat digunakan."
            };
        }

        if (!/^\d{3}$/.test(password)) {
            return {
                success: false,
                message: "Password harus terdiri dari 3 angka."
            };
        }

        if (this.getByUsername(username)) {
            return {
                success: false,
                message: "Username sudah digunakan."
            };
        }

        const users = this.getAll();

        users.push({
            username: username,
            password: password
        });

        const saved = Storage.set(
            STORAGE_KEYS.USERS,
            users
        );

        return {
            success: saved,
            message: saved
                ? "Pengguna berhasil ditambahkan."
                : "Gagal menyimpan pengguna."
        };

    },


    // Update user password
    updatePassword(username, newPassword) {

        newPassword = String(newPassword).trim();

        if (!/^\d{3}$/.test(newPassword)) {
            return {
                success: false,
                message: "Password harus terdiri dari 3 angka."
            };
        }

        const users = this.getAll();

        const user = users.find(
            item => item.username.toLowerCase() ===
                    username.toLowerCase()
        );

        if (!user) {
            return {
                success: false,
                message: "Pengguna tidak ditemukan."
            };
        }

        user.password = newPassword;

        const saved = Storage.set(
            STORAGE_KEYS.USERS,
            users
        );

        return {
            success: saved,
            message: saved
                ? "Password berhasil diperbarui."
                : "Gagal memperbarui password."
        };

    },


    // Rename username
    updateUsername(oldUsername, newUsername) {

        newUsername = newUsername.trim();

        if (!newUsername) {
            return {
                success: false,
                message: "Username baru wajib diisi."
            };
        }

        if (newUsername.toLowerCase() === "admin") {
            return {
                success: false,
                message: "Username tidak tersedia."
            };
        }

        const users = this.getAll();

        const user = users.find(
            item => item.username.toLowerCase() ===
                    oldUsername.toLowerCase()
        );

        if (!user) {
            return {
                success: false,
                message: "Pengguna tidak ditemukan."
            };
        }

        const duplicate = users.some(
            item => item.username.toLowerCase() ===
                    newUsername.toLowerCase() &&
                    item.username.toLowerCase() !==
                    oldUsername.toLowerCase()
        );

        if (duplicate) {
            return {
                success: false,
                message: "Username sudah digunakan."
            };
        }

        const oldName = user.username;

        user.username = newUsername;

        // Update recipient references in messages
        const messages = MessageManager.getAll();

        messages.forEach(message => {
            if (
                message.recipient.toLowerCase() ===
                oldName.toLowerCase()
            ) {
                message.recipient = newUsername;
            }
        });

        const savedUsers = Storage.set(
            STORAGE_KEYS.USERS,
            users
        );

        const savedMessages = Storage.set(
            STORAGE_KEYS.MESSAGES,
            messages
        );

        return {
            success: savedUsers && savedMessages,
            message: savedUsers && savedMessages
                ? "Username berhasil diperbarui."
                : "Gagal memperbarui username."
        };

    },


    // Delete user
    delete(username) {

        const users = this.getAll();

        const filteredUsers = users.filter(
            user => user.username.toLowerCase() !==
                    username.toLowerCase()
        );

        if (filteredUsers.length === users.length) {
            return {
                success: false,
                message: "Pengguna tidak ditemukan."
            };
        }

        const saved = Storage.set(
            STORAGE_KEYS.USERS,
            filteredUsers
        );

        return {
            success: saved,
            message: saved
                ? "Pengguna berhasil dihapus."
                : "Gagal menghapus pengguna."
        };

    },


    // Authenticate user
    authenticate(username, password) {

        const user = this.getByUsername(username);

        if (!user) {
            return {
                success: false,
                message: "Username tidak ditemukan."
            };
        }

        if (user.password !== String(password)) {
            return {
                success: false,
                message: "Password salah."
            };
        }

        return {
            success: true,
            user: {
                username: user.username
            }
        };

    }

};


// =======================================================
// 8. ADMIN MANAGEMENT
// =======================================================

const AdminManager = {

    getCredentials() {
        return Storage.get(
            STORAGE_KEYS.ADMIN,
            DEFAULT_ADMIN
        );
    },

    authenticate(username, password) {

        const admin = this.getCredentials();

        if (
            username === admin.username &&
            password === admin.password
        ) {
            return {
                success: true,
                message: "Login admin berhasil."
            };
        }

        return {
            success: false,
            message: "Username atau password admin salah."
        };

    },

    updatePassword(newPassword) {

        if (!newPassword) {
            return {
                success: false,
                message: "Password tidak boleh kosong."
            };
        }

        const admin = this.getCredentials();

        admin.password = String(newPassword);

        const saved = Storage.set(
            STORAGE_KEYS.ADMIN,
            admin
        );

        return {
            success: saved,
            message: saved
                ? "Password admin berhasil diperbarui."
                : "Gagal memperbarui password admin."
        };

    }

};


// =======================================================
// 9. MESSAGE MANAGEMENT
// =======================================================

const MessageManager = {

    // Get all messages
    getAll() {
        return Storage.get(
            STORAGE_KEYS.MESSAGES,
            []
        );
    },


    // Generate unique ID
    generateID() {

        return "MSG-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2, 8);

    },


    // Create anonymous message
    create(message, recipient) {

        message = message.trim();
        recipient = recipient.trim();

        if (!message) {
            return {
                success: false,
                message: "Pesan tidak boleh kosong."
            };
        }

        if (!recipient) {
            return {
                success: false,
                message: "Pilih penerima pesan."
            };
        }

        if (recipient.toUpperCase() !== "ALL") {

            if (!UserManager.getByUsername(recipient)) {
                return {
                    success: false,
                    message: "Penerima tidak ditemukan."
                };
            }

        } else {
            recipient = "ALL";
        }

        const messages = this.getAll();

        const newMessage = {
            id: this.generateID(),
            message: message,
            recipient: recipient,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        messages.unshift(newMessage);

        const saved = Storage.set(
            STORAGE_KEYS.MESSAGES,
            messages
        );

        return {
            success: saved,
            data: newMessage,
            message: saved
                ? "Pesan berhasil dikirim."
                : "Gagal mengirim pesan."
        };

    },


    // Get messages for a specific user
    getForUser(username) {

        return this.getAll().filter(message => {

            return (
                message.recipient.toUpperCase() === "ALL" ||
                message.recipient.toLowerCase() ===
                username.toLowerCase()
            );

        });

    },


    // Get messages addressed to a specific user only
    getDirectMessages(username) {

        return this.getAll().filter(message => {

            return (
                message.recipient.toLowerCase() ===
                username.toLowerCase()
            );

        });

    },


    // Delete message
    delete(id) {

        const messages = this.getAll();

        const filteredMessages = messages.filter(
            message => message.id !== id
        );

        if (messages.length === filteredMessages.length) {
            return {
                success: false,
                message: "Pesan tidak ditemukan."
            };
        }

        const saved = Storage.set(
            STORAGE_KEYS.MESSAGES,
            filteredMessages
        );

        return {
            success: saved,
            message: saved
                ? "Pesan berhasil dihapus."
                : "Gagal menghapus pesan."
        };

    },


    // Clear all messages
    deleteAll() {

        const saved = Storage.set(
            STORAGE_KEYS.MESSAGES,
            []
        );

        return {
            success: saved,
            message: saved
                ? "Semua pesan berhasil dihapus."
                : "Gagal menghapus pesan."
        };

    },


    // Count all messages
    countAll() {
        return this.getAll().length;
    },


    // Count messages for a user
    countForUser(username) {
        return this.getForUser(username).length;
    }

};


// =======================================================
// 10. APPLICATION STATISTICS
// =======================================================

const AppStatistics = {

    getData() {

        const users = UserManager.getAll();
        const messages = MessageManager.getAll();

        return {

            totalUsers: users.length,

            totalMessages: messages.length,

            totalAllMessages: messages.filter(
                message =>
                    message.recipient.toUpperCase() === "ALL"
            ).length,

            totalDirectMessages: messages.filter(
                message =>
                    message.recipient.toUpperCase() !== "ALL"
            ).length

        };

    }

};


// =======================================================
// 11. INITIALIZE WHEN SCRIPT LOADS
// =======================================================

initializeApp();

console.log("=================================");
console.log("       BE MESSAGE SYSTEM");
console.log("=================================");
console.log("Users:", UserManager.getAll().length);
console.log("Messages:", MessageManager.countAll());
console.log("Status: Ready");
console.log("=================================");
