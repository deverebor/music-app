<script setup lang="ts">
import { ref } from "vue";
import type { ILoginValues } from "../../interfaces";
import { useUserStore } from "@/stores/user/user";

const userStore = useUserStore();

const validationLoginSchema = ref({
  email: "required|min:3|max:60|email",
  password: "required|min:8",
});

const loginOnSubmit = ref(false);
const loginShowAlert = ref(false);
const loginAlertVariant = ref("");
const loginAlertMessage = ref("");

async function loginFormSubmit(loginValues: ILoginValues) {
  loginShowAlert.value = true;
  loginOnSubmit.value = true;
  loginAlertVariant.value = "bg-blue-500";
  loginAlertMessage.value = "Please await your account is being logged in.";

  try {
    await userStore.loginCurrentUser(loginValues);
  } catch (error: any) {
    loginOnSubmit.value = false;
    loginAlertVariant.value = "bg-red-500";
    loginAlertMessage.value = "An unexpected error has occurred. Try again.";
    return;
  }

  loginAlertVariant.value = "bg-green-500";
  loginAlertMessage.value = "Your account has been logged in.";

  window.location.reload();
}
</script>
<template>
  <p
    v-if="loginShowAlert"
    class="text-white text-center font-bold p-4 rounded mb-4 transition-all"
    :class="loginAlertVariant"
  >
    {{ loginAlertMessage }}
  </p>
  <!-- Login Form -->
  <VeeForm @submit="loginFormSubmit" :validation-schema="validationLoginSchema">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <VeeErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <VeeErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loginOnSubmit"
      :class="{ 'opacity-50 cursor-not-allowed': loginOnSubmit }"
    >
      Submit
    </button>
  </VeeForm>
</template>
