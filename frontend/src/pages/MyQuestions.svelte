<script>
    import { onMount } from "svelte";
    import { Link, navigate } from "svelte-routing";
    import { questionsAPI } from "../lib/api";
    import { authStore } from "../lib/auth";

    let questions = [];
    let loading = true;
    let error = null;
    let user = null;

    authStore.subscribe((value) => {
        user = value;
    });

    // Redirect if not authenticated
    $: if (user === null) {
        navigate("/login");
    }

    onMount(async () => {
        if (!user) return;

        try {
            const data = await questionsAPI.getAll();
            // Filter to only show user's questions
            questions = data.questions.filter((q) => q.user_id === user.id);
            loading = false;
        } catch (err) {
            error = err.message;
            loading = false;
        }
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

<div class="min-h-screen px-4 py-12">
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                My Questions
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Questions you've asked to the community
            </p>
        </div>

        {#if loading}
            <div class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"
                ></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">
                    Loading your questions...
                </p>
            </div>
        {:else if error}
            <div
                class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
            >
                <p class="text-red-700 dark:text-red-400">Error: {error}</p>
            </div>
        {:else if questions.length === 0}
            <div class="card text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <h3
                    class="text-2xl font-bold text-gray-800 dark:text-white mb-4"
                >
                    No Questions Yet
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't asked any questions yet. Start a discussion!
                </p>
                <Link to="/ask">
                    <button class="btn-primary">
                        Ask Your First Question
                    </button>
                </Link>
            </div>
        {:else}
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each questions as question}
                    <Link to="/question/{question.id}">
                        <div class="card card-hover cursor-pointer h-full">
                            <div class="flex items-start justify-between mb-3">
                                <h3
                                    class="text-xl font-bold text-gray-800 dark:text-white flex-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {question.title}
                                </h3>
                            </div>

                            <p
                                class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2"
                            >
                                {question.content}
                            </p>

                            {#if question.tags}
                                <div class="flex flex-wrap gap-2 mb-4">
                                    {#each question.tags
                                        .split(",")
                                        .filter((t) => t.trim()) as tag}
                                        <span
                                            class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
                                        >
                                            {tag.trim()}
                                        </span>
                                    {/each}
                                </div>
                            {/if}

                            <div
                                class="pt-4 border-t border-gray-200 dark:border-slate-700"
                            >
                                <div
                                    class="flex items-center justify-between text-sm"
                                >
                                    <span
                                        class="text-gray-600 dark:text-gray-400"
                                    >
                                        💬 {question.answers.length}
                                        {question.answers.length === 1
                                            ? "Answer"
                                            : "Answers"}
                                    </span>
                                    <span
                                        class="text-gray-500 dark:text-gray-400 text-xs"
                                    >
                                        {formatDate(question.created_at)}
                                    </span>
                                </div>
                                {#if question.answers.some((a) => a.is_accepted)}
                                    <div class="mt-2">
                                        <span class="badge-accepted text-xs">
                                            ✓ Resolved
                                        </span>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </Link>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
