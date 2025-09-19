import 'dart:io'; // Import the dart:io library for input/output operations.

void main() {
  // --- Output ---
  // This line prints a message to the console, asking the user for input.
  stdout.write('Please enter a number: ');

  // --- Input ---
  // Read a line of text from the console. The '!' asserts that the result is not null.
  String? userInput = stdin.readLineSync();

  // Parse the string input to an integer. If parsing fails, use a default value of 0.
  int number = int.tryParse(userInput ?? '0') ?? 0;

  // Print a new line for better formatting.
  print('\n--- Multiplication Table for $number ---');

  // --- Loop ---
  // Use a for loop to iterate from 1 to 10.
  for (int i = 1; i <= 10; i++) {
    // Calculate the product.
    int product = number * i;

    // Print the result for each iteration.
    print('$number x $i = $product');
  }
}
