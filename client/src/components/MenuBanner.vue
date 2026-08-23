<template>
  <section class="banner">
    <div class="copy">
      <h2>Your weekly kitchen</h2>
      <p>Save recipes, plan the week, and keep every flavor in one place.</p>
    </div>
  </section>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: end;
  min-height: 220px;
  margin-bottom: 22px;
  padding: 32px;
  overflow: hidden;
  border-radius: 24px;
  background-color: var(--terracotta);
  background-image:
    linear-gradient(90deg, rgba(45, 38, 31, 0.62) 0%, rgba(45, 38, 31, 0.28) 55%, rgba(45, 38, 31, 0.08) 100%),
    url('/menu-banner-bowl.png');
  background-position: right center;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fffaf3;
}

.copy {
  max-width: 28rem;
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
  color: rgba(255, 250, 243, 0.9);
}

@media (max-width: 640px) {
  .banner {
    min-height: 180px;
    padding: 24px;
    background-position: 70% center;
  }

  h2 {
    font-size: 1.6rem;
  }
}
</style>
