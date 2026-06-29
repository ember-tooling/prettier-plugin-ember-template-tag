<template>
  <SomeComponent
    @foo={{false}}
    {{! @glint-expect-error }}
    @bar={{false}}
  />
</template>
