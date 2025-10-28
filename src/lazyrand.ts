const u64 = new BigUint64Array(1);
const f64 = new Float64Array(u64.buffer);

const randF64 = () => {
  crypto.getRandomValues(u64);
  return f64[0];
};

const sleep = async () => {
  return new Promise<void>((res) => setTimeout(res, 600));
}

export { randF64, sleep };
