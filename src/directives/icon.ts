export const Icon = {
  beforeMount(el: any, binding: any) {
    let iconClass = `fa fa-${binding.value} float-right text-green-400 text-xl`;

    if (binding.arg === "full") {
      iconClass = binding.value;
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
