import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainScreen from "./components/mainScreen/MainScreen";
import About from "./components/about/About";
import Services from "./components/services/Services";
import Header from "./components/header/Header";

export default function App() {
	return (
		<>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<MainScreen />} />
					<Route path="/about" element={<About />} />
					<Route path="/services" element={<Services />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}
