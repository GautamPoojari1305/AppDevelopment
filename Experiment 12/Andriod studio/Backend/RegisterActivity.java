package com.example.andriodauth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;

public class RegisterActivity extends AppCompatActivity {

    private EditText etEmail, etPassword, etConfirm;
    private Button btnRegister;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etConfirm = findViewById(R.id.etConfirm);
        btnRegister = findViewById(R.id.btnRegister);

        mAuth = FirebaseAuth.getInstance();

        btnRegister.setOnClickListener(v -> registerUser());
    }

    private void registerUser() {
        String email = etEmail.getText().toString().trim();
        String pw = etPassword.getText().toString();
        String confirm = etConfirm.getText().toString();

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("Enter a valid email");
            return;
        }
        if (pw.length() < 8) {
            etPassword.setError("Password must be at least 8 characters");
            return;
        }
        if (!pw.equals(confirm)) {
            etConfirm.setError("Passwords do not match");
            return;
        }
        btnRegister.setEnabled(false);

        mAuth.createUserWithEmailAndPassword(email, pw)
                .addOnCompleteListener(task -> {
                    btnRegister.setEnabled(true);
                    if (task.isSuccessful()) {
                        Toast.makeText(RegisterActivity.this, "Account created", Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(RegisterActivity.this, HomeActivity.class));
                        finish();
                    } else {
                        String message = "Registration failed";
                        if (task.getException() != null) message = task.getException().getMessage();
                        Toast.makeText(RegisterActivity.this, message, Toast.LENGTH_LONG).show();
                    }
                });
    }
}
