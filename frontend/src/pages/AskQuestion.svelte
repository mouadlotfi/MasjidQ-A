<script>
    import { navigate } from "svelte-routing";
    import { authStore } from "../lib/auth";
    import { questionsAPI } from "../lib/api";

    let user = null;
    let title = "";
    let content = "";
    let tags = "";
    let error = null;
    let loading = false;
    let success = false;

    authStore.subscribe((value) => {
        user = value;
    });

    // Redirect if not authenticated
    $: if (user === null) {
        navigate("/login");
    }

    async function handleSubmit() {
        error = null;
        loading = true;
        success = false;

        try {
            await questionsAPI.create(title, content, tags);
            success = true;

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            error = err.message;
            loading = false;
        }
    }
</script>

<div class="min-h-screen px-4 py-12">
    <div class="max-w-3xl mx-auto">
        <div class="card animate-slide-up">
            <div class="mb-8">
                <h2
                    class="text-3xl font-bold text-gray-800 dark:text-white mb-2"
                >
                    Ask a Question
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                    Share your question with the community
                </p>
            </div>

            {#if error}
                <div
                    class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded"
                >
                    <p class="text-red-700 dark:text-red-400">{error}</p>
                </div>
            {/if}

            {#if success}
                <div
                    class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded"
                >
                    <p class="text-green-700 dark:text-green-400">
                        ✓ Question posted successfully! Redirecting...
                    </p>
                </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                <div>
                    <label
                        for="title"
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Question Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        bind:value={title}
                        required
                        disabled={loading || success}
                        class="input-field"
                        placeholder="What would you like to know?"
                    />
                </div>

                <div>
                    <label
                        for="content"
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Question Details
                    </label>
                    <textarea
                        id="content"
                        bind:value={content}
                        required
                        disabled={loading || success}
                        rows="8"
                        class="input-field resize-none"
                        placeholder="Provide more details about your question..."
                    />
                </div>

                <div>
                    <label
                        for="tags"
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Tags (comma separated)
                    </label>
                    <input
                        id="tags"
                        type="text"
                        bind:value={tags}
                        disabled={loading || success}
                        class="input-field"
                        placeholder="e.g. Prayer, Ramadan, Education"
                    />
                </div>

                <div class="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || success}
                        class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Posting..." : "Post Question"}
                    </button>

                    <button
                        type="button"
                        on:click={() => navigate("/")}
                        disabled={loading || success}
                        class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
