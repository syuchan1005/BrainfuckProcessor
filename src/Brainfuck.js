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

  static create(text, ops, minify = true, minifyOptions = {
    subMin: 50, rhoMax: 50, rhoLenMax: 5, countMax: 3,
  }) {
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
      if (minify && sub > minifyOptions.subMin && output.length === 0) {
        let s = Brainfuck.decompose(sub);
        let count = 0;
        while (s.some(a => a >= minifyOptions.rhoMax)) {
          count += 1;
          s = s.map((a) => {
            if (a >= minifyOptions.rhoMax) {
              return Brainfuck.decompose(a - 1);
            }
            return a;
          }).flat();
          if (count >= minifyOptions.countMax
            || s.length > minifyOptions.rhoLenMax
            || s.every(a => a < minifyOptions.rhoMax)) break;
        }
        const calc = s.reduce((p, n) => p * n);
        output += `${op.incrementBytePointer.repeat(s.shift())}${s.reduce((p, n) => `${p}${op.jumpForward}${op.decrementBytePointer}${op.incrementPointer}${op.incrementBytePointer.repeat(n)}`, '')}${`${op.decrementPointer}${op.jumpBackward}`.repeat(s.length)}${op.incrementPointer.repeat(s.length)}${op.incrementBytePointer.repeat(sub - calc)}.`;
      } else {
        output += `${(sub > 0 ? op.incrementBytePointer : op.decrementBytePointer).repeat(Math.abs(sub))}${op.outputBytePointer}`;
      }
    });
    return output;
  }

  static factor(num) {
    const prho = (n) => {
      const isPrime = (na) => {
        const primes = [2, 3, 5, 7, 11];
        for (let j = 0; primes[j] <= Math.sqrt(na); j += 1) {
          if (na % primes[j] === 0) return false;
        }
        return true;
      };
      const gcd = (a, b) => {
        console.log(a, b);
        let m = a;
        let na = b;
        if (m < na) {
          const r = m;
          m = na;
          na = r;
        }

        while (m % na !== 0) {
          console.log('C');
          const r = m % na;
          m = na;
          na = r;
        }

        return na;
      };
      if (n % 2 === 0) return n === 2 ? false : 2;
      if (isPrime(n)) return false;
      const g = x => ((x ** 2) + 1);
      let x = 2;
      let y = 2;
      let d = 1;

      while (d === 1) {
        console.log('B');
        x = g(x);
        y = g(g(y));
        d = gcd(Math.abs(x - y), n);
      }

      return d === n ? false : d;
    };
    let n = Number(num);
    const o = [];
    let d = prho(n);
    if (!d) return [n];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('A');
      o.push(d);
      n /= d;
      d = prho(n);
      if (!d) {
        o.push(n);
        break;
      }
    }

    return o;
  }

  static decompose(
    num,
    max,
    calcLength = (arr => arr.reduce((p, n) => p + n, /* op len */ arr.length * 5)),
  ) {
    const maxI = max || num - 1;
    const isPrime = (na) => {
      const primes = [2, 3, 5, 7, 11];
      for (let j = 0; primes[j] <= Math.sqrt(na); j += 1) {
        if (na % primes[j] === 0) return false;
      }
      return true;
    };
    if (isPrime(num)) return [num];
    const res = [];
    for (let i = maxI; i > 1; i -= 1) {
      const t = num / i;
      if (Number.isInteger(t)) {
        res.push([t, i]);
      }
    }
    if (res.length === 0) return [num];
    return res.reduce((p, n) => (((calcLength(p)) > calcLength(n)) ? n : p));
  }
}

export default Brainfuck;
