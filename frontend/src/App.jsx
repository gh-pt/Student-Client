import Input from "./components/Input";
import StudentList from "./components/StudentList";
import { AppState } from "./context/context";

function App() {
  const { students } = AppState();
  return (
    <>
      <Input />
      <StudentList students={students} />
    </>
  );
}

export default App;
