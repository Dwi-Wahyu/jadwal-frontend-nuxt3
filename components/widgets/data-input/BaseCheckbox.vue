<template>
    <div class="flex items-center space-x-2">
      <input
        :id="id"
        type="checkbox"
        :value="value"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="h-5 w-5 text-yellow-500 ring-yellow-500 rounded focus:ring-yellow-500 focus:ring-2 appearance-none checked:bg-yellow-500 border-yellow ring-2 checked:before:content-['✔'] checked:before:text-white checked:before:block checked:before:text-center"
      />
      <label v-if="label" :for="id" class="text-sm ">
        {{ label }}
      </label>
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Boolean],
      default: true,
    },
  });
  </script>
  