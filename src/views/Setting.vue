<template>
  <div class="setting">
    <md-field v-for="([name, obj]) in Object.entries(func)" :key="name">
      <label>{{ obj.title }}</label>
      <md-input
        :value="$store.state.brainfuck[name]"
        @input="(v) => $store.commit(`brainfuck_${name}`, v)"
      />
      <md-button
        class="md-icon-button md-dense"
        @click="restore(name)"
      >
        <md-icon>settings_backup_restore</md-icon>
      </md-button>
    </md-field>
  </div>
</template>

<script>
const func = {
  incrementPointer: {
    value: '>',
    title: 'Increment the Pointer',
  },
  decrementPointer: {
    value: '<',
    title: 'Decrement the pointer',
  },
  incrementBytePointer: {
    value: '+',
    title: 'Increment the byte at the pointer',
  },
  decrementBytePointer: {
    value: '-',
    title: 'Decrement the byte at the pointer',
  },
  outputBytePointer: {
    value: '.',
    title: 'Output the byte at the pointer',
  },
  inputBytePointer: {
    value: ',',
    title: 'Input a byte and store it in the byte at the pointer',
  },
  jumpForward: {
    value: '[',
    title: 'Jump forward',
  },
  jumpBackward: {
    value: ']',
    title: 'Jump backward',
  },
};

export default {
  name: 'setting',
  computed: {
    func: () => func,
  },
  methods: {
    restore(funcName) {
      this.$store.commit(`brainfuck_${funcName}`, func[funcName].value);
    },
  },
};
</script>

<style scoped>
  .setting {
    padding: 20px;
  }
</style>
