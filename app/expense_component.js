import { Platform, Alert, Button, ScrollView, Text, View } from "react-native";
import styles from "./styles";

export default function ExpenseComponent({ expenses, fetchExpenses }) {
	return (
		<ScrollView
			style={{
				marginBottom: 80,
			}}
		>
			{expenses.map((expense) => {
				console.log(expense);
				return (
					<ExpenseListTile
						key={expense.id}
						expense={expense}
						fetchExpenses={fetchExpenses}
					/>
				);
			})}
		</ScrollView>
	);
}

const ExpenseListTile = ({
	expense,
	fetchExpenses
}) => {

	const deleteExpenseHandler = async (expenseId) => {
        try {
            const response = await fetch("http://localhost/expense_tracker/delete_expense.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `id=${expenseId}`,
            });
            const data = await response.json();

            if (data.success) {
                alert("Expense deleted successfully");
                fetchExpenses(); // Fetch updated expenses
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Failed to delete expense: " + error.message);
        }
    };

	const showAlert = (title, message, onConfirm, onCancel) => {
		if (Platform.OS === "web") {
			if (window.confirm(`${title}\n\n${message}`)) {
				onConfirm();
			} else {
				if (onCancel) onCancel();
			}
		} else {
			Alert.alert(title, message, [
				{
					text: "Yes",
					onPress: onConfirm,
				},
				{
					text: "No",
					onPress: onCancel,
				},
			]);
		}
	};

	return (
		<View style={styles.expenseTile}>
			<Text style={styles.expenseTileText}>{expense.name}</Text>
			<Text style={styles.expenseTileText}>{expense.category}</Text>
			<Text style={styles.expenseTileText}>{expense.amount}</Text>
			<Button
                onPress={() => showAlert("Delete", "Are you sure you want to delete?", () => deleteExpenseHandler(expense.id))}
                title="Delete"
            />
		</View>
	);
};