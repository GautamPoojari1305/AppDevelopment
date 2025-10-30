import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // ✅ make sure this path is correct

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // ================== Load Todos from Firestore (Real-time) ==================
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  // ================== Add a Todo ==================
  const addTodo = async () => {
    if (text.trim().length === 0) {
      Alert.alert("Empty Task!", "Please enter a task before adding.");
      return;
    }

    try {
      await addDoc(collection(db, "todos"), {
        text,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // ================== Toggle Completed Status ==================
  const toggleTodo = async (id, completed) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { completed: !completed });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // ================== Delete Todo ==================
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // ================== Render Todo Item ==================
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id, item.completed)}
      onLongPress={() =>
        Alert.alert("Delete Task", "Are you sure you want to delete this?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => deleteTodo(item.id) },
        ])
      }
    >
      <Text style={[styles.todoText, item.completed ? styles.completedText : null]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButton}>❌</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // ================== UI ==================
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 My To-Do List (Firestore)</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          onChangeText={setText}
          value={text}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <StatusBar style="auto" />
    </View>
  );
}

// ================== Styles ==================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  todoText: {
    fontSize: 18,
    flex: 1,
    color: "#495057",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#adb5bd",
  },
  deleteButton: {
    fontSize: 20,
    color: "#dc3545",
  },
});
