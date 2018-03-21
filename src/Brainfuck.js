class Brainfuck {
  constructor() {
    this.functions = {
      incrementPointer: () => {
        this.ptr += 1;
        if (this.debug) this.write('>', this.ptr, this.data[this.ptr]);
      }, // '>'
      decrementPointer: () => {
        this.ptr -= 1;
        if (this.ptr < 0) this.ptr = 0;
        if (this.debug) this.write('<', this.ptr, this.data[this.ptr]);
      }, // '<'
      incrementBytePointer: () => {
        this.data[this.ptr] = this.data[this.ptr] || 0;
        this.data[this.ptr] += 1;
        if (this.debug) this.write('+', this.ptr, this.data[this.ptr]);
      }, // '+'
      decrementBytePointer: () => {
        this.data[this.ptr] = this.data[this.ptr] || 0;
        this.data[this.ptr] -= 1;
        if (this.debug) this.write('-', this.ptr, this.data[this.ptr]);
      }, // '-'
      outputBytePointer: () => {
        const c = String.fromCharCode(this.data[this.ptr]);
        this.output.push(c);
        if (this.debug) this.write('.', this.ptr, this.data[this.ptr]);
      }, // '.'
      inputBytePointer: () => {
        const c = this.stdin.shift();
        if (typeof c === 'string') this.data[this.ptr] = c.charCodeAt(0);
        if (this.debug) this.write(',', this.ptr, this.data[this.ptr]);
      }, // ','
      jumpForward: '[',
      jumpBackward: ']',
    };
  }

  parse(source, stdin, ops, debug, debugWrite) {
    return new Promise((resolve, reject) => {
      if (!source) resolve('');
      this.source = source;
      this.stdin = stdin.split('').filter(v => v.length !== 0);
      const op = Object.assign({
        incrementPointer: '>',
        decrementPointer: '<',
        incrementBytePointer: '+',
        decrementBytePointer: '-',
        outputBytePointer: '.',
        inputBytePointer: ',',
        jumpForward: '[',
        jumpBackward: ']',
      }, ops);
      this.operators = {};
      Object.keys(op).forEach((key) => { this.operators[op[key]] = key; });
      this.jumpForward = op.jumpForward;
      this.jumpBackward = op.jumpBackward;
      this.debug = Boolean(debug);
      this.write = debugWrite || console.log; /* eslint-disable-line no-console */

      this.output = [];
      this.data = [];
      this.ptr = 0;
      try {
        const nodes = this.parseProgram();
        nodes.forEach((node) => { node(); });
      } catch (err) {
        reject(err);
      }
      resolve({
        output: this.output.join(''),
        data: this.data,
      });
    });
  }

  parseProgram() {
    const nodes = [];
    while (this.source.length > 0) {
      let ch = false;
      Object.keys(this.operators).some((operator) => {
        if (this.source.startsWith(operator)) {
          ch = true;
          const func = this.functions[this.operators[operator]];
          this.source = this.source.substr(operator.length);
          if (typeof func === 'string') {
            if (func === '[') {
              nodes.push(this.parseLoop());
            } else {
              throw new Error('Missing opening function');
            }
          } else if (func) {
            nodes.push(func);
          }
          return true;
        }
        return false;
      });
      if (!ch) throw new Error('Unknown operator');
    }
    return nodes;
  }

  parseLoop() {
    const nodes = [];

    while (!this.source.startsWith(this.jumpBackward)) {
      let ch = false;
      Object.keys(this.operators).some((operator) => {
        if (this.source.startsWith(operator)) {
          ch = true;
          const func = this.functions[this.operators[operator]];
          this.source = this.source.substr(operator.length);
          if (typeof func === 'string' && func === '[') {
            nodes.push(this.parseLoop());
          } else {
            nodes.push(func);
          }
          return true;
        }
        return false;
      });
      if (!ch) throw new Error('Missing closing operator');
    }

    this.source = this.source.substr(this.jumpBackward.length);

    return () => {
      let loopCounter = 0;
      while (this.data[this.ptr] > 0) {
        loopCounter += 1;
        if (loopCounter > 10000) throw new Error('Infinite loop detected');
        nodes.forEach((node) => { node(); });
      }
    };
  }

  static create(text, ops) {
    const op = Object.assign({
      incrementPointer: '>',
      decrementPointer: '<',
      incrementBytePointer: '+',
      decrementBytePointer: '-',
      outputBytePointer: '.',
      inputBytePointer: ',',
      jumpForward: '[',
      jumpBackward: ']',
    }, ops);
    let output = '';
    let before = 0;
    text.split('').filter(v => v.length !== 0).forEach((char) => {
      const sub = char.charCodeAt(0) - before;
      before = char.charCodeAt(0);
      output += `${(sub > 0 ? op.incrementBytePointer : op.decrementBytePointer).repeat(Math.abs(sub))}${op.outputBytePointer}`;
    });
    return output;
  }
}

export default Brainfuck;
