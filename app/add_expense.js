import { Picker } from "@react-native-picker/picker";
import { Button, Text, TextInput, View } from "react-native";
import styles from "./styles";

// Define the Addform component which is used to add new expenses
export default function Addform({
	name,
    setName,
    amount,
    setAmount,
    category,
    setCategory,
    categories,
    setExpenses,
    setAddForm,
    fetchExpenses,
	userId,
}) {
	const addExpenseHandler = async () => {
        let amountNumber = parseInt(amount);
        if (amountNumber <= 0 || name == "") {
            alert("Please enter a valid amount and name");
            return;
        }

        try {
            const response = await fetch("http://localhost/expense_tracker/add_expense.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}&amount=${amountNumber}&user_id=${userId}`,
            });
            const data = await response.json();

            if (data.success) {
                alert("Expense added successfully");
                setAddForm(false);
                fetchExpenses(); // Fetch updated expenses from the backend
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Failed to add expense: " + error.message);
        }
    };

	return (
		<View>
			<Text style={styles.heading3}>Add Form</Text>
			<Text style={styles.label}>Expense Name</Text>
			<TextInput
				onChangeText={(value) => setName(value)}
				value={name}
				style={styles.textInput}
				placeholder="Enter the expense name"
			/>

			<Text style={styles.label}>Amount</Text>
			<TextInput
				keyboardType="numeric"
				onChangeText={(value) => {
					value = value.replace(/[^0-9]/g, "");
					setAmount(value);
				}}
				value={amount}
				style={styles.textInput}
				placeholder="Amount"
			/>

			<Text style={styles.label}>Category</Text>
			<Picker
				style={styles.textInput}
				selectedValue={category}
				onValueChange={(itemValue) => setCategory(itemValue)}
			>
				{categories.map((category, index) => {
					return (
						<Picker.Item
							key={index}
							label={category}
							value={category}
						/>
					);
				})}
			</Picker>

			{/* Buttons to add or cancel expense */}
			<View style={styles.row}>
				<Button onPress={addExpenseHandler} title="Add Expense" />
				<Button onPress={() => setAddForm(false)} title="Cancel" />
			</View>
		</View>
	);
}