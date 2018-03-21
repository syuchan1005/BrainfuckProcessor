<template>
  <div class="decode">
    <md-content>
      <div>Text</div>
      <codemirror @change="debounceCreate" v-model="text" />
    </md-content>

    <md-button class="runBtn" @click="create">
      <md-icon class="md-size-4x">keyboard_arrow_down</md-icon>
    </md-button>

    <md-content>
      <div>Source Code</div>
      <codemirror v-model="source" />
    </md-content>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import Brainfuck from '../Brainfuck';

  export default {
    name: 'decode',
    data() {
      return {
        source: '',
      };
    },
    computed: {
      text: {
        get() {
          return this.$store.state.decode.text;
        },
        set(value) {
          this.$store.commit('decode_text', value);
        },
      },
    },
    methods: {
      debounceCreate: debounce(function () { /* eslint-disable-line func-names */
        this.create();
      }, 500),
      create() {
        this.source = Brainfuck.create(this.text, this.$store.state.brainfuck);
      },
    },
  };
</script>

<style scoped>
  .decode {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .decode > div {
    width: 100%;
    max-width: 45vw;
    height: 100%;
  }

  .runBtn {
    margin: 0 auto;
    transform: rotate(270deg);
  }

  .md-field {
    height: 100%;
  }

  @media all and (max-width: 750px) {
    .encode {
      flex-wrap: wrap;
    }

    .runBtn {
      transform: none;
    }
  }
</style>
