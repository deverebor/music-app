<script setup lang="ts">
import { ref } from "vue";
import type { IInitialFormValues, IRegisterValues } from "../../interfaces";
import { useUserStore } from "@/stores/user/user";

const userStore = useUserStore();

const validationRegistrationSchema = ref({
  name: "required|min:3|max:60|alphaSpaces",
  email: "required|min:3|max:60|email",
  age: "required|between:18,100",
  password: "required|min:8|notOneOf:password",
  confirmPassword: "required|passwordsMismatch:@password",
  country: "required",
  tos: "tos",
});
const initialFormValues = ref({
  country: "Brazil",
} as IInitialFormValues);

const registrationOnSubmit = ref(false);
const registrationShowAlert = ref(false);
const registrationAlertVariant = ref("");
const registrationAlertMessage = ref("");

async function registerFormSubmit(registerValues: IRegisterValues) {
  registrationShowAlert.value = true;
  registrationOnSubmit.value = true;
  registrationAlertVariant.value = "bg-blue-500";
  registrationAlertMessage.value =
    "Please await your account is being created.";

  try {
    await userStore.registerNewUser(registerValues);
  } catch (error: any) {
    registrationOnSubmit.value = false;
    registrationAlertVariant.value = "bg-red-500";
    registrationAlertMessage.value =
      "An unexpected error has occurred. Try again.";
    return;
  }

  registrationAlertVariant.value = "bg-green-500";
  registrationAlertMessage.value = "Your account has been created.";
  window.location.reload();
}
</script>
<template>
  <!-- Registration Form -->
  <p
    v-if="registrationShowAlert"
    class="text-white text-center font-bold p-4 rounded mb-4 transition-all"
    :class="registrationAlertVariant"
  >
    {{ registrationAlertMessage }}
  </p>
  <VeeForm
    @submit="registerFormSubmit"
    :validation-schema="validationRegistrationSchema"
    :initial-values="initialFormValues"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <VeeErrorMessage name="name" class="text-red-600" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <VeeErrorMessage name="email" class="text-red-600" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <VeeErrorMessage name="age" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField :bails="false" name="password" #default="{ field, errors }">
        <input
          v-bind="field"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          placeholder="Password"
        />
        <p :key="error" v-for="error in errors" class="text-red-600">
          {{ error }}
        </p>
      </VeeField>
      <VeeErrorMessage name="password" class="text-red-600" />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        name="confirmPassword"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <VeeErrorMessage name="confirmPassword" class="text-red-600" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Brazil">Brazil</option>
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
      </VeeField>
      <VeeErrorMessage name="country" class="text-red-600" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <label class="inline-block">Accept terms of service</label>
      <VeeField
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <VeeErrorMessage name="tos" class="text-red-600 block" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="{ 'opacity-50 cursor-not-allowed': registrationOnSubmit }"
      :disabled="registrationOnSubmit"
    >
      Submit
    </button>
  </VeeForm>
</template>
