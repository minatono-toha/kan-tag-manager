<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      :class="zIndexClass"
      @click.self="handleOverlayClick"
    >
      <div
        class="rounded-lg shadow-lg p-6 transition-colors duration-200"
        :class="[containerClass, widthClass]"
        @click.stop
      >
        <!-- Header slot -->
        <div v-if="$slots.header || title" class="mb-4">
          <slot name="header">
            <h3
              class="text-lg font-medium"
              :class="theme !== 'light' ? 'text-white' : 'text-gray-900'"
            >
              {{ title }}
            </h3>
          </slot>
        </div>

        <!-- Main content slot -->
        <div class="modal-content">
          <slot></slot>
        </div>

        <!-- Footer slot -->
        <div v-if="$slots.footer || showDefaultFooter" class="mt-6">
          <slot name="footer">
            <div class="flex justify-end gap-2">
              <button
                v-if="showCancel"
                type="button"
                @click="handleCancel"
                class="px-4 py-2 text-sm rounded-md transition-colors"
                :class="theme !== 'light' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'"
              >
                {{ cancelText }}
              </button>
              <button
                v-if="showConfirm"
                type="button"
                @click="handleConfirm"
                :disabled="confirmDisabled"
                class="px-4 py-2 text-sm text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="confirmButtonClass"
              >
                {{ confirmText }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'BaseShipModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value: string) => ['light', 'dark', 'gradient'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    showDefaultFooter: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: 'キャンセル'
    },
    confirmText: {
      type: String,
      default: 'OK'
    },
    confirmDisabled: {
      type: Boolean,
      default: false
    },
    confirmVariant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'danger'].includes(value)
    }
  },
  emits: ['close', 'cancel', 'confirm'],
  setup(props, { emit }) {
    const containerClass = computed(() => {
      return props.theme !== 'light' ? 'bg-gray-800' : 'bg-white'
    })

    const widthClass = computed(() => {
      const widths: Record<string, string> = {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[500px]',
        xl: 'w-[600px]'
      }
      return widths[props.width]
    })

    const zIndexClass = computed(() => {
      return `z-[${props.zIndex}]`
    })

    const confirmButtonClass = computed(() => {
      if (props.confirmVariant === 'danger') {
        return 'bg-red-600 hover:bg-red-700'
      }
      return 'bg-blue-600 hover:bg-blue-700'
    })

    const handleOverlayClick = () => {
      if (props.closeOnOverlay) {
        emit('close')
      }
    }

    const handleCancel = () => {
      emit('cancel')
      emit('close')
    }

    const handleConfirm = () => {
      emit('confirm')
    }

    return {
      containerClass,
      widthClass,
      zIndexClass,
      confirmButtonClass,
      handleOverlayClick,
      handleCancel,
      handleConfirm
    }
  }
})
</script>

<style scoped>
</style>
