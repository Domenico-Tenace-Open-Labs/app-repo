<script setup lang="ts">
/**
 * Login form card as in the mockup (email/password + Google OAuth switch).
 * Generic: emits credentials / google and navigation events; parent handles auth.
 */
defineProps<{
  loading?: boolean;
  googleLoading?: boolean;
}>();

const emit = defineEmits<{
  submit: [{ email: string; password: string }];
  google: [];
  register: [];
}>();

const email = ref("");
const password = ref("");

function handleSubmit() {
  if (!email.value || !password.value) return;
  emit("submit", { email: email.value.trim(), password: password.value });
}
</script>

<template>
  <VCard class="auth-card" variant="flat">
    <div class="text-center mb-5">
      <h2 class="text-h6 font-weight-bold">Login to App Repo</h2>
      <p class="text-caption text-medium-emphasis mt-1">
        Access your bookmarks and share useful resources with our developer network.
      </p>
    </div>

    <form class="d-flex flex-column ga-4" @submit.prevent="handleSubmit">
      <VTextField
        v-model="email"
        type="email"
        label="Email Address"
        placeholder="name@email.com"
        variant="outlined"
        density="comfortable"
        hide-details
      />
      <VTextField
        v-model="password"
        type="password"
        label="Password"
        placeholder="••••••••"
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
        Sign In
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
      Sign In with Google
    </VBtn>

    <p class="text-caption text-center text-medium-emphasis mt-5">
      Don't have an account?
      <VBtn
        variant="text"
        color="primary"
        density="compact"
        class="text-none px-0"
        @click="emit('register')"
      >
        Sign Up
      </VBtn>
    </p>
  </VCard>
</template>

<style scoped>
.auth-card {
  padding: 2rem;
}
</style>