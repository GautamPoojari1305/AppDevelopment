package com.example.andriodauth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class HomeActivity extends AppCompatActivity {

    private TextView tvEmail, tvUid;
    private Button btnSignOut;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        tvEmail = findViewById(R.id.tvEmail);
        tvUid = findViewById(R.id.tvUid);
        btnSignOut = findViewById(R.id.btnSignOut);
        mAuth = FirebaseAuth.getInstance();

        FirebaseUser user = mAuth.getCurrentUser();
        if (user == null) {
            // Not authenticated
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        tvEmail.setText("Email: " + user.getEmail());
        tvUid.setText("UID: " + user.getUid());

        btnSignOut.setOnClickListener(v -> {
            mAuth.signOut();
            // Return to login
            startActivity(new Intent(HomeActivity.this, LoginActivity.class));
            finish();
        });
    }
}
