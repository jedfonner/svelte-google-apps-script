<script lang="ts">
  let loadingState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMessage: string = $state('');
  let serverResponse: string = $state([]);

  const invokeServerFunction = async () => {
    loadingState = 'loading';
    try {
      const result = await window.google.script.run
        .withSuccessHandler((response: string) => {
          console.log('Server response:', response);
          serverResponse.push(response);
          loadingState = 'success';
          errorMessage = '';
        })
        .withFailureHandler((error: GasError) => {
          console.error('Error invoking server function:', error);
          serverResponse = [];
          loadingState = 'error';
          errorMessage = error.message || 'Unknown error occurred';
        })
        .testInvokationFromClient('foo', 'bar'); // Example of a server function call
    } catch (error) {
      console.error('Unexpected error:', error);
      serverResponse = [];
      loadingState = 'error';
      errorMessage = `An unexpected error occurred: ${error}`;
    }
  };
  const invokeServerFunction2 = async () => {
    loadingState = 'loading';
    try {
      const result = await window.google.script.run
        .withSuccessHandler((response: string) => {
          console.log('Server response:', response);
          serverResponse.push(response);
          loadingState = 'success';
          errorMessage = '';
        })
        .withFailureHandler((error: GasError) => {
          console.error('Error invoking server function:', error);
          serverResponse = [];
          loadingState = 'error';
          errorMessage = error.message || 'Unknown error occurred';
        })
        .testInvokationFromClient2('alice', 'bob'); // Example of a server function call
    } catch (error) {
      console.error('Unexpected error:', error);
      serverResponse = [];
      loadingState = 'error';
      errorMessage = `An unexpected error occurred: ${error}`;
    }
  };

  const invokeBoth = async () => {
    await invokeServerFunction();
    await invokeServerFunction2();
  };
  const reset = () => {
    loadingState = 'idle';
    errorMessage = '';
    serverResponse = [];
  };
</script>

<p>Click to invoke a function defined in Google Apps Script's Code.gs</p>
<button onclick={invokeServerFunction}>Invoke Server Function</button>
<button onclick={invokeServerFunction2}>Invoke Server Function 2</button>
<button onclick={invokeBoth}>Invoke Both Functions Simultaneously</button>
<button onclick={reset}>Reset</button>
{#if loadingState === 'loading'}
  <p>Loading...</p>
{/if}
{#if loadingState === 'error'}
  <p>Error: {errorMessage}</p>
{/if}
{#if loadingState === 'success'}
  {#if serverResponse}
    <p>Server Response:</p>
    {#each serverResponse as response, index}
      <p>{index + 1}. {response}</p>
    {/each}
  {/if}
{/if}
