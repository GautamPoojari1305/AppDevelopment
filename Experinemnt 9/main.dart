import 'package:flutter/material.dart';
import 'package:math_expressions/math_expressions.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;

void main() {
  runApp(const CalculatorApp());
}

/// -----------------------------
/// Database helper (singleton)
/// -----------------------------
class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;
  DatabaseHelper._init();

  final String tableCalculations = 'calculations';

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('calculations.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = p.join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $tableCalculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expression TEXT NOT NULL,
        result TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )
    ''');
  }

  Future<int> insertCalculation(Map<String, dynamic> row) async {
    final db = await instance.database;
    return await db.insert(tableCalculations, row);
  }

  Future<List<Map<String, dynamic>>> getAllCalculations() async {
    final db = await instance.database;
    return await db.query(
      tableCalculations,
      orderBy: 'id DESC',
    );
  }

  Future<int> deleteCalculation(int id) async {
    final db = await instance.database;
    return await db.delete(tableCalculations, where: 'id = ?', whereArgs: [id]);
  }

  Future<int> clearAll() async {
    final db = await instance.database;
    return await db.delete(tableCalculations);
  }

  Future close() async {
    final db = await instance.database;
    db.close();
  }
}

/// -----------------------------
/// App & UI
/// -----------------------------
class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Calculator',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const CalculatorScreen(),
    );
  }
}

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({super.key});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  String _expression = "";
  String _result = "0";
  List<Map<String, dynamic>> _history = [];

  final dbHelper = DatabaseHelper.instance;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final rows = await dbHelper.getAllCalculations();
    setState(() {
      _history = rows;
    });
  }

  Future<void> _saveCalculationToDb(String expression, String result) async {
    final now = DateTime.now().toIso8601String();
    await dbHelper.insertCalculation({
      'expression': expression,
      'result': result,
      'timestamp': now,
    });
    await _loadHistory();
  }

  void _buttonPressed(String value) {
    setState(() {
      if (value == "C") {
        _expression = "";
        _result = "0";
      } else if (value == "=") {
        try {
          Parser p = Parser();
          Expression exp =
          p.parse(_expression.replaceAll('×', '*').replaceAll('÷', '/'));
          ContextModel cm = ContextModel();
          double eval = exp.evaluate(EvaluationType.REAL, cm);

          String evalStr = eval.toString();
          if (eval % 1 == 0) {
            evalStr = eval.toInt().toString();
          }

          _result = evalStr;
          _saveCalculationToDb(_expression, _result);
        } catch (e) {
          _result = "Error";
        }
      } else {
        _expression += value;
      }
    });
  }

  Widget _buildButton(String text, {Color? color}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(4.0),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: color ?? Colors.blueGrey[800],
            padding: const EdgeInsets.all(24),
          ),
          onPressed: () => _buttonPressed(text),
          child: Text(
            text,
            style: const TextStyle(fontSize: 24, color: Colors.white),
          ),
        ),
      ),
    );
  }

  Future<void> _deleteHistoryItem(int id) async {
    await dbHelper.deleteCalculation(id);
    await _loadHistory();
  }

  Future<void> _clearHistoryConfirm() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Clear all history?'),
        content: const Text('This will delete all saved calculations.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel')),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Delete')),
        ],
      ),
    );

    if (confirm == true) {
      await dbHelper.clearAll();
      await _loadHistory();
    }
  }

  @override
  void dispose() {
    dbHelper.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep),
            onPressed: _history.isNotEmpty ? _clearHistoryConfirm : null,
            tooltip: 'Clear all history',
          )
        ],
      ),
      body: Column(
        children: [
          // Display area
          Expanded(
            flex: 2,
            child: Container(
              padding: const EdgeInsets.all(20),
              alignment: Alignment.bottomRight,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    reverse: true,
                    child: Text(
                      _expression,
                      style:
                      const TextStyle(fontSize: 32, color: Colors.white70),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _result,
                    style: const TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: Colors.white),
                  ),
                ],
              ),
            ),
          ),

          // Buttons
          Column(
            children: [
              Row(
                children: [
                  _buildButton("7"),
                  _buildButton("8"),
                  _buildButton("9"),
                  _buildButton("÷", color: Colors.orange),
                ],
              ),
              Row(
                children: [
                  _buildButton("4"),
                  _buildButton("5"),
                  _buildButton("6"),
                  _buildButton("×", color: Colors.orange),
                ],
              ),
              Row(
                children: [
                  _buildButton("1"),
                  _buildButton("2"),
                  _buildButton("3"),
                  _buildButton("-", color: Colors.orange),
                ],
              ),
              Row(
                children: [
                  _buildButton("0"),
                  _buildButton("."),
                  _buildButton("C", color: Colors.red),
                  _buildButton("+", color: Colors.orange),
                ],
              ),
              Row(
                children: [
                  _buildButton("=", color: Colors.green),
                ],
              ),
            ],
          ),

          const Divider(color: Colors.white54),

          // History title
          Padding(
            padding:
            const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
            child: Row(
              children: [
                const Expanded(
                  child: Text('History',
                      style: TextStyle(color: Colors.white, fontSize: 18)),
                ),
                if (_history.isNotEmpty)
                  Text('${_history.length}',
                      style: const TextStyle(color: Colors.white54)),
              ],
            ),
          ),

          // History list
          Expanded(
            flex: 2,
            child: _history.isEmpty
                ? const Center(
                child: Text('No history yet',
                    style: TextStyle(color: Colors.white54)))
                : ListView.builder(
              itemCount: _history.length,
              itemBuilder: (context, index) {
                final row = _history[index];
                final id = row['id'] as int;
                final expr = row['expression'] as String;
                final res = row['result'] as String;

                return Dismissible(
                  key: ValueKey(id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    color: Colors.red,
                    alignment: Alignment.centerRight,
                    padding:
                    const EdgeInsets.symmetric(horizontal: 20),
                    child:
                    const Icon(Icons.delete, color: Colors.white),
                  ),
                  onDismissed: (_) async {
                    await _deleteHistoryItem(id);
                  },
                  child: ListTile(
                    tileColor: Colors.grey[900],
                    title: Text(expr,
                        style:
                        const TextStyle(color: Colors.white70)),
                    subtitle: Text(res,
                        style:
                        const TextStyle(color: Colors.white)),
                    trailing: IconButton(
                      icon: const Icon(Icons.replay,
                          color: Colors.white54),
                      onPressed: () {
                        setState(() {
                          _expression = expr;
                          _result = res;
                        });
                      },
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
