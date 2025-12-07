// Function of two variables
function f(x, y) {
  return Math.exp(-(x * x + y * y));
}

// 2D Simpson's Rule
function doubleIntegrate(func, ax, bx, ay, by, nx = 100, ny = 100) {
  if (nx % 2 !== 0) nx++;
  if (ny % 2 !== 0) ny++;

  const hx = (bx - ax) / nx;
  const hy = (by - ay) / ny;
  let sum = 0;

  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= ny; j++) {
      const x = ax + i * hx;
      const y = ay + j * hy;

      let coeff = 1;
      if (i === 0 || i === nx) coeff *= 1; else if (i % 2 === 0) coeff *= 2; else coeff *= 4;
      if (j === 0 || j === ny) coeff *= 1; else if (j % 2 === 0) coeff *= 2; else coeff *= 4;

      sum += coeff * func(x, y);
    }
  }

  return (hx * hy / 9) * sum;
}

// Example: ∫∫ e^(-(x^2+y^2)) dx dy over [0,1]x[0,1]
const result = doubleIntegrate(f, 0, 1, 0, 1, 100, 100);
console.log("Double integration result:", result);