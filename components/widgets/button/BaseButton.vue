<template>
    <button
      :type="type"
      :class="[
        addClass,
        baseClasses,
        variantClasses,
        sizeClasses,
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  const props = defineProps({
    type: {
      type: String,
      default: 'button', // Bisa 'button', 'submit', atau 'reset'
    },
    variant: {
      type: String,
      default: 'primary', // Bisa 'primary', 'secondary', atau 'outline'
    },
    size: {
      type: String,
      default: 'md', // Bisa 'sm', 'md', atau 'lg'
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    addClass: {
        type: String,
        default: ''
    }
  });
  
  const emit = defineEmits(['click']);
  
  const handleClick = (event) => {
    if (!props.disabled) {
      emit('click', event);
    }
  };
  
  const baseClasses = 'inline-flex items-center justify-center font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-second focus:second';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
      case 'outline':
        return 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-100 focus:ring-blue-500';
      default:
        return '';
    }
  });
  
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return '';
    }
  });
  </script>
  