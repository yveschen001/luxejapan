<template>
  <div class="section-divider-block">
    <img src="@/assets/images/section-divider-1.svg" alt="装饰分割线" class="section-divider" />
  </div>
</template>

<style scoped>
.section-divider-block {
  width: 100vw;
  min-width: 100%;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 0;
  background: transparent;
}
.section-divider {
  width: 100%;
  max-width: 1200px;
  height: 2px;
  display: block;
}
@media (min-width: 600px) {
  .section-divider-block {
    height: 14px;
  }
  .section-divider {
    height: 3px;
  }
}
</style> 