package com.example.mycounterapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    private int count = 0;
    private TextView counterText;
    private Button increaseButton, decreaseButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Link UI elements
        counterText = findViewById(R.id.counterText);
        increaseButton = findViewById(R.id.increaseButton);
        decreaseButton = findViewById(R.id.decreaseButton);

        // Increase counter
        increaseButton.setOnClickListener(v -> {
            count++;
            counterText.setText(String.valueOf(count));
        });

        // Decrease counter
        decreaseButton.setOnClickListener(v -> {
            count--;
            counterText.setText(String.valueOf(count));
        });
    }
}
