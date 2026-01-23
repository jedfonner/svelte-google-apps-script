// Add your server functions here
const serverFunctions: ServerFunctions = {
  testInvokationFromClient: () => {
    console.log('[MOCK] Server function testInvokationFromClient executed');
    return "Success from mock server!";
  },
  // You can add more mock server functions here as needed
}


// 2. Extend the Window interface to include our google object
// This is necessary for TypeScript to recognize window.google.script.run
// It must be in this file not global.d.ts to work correctly
declare global {
  interface Window {
    google: {
      script: {
        run: MockProxy;
      };
    };
  }
}
export const setupMock = () => {
  const callbacks = {
    success: null as ((res: any) => void) | null,
    failure: null as ((err: any) => void) | null,
  };

  const proxyMock = new Proxy({}, {
    get: (target, prop: string) => {
      // TRAP 1: withSuccessHandler
      if (prop === 'withSuccessHandler') {
        return (fn: any) => {
          callbacks.success = fn;
          return proxyMock; // Return the proxy to keep chaining
        };
      }

      // TRAP 2: withFailureHandler
      if (prop === 'withFailureHandler') {
        return (fn: any) => {
          callbacks.failure = fn;
          return proxyMock;
        };
      }

      // TRAP 3: Server Functions
      return (...args: any[]) => {
        console.log(`[MOCK] Calling server function: ${prop}`, args);

        setTimeout(() => {
          let result;
          let error = null;

          if (serverFunctions[prop]) {
            result = serverFunctions[prop](...args)
          } else {
            error = new Error(`Function ${prop} not found on server.`);
          }

          // Execute callbacks
          if (error && callbacks.failure) {
            callbacks.failure(error);
          } else if (!error && callbacks.success) {
            callbacks.success(result);
          }

          // Reset callbacks
          callbacks.success = null;
          callbacks.failure = null;
        }, 500);
      };
    },
  });

  window.google = {
    script: {
      // The double cast 'as unknown as MockProxy' is crucial here.
      // It tells TypeScript: "Trust me, this Proxy fulfills the MockProxy contract."
      run: proxyMock as unknown as MockProxy
    }
  };
}
