<script lang="ts">
    import { CardSize } from '$lib/models/site';
    import { app, setCardSize } from '$lib/repo/app.repo';

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
