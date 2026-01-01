<script>
  import { navigate } from "svelte-routing";
  import { authStore } from "../lib/auth";

  let isLogin = true;
  let username = "";
  let password = "";
  let role = "Parent";
  let error = null;
  let loading = false;

  async function handleSubmit() {
    error = null;
    loading = true;

    try {
      if (isLogin) {
        await authStore.login(username, password);
      } else {
        await authStore.register(username, password, role);
      }
      navigate("/");
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = null;
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-12">
  <div class="max-w-md w-full">
    <div class="card animate-slide-up">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🕌</div>
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {isLogin ? "Welcome Back" : "Join Our Community"}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {isLogin ? "Login to your account" : "Create a new account"}
        </p>
      </div>

      {#if error}
        <div
          class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded"
        >
          <p class="text-red-700 dark:text-red-400">{error}</p>
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
          <label
            for="username"
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            bind:value={username}
            required
            class="input-field"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="input-field"
            placeholder="Enter your password"
          />
        </div>

        {#if !isLogin}
          <div>
            <label
              for="role"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Role
            </label>
            <select id="role" bind:value={role} class="input-field">
              <option value="Parent">Parent</option>
              <option value="Imam">Imam</option>
            </select>
          </div>
        {/if}

        <button
          type="submit"
          disabled={loading}
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          on:click={toggleMode}
          class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  </div>
</div>
