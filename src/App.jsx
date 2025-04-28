import Input from "./components/Input";
import StudentList from "./components/StudentList";
import { AppState } from "./context/context";

function App() {
	const { students, missingItems, loading } = AppState();
	return (
		<>
			<Input />
			<StudentList
				students={students}
				missingItems={missingItems}
				loading={loading}
			/>
		</>
	);
}

export default App;
