<template>
  <TransitionRoot :show="dialogs[dialog]" as="template">
    <Dialog @close="close" as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full w-full flex-1 items-center justify-center p-4 text-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-2/3 transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <div
                  class="mb-6 flex items-center justify-between border-b border-gray-300 pb-4"
                  v-if="$slots.title || closeButton"
                >
                  <DialogTitle as="div">
                    <h6 class="font-bold uppercase">{{ title }}</h6>
                  </DialogTitle>

                  <div class="-mx-3 -my-2 md:-mx-4 md:-my-3">
                    <AppButton
                      icon="Close"
                      v-if="closeButton"
                      @click="close"
                    ></AppButton>
                  </div>
                </div>
                <slot></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { inject } from 'vue';

const { dialogs } = inject('dialog');

const props = defineProps({
  dialog: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  closeButton: {
    type: Boolean,
    default: true,
  },
});

dialogs.value[props.dialog] = false;

function close() {
  dialogs.value[props.dialog] = false;
}
</script>
