<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-semibold mb-2">
      {{ label }}
    </label>

    <div v-if="withIcon" class="flex">
      <div class="border border-r-0 text-sm px-3 py-2 w-fit rounded-l">
        {{ icon }}
      </div>
      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        class=""
        :class="`${
          error ? 'border-danger' : 'border-gray-300'
        } ${baseClass} flex-grow rounded-r`"
      />
    </div>

    <div v-if="!withIcon">
      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="`${error ? 'border-danger' : 'border-gray-300'} ${baseClass} ${
          variant == 'underline' ? '' : 'rounded-md'
        } `"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "normal",
  },
  withIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    default: "+62",
  },
});

const baseClass = computed(() => {
  switch (props.variant) {
    case "normal":
      return "block w-full px-3  py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm";
    case "underline":
      return "block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer";
  }
});
</script>
