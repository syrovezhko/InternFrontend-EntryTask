<script>
  import { createEventDispatcher } from 'svelte';
  import { baseURL } from './apiData';
  let selectedTiket = '';
  let tikets = []
  const dispatch = createEventDispatcher();
  
  const handleChange = () => {
    dispatch('tiketSelected', selectedTiket);
  };
  (async function () {
    try {
      const responseCodes = await fetch(`${baseURL}/codes`)
                            .then(res => res.json());
      if (responseCodes.result === "error") {
        alert(responseCodes["error-type"]);
        return;
      }
      tikets = responseCodes.supported_codes;
    } catch (error) {
      console.error("Ошибка", error);
    }
  }());
</script>
{#if Boolean(tikets.length)}
<select class="select" bind:value={selectedTiket} on:change={handleChange}>
  {#each tikets as tiket}
    <option value={tiket[0]}>{tiket[1]}</option>
  {/each}
</select>
{/if}