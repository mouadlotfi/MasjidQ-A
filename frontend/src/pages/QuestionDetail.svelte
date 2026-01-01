<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { questionsAPI, answersAPI } from "../lib/api";
    import { authStore } from "../lib/auth";

    export let id;

    let question = null;
    let loading = true;
    let error = null;
    let user = null;
    let answerContent = "";
    let submitting = false;
    let submitError = null;
    let submitSuccess = false;
    let showDeleteConfirm = false;
    let deleting = false;

    authStore.subscribe((value) => {
        user = value;
    });

    onMount(async () => {
        await loadQuestion();
    });

    async function loadQuestion() {
        try {
            const data = await questionsAPI.getById(id);
            question = data.question;
            loading = false;
        } catch (err) {
            error = err.message;
            loading = false;
        }
    }

    async function handleSubmitAnswer() {
        submitError = null;
        submitting = true;
        submitSuccess = false;

        try {
            await answersAPI.create(id, answerContent);
            answerContent = "";
            submitSuccess = true;

            await loadQuestion();

            setTimeout(() => {
                submitSuccess = false;
            }, 3000);
        } catch (err) {
            submitError = err.message;
        } finally {
            submitting = false;
        }
    }

    async function handleAcceptAnswer(answerId) {
        try {
            await answersAPI.markAsAccepted(answerId);
            await loadQuestion();
        } catch (err) {
            alert("Error accepting answer: " + err.message);
        }
    }

    async function handleDeleteQuestion() {
        deleting = true;
        try {
            await questionsAPI.delete(id);
            navigate("/");
        } catch (err) {
            alert("Error deleting question: " + err.message);
            deleting = false;
            showDeleteConfirm = false;
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

<div class="min-h-screen px-4 py-12">
    <div class="max-w-4xl mx-auto">
        {#if loading}
            <div class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"
                ></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">
                    Loading question...
                </p>
            </div>
        {:else if error}
            <div
                class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
            >
                <p class="text-red-700 dark:text-red-400">Error: {error}</p>
                <button on:click={() => navigate("/")} class="mt-4 btn-primary">
                    Back to Home
                </button>
            </div>
        {:else if question}
            <!-- Question Card -->
            <div class="card mb-8 animate-slide-up">
                <div class="flex items-start justify-between mb-4">
                    <h1
                        class="text-3xl font-bold text-gray-800 dark:text-white flex-1"
                    >
                        {question.title}
                    </h1>
                    {#if user && user.id === question.user_id}
                        <button
                            on:click={() => (showDeleteConfirm = true)}
                            class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-sm transition-colors ml-4"
                            title="Delete question"
                        >
                            🗑️ Delete
                        </button>
                    {/if}
                </div>

                {#if showDeleteConfirm}
                    <div
                        class="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-4 rounded-lg mb-4"
                    >
                        <p
                            class="text-red-700 dark:text-red-400 font-semibold mb-3"
                        >
                            Are you sure you want to delete this question? This
                            action cannot be undone.
                        </p>
                        <div class="flex gap-3">
                            <button
                                on:click={handleDeleteQuestion}
                                disabled={deleting}
                                class="btn-danger text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                                on:click={() => (showDeleteConfirm = false)}
                                disabled={deleting}
                                class="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                {/if}

                <p
                    class="text-gray-700 dark:text-gray-300 text-lg mb-6 whitespace-pre-wrap"
                >
                    {question.content}
                </p>

                {#if question.tags}
                    <div class="flex flex-wrap gap-2 mb-6">
                        {#each question.tags
                            .split(",")
                            .filter((t) => t.trim()) as tag}
                            <span
                                class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                            >
                                {tag.trim()}
                            </span>
                        {/each}
                    </div>
                {/if}

                <div
                    class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700"
                >
                    <div class="flex items-center space-x-3">
                        <span
                            class={question.user_role === "Imam"
                                ? "badge-imam"
                                : "badge-parent"}
                        >
                            {question.user_role}
                        </span>
                        <span
                            class="text-gray-700 dark:text-gray-300 font-semibold"
                            >{question.username}</span
                        >
                    </div>
                    <span class="text-gray-500 dark:text-gray-400 text-sm"
                        >{formatDate(question.created_at)}</span
                    >
                </div>
            </div>

            <!-- Answers Section -->
            <div class="mb-8">
                <h2
                    class="text-2xl font-bold text-gray-800 dark:text-white mb-6"
                >
                    Answers ({question.answers.length})
                </h2>

                {#if question.answers.length === 0}
                    <div class="card text-center py-8">
                        <p class="text-gray-600 dark:text-gray-400">
                            No answers yet. Be the first to answer!
                        </p>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each question.answers as answer}
                            <div
                                class="card {answer.is_accepted
                                    ? 'border-2 border-green-500 dark:border-green-400'
                                    : ''} animate-slide-up"
                            >
                                {#if answer.is_accepted}
                                    <div class="mb-3">
                                        <span class="badge-accepted">
                                            ✓ Accepted Answer
                                        </span>
                                    </div>
                                {/if}

                                <p
                                    class="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap"
                                >
                                    {answer.content}
                                </p>

                                <div
                                    class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700"
                                >
                                    <div class="flex items-center space-x-3">
                                        <span
                                            class={answer.user_role === "Imam"
                                                ? "badge-imam"
                                                : "badge-parent"}
                                        >
                                            {answer.user_role}
                                        </span>
                                        <span
                                            class="text-gray-700 dark:text-gray-300 font-semibold"
                                            >{answer.username}</span
                                        >
                                    </div>

                                    <div class="flex items-center space-x-4">
                                        <span
                                            class="text-gray-500 dark:text-gray-400 text-sm"
                                            >{formatDate(
                                                answer.created_at,
                                            )}</span
                                        >

                                        {#if user && user.role === "Imam" && !answer.is_accepted}
                                            <button
                                                on:click={() =>
                                                    handleAcceptAnswer(
                                                        answer.id,
                                                    )}
                                                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors"
                                            >
                                                Mark as Accepted
                                            </button>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Answer Form (for authenticated users) -->
            {#if user}
                <div class="card animate-slide-up">
                    <h3
                        class="text-xl font-bold text-gray-800 dark:text-white mb-4"
                    >
                        Your Answer
                    </h3>

                    {#if submitError}
                        <div
                            class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4 rounded"
                        >
                            <p class="text-red-700 dark:text-red-400">
                                {submitError}
                            </p>
                        </div>
                    {/if}

                    {#if submitSuccess}
                        <div
                            class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-4 rounded"
                        >
                            <p class="text-green-700 dark:text-green-400">
                                ✓ Answer posted successfully!
                            </p>
                        </div>
                    {/if}

                    <form on:submit|preventDefault={handleSubmitAnswer}>
                        <textarea
                            bind:value={answerContent}
                            required
                            disabled={submitting}
                            rows="6"
                            class="input-field resize-none mb-4"
                            placeholder="Share your knowledge and help the community..."
                        />

                        <button
                            type="submit"
                            disabled={submitting || !answerContent.trim()}
                            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Posting..." : "Post Answer"}
                        </button>
                    </form>
                </div>
            {:else}
                <div class="card text-center py-8 animate-slide-up">
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        Please login to post an answer
                    </p>
                    <button
                        on:click={() => navigate("/login")}
                        class="btn-primary"
                    >
                        Login
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>
