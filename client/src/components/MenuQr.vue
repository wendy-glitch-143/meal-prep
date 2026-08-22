<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import QRCode from 'qrcode';

const open = ref(false);
const dataUrl = ref('');
const copied = ref(false);

const publicUrl = computed(() => `${window.location.origin}/view`);

async function makeQr() {
  dataUrl.value = await QRCode.toDataURL(publicUrl.value, {
    width: 240,
    margin: 1,
    color: { dark: '#2d261f', light: '#fffaf3' },
  });
}

async function copyLink() {
  await navigator.clipboard.writeText(publicUrl.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}

onMounted(makeQr);
watch(publicUrl, makeQr);
</script>

<template>
  <button class="btn btn-ghost" type="button" @click="open = true">QR menu</button>
  <div v-if="open" class="overlay" @click.self="open = false">
    <section class="card sheet">
      <h2>Public menu</h2>
      <p>Guests scan this to view the menu and planner. No login or edits.</p>
      <img v-if="dataUrl" :src="dataUrl" alt="QR code for the public menu" />
      <code>{{ publicUrl }}</code>
      <div class="actions">
        <button class="btn btn-sage" type="button" @click="copyLink">
          {{ copied ? 'Copied' : 'Copy link' }}
        </button>
        <button class="btn btn-ghost" type="button" @click="open = false">Close</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 38, 31, 0.35);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 20;
}

.sheet {
  width: min(360px, 100%);
  padding: 22px;
  text-align: center;
}

p,
code {
  color: var(--muted);
}

img {
  width: 220px;
  height: 220px;
  margin: 12px 0;
}

code {
  display: block;
  word-break: break-all;
  font-size: 0.78rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
}
</style>
