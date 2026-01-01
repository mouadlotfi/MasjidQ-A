<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { questionsAPI } from "../lib/api";
  import { authStore } from "../lib/auth";

  let questions = [];
  let loading = true;
  let error = null;
  let user = null;
  let scrollY = 0;

  authStore.subscribe((value) => {
    user = value;
  });

  onMount(async () => {
    try {
      const data = await questionsAPI.getAll();
      questions = data.questions;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

<svelte:window bind:scrollY />

<div class="min-h-screen">
  <!-- Hero Section with Parallax -->
  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <!-- Parallax Background -->
    <div
      class="parallax-bg opacity-90"
      style="transform: translateY({scrollY * 0.5}px)"
    ></div>

    <!-- Animated Gradient Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950"
    ></div>

    <!-- Floating Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-float"
      ></div>
      <div
        class="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-float"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 dark:bg-pink-400/10 rounded-full blur-3xl animate-float"
        style="animation-delay: 2s"
      ></div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 max-w-5xl mx-auto text-center px-4 py-20">
      <div class="mb-8">
        <span class="inline-block text-6xl mb-6 animate-pulse-glow">🕌</span>
      </div>

      <h1
        class="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in text-white glow-text"
      >
        Masjid Q&A Forum
      </h1>

      <p
        class="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 animate-slide-up max-w-3xl mx-auto"
      >
        Connect, Learn, and Grow Together
      </p>

      <div
        class="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in"
      >
        {#if user}
          <Link to="/ask">
            <button class="btn-primary text-lg px-8 py-4 animate-bounce-gentle">
              ✨ Ask a Question
            </button>
          </Link>
        {:else}
          <Link to="/login">
            <button class="btn-primary text-lg px-8 py-4 animate-bounce-gentle">
              🚀 Get Started
            </button>
          </Link>
          <Link to="/login">
            <button
              class="glass-effect text-white text-lg px-8 py-4 hover:bg-white/20 transition-all duration-300"
            >
              Sign In
            </button>
          </Link>
        {/if}
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
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
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="scroll-reveal py-20 px-4 bg-white dark:bg-slate-900/50">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-8 card card-hover">
          <div class="text-5xl font-bold text-gradient mb-2">
            {questions.length}
          </div>
          <div class="text-gray-600 dark:text-gray-400 text-lg">
            Questions Asked
          </div>
        </div>
        <div class="text-center p-8 card card-hover">
          <div class="text-5xl font-bold text-gradient mb-2">
            {questions.reduce((sum, q) => sum + q.answers.length, 0)}
          </div>
          <div class="text-gray-600 dark:text-gray-400 text-lg">
            Answers Provided
          </div>
        </div>
        <div class="text-center p-8 card card-hover">
          <div class="text-5xl font-bold text-gradient mb-2">
            {questions.filter((q) => q.answers.some((a) => a.is_accepted))
              .length}
          </div>
          <div class="text-gray-600 dark:text-gray-400 text-lg">Resolved</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="scroll-reveal py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <h2
        class="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 dark:text-white"
      >
        Why Join Our Community?
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="scroll-reveal card card-hover text-center">
          <div class="text-5xl mb-4">💡</div>
          <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
            Ask Anything
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Get answers to your Islamic questions from knowledgeable Imams and
            community members
          </p>
        </div>

        <div
          class="scroll-reveal card card-hover text-center"
          style="animation-delay: 0.1s"
        >
          <div class="text-5xl mb-4">🤝</div>
          <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
            Share Knowledge
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Contribute your insights and help others on their spiritual journey
          </p>
        </div>

        <div
          class="scroll-reveal card card-hover text-center"
          style="animation-delay: 0.2s"
        >
          <div class="text-5xl mb-4">✨</div>
          <h3 class="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
            Grow Together
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Build a stronger community through shared learning and mutual
            support
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Recent Questions Section -->
  <section class="scroll-reveal py-20 px-4 bg-white dark:bg-slate-900/30">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2
          class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Recent Discussions
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Explore the latest questions from our community
        </p>
      </div>

      {#if loading}
        <div class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Loading questions...
          </p>
        </div>
      {:else if error}
        <div
          class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded"
        >
          <p class="text-red-700 dark:text-red-400">Error: {error}</p>
        </div>
      {:else if questions.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            No questions yet. Be the first to ask!
          </p>
        </div>
      {:else}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each questions.slice(0, 6) as question, index}
            <Link to="/question/{question.id}">
              <div
                class="scroll-reveal card card-hover cursor-pointer h-full"
                style="animation-delay: {index * 0.05}s"
              >
                <div class="flex items-start justify-between mb-3">
                  <h3
                    class="text-xl font-bold text-gray-800 dark:text-white flex-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {question.title}
                  </h3>
                </div>

                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {question.content}
                </p>

                <div class="flex items-center justify-between text-sm mb-4">
                  <div class="flex items-center space-x-2">
                    <span
                      class={question.user_role === "Imam"
                        ? "badge-imam"
                        : "badge-parent"}
                    >
                      {question.user_role}
                    </span>
                    <span class="text-gray-700 dark:text-gray-300 font-medium"
                      >{question.username}</span
                    >
                  </div>
                </div>

                <div
                  class="pt-4 border-t border-gray-200 dark:border-slate-700"
                >
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">
                      💬 {question.answers.length}
                      {question.answers.length === 1 ? "Answer" : "Answers"}
                    </span>
                    {#if question.answers.some((a) => a.is_accepted)}
                      <span class="badge-accepted text-xs"> ✓ Resolved </span>
                    {/if}
                  </div>
                </div>
              </div>
            </Link>
          {/each}
        </div>

        {#if questions.length > 6}
          <div class="text-center mt-12">
            <p class="text-gray-600 dark:text-gray-400 text-lg">
              And {questions.length - 6} more questions...
            </p>
          </div>
        {/if}
      {/if}
    </div>
  </section>

  <!-- CTA Section -->
  <section
    class="scroll-reveal py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900"
  >
    <div class="max-w-4xl mx-auto text-center text-white">
      <h2 class="text-4xl md:text-5xl font-bold mb-6">
        Ready to Join the Conversation?
      </h2>
      <p class="text-xl mb-8 opacity-90">
        Start asking questions and sharing knowledge with our community today
      </p>
      {#if !user}
        <Link to="/login">
          <button
            class="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Sign Up Now
          </button>
        </Link>
      {/if}
    </div>
  </section>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .scroll-reveal {
    opacity: 1;
    transform: translateY(0);
  }

  .scroll-reveal.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }
</style>
