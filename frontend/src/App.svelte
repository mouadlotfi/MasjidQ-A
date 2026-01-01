<script>
  import { Router, Link, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import { authStore } from "./lib/auth";
  import { theme, toggleTheme } from "./lib/theme";

  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import AskQuestion from "./pages/AskQuestion.svelte";
  import QuestionDetail from "./pages/QuestionDetail.svelte";
  import Settings from "./pages/Settings.svelte";
  import MyQuestions from "./pages/MyQuestions.svelte";
  import Browse from "./pages/Browse.svelte";

  let user = null;
  let currentTheme = "dark";

  // Subscribe to auth store
  authStore.subscribe((value) => {
    user = value;
  });

  // Subscribe to theme store
  theme.subscribe((value) => {
    currentTheme = value;
  });

  // Initialize auth on mount
  onMount(async () => {
    await authStore.init();
  });

  async function handleLogout() {
    await authStore.logout();
  }
</script>

<Router>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav
      class="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 shadow-lg sticky top-0 z-50 backdrop-blur-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <Link
              to="/"
              class="text-white text-2xl font-bold hover:text-blue-100 transition-colors"
            >
              🕌 Masjid Q&A
            </Link>
            <Link
              to="/"
              class="text-white hover:text-blue-100 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/browse"
              class="text-white hover:text-blue-100 transition-colors font-medium"
            >
              Browse
            </Link>
            {#if user}
              <Link
                to="/my-questions"
                class="text-white hover:text-blue-100 transition-colors font-medium"
              >
                My Questions
              </Link>
              <Link
                to="/ask"
                class="text-white hover:text-blue-100 transition-colors font-medium"
              >
                Ask Question
              </Link>
              <Link
                to="/settings"
                class="text-white hover:text-blue-100 transition-colors font-medium"
              >
                Settings
              </Link>
            {/if}
          </div>

          <div class="flex items-center space-x-4">
            <!-- Dark Mode Toggle -->
            <button
              on:click={toggleTheme}
              class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              title="Toggle theme"
            >
              {#if currentTheme === "dark"}
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              {:else}
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              {/if}
            </button>

            {#if user}
              <div class="flex items-center space-x-3">
                <span class="text-white font-medium">{user.username}</span>
                <span
                  class={user.role === "Imam" ? "badge-imam" : "badge-parent"}
                >
                  {user.role}
                </span>
                <button
                  on:click={handleLogout}
                  class="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Logout
                </button>
              </div>
            {:else}
              <Link to="/login">
                <button
                  class="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Login
                </button>
              </Link>
            {/if}
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/login" component={Login} />
      <Route path="/ask" component={AskQuestion} />
      <Route path="/question/:id" component={QuestionDetail} />
      <Route path="/settings" component={Settings} />
      <Route path="/my-questions" component={MyQuestions} />
    </main>

    <!-- Footer -->
    <footer
      class="bg-gradient-to-r from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black text-white mt-16 py-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-lg font-semibold mb-2">Masjid Q&A Forum</p>
        <p class="text-slate-400">
          Connecting our community through knowledge and guidance
        </p>
        <p class="text-slate-500 mt-4 text-sm">
          © 2026 Masjid Q&A. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</Router>
