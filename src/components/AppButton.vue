<template>
  <RouterLink v-if="to" :to="to" :class="classes" @click.prevent="onClick">
    <slot></slot
  ></RouterLink>
  <component
    :is="tag"
    :type="type"
    :class="classes"
    :href="href"
    :target="target"
    :rel="rel"
    @click="onClick"
    v-else
  >
    <AppIcon icon="Loader" size="small" v-if="loading"></AppIcon>
    <AppIcon :icon="icon" v-else-if="icon" />

    <span v-if="!iconOnly"><slot></slot></span>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const emit = defineEmits(['click']);

const props = defineProps({
  to: {
    type: String,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
  text: {
    type: Boolean,
    default: false,
  },
  link: {
    type: Boolean,
    default: false,
  },
  menu: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Boolean,
    default: false,
  },
  href: {
    type: String,
  },
  target: {
    type: String,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator(value) {
      return ['left', 'right'].includes(value);
    },
  },
  type: {
    type: String,
    validator(value) {
      return ['button', 'submit', 'reset'].includes(value);
    },
  },
  tag: {
    type: String,
    default: 'button',
    validator(value) {
      return ['a', 'button'].includes(value);
    },
  },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value);
    },
  },
});

const rel = computed(() => {
  return props.target === '_blank' && props.href ? 'noopener' : null;
});

const classes = computed(() => ({
  // General button style
  'inline-flex whitespace-nowrap justify-center items-center gap-3': true,
  'select-none': true,
  'cursor-pointer': !props.disabled,
  'ease-in duration-200': true,
  'border border-transparent': true,

  // Only primary & secondary are rounded
  'rounded-lg':
    props.primary | props.secondary | props.field | props.menu | props.text,

  // Primary
  'bg-black text-white hover:bg-opacity-60': props.primary && !props.disabled,
  'bg-gray-500 text-gray-200': props.primary && props.disabled,

  // Secondary
  'text-black border-black hover:bg-neutral-200':
    props.secondary && !props.disabled,
  'border-black opacity-50': props.secondary && props.disabled,

  // Text
  'text-black border-transparent font-bold hover:bg-neutral-200':
    props.text && !props.disabled,
  'opacity-50': props.text && props.disabled,

  // Link
  'inline-block bg-transparent text-black underline hover:opacity-70':
    props.link,
  'text-red': props.link && props.primary,

  // Menu
  'bg-gray-200 hover:bg-neutral-200': props.menu,

  // Field
  'bg-gray-400 py-1 px-4 text-white hover:bg-gray-500 focus:bg-gray-500':
    props.field,

  // Disabled
  'cursor-not-allowed ': props.disabled || props.loading,

  // Icon right
  'flex-row-reverse': props.iconPosition == 'right',

  // Icon only
  'w-14 h-14': props.iconOnly,
  'rounded-full': props.iconOnly && props.rounded,

  // Size
  'px-2 py-1 md:px-3 md:py-1 text-sm':
    props.size === 'small' && !props.link && !props.field,
  'px-3 py-2 md:px-3 md:py-3':
    props.size === 'medium' && !props.link && !props.field,
  'px-5 py-5': props.size === 'large' && !props.link,

  // Full with button
  'w-full': props.full,
}));

const onClick = (e) => {
  if (props.tag != 'a') {
    e.preventDefault();
  }

  if (!props.disabled && !props.loading) emit('click');
};
</script>

<style scoped>
.router-link-active {
  @apply cursor-default bg-neutral-200;
}
</style>
