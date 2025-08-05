import QueryClientProvider from "./src/QueryClientProvider.js";
import App from "./src/App";

export default function Main() {
  return (
    <QueryClientProvider>
      <App/>
    </QueryClientProvider>
  );
}