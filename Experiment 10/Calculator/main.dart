import 'package:flutter/material.dart';
import 'package:math_expressions/math_expressions.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Calculator with History',
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

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  void _buttonPressed(String value) async {
    setState(() {
      if (value == "C") {
        _expression = "";
        _result = "0";
      } else if (value == "=") {
        try {
          Parser p = Parser();
          Expression exp = p.parse(
              _expression.replaceAll('×', '*').replaceAll('÷', '/'));
          ContextModel cm = ContextModel();
          double eval = exp.evaluate(EvaluationType.REAL, cm);
          _result = eval.toString();

          // Save calculation to Firestore
          _firestore.collection('calculations').add({
            'expression': _expression,
            'result': _result,
            'timestamp': FieldValue.serverTimestamp(),
          });
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

  Widget _buildHistory() {
    return Expanded(
      child: StreamBuilder<QuerySnapshot>(
        stream: _firestore
            .collection('calculations')
            .orderBy('timestamp', descending: true)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          final docs = snapshot.data!.docs;
          return ListView(
            children: docs.map((doc) {
              final data = doc.data() as Map<String, dynamic>;
              return ListTile(
                title: Text(
                  "${data['expression']} = ${data['result']}",
                  style: const TextStyle(color: Colors.white),
                ),
              );
            }).toList(),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(20),
                alignment: Alignment.bottomRight,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      _expression,
                      style: const TextStyle(fontSize: 32, color: Colors.white70),
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
            _buildHistory(),
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
          ],
        ),
      ),
    );
  }
}
