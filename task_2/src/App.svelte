<script>
  import Tikets from "./lib/Tikets.svelte";
  import { baseURL } from "./lib/apiData";
  
  let lastInput = null;
  let amountFrom = 0;
  let tiketFrom = "";
  let amountTo = 0;
  let tiketTo = "";

  const handleTiketFromChange = (event) => {
    tiketFrom = event.detail;
    convertTiket();
  };

  const handleTiketToChange = (event) => {
    tiketTo = event.detail;
    convertTiket();
  };

  const handleAmountFromInput = (event) => {
    amountFrom = event.target.value.replace(/\,/g, '.');
    const isValidInput = /^[0-9]*([.,]?[0-9]*)?$/.test(amountFrom);
    if (!isValidInput) {
      alert('введите число');
      amountFrom = 0;
    }
     lastInput = 'from';
    convertTiket();
  };

  const handleAmountToInput = (event) => {
    amountTo = event.target.value.replace(/\,/g, '.');
    const isValidInput = /^[0-9]*([.,]?[0-9]*)?$/.test(amountTo);
    if (!isValidInput) {
      alert('введите число');
      amountTo = 0;
    }
     lastInput = 'to';
    convertTiket();
  };

  const convertTiket = async () => {
    try {
      const responseFrom = await fetch(`${baseURL}/latest/${tiketFrom}`)
                                .then(res => res.json());
      const responseTo   = await fetch(`${baseURL}/latest/${tiketTo}`)
                                .then(res => res.json());
      if (responseFrom.result === "error" || responseTo.result === "error") {
        alert(responseFrom["error-type"] || responseTo["error-type"]);
        return;
      }
      const exchangeRateFrom = responseFrom.conversion_rates[tiketTo];
      const exchangeRateTo = responseTo.conversion_rates[tiketFrom];
    if (lastInput === 'from' && !isNaN(amountFrom) && amountFrom !== '') {
          amountTo = (amountFrom * exchangeRateFrom).toFixed(5);
        } else if (lastInput === 'to' && !isNaN(amountTo) && amountTo !== '') {
          amountFrom = (amountTo * exchangeRateTo).toFixed(5);
        }
    } catch (error) {
      console.error("Ошибка", error);
    }
  };
</script>

<style>

  main {
  width: 80vw;
  }

  form {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  div {
    display: flex;
    justify-content: space-between;
  }
</style>

<main>
<h1>Конвертер валют</h1>
<div>
  <form on:submit|preventDefault={convertTiket}>
    <label>
      Исходная валюта
      <input type="text" bind:value={amountFrom} on:input={handleAmountFromInput} placeholder="0.00" />
    </label>
    <label>
      Тикер
      <Tikets on:tiketSelected={handleTiketFromChange} />
      
    </label>
  </form>
  <form>
    <label>
      Целевая валюта
      <input type="text" bind:value={amountTo} on:input={handleAmountToInput}  placeholder="0.00" />
    </label> 
    <label>
      Тикер
      <Tikets on:tiketSelected={handleTiketToChange} />
    </label>
  </form>
</div>
  {#if Boolean(amountFrom && amountTo)}
  <p>
    {amountFrom} <b>{tiketFrom}</b> | эквивалентно | {amountTo} <b>{tiketTo}</b>.
  </p>
  {/if}
</main>