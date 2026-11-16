<script lang="ts">
    import { Label, Switch, useId, type WithoutChildrenOrChild } from 'bits-ui';

    let {
        id = useId(),
        checked = $bindable(false),
        ref = $bindable(null),
        label,
        ...restProps
    }: WithoutChildrenOrChild<Switch.RootProps> & {
          label: string;
    } = $props();
</script>

<Switch.Root bind:checked bind:ref {id} {...restProps}>
    <Switch.Thumb />
</Switch.Root>
<Label.Root for={id}>{label}</Label.Root>