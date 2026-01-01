<script>
    import { navigate } from "svelte-routing";
    import { authStore } from "../lib/auth";
    import { authAPI } from "../lib/api";

    let user = null;
    let activeTab = "password";

    // Password change
    let currentPassword = "";
    let newPassword = "";
    let confirmPassword = "";
    let passwordError = null;
    let passwordSuccess = false;
    let passwordLoading = false;

    // Username change
    let newUsername = "";
    let usernameError = null;
    let usernameSuccess = false;
    let usernameLoading = false;

    // Delete account
    let showDeleteConfirm = false;
    let deleteLoading = false;

    authStore.subscribe((value) => {
        user = value;
    });

    // Redirect if not authenticated
    $: if (user === null) {
        navigate("/login");
    }

    async function handlePasswordChange() {
        passwordError = null;
        passwordSuccess = false;

        if (!currentPassword || !newPassword || !confirmPassword) {
            passwordError = "All fields are required";
            return;
        }

        if (newPassword !== confirmPassword) {
            passwordError = "New passwords do not match";
            return;
        }

        if (newPassword.length < 6) {
            passwordError = "Password must be at least 6 characters";
            return;
        }

        passwordLoading = true;

        try {
            await authAPI.changePassword(currentPassword, newPassword);
            passwordSuccess = true;
            currentPassword = "";
            newPassword = "";
            confirmPassword = "";

            setTimeout(() => {
                passwordSuccess = false;
            }, 3000);
        } catch (err) {
            passwordError = err.message;
        } finally {
            passwordLoading = false;
        }
    }

    async function handleUsernameChange() {
        usernameError = null;
        usernameSuccess = false;

        if (!newUsername) {
            usernameError = "Username is required";
            return;
        }

        if (newUsername.length < 3) {
            usernameError = "Username must be at least 3 characters";
            return;
        }

        usernameLoading = true;

        try {
            const data = await authAPI.changeUsername(newUsername);
            authStore.setUser(data.user);
            usernameSuccess = true;
            newUsername = "";

            setTimeout(() => {
                usernameSuccess = false;
            }, 3000);
        } catch (err) {
            usernameError = err.message;
        } finally {
            usernameLoading = false;
        }
    }

    async function handleDeleteAccount() {
        deleteLoading = true;

        try {
            await authAPI.deleteAccount();
            navigate("/");
        } catch (err) {
            alert("Error deleting account: " + err.message);
            deleteLoading = false;
        }
    }
</script>

<div class="min-h-screen px-4 py-12">
    <div class="max-w-4xl mx-auto">
        <div class="card animate-slide-up">
            <div class="mb-8">
                <h2
                    class="text-3xl font-bold text-gray-800 dark:text-white mb-2"
                >
                    Account Settings
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                    Manage your account preferences and security
                </p>
            </div>

            <!-- Tabs -->
            <div
                class="flex space-x-4 mb-8 border-b border-gray-200 dark:border-slate-700"
            >
                <button
                    on:click={() => (activeTab = "password")}
                    class="pb-3 px-4 font-semibold transition-colors {activeTab ===
                    'password'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}"
                >
                    🔒 Password
                </button>
                <button
                    on:click={() => (activeTab = "username")}
                    class="pb-3 px-4 font-semibold transition-colors {activeTab ===
                    'username'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}"
                >
                    👤 Username
                </button>
                <button
                    on:click={() => (activeTab = "danger")}
                    class="pb-3 px-4 font-semibold transition-colors {activeTab ===
                    'danger'
                        ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}"
                >
                    ⚠️ Danger Zone
                </button>
            </div>

            <!-- Password Tab -->
            {#if activeTab === "password"}
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                        Change Password
                    </h3>

                    {#if passwordError}
                        <div
                            class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
                        >
                            <p class="text-red-700 dark:text-red-400">
                                {passwordError}
                            </p>
                        </div>
                    {/if}

                    {#if passwordSuccess}
                        <div
                            class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded"
                        >
                            <p class="text-green-700 dark:text-green-400">
                                ✓ Password updated successfully!
                            </p>
                        </div>
                    {/if}

                    <form
                        on:submit|preventDefault={handlePasswordChange}
                        class="space-y-6"
                    >
                        <div>
                            <label
                                for="currentPassword"
                                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Current Password
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                bind:value={currentPassword}
                                required
                                disabled={passwordLoading}
                                class="input-field"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label
                                for="newPassword"
                                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                            >
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                bind:value={newPassword}
                                required
                                disabled={passwordLoading}
                                class="input-field"
                                placeholder="Enter new password (min 6 characters)"
                            />
                        </div>

                        <div>
                            <label
                                for="confirmPassword"
                                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                bind:value={confirmPassword}
                                required
                                disabled={passwordLoading}
                                class="input-field"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {passwordLoading
                                ? "Updating..."
                                : "Update Password"}
                        </button>
                    </form>
                </div>
            {/if}

            <!-- Username Tab -->
            {#if activeTab === "username"}
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                        Change Username
                    </h3>

                    <div
                        class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded"
                    >
                        <p class="text-blue-700 dark:text-blue-400">
                            Current username: <strong>{user?.username}</strong>
                        </p>
                    </div>

                    {#if usernameError}
                        <div
                            class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
                        >
                            <p class="text-red-700 dark:text-red-400">
                                {usernameError}
                            </p>
                        </div>
                    {/if}

                    {#if usernameSuccess}
                        <div
                            class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded"
                        >
                            <p class="text-green-700 dark:text-green-400">
                                ✓ Username updated successfully!
                            </p>
                        </div>
                    {/if}

                    <form
                        on:submit|preventDefault={handleUsernameChange}
                        class="space-y-6"
                    >
                        <div>
                            <label
                                for="newUsername"
                                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                            >
                                New Username
                            </label>
                            <input
                                id="newUsername"
                                type="text"
                                bind:value={newUsername}
                                required
                                disabled={usernameLoading}
                                class="input-field"
                                placeholder="Enter new username (min 3 characters)"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={usernameLoading}
                            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {usernameLoading
                                ? "Updating..."
                                : "Update Username"}
                        </button>
                    </form>
                </div>
            {/if}

            <!-- Danger Zone Tab -->
            {#if activeTab === "danger"}
                <div class="space-y-6">
                    <h3
                        class="text-xl font-bold text-red-600 dark:text-red-400"
                    >
                        Danger Zone
                    </h3>

                    <div
                        class="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-6 rounded-lg"
                    >
                        <h4
                            class="text-lg font-bold text-red-700 dark:text-red-400 mb-2"
                        >
                            Delete Account
                        </h4>
                        <p class="text-red-600 dark:text-red-400 mb-4">
                            Once you delete your account, there is no going
                            back. This will permanently delete your account, all
                            your questions, and all your answers.
                        </p>

                        {#if !showDeleteConfirm}
                            <button
                                on:click={() => (showDeleteConfirm = true)}
                                class="btn-danger"
                            >
                                Delete My Account
                            </button>
                        {:else}
                            <div class="space-y-4">
                                <p
                                    class="text-red-700 dark:text-red-400 font-semibold"
                                >
                                    Are you absolutely sure? This action cannot
                                    be undone.
                                </p>
                                <div class="flex gap-4">
                                    <button
                                        on:click={handleDeleteAccount}
                                        disabled={deleteLoading}
                                        class="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deleteLoading
                                            ? "Deleting..."
                                            : "Yes, Delete My Account"}
                                    </button>
                                    <button
                                        on:click={() =>
                                            (showDeleteConfirm = false)}
                                        disabled={deleteLoading}
                                        class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
