import type {
  IRegisterValues,
  ILoginValues,
} from "@/components/AuthModal/interfaces";
import { firebaseAuth, usersCollection } from "@/includes/Firebase/firebase";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const isUserLoggedIn = ref(false);

  async function registerNewUser(registerValues: IRegisterValues) {
    const userLoggedInCredentials =
      await firebaseAuth.createUserWithEmailAndPassword(
        registerValues.email,
        registerValues.password
      );

    await usersCollection.doc(userLoggedInCredentials.user?.uid).set({
      name: registerValues.name,
      email: registerValues.email,
      age: registerValues.age,
      country: registerValues.country,
    });

    await userLoggedInCredentials.user?.updateProfile({
      displayName: registerValues.name,
    });

    isUserLoggedIn.value = true;
  }

  async function loginCurrentUser(loginValues: ILoginValues) {
    await firebaseAuth.signInWithEmailAndPassword(
      loginValues.email,
      loginValues.password
    );

    isUserLoggedIn.value = true;
  }

  async function logoutCurrentUser() {
    await firebaseAuth.signOut();

    isUserLoggedIn.value = false;
  }

  return {
    isUserLoggedIn,
    registerNewUser,
    loginCurrentUser,
    logoutCurrentUser,
  };
});
