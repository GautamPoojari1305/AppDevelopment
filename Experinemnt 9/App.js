import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

// ================= MAIN APP COMPONENT =================
function TodoApp() {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [deletedHistory, setDeletedHistory] = useState([]);

  // Create tables and load data
  useEffect(() => {
    const setupDatabase = async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          completed INT
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS deleted (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          deleted_at TEXT
        );
      `);

      await loadTodos();
      await loadDeletedHistory();
    };
    setupDatabase();
  }, []);

  // Load todos
  const loadTodos = async () => {
    const result = await db.getAllAsync('SELECT * FROM todos;');
    setTodos(result);
  };

  // Load deleted history
  const loadDeletedHistory = async () => {
    const result = await db.getAllAsync('SELECT * FROM deleted ORDER BY id DESC;');
    setDeletedHistory(result);
  };

  // Add new todo
  const addTodo = async () => {
    if (text.trim().length === 0) {
      Alert.alert('Empty Task!', 'Please enter a task before adding.');
      return;
    }
    await db.runAsync('INSERT INTO todos (text, completed) VALUES (?, ?);', [text, 0]);
    setText('');
    await loadTodos();
  };

  // Toggle completed status
  const toggleTodo = async (id, completed) => {
    const newStatus = completed ? 0 : 1;
    await db.runAsync('UPDATE todos SET completed = ? WHERE id = ?;', [newStatus, id]);
    await loadTodos();
  };

  // Delete todo and store it in history
  const deleteTodo = async (id, text) => {
    await db.runAsync('DELETE FROM todos WHERE id = ?;', [id]);
    await db.runAsync(
      'INSERT INTO deleted (text, deleted_at) VALUES (?, datetime("now"));',
      [text]
    );
    await loadTodos();
    await loadDeletedHistory();
  };

  // Render todo item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id, item.completed)}
      onLongPress={() => deleteTodo(item.id, item.text)}
    >
      <Text style={[styles.todoText, item.completed ? styles.completedText : null]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id, item.text)}>
        <Text style={styles.deleteButton}>❌</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render deleted history item
  const renderDeletedItem = ({ item }) => (
    <View style={styles.deletedItem}>
      <Text style={styles.deletedText}>{item.text}</Text>
      <Text style={styles.deletedTime}>{item.deleted_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 To Do List</Text>

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
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />

      <Text style={styles.historyHeader}>🗑️ Deleted Tasks</Text>

      <FlatList
        data={deletedHistory}
        renderItem={renderDeletedItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.historyList}
      />

      <StatusBar style="auto" />
    </View>
  );
}

// ================= APP WRAPPER WITH SQLITE PROVIDER =================
export default function App() {
  return (
    <SQLiteProvider databaseName="todo.db">
      <TodoApp />
    </SQLiteProvider>
  );
}

// =================== STYLES ===================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  todoText: {
    fontSize: 18,
    flex: 1,
    color: '#495057',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#adb5bd',
  },
  deleteButton: {
    fontSize: 20,
    color: '#dc3545',
  },
  historyHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    color: '#6c757d',
  },
  historyList: {
    maxHeight: 150,
  },
  deletedItem: {
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  deletedText: {
    color: '#dc3545',
    fontSize: 16,
  },
  deletedTime: {
    fontSize: 12,
    color: '#6c757d',
  },
});
