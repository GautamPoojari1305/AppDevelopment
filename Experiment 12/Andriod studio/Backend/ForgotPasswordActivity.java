package com.example.andriodauth;

import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;

public class ForgotPasswordActivity extends AppCompatActivity {

    private EditText etEmail;
    private Button btnReset;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        etEmail = findViewById(R.id.etEmail);
        btnReset = findViewById(R.id.btnReset);
        mAuth = FirebaseAuth.getInstance();

        btnReset.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                etEmail.setError("Enter a valid email");
                return;
            }
            btnReset.setEnabled(false);
            mAuth.sendPasswordResetEmail(email).addOnCompleteListener(task -> {
                btnReset.setEnabled(true);
                if (task.isSuccessful()) {
                    Toast.makeText(ForgotPasswordActivity.this, "Reset email sent", Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    String message = "Failed to send reset email";
                    if (task.getException() != null) message = task.getException().getMessage();
                    Toast.makeText(ForgotPasswordActivity.this, message, Toast.LENGTH_LONG).show();
                }
            });
        });
    }
}
