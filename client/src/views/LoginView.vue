<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../auth';

const { login } = useAuth();
const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await login({ username: username.value, password: password.value });
    router.push('/planner');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="card auth-card">
      <p class="eyebrow">Welcome back</p>
      <h1>Log in to Prepd</h1>
      <p class="lead">Plan the week, then shop once.</p>
      <form @submit.prevent="onSubmit">
        <p v-if="error" class="error">{{ error }}</p>
        <div class="field">
          <label for="username">Username</label>
          <input id="username" v-model="username" autocomplete="username" required />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Log in' }}
        </button>
      </form>
      <p class="switch">
        New here?
        <router-link to="/signup">Create an account</router-link>
      </p>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-card {
  width: min(420px, 100%);
  padding: 36px 32px;
}

.eyebrow {
  color: var(--sage-dark);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
  margin: 0 0 8px;
}

h1 {
  margin: 0;
}

.lead,
.switch {
  color: var(--muted);
}

form {
  margin-top: 22px;
}

.btn {
  width: 100%;
}

.switch a {
  color: var(--terracotta);
  font-weight: 600;
}
</style>
