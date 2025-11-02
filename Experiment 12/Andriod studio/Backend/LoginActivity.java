package com.example.andriodauth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;

public class LoginActivity extends AppCompatActivity {

    private EditText etEmail, etPassword;
    private Button btnSignIn;
    private TextView tvToRegister, tvForgot;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnSignIn = findViewById(R.id.btnSignIn);
        tvToRegister = findViewById(R.id.tvToRegister);
        tvForgot = findViewById(R.id.tvForgot);

        mAuth = FirebaseAuth.getInstance();

        btnSignIn.setOnClickListener(v -> signIn());
        tvToRegister.setOnClickListener(v -> startActivity(new Intent(this, RegisterActivity.class)));
        tvForgot.setOnClickListener(v -> startActivity(new Intent(this, ForgotPasswordActivity.class)));
    }

    private void signIn() {
        String email = etEmail.getText().toString().trim();
        String pw = etPassword.getText().toString();

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("Enter a valid email");
            return;
        }
        if (pw.length() < 8) {
            etPassword.setError("Password must be at least 8 characters");
            return;
        }
        btnSignIn.setEnabled(false);

        mAuth.signInWithEmailAndPassword(email, pw)
                .addOnCompleteListener(task -> {
                    btnSignIn.setEnabled(true);
                    if (task.isSuccessful()) {
                        startActivity(new Intent(LoginActivity.this, HomeActivity.class));
                        finish();
                    } else {
                        String message = "Authentication failed";
                        if (task.getException() != null) message = task.getException().getMessage();
                        Toast.makeText(LoginActivity.this, message, Toast.LENGTH_LONG).show();
                    }
                });
    }
}
