<template>
  <div class="setting">
    <md-field>
      <label>Increment the Pointer</label>
      <md-input v-model="incrementPointer"></md-input>
    </md-field>
    <md-field>
      <label>Decrement the pointer</label>
      <md-input v-model="decrementPointer"></md-input>
    </md-field>
    <md-field>
      <label>Increment the byte at the pointer</label>
      <md-input v-model="incrementBytePointer"></md-input>
    </md-field>
    <md-field>
      <label>Decrement the byte at the pointer</label>
      <md-input v-model="decrementBytePointer"></md-input>
    </md-field>
    <md-field>
      <label>Output the byte at the pointer</label>
      <md-input v-model="outputBytePointer"></md-input>
    </md-field>
    <md-field>
      <label>Input a byte and store it in the byte at the pointer</label>
      <md-input v-model="inputBytePointer"></md-input>
    </md-field>
    <md-field>
      <label>Jump forward</label>
      <md-input v-model="jumpForward"></md-input>
    </md-field>
    <md-field>
      <label>Jump backward</label>
      <md-input v-model="jumpBackward"></md-input>
    </md-field>
  </div>
</template>

<script>
const func = [
  'incrementPointer',
  'decrementPointer',
  'incrementBytePointer',
  'decrementBytePointer',
  'outputBytePointer',
  'inputBytePointer',
  'jumpForward',
  'jumpBackward',
];
const computed = {};
func.forEach((key) => {
  computed[key] = {
    get() {
      return this.$store.state.brainfuck[key];
    },
    set(value) {
      this.$store.commit(`brainfuck_${key}`, value);
    },
  };
});

export default {
  name: 'setting',
  computed,
};
</script>

<style scoped>
  .setting {
    padding: 20px;
  }
</style>
