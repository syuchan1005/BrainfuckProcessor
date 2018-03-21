<template>
  <div class="encode">
    <div>
      <md-content class="code">
        <div>Source Code</div>
        <codemirror v-model="source" @change="debounceParse"/>
      </md-content>
      <md-field>
        <label>stdin</label>
        <md-textarea v-model="stdin"></md-textarea>
      </md-field>
    </div>

    <md-button class="runBtn" @click="parse">
      <md-icon class="md-size-4x">keyboard_arrow_down</md-icon>
    </md-button>

    <div>
      <md-table v-model="nodes" md-fixed-header class="table">
        <md-table-toolbar>
          <h1 class="md-title">Nodes</h1>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }" :data-op="item.operator">
          <md-table-cell md-label="Op">{{ item.operator }}</md-table-cell>
          <md-table-cell md-label="Pointer">{{ item.pointer }}</md-table-cell>
          <md-table-cell md-label="Data">{{ item.data }}</md-table-cell>
          <md-table-cell md-label="Char">{{ item.char }}</md-table-cell>
        </md-table-row>
      </md-table>

      <md-field :class="{ 'md-invalid': hasError }">
        <label>Result</label>
        <md-textarea readonly v-model="result"></md-textarea>
        <span class="md-error">There is an error</span>
      </md-field>
      <md-field>
        <label>Data Array</label>
        <md-textarea readonly v-model="dataView"></md-textarea>
      </md-field>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import Brainfuck from '../Brainfuck';

  export default {
    name: 'encode',
    data() {
      return {
        result: '',
        dataView: '',
        nodes: [],
        hasError: false,
        brainfuck: new Brainfuck(),
      };
    },
    computed: {
      source: {
        get() {
          return this.$store.state.encode.source;
        },
        set(value) {
          this.$store.commit('encode_source', value);
        },
      },
      stdin: {
        get() {
          return this.$store.state.encode.stdin;
        },
        set(value) {
          this.$store.commit('encode_stdin', value);
        },
      },
    },
    methods: {
      debounceParse: debounce(function () { /* eslint-disable-line func-names */
        this.parse();
      }, 500),
      parse() {
        this.nodes = [];
        this.hasError = false;
        this.brainfuck.parse(this.source, this.stdin, this.$store.state.brainfuck,
          true, (operator, pointer, data) => {
            if (this.nodes.length > 100) this.nodes.shift();
            this.nodes.push({
              operator, pointer, data, char: this.escape(String.fromCharCode(data)),
            });
          })
          .then((parseResult) => {
            this.result = parseResult.output;
            this.dataView = (parseResult.data || []).map(v => `${v}(${this.escape(String.fromCharCode(v))})`);
            const dom = document.getElementsByClassName('md-table-content')[0];
            setTimeout(() => {
              dom.scrollTop = dom.scrollHeight;
            }, 5);
          }).catch((err) => {
            this.hasError = true;
            this.result = err;
          });
      },
      escape(str) {
        return str
          .replace(/[\\]/g, '\\\\')
          .replace(/[\b]/g, '\\b')
          .replace(/[\f]/g, '\\f')
          .replace(/[\n]/g, '\\n')
          .replace(/[\r]/g, '\\r')
          .replace(/[\t]/g, '\\t');
      },
    },
  };
</script>

<style scoped>
  .encode {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .encode > div {
    width: 100%;
    max-width: 45vw;
  }

  .code {
    min-height: 521px;
  }

  .table {
    min-width: 377px;
    min-height: 521px;
  }

  .md-table-row[data-op='.'] {
    background-color: rgba(111, 194, 255, 0.4);
  }

  .runBtn {
    margin: 0 auto;
    transform: rotate(270deg);
  }

  @media all and (max-width: 750px) {
    .encode {
      flex-wrap: wrap;
    }

    .encode > div {
      max-width: none;
    }

    .runBtn {
      transform: none;
    }
  }
</style>
