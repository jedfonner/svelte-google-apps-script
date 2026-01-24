// Add your server functions here
export const mocks: ServerFunctions = {
  testInvokationFromClient: (arg1, arg2) => {
    console.log('[MOCK] Server function testInvokationFromClient executed');
    return "Success from mock server - received: " + arg1 + " " + arg2;
  },
  // You can add more mock server functions here as needed
}
