<div class="page-nav md:bg-zinc-300 md:dark:bg-zinc-700 border-gray-300 dark:border-gray-700">
    <div class="header">
        <slot name="header" />
    </div>
    <div class="pages">
        <slot name="pages" />
    </div>
</div>

<style lang="scss">
    div.page-nav {
        @apply flex flex-row flex-wrap md:flex-nowrap md:flex-col md:h-full md:border-r md:min-w-[16rem] md:max-w-[16rem];
    }

    div.header :global {
        @apply px-4 py-5 border-b flex items-center w-full;
        background: var(--accent);
        border-color: var(--accent-light);
        h3 {
            @apply font-medium text-3xl flex-1 text-white;
        }

        svg {
            @apply relative -top-0.5;
            color: white !important;
            width: 1.75rem !important;
            height: 1.75rem !important;
        }
    }

    div.pages :global {
        @apply md:w-full md:h-full overflow-x-auto md:overflow-x-hidden md:overflow-y-auto flex flex-row md:flex-col px-4 pb-3.5 pt-4 md:py-4;
        form {
            @apply w-full mb-4 hidden md:block;
            input {
                @apply w-full rounded-md border-transparent text-sm px-1.5 py-2.5 focus:border-gray-400 focus:ring-0;
                color: var(--text-color);
            }
        }

        a,
        button.wide-button {
            @apply w-full px-1.5 py-2 rounded-md text-sm mb-0.5 mr-2 md:mr-0 flex items-center cursor-pointer select-none transition transform;
            color: var(--text-color);

            &.big-button {
                @apply py-4;
                span.text {
                    @apply text-lg relative top-[0.075rem];
                }
                span.link-icon {
                    svg {
                        width: 30px !important;
                        height: 30px !important;
                    }
                }
            }

            &:hover,
            &.active {
                @apply transition-all;
                background: var(--accent);
                text-decoration: none;
                color: white;
            }

            &:hover {
                @apply scale-105;
            }

            span.text {
                @apply truncate;
            }

            span.link-icon {
                @apply mr-2 relative;
                svg {
                    width: 18px !important;
                    height: 18px !important;
                }
            }
        }
        a.hide,
        button.wide-button.hide {
            @apply hidden md:flex;
        }
    }
</style>
