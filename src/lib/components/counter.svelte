<script lang="ts">
  export let count: number = 0
  let times = 2
  $: result = count * times

  const calcTimes = () => {
    times += 1
  }
</script>

<div>{count} x {times} = {result}</div>
<button on:click={calcTimes}>x1</button>
