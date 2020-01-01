/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const brainfuck = {
  incrementPointer: '>',
  decrementPointer: '<',
  incrementBytePointer: '+',
  decrementBytePointer: '-',
  outputBytePointer: '.',
  inputBytePointer: ',',
  jumpForward: '[',
  jumpBackward: ']',
};

const brainfuckMutations = {};
Object.keys(brainfuck).forEach((key) => {
  // @ts-ignore
  brainfuckMutations[`brainfuck_${key}`] = (state, data) => {
    state.brainfuck[key] = data;
  };
});

export default new Vuex.Store({
  state: {
    brainfuck,
    encode: {
      source: '',
      stdin: '',
    },
    decode: {
      text: '',
    },
  },
  mutations: {
    ...brainfuckMutations,
    encode_source(state, data) {
      state.encode.source = data;
    },
    encode_stdin(state, data) {
      state.encode.stdin = data;
    },
    decode_text(state, data) {
      state.decode.text = data;
    },
  },
});
