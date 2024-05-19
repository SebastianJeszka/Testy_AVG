import 'cypress-fail-fast';
import './commands';

Cypress.on('uncaught:exception', (err) => {
  // ignore cke editor error start
  if (err.message.includes(`Cannot read properties of null (reading 'unselectable')`)) {
    return false;
  }
  if (err.message.includes(`Cannot read properties of undefined (reading 'compatMode')`)) {
    return false;
  }
  // ignore cke editor error end

  // ignore monaco error start
  if (err.message.includes(`Could not find source file: 'inmemory://model/1'`)) {
    return false;
  }
  // ignore monaco error end
});
