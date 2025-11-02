// App.js — Expo + Firebase Auth + React Native Paper (Flutter-style UI)

import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Provider as PaperProvider,
  Button,
  TextInput,
  Snackbar,
  Dialog,
  Portal,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

// ---------------------------
// 🔥 Firebase Config
// ---------------------------
const firebaseConfig = {
  apiKey: 'AIzaSyASCnZTpbTGrXJUEKJaOaPwIqIq8kThgFU',
  authDomain: 'reactauth-519b0.firebaseapp.com',
  projectId: 'reactauth-519b0',
  storageBucket: 'reactauth-519b0.firebasestorage.app',
  messagingSenderId: '618387552841',
  appId: '1:618387552841:web:af4728349f7914a2321d98',
  measurementId: 'G-8H6KLEEGRE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ---------------------------
// Helper for friendly error messages
// ---------------------------
function firebaseErrorMessage(code, fallback) {
  switch (code) {
    case 'auth/user-not-found':
      return 'User not found.';
    case 'auth/wrong-password':
      return 'Invalid password.';
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/weak-password':
      return 'Password too weak (min 8 chars).';
    case 'auth/email-already-in-use':
      return 'Email already in use.';
    case 'auth/too-many-requests':
      return 'Too many attempts, try again later.';
    default:
      return fallback || 'Authentication failed. Try again.';
  }
}

// ---------------------------
// 🌟 App Component
// ---------------------------
export default function App() {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);
  const [tabIndex, setTabIndex] = React.useState(0); // 0 = SignIn, 1 = SignUp
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [snackbar, setSnackbar] = React.useState({ visible: false, message: '', type: 'info' });
  const [signOutDialog, setSignOutDialog] = React.useState(false);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return () => unsub();
  }, [initializing]);

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  // Sign In
  async function handleSignIn() {
    setErrorText('');
    if (!validateEmail(email)) return setErrorText('Enter a valid email.');
    if (!password || password.length < 8) return setErrorText('Password must be at least 8 characters.');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSnackbar({ visible: true, message: 'Signed in successfully', type: 'success' });
    } catch (err) {
      setErrorText(firebaseErrorMessage(err.code, err.message));
    } finally {
      setLoading(false);
    }
  }

  // Sign Up
  async function handleSignUp() {
    setErrorText('');
    if (!validateEmail(email)) return setErrorText('Enter a valid email.');
    if (!password || password.length < 8) return setErrorText('Password must be at least 8 characters.');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: '' });
      setSnackbar({ visible: true, message: 'Account created successfully', type: 'success' });
    } catch (err) {
      setErrorText(firebaseErrorMessage(err.code, err.message));
    } finally {
      setLoading(false);
    }
  }

  // Google Sign In (works in web preview)
  async function handleGoogleSignIn() {
    try {
      await signInWithPopup(auth, googleProvider);
      setSnackbar({ visible: true, message: 'Signed in with Google', type: 'success' });
    } catch (err) {
      setErrorText(firebaseErrorMessage(err.code, err.message));
    }
  }

  // Reset Password
  async function handlePasswordReset() {
    if (!validateEmail(email)) return setErrorText('Enter valid email for reset link.');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSnackbar({ visible: true, message: `Reset link sent to ${email}`, type: 'success' });
    } catch (err) {
      setErrorText(firebaseErrorMessage(err.code, err.message));
    } finally {
      setLoading(false);
    }
  }

  // Sign Out
  async function confirmSignOut() {
    setSignOutDialog(false);
    try {
      await signOut(auth);
      setSnackbar({ visible: true, message: 'Signed out', type: 'info' });
    } catch {
      setSnackbar({ visible: true, message: 'Sign out failed', type: 'error' });
    }
  }

  // ---------------------------
  // Loading Screen
  // ---------------------------
  if (initializing) {
    return (
      <PaperProvider>
        <View style={styles.centerScreen}>
          <ActivityIndicator animating size="large" />
        </View>
      </PaperProvider>
    );
  }

  // ---------------------------
  // Protected Dashboard
  // ---------------------------
  if (user) {
    const createdAt = user.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleString()
      : 'N/A';

    return (
      <PaperProvider>
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardHeaderTitle}>Dashboard (Protected)</Text>
          <Icon name="logout" size={24} color="#fff" onPress={() => setSignOutDialog(true)} />
        </View>

        <ScrollView contentContainerStyle={styles.dashboardContainer}>
          <Avatar.Text size={80} label={user.email?.[0]?.toUpperCase() || '?'} style={{ backgroundColor: '#e8eaf6' }} />
          <Text style={styles.title}>Welcome Home!</Text>
          <Text style={styles.subtitle}>Your session is authenticated and protected.</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Icon name="email-outline" size={22} color="#555" />
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="key-outline" size={22} color="#555" />
              <Text style={styles.label}>UID:</Text>
              <Text style={styles.value}>{user.uid}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="check-decagram-outline" size={22} color="#555" />
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{user.emailVerified ? 'Verified' : 'Unverified'}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="calendar" size={22} color="#555" />
              <Text style={styles.label}>Created:</Text>
              <Text style={styles.value}>{createdAt}</Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={() => setSignOutDialog(true)}
            icon="logout"
            buttonColor="#d32f2f"
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
        </ScrollView>

        <Portal>
          <Dialog visible={signOutDialog} onDismiss={() => setSignOutDialog(false)}>
            <Dialog.Title>Confirm Sign Out</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to sign out?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setSignOutDialog(false)}>Cancel</Button>
              <Button onPress={confirmSignOut}>Sign Out</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          duration={3000}
        >
          {snackbar.message}
        </Snackbar>
      </PaperProvider>
    );
  }

  // ---------------------------
  // Sign In / Sign Up Screen
  // ---------------------------
  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.authContainer}>
          <Text style={styles.appTitle}>React Native Firebase Auth</Text>

          <View style={styles.tabRow}>
            <Button
              mode={tabIndex === 0 ? 'contained' : 'outlined'}
              onPress={() => {
                setTabIndex(0);
                setErrorText('');
              }}
              style={styles.tabButton}
            >
              Sign In
            </Button>
            <Button
              mode={tabIndex === 1 ? 'contained' : 'outlined'}
              onPress={() => {
                setTabIndex(1);
                setErrorText('');
              }}
              style={styles.tabButton}
            >
              Sign Up
            </Button>
          </View>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="email-outline" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="key-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {tabIndex === 0 && (
            <Button mode="text" onPress={handlePasswordReset}>
              Forgot Password?
            </Button>
          )}

          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

          <Button
            mode="contained"
            onPress={tabIndex === 0 ? handleSignIn : handleSignUp}
            loading={loading}
            style={styles.submitButton}
          >
            {tabIndex === 0 ? 'Sign In' : 'Sign Up'}
          </Button>

          <Text style={styles.orText}>OR</Text>

          <Button mode="outlined" icon="google" onPress={handleGoogleSignIn} disabled={loading}>
            {tabIndex === 0 ? 'Sign In with Google' : 'Sign Up with Google'}
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </PaperProvider>
  );
}

// ---------------------------
// 💅 Styles
// ---------------------------
const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },

  authContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },

  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#3f51b5',
    marginBottom: 20,
  },

  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },

  input: {
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },

  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 6,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },

  orText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: 10,
  },

  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    padding: 16,
  },

  dashboardHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  dashboardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f8fb',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },

  subtitle: {
    color: '#555',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    padding: 20,
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  label: {
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 4,
  },

  value: {
    flex: 1,
    fontFamily: 'monospace',
    color: '#333',
  },

  signOutButton: {
    backgroundColor: '#d32f2f',
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 10,
  },
});
