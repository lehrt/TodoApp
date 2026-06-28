import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <TodoList />
    </FluentProvider>
  );
}

export default App;
