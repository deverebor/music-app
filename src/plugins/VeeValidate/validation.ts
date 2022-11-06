import {
  alpha_spaces as alphaSpaces,
  between,
  email,
  max,
  max_value as maxValue,
  min,
  min_value as minValue,
  required,
  confirmed,
  not_one_of as notOneOf,
} from "@vee-validate/rules";
import {
  configure,
  defineRule,
  ErrorMessage as VeeErroMessage,
  Field as VeeField,
  Form as VeeForm,
} from "vee-validate";

import type { App } from "vue";

export default {
  install(app: App) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("VeeErroMessage", VeeErroMessage);

    defineRule("alphaSpaces", alphaSpaces);
    defineRule("between", between);
    defineRule("passwordsMismatch", confirmed);
    defineRule("email", email);
    defineRule("max", max);
    defineRule("maxValue", maxValue);
    defineRule("min", min);
    defineRule("minValue", minValue);
    defineRule("required", required);
    defineRule("tos", required);
    defineRule("notOneOf", notOneOf);
    defineRule("notOneOf_country", notOneOf);

    configure({
      generateMessage: (context) => {
        const messages = {
          alphaSpaces: `The ${context.field} field may only contain alphabetic characters and spaces`,
          email: `The ${context.field} field must be a valid email`,
          max: `The ${context.field} field is too long`,
          maxValue: `The ${context.field} field is to high`,
          min: `The ${context.field} field is too short`,
          minValue: `The ${context.field} field is to low`,
          notOneOf_country: `Due to legal reasons, we do not accept users from ${context.value}`,
          notOneOf: `The ${context.field} field is not allowed`,
          passwordsMismatch: `The passwords don't match`,
          required: `The ${context.field} field is required`,
          tos: `You must accept the Terms of Services`,
        };

        const message = messages[context.rule.name]
          ? messages[context.rule.name]
          : `The ${context.field} field is invalid`;

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
