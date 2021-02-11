<template>
  <div class="w-screen h-screen">
    <picture class="flex w-full h-full absolute inset-0 z-0">
      <source srcset="./assets/sunset.avif" type="image/avif" />
      <source srcset="./assets/sunset.webp" type="image/webp" />
      <img src="./assets/sunset.jpg" alt="" class="w-full h-full object-cover object-center" />
    </picture>
    <div class="absolute inset-0 z-10 bg-grey-150 opacity-90" />
    <main class="relative z-20 p-16">
      <header>
        <div class="relative z-10 text-grey-900 space-y-4">
          <h1 ref="headerSalutation" class="text-5xl font-light origin-top-left">
            <span ref="headerSalutationInner" class="origin-left block">Good Morning, Tim</span>
          </h1>
          <h2 ref="headerQuery" class="text-5xl font-light origin-top-left">What would you like to do?</h2>
        </div>
        <div ref="headerBackground" class="bg-grey-400 absolute inset-x-0 top-0 h-24 origin-top" />
      </header>
      <div class="mt-64 space-x-2">
        <button @click="send(state.value === 'locked' ? 'UNLOCK' : 'LOCK')" class="p-2 bg-blue-700 text-blue-50">
          toggle
        </button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { assign, createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { presets, useSpring } from 'coilix'
import gsap from 'gsap'

const headerSalutation = ref<HTMLElement>()
const headerSalutationInner = ref<HTMLElement>()
const headerQuery = ref<HTMLElement>()
const headerBackground = ref<HTMLElement>()

const lockedStyles = {
  headerSalutation: { opacity: 1, y: 0, x: 0 },
  headerSalutationInner: { scale: 1 },
  headerQuery: { opacity: 0.6, y: 0, x: 0, scale: 1 },
  headerBackground: { opacity: 0, scaleY: 0.2 },
}
const unlockedStyles = {
  headerSalutation: { opacity: 0, y: -64, x: -32 },
  headerSalutationInner: { scale: 0.5 },
  headerQuery: { opacity: 0.6, y: -92, x: -32, scale: 0.5 },
  headerBackground: { opacity: 0.2, scaleY: 1 },
}

const { state, send } = useMachine(
  createMachine({
    initial: 'locked',
    context: lockedStyles,
    states: {
      locked: { entry: assign(lockedStyles), on: { UNLOCK: 'home' } },
      home: { entry: assign(unlockedStyles), on: { LOCK: 'locked' } },
    },
  }),
)

onMounted(() => {
  const setHeaderSalutation = gsap.quickSetter(headerSalutation.value!, 'css')
  const setHeaderSalutationInner = gsap.quickSetter(headerSalutationInner.value!, 'css')
  const setHeaderQuery = gsap.quickSetter(headerQuery.value!, 'css')
  const setHeaderBackground = gsap.quickSetter(headerBackground.value!, 'css')

  useSpring(
    () => state.value.context.headerSalutation,
    () => (state.value.value === 'locked' ? presets.default : { mass: 1, tension: 100, friction: 12 }),
    { onUpdate: (values) => setHeaderSalutation(values) },
  )
  useSpring(
    () => state.value.context.headerSalutationInner,
    () =>
      state.value.value === 'locked'
        ? { mass: 1, tension: 60, friction: 14, precision: 0.0001, restingVelocity: 0.00001 }
        : { ...presets.default, precision: 0.0001, restingVelocity: 0.00001 },
    { onUpdate: (values) => setHeaderSalutationInner(values) },
  )
  useSpring(
    () => state.value.context.headerQuery,
    { mass: 1, tension: 175, friction: 30 },
    { onUpdate: (values) => setHeaderQuery(values) },
  )
  useSpring(
    () => state.value.context.headerBackground,
    { mass: 1, tension: 150, friction: 25 },
    { onUpdate: (values) => setHeaderBackground(values) },
  )
})
</script>
