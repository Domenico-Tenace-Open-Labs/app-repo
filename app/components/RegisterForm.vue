<script setup lang="ts">
/**
 * Registration form card as in the mockup (full name / email / password + Google).
 * Generic: emits credentials / google and navigation events; parent handles auth.
 */
defineProps<{
  loading?: boolean;
  googleLoading?: boolean;
}>();

const emit = defineEmits<{
  submit: [{ name: string; email: string; password: string }];
  google: [];
  login: [];
}>();

const name = ref("");
const email = ref("");
const password = ref("");

function handleSubmit() {
  if (!name.value || !email.value || !password.value) return;
  emit("submit", {
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
  });
}
</script>

<template>
  <VCard class="auth-card" variant="flat">
    <div class="text-center mb-5">
      <h2 class="text-h6 font-weight-bold">Create your Account</h2>
      <p class="text-caption text-medium-emphasis mt-1">
        Join the developer community to catalog modern software tools.
      </p>
    </div>

    <form class="d-flex flex-column ga-4" @submit.prevent="handleSubmit">
      <VTextField
        v-model="name"
        type="text"
        label="Full Name"
        placeholder="e.g. Domenica Tenace"
        variant="outlined"
        density="comfortable"
        hide-details
      />
      <VTextField
        v-model="email"
        type="email"
        label="Email Address"
        placeholder="name@example.com"
        variant="outlined"
        density="comfortable"
        hide-details
      />
      <VTextField
        v-model="password"
        type="password"
        label="Password"
        placeholder="At least 6 characters"
        :rules="[(v: string) => !v || v.length >= 6 || 'Password must be at least 6 characters']"
        variant="outlined"
        density="comfortable"
        hide-details
      />
      <VBtn
        type="submit"
        color="primary"
        size="large"
        :loading="loading"
      >
        Create Account
      </VBtn>
    </form>

    <div class="d-flex align-center justify-space-between my-4">
      <VDivider class="flex-grow-1" />
      <span class="mx-3 text-caption font-weight-bold text-medium-emphasis">Or</span>
      <VDivider class="flex-grow-1" />
    </div>

    <VBtn
      variant="outlined"
      color="primary"
      block
      :loading="googleLoading"
      @click="emit('google')"
    >
      <template #prepend>
        <GoogleIcon />
      </template>
      Register with Google
    </VBtn>

    <p class="text-caption text-center text-medium-emphasis mt-5">
      Already have an account?
      <VBtn
        variant="text"
        color="primary"
        density="compact"
        class="text-none px-0"
        @click="emit('login')"
      >
        Sign In
      </VBtn>
    </p>
  </VCard>
</template>

<style scoped>
.auth-card {
  padding: 2rem;
}
</style>