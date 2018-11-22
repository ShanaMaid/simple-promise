const PENDING = 'pendinng';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(fn) {
  let state = PENDING;
  let value = null;
  const stack = [];

  this.then = (fn) => {
    return new Promise((resolve) => {
      handle({
        fn: fn || null,
        resolve,
      });
    });
  }

  const handle = (cb) => {
    if (state === PENDING) {
      stack.push(cb);
      return;
    }

    if (!cb.fn) {
      cb.resolve(value);
    }

    const result = cb.fn(value);
    cb.resolve(result); 
  }

  const resolve = (v) => {
    if (state !== PENDING) {
      return;
    }

    if (v instanceof Promise) {
      v.then(resolve);
      return;
    }
    
    // 使用settimeout是为了让then将所有队列压入stack后再执行
    setTimeout(() => {
      state = FULFILLED;
      value = v;
      stack.forEach((item) => {
        handle(item);
      })
    }, 0);
  }


  fn(resolve)
}

new Promise(r => {
  setTimeout(() => {
    r(1111)
  }, 4000)
})
.then((v) => {
  console.log(v);
  return 222222;
})
.then(v => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(v)
      resolve(333)
    }, 1000)
  });
}).then(v => {
  console.log(v);
  return 444;
});
