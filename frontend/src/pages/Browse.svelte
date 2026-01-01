<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { questionsAPI } from "../lib/api";
    import { authStore } from "../lib/auth";

    let questions = [];
    let filteredQuestions = [];
    let loading = true;
    let error = null;
    let user = null;
    let searchQuery = "";
    let selectedTag = "";
    let allTags = [];

    authStore.subscribe((value) => {
        user = value;
    });

    onMount(async () => {
        try {
            const data = await questionsAPI.getAll();
            questions = data.questions;
            filteredQuestions = questions;

            // Extract all unique tags
            const tagSet = new Set();
            questions.forEach((q) => {
                if (q.tags) {
                    q.tags.split(",").forEach((tag) => {
                        const trimmed = tag.trim();
                        if (trimmed) tagSet.add(trimmed);
                    });
                }
            });
            allTags = Array.from(tagSet).sort();

            loading = false;
        } catch (err) {
            error = err.message;
            loading = false;
        }
    });

    // Filter questions based on search and tag
    $: {
        filteredQuestions = questions.filter((q) => {
            const matchesSearch =
                searchQuery === "" ||
                q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.username.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTag =
                selectedTag === "" ||
                (q.tags &&
                    q.tags
                        .split(",")
                        .map((t) => t.trim())
                        .includes(selectedTag));

            return matchesSearch && matchesTag;
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function clearFilters() {
        searchQuery = "";
        selectedTag = "";
    }
</script>

<div class="min-h-screen px-4 py-12">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Browse Questions
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Search and filter through all community questions
            </p>
        </div>

        <!-- Search and Filters -->
        <div class="card mb-8">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <!-- Search -->
                <div class="lg:col-span-2">
                    <label
                        for="search"
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Search Questions
                    </label>
                    <input
                        id="search"
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search by title, content, or author..."
                        class="input-field"
                    />
                </div>

                <!-- Tag Filter -->
                <div>
                    <label
                        for="tag"
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Filter by Tag
                    </label>
                    <select
                        id="tag"
                        bind:value={selectedTag}
                        class="input-field"
                    >
                        <option value="">All Tags</option>
                        {#each allTags as tag}
                            <option value={tag}>{tag}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <!-- Active Filters & Clear -->
            {#if searchQuery || selectedTag}
                <div class="mt-4 flex items-center justify-between">
                    <div class="flex flex-wrap gap-2">
                        {#if searchQuery}
                            <span
                                class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                            >
                                Search: "{searchQuery}"
                            </span>
                        {/if}
                        {#if selectedTag}
                            <span
                                class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm"
                            >
                                Tag: {selectedTag}
                            </span>
                        {/if}
                    </div>
                    <button
                        on:click={clearFilters}
                        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold"
                    >
                        Clear Filters
                    </button>
                </div>
            {/if}

            <!-- Results Count -->
            <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredQuestions.length} of {questions.length} questions
            </div>
        </div>

        <!-- Questions Grid -->
        {#if loading}
            <div class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"
                ></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">
                    Loading questions...
                </p>
            </div>
        {:else if error}
            <div
                class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
            >
                <p class="text-red-700 dark:text-red-400">Error: {error}</p>
            </div>
        {:else if filteredQuestions.length === 0}
            <div class="card text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <h3
                    class="text-2xl font-bold text-gray-800 dark:text-white mb-4"
                >
                    No Questions Found
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your search or filters
                </p>
                <button on:click={clearFilters} class="btn-secondary">
                    Clear Filters
                </button>
            </div>
        {:else}
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each filteredQuestions as question}
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

                            <!-- Tags -->
                            {#if question.tags}
                                <div class="flex flex-wrap gap-2 mb-4">
                                    {#each question.tags
                                        .split(",")
                                        .filter((t) => t.trim())
                                        .slice(0, 3) as tag}
                                        <span
                                            class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
                                        >
                                            {tag.trim()}
                                        </span>
                                    {/each}
                                </div>
                            {/if}

                            <!-- Author and Date -->
                            <div
                                class="flex items-center justify-between text-sm mb-4"
                            >
                                <div class="flex items-center space-x-2">
                                    <span
                                        class={question.user_role === "Imam"
                                            ? "badge-imam"
                                            : "badge-parent"}
                                    >
                                        {question.user_role}
                                    </span>
                                    <span
                                        class="text-gray-700 dark:text-gray-300 font-medium"
                                        >{question.username}</span
                                    >
                                </div>
                            </div>

                            <!-- Stats -->
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
                                    {#if question.answers.some((a) => a.is_accepted)}
                                        <span class="badge-accepted text-xs">
                                            ✓ Resolved
                                        </span>
                                    {/if}
                                </div>
                                <div
                                    class="mt-2 text-xs text-gray-500 dark:text-gray-400"
                                >
                                    {formatDate(question.created_at)}
                                </div>
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
