<script lang="ts">
  let loadingState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMessage: string = $state('');
  let serverResponse: string = $state('');

  const invokeServerFunction = async () => {
    loadingState = 'loading';
    try {
      const result = await window.google.script.run
        .withSuccessHandler((response: string) => {
          console.log('Server response:', response);
          serverResponse = response;
          loadingState = 'success';
          errorMessage = '';
        })
        .withFailureHandler((error: GasError) => {
          console.error('Error invoking server function:', error);
          serverResponse = '';
          loadingState = 'error';
          errorMessage = error.message || 'Unknown error occurred';
        })
        .testInvokationFromClient('foo', 'bar'); // Example of a server function call
    } catch (error) {
      console.error('Unexpected error:', error);
      serverResponse = '';
      loadingState = 'error';
      errorMessage = `An unexpected error occurred: ${error}`;
    }
  };
</script>

<p>Click to invoke a function defined in Google Apps Script's Code.gs</p>
<button onclick={invokeServerFunction}>Invoke Server Function</button>

{#if loadingState === 'loading'}
  <p>Loading...</p>
{/if}
{#if loadingState === 'error'}
  <p>Error: {errorMessage}</p>
{/if}
{#if loadingState === 'success'}
  {#if serverResponse}
    <p>Server Response: {serverResponse}</p>
  {/if}
{/if}
