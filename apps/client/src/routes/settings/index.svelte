<script lang="ts">
    import { app, setCardSize } from '$lib/repo/app.repo';
    import { CardSize } from '$lib/models/site';
    import ThemePreference from './_general-forms/ThemePreference.svelte';
    import RatingsFilter from './_general-forms/RatingsFilter.svelte';
    import CardSizeForm from './_general-forms/CardSizeForm.svelte';

    const cardSizes = Object.entries(CardSize).map(([key, value]) => ({
        value: value,
        label: key,
    }));
    let currSize = cardSizes.filter((size) => {
        return size.value === $app.cardSize;
    })[0];

    function changeCardSize(cardSize: string): void {
        setCardSize(CardSize[cardSize]);
    }
</script>

<div class="w-full flex-1">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto my-6 w-11/12">
        <ThemePreference />
        <RatingsFilter />
        <CardSizeForm />
    </div>
</div>
