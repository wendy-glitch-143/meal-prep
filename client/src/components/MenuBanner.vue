<template>
  <section class="banner">
    <div class="copy">
      <h2>Your weekly kitchen</h2>
      <p>Save recipes, plan the week, and keep every flavor in one place.</p>
    </div>
    <img src="/menu-banner-bowl.png" alt="A bowl of meal-prep food" />
  </section>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  min-height: 180px;
  margin-bottom: 22px;
  padding: 28px 28px 0 32px;
  overflow: hidden;
  border-radius: 24px;
  background: var(--terracotta);
  color: #fffaf3;
}

.copy {
  max-width: 28rem;
  padding-bottom: 28px;
}

h2 {
  margin: 0 0 8px;
  font-size: 2rem;
  color: #fffaf3;
}

p {
  margin: 0;
  font-weight: 600;
  line-height: 1.4;
  color: rgba(255, 250, 243, 0.88);
}

img {
  width: min(220px, 38%);
  height: auto;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.18));
}

@media (max-width: 640px) {
  .banner {
    flex-direction: column;
    align-items: start;
    padding: 24px 24px 0;
  }

  h2 {
    font-size: 1.6rem;
  }

  img {
    width: 160px;
    align-self: end;
  }
}
</style>
