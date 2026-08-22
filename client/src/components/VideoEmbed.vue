<script setup>
import { computed } from 'vue';
import { parseVideo } from '../video';

const props = defineProps({
  url: { type: String, default: '' },
});

const video = computed(() => parseVideo(props.url));
</script>

<template>
  <div v-if="video" class="wrap" :class="{ tall: video.tall }">
    <p class="source">{{ video.source }}</p>
    <div class="frame">
      <iframe
        :src="video.embed"
        title="Recipe video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      />
    </div>
    <a class="open" :href="url" target="_blank" rel="noreferrer">Open original</a>
  </div>
</template>

<style scoped>
.wrap {
  margin: 18px 0 8px;
}

.source {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 0.85rem;
}

.frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: var(--chip-bg);
}

.tall .frame {
  max-width: 360px;
  aspect-ratio: 9 / 16;
}

iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.open {
  display: inline-block;
  margin-top: 8px;
  color: var(--sage-dark);
  font-size: 0.88rem;
  font-weight: 600;
}
</style>
