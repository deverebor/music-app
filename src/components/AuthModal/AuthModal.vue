<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import type { IInitialFormValues, IRegisterValues } from "./interfaces";

const tab = ref("login");
const validationSchema = ref({
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
const registrationAlertVariant = ref("bg-blue-500");
const registrationAlertMessage = ref(
  "Please await your account is being created."
);

const store = useModalStore();
const { isOpen } = storeToRefs(store);

function register(registerValues: IRegisterValues) {
  registrationShowAlert.value = true;
  registrationOnSubmit.value = true;
  registrationAlertVariant.value = "bg-blue-500";
  registrationAlertMessage.value =
    "Please await your account is being created.";

  registrationAlertVariant.value = "bg-green-500";
  registrationAlertMessage.value = "Your account has been created.";
  console.log(registerValues);
}
</script>
<template>
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    :class="store.getHiddenClass"
    id="modal"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">
        &#8203;
      </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div
              class="modal-close cursor-pointer z-50"
              @click="isOpen = false"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                @click.prevent="tab = 'login'"
                :class="[
                  'block rounded py-3 px-4 transition ',
                  {
                    'hover:text-white text-white bg-blue-600': tab === 'login',
                    'hover:text-blue-600 text-gray-600': tab !== 'login',
                  },
                ]"
                href="#"
              >
                Login
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                @click.prevent="tab = 'register'"
                :class="[
                  'block rounded py-3 px-4 transition ',
                  {
                    'hover:text-white text-white bg-blue-600':
                      tab === 'register',
                    'hover:text-blue-600 text-gray-600': tab !== 'register',
                  },
                ]"
                href="#"
              >
                Register
              </a>
            </li>
          </ul>

          <!-- Login Form -->
          <form v-if="tab === 'login'">
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <input
                type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
              />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <input
                type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
          <!-- Registration Form -->
          <p
            v-if="registrationShowAlert"
            class="text-white text-center font-bold p-4 rounded mb-4"
            :class="registrationAlertVariant"
          >
            {{ registrationAlertMessage }}
          </p>
          <VeeForm
            v-if="tab === 'register'"
            @submit="register"
            :validation-schema="validationSchema"
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
              <VeeErroMessage name="name" class="text-red-600" />
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
              <VeeErroMessage name="email" class="text-red-600" />
            </div>
            <!-- Age -->
            <div class="mb-3">
              <label class="inline-block mb-2">Age</label>
              <VeeField
                name="age"
                type="number"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              />
              <VeeErroMessage name="age" class="text-red-600" />
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <VeeField
                :bails="false"
                name="password"
                #default="{ field, errors }"
              >
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
              <VeeErroMessage name="password" class="text-red-600" />
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
              <VeeErroMessage name="confirmPassword" class="text-red-600" />
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
              <VeeErroMessage name="country" class="text-red-600" />
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
              <VeeErroMessage name="tos" class="text-red-600 block" />
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
              :disabled="registrationOnSubmit"
            >
              Submit
            </button>
          </VeeForm>
        </div>
      </div>
    </div>
  </div>
</template>
