<template>
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_37_377)">
    <path d="M3.125 10H16.875" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.125 5H16.875" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.125 15H16.875" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_37_377">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
</svg>


</template>

<script lang="ts" setup>
const props = defineProps({

    height: {
        type: String,
        default : '20'
    },
    width: {
        type: String,
        default : '20'
    }

})
</script>

<style>

</style>