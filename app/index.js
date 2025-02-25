import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import styles from "./styles";
import Addform from "./add_expense";
import ExpenseComponent from "./expense_component";

export default function App() {
	const [userId, setUserId] = useState(null); // To track logged-in user
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("Food");
	const [expenses, setExpenses] = useState([]);
	const [addForm, setAddForm] = useState(false);
	const categories = ["Food", "Clothes", "Bills", "Others"];
	const [chartData, setChartData] = useState([
		{ name: "Food", amount: 0, color: "#e62d20", legendFontColor: "#7F7F7F", legendFontSize: 15 },
		{ name: "Clothes", amount: 0, color: "#27e620", legendFontColor: "#7F7F7F", legendFontSize: 15 },
		{ name: "Bills", amount: 0, color: "#1c6bd9", legendFontColor: "#7F7F7F", legendFontSize: 15 },
		{ name: "Others", amount: 0, color: "#5adbac", legendFontColor: "#7F7F7F", legendFontSize: 15 },
	]);

	const fetchExpenses = async () => {
		try {
			const response = await fetch(`http://localhost/expense_tracker/get_expenses.php?user_id=${userId}`);
			const data = await response.json();

			// Update expenses and chart data
			setExpenses(data);
			const updatedChartData = chartData.map((category) => {
				const total = data
					.filter((expense) => expense.category === category.name)
					.reduce((sum, expense) => sum + parseInt(expense.amount), 0);
				return { ...category, amount: total };
			});
			setChartData(updatedChartData);
		} catch (error) {
			alert("Failed to fetch expenses: " + error.message);
		}
	};

	const handleAuth = async () => {
		const url = isRegistering
			? "http://localhost/expense_tracker/register.php"
			: "http://localhost/expense_tracker/login.php";

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
			});
			const data = await response.json();

			if (data.success) {
				alert(isRegistering ? "Registered successfully" : "Login successful");
				setUserId(data.user_id || null); // Set the logged-in user ID
				if (!isRegistering) fetchExpenses(); // Fetch user-specific expenses after login
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	const toggleForm = () => setIsRegistering(!isRegistering);

	useEffect(() => {
		if (userId) fetchExpenses();
	}, [userId]);

	if (!userId) {
		// Render login/registration form
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar style="auto" />
				<Text style={styles.heading}>Expensify</Text>
				<TextInput
					placeholder="Username"
					value={username}
					onChangeText={setUsername}
					style={styles.textInput}
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					style={styles.textInput}
					secureTextEntry
				/>
				<Button title={isRegistering ? "Register" : "Login"} onPress={handleAuth} />
				<Button title={isRegistering ? "Switch to Login" : "Switch to Register"} onPress={toggleForm} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="auto" />
			<Text style={styles.heading}>Welcome, {username}!</Text>
			<PieChart
				data={chartData}
				width={300}
				height={200}
				chartConfig={{
					backgroundGradientFrom: "#1E2923",
					backgroundGradientTo: "#08130D",
					color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
				}}
				accessor="amount"
				backgroundColor="transparent"
				paddingLeft="15"
				absolute
			/>
			{addForm ? (
				<Addform
					name={name}
					setName={setName}
					amount={amount}
					setAmount={setAmount}
					category={category}
					setCategory={setCategory}
					categories={categories}
					setExpenses={setExpenses}
					setAddForm={setAddForm}
					fetchExpenses={fetchExpenses}
					userId={userId}
				/>
			) : (
				<View style={styles.row}>
					<Button onPress={() => setAddForm(true)} title="Add Expense" color="green" />
				</View>
			)}
			<ExpenseComponent expenses={expenses} fetchExpenses={fetchExpenses} />
		</SafeAreaView>
	);
}
