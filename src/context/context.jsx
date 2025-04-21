import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
	const [students, setStudents] = useState([]);
	const [missingItems, setMissingItems] = useState([]);

	return (
		<AppContext.Provider
			value={{ students, setStudents, missingItems, setMissingItems }}>
			{children}
		</AppContext.Provider>
	);
};

export const AppState = () => {
	return useContext(AppContext);
};

export default AppProvider;
