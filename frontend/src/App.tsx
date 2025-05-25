import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div className="text-teal-700">
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button className="cursor-pointer">Click me</Button>
      </div>
    </div>
  );
};

export default App;
