import { parseStructured } from '../dsl';

/**
 * Original Math AA HL Paper 3-style investigations: a pattern is explored with numbers,
 * a conjecture is made, then proved and extended. Numeric answers verified in Python.
 */
export const mathPaper3 = parseStructured(
  'math',
  String.raw`
@struct M1 style=P3
Q: **Sums of products of consecutive integers.** ¶ Let $S_n = \displaystyle\sum_{r=1}^{n} r(r+1)$, so $S_1 = 2$ and $S_2 = 2 + 6 = 8$.
a) [1] Show that $S_3 = 20$.
M: $2 + 6 + 12 = 20$ (A1)
b) [2] Find $S_5$.
= 70 abs=0
M: $S_4 = 40$, $S_5 = 40 + 30 = 70$ (M1 A1)
c) [2] Calculate $\dfrac{S_n}{n(n+1)}$ for $n = 1, 2, 3, 4, 5$ and hence conjecture an expression for $S_n$ in terms of $n$.
M: Values $1, \tfrac43, \tfrac53, 2, \tfrac73$, i.e. $\tfrac{n+2}{3}$ (A1) ¶ $S_n = \dfrac{n(n+1)(n+2)}{3}$ (A1)
d) [6] Prove your conjecture by mathematical induction.
M: $n = 1$: $S_1 = 2 = \tfrac{1\cdot2\cdot3}{3}$, true (A1) ¶ Assume true for $n = k$: $S_k = \tfrac{k(k+1)(k+2)}{3}$ (M1) ¶ $S_{k+1} = \tfrac{k(k+1)(k+2)}{3} + (k+1)(k+2)$ (M1) ¶ $= \tfrac{(k+1)(k+2)(k+3)}{3}$ (A1) ¶ which is the formula with $n = k + 1$ (A1) ¶ Conclusion: true for $n = 1$ and true for $k$ implies true for $k + 1$, so true for all $n \in \mathbb{Z}^+$ (R1)
e) [2] Let $T_n = \displaystyle\sum_{r=1}^{n} r(r+1)(r+2)$. Find $T_3$.
= 90 abs=0
M: $6 + 24 + 60 = 90$ (M1 A1)
f) [3] Conjecture a formula for $T_n$ and check it for $n = 3$. Generalise to $\displaystyle\sum_{r=1}^{n} r(r+1)\cdots(r+k-1)$.
M: $T_n = \dfrac{n(n+1)(n+2)(n+3)}{4}$ (A1) ¶ $n = 3$: $\tfrac{3\cdot4\cdot5\cdot6}{4} = 90$ (A1) ¶ General: $\dfrac{n(n+1)\cdots(n+k)}{k+1}$ (A1)
g) [4] Show that $r(r+1)(r+2) - (r-1)r(r+1) = 3r(r+1)$. Hence, by summing from $r = 1$ to $n$, prove the result for $S_n$ without induction.
M: Factorise $r(r+1)[(r+2) - (r-1)] = 3r(r+1)$ (A1) ¶ Summing, the left side telescopes (M1) ¶ to $n(n+1)(n+2) - 0$ (A1) ¶ so $3S_n = n(n+1)(n+2)$ (A1)
h) [3] Use $r^2 = r(r+1) - r$ to find $\displaystyle\sum_{r=1}^{20} r^2$.
= 2870 abs=0
M: $\sum r^2 = S_n - \tfrac{n(n+1)}{2} = \tfrac{n(n+1)(2n+1)}{6}$ (M1 A1) ¶ $n = 20$: $2870$ (A1)
S: The structure (numbers → conjecture → proof → generalisation → application) is typical of Paper 3. Write the conjecture explicitly before proving it.

@struct M1 style=P3
Q: **Roots of unity.** ¶ For an integer $n \ge 2$, let $\omega = e^{2\pi i/n}$. The solutions of $z^n = 1$ are $1, \omega, \omega^2, \ldots, \omega^{n-1}$.
a) [2] Write down the six solutions of $z^6 = 1$ in the form $e^{i\theta}$ and plot them on an Argand diagram.
M: $e^{ik\pi/3}$, $k = 0, 1, \ldots, 5$ (A1) ¶ Vertices of a regular hexagon on the unit circle (A1)
b) [2] For $n = 6$, find $1 + \omega + \omega^2 + \cdots + \omega^5$.
= 0 abs=0.001
M: Pairs of opposite roots cancel, e.g. $\omega^3 = -1$ (M1) ¶ Sum $= 0$ (A1)
c) [3] Prove that $1 + \omega + \cdots + \omega^{n-1} = 0$ for every $n \ge 2$.
M: Geometric series with ratio $\omega \ne 1$ (M1) ¶ Sum $= \dfrac{\omega^n - 1}{\omega - 1}$ (A1) ¶ $= 0$ because $\omega^n = 1$ (R1)
d) [3] Hence show that $\displaystyle\sum_{k=0}^{n-1}\cos\frac{2\pi k}{n} = 0$, and find $\displaystyle\sum_{k=1}^{4}\cos\frac{2\pi k}{5}$.
= -1 abs=0.001
M: Real part of the sum in (c) (M1) ¶ $\sum_{k=0}^{4} = 0$ (A1) ¶ Removing the $k = 0$ term: $0 - 1 = -1$ (A1)
e) [4] Explain why $z^n - 1 = \displaystyle\prod_{k=0}^{n-1}(z - \omega^k)$. By dividing by $z - 1$, show that $\displaystyle\prod_{k=1}^{n-1}(1 - \omega^k) = n$, and state its value for $n = 6$.
= 6 abs=0.001
M: The $\omega^k$ are the $n$ distinct roots of a monic polynomial of degree $n$ (R1) ¶ $\dfrac{z^n - 1}{z - 1} = 1 + z + \cdots + z^{n-1} = \prod_{k=1}^{n-1}(z - \omega^k)$ (M1 A1) ¶ Put $z = 1$: product $= n$; for $n = 6$ it is $6$ (A1)
f) [4] Show that $|1 - e^{i\theta}| = 2\left|\sin\dfrac{\theta}{2}\right|$.
M: $1 - e^{i\theta} = e^{i\theta/2}(e^{-i\theta/2} - e^{i\theta/2})$ (M1) ¶ $= -2i\,e^{i\theta/2}\sin\tfrac{\theta}{2}$ (A1) ¶ $|e^{i\theta/2}| = 1$ and $|-2i| = 2$ (M1) ¶ so the modulus is $2|\sin\tfrac{\theta}{2}|$ (A1)
g) [4] Hence prove that $\displaystyle\prod_{k=1}^{n-1}\sin\frac{k\pi}{n} = \frac{n}{2^{n-1}}$ and evaluate it for $n = 6$.
= 0.1875 rel=0.001
M: Take moduli in (e): $\prod_{k=1}^{n-1}|1 - \omega^k| = n$ (M1) ¶ Each factor is $2\sin\tfrac{k\pi}{n}$ (positive for $0 < k < n$) (A1) ¶ $2^{n-1}\prod\sin\tfrac{k\pi}{n} = n$ (A1) ¶ $n = 6$: $\tfrac{6}{32} = 0.1875$ (A1)
S: Key moves: geometric series with $\omega^n = 1$, the factor theorem for $z^n - 1$, and taking moduli of a product.

@struct M5 style=P3
Q: **A family of improper integrals.** ¶ For $n \in \mathbb{N}$ let $I_n = \displaystyle\int_0^{\infty} x^n e^{-x}\,dx$. You may assume that $\lim_{x\to\infty} x^n e^{-x} = 0$.
a) [2] Find $I_0$.
= 1 abs=0.001
M: $\left[-e^{-x}\right]_0^{\infty}$ (M1) ¶ $= 0 - (-1) = 1$ (A1)
b) [4] Use integration by parts to show that $I_n = nI_{n-1}$ for $n \ge 1$.
M: $u = x^n$, $dv = e^{-x}dx$ (M1) ¶ $I_n = \left[-x^ne^{-x}\right]_0^{\infty} + n\int_0^{\infty} x^{n-1}e^{-x}dx$ (A1) ¶ The bracket is $0$ at both limits (R1) ¶ so $I_n = nI_{n-1}$ (A1)
c) [2] Hence find $I_5$.
= 120 abs=0
M: $I_5 = 5\cdot4\cdot3\cdot2\cdot1\cdot I_0$ (M1) ¶ $= 120$ (A1)
d) [3] Conjecture an expression for $I_n$ and prove it by induction.
M: $I_n = n!$ (A1) ¶ True for $n = 0$; if $I_k = k!$ then $I_{k+1} = (k+1)k! = (k+1)!$ (M1 A1)
e) [4] For $a > 0$, use the substitution $u = ax$ to show that $\displaystyle\int_0^{\infty} x^n e^{-ax}dx = \frac{n!}{a^{n+1}}$, and hence evaluate $\displaystyle\int_0^{\infty} x^3 e^{-2x}dx$.
= 0.375 rel=0.001
M: $x = u/a$, $dx = du/a$, limits unchanged (M1) ¶ $\int_0^{\infty} \tfrac{u^n}{a^n}e^{-u}\tfrac{du}{a} = \tfrac{I_n}{a^{n+1}}$ (A1) ¶ $= \tfrac{n!}{a^{n+1}}$ (A1) ¶ $\tfrac{3!}{2^4} = 0.375$ (A1)
f) [3] A continuous random variable $X$ has probability density function $f(x) = kx^2e^{-x/2}$ for $x \ge 0$. Find $k$.
= 0.0625 rel=0.001
M: $\int_0^{\infty} x^2e^{-x/2}dx = \tfrac{2!}{(1/2)^3} = 16$ (M1 A1) ¶ $k = \tfrac{1}{16}$ (A1)
g) [3] Find $E(X)$.
= 6 rel=0.001
M: $E(X) = k\int_0^{\infty} x^3e^{-x/2}dx$ (M1) ¶ $= \tfrac{1}{16}\cdot\tfrac{3!}{(1/2)^4} = \tfrac{96}{16}$ (A1) ¶ $= 6$ (A1)
S: Recognising a known integral after a substitution saves a lot of work; Paper 3 often ends by applying the general result in a new context.

@struct M4 style=P3
Q: **Waiting for patterns.** ¶ A fair coin is tossed repeatedly. Let $X$ be the number of tosses up to and including the first head.
a) [2] Find $P(X = 4)$.
= 0.0625 rel=0.001
M: Three tails then a head: $\left(\tfrac12\right)^4$ (M1) ¶ $= 0.0625$ (A1)
b) [3] Using $\displaystyle\sum_{k=1}^{\infty} kx^{k-1} = \frac{1}{(1-x)^2}$ for $|x| < 1$, find $E(X)$.
= 2 abs=0.001
M: $E(X) = \sum k\left(\tfrac12\right)^k = \tfrac12\sum k\left(\tfrac12\right)^{k-1}$ (M1) ¶ $= \tfrac12\cdot\tfrac{1}{(1/2)^2}$ (A1) ¶ $= 2$ (A1)
c) [4] Let $e$ be the expected number of tosses until two consecutive heads (HH) first appear. By considering the first one or two tosses, show that $e = \tfrac12(e + 1) + \tfrac14(e + 2) + \tfrac14(2)$, and solve for $e$.
= 6 abs=0.001
M: T first (prob $\tfrac12$): start again after 1 toss (A1) ¶ HT (prob $\tfrac14$): start again after 2 tosses (A1) ¶ HH (prob $\tfrac14$): finished after 2 (A1) ¶ $\tfrac14 e = \tfrac32 \Rightarrow e = 6$ (A1)
d) [4] Find the expected number of tosses until the pattern HT first appears.
= 4 abs=0.001
M: Wait for the first H: expected 2 tosses (M1) ¶ After that, every toss is H (keep waiting) or T (done) (R1) ¶ so a further expected 2 tosses (A1) ¶ Total $4$ (A1)
e) [2] HH and HT each have probability $\tfrac14$ on any two given tosses. Explain why their expected waiting times differ.
M: After a failed HH attempt (HT) you must start again from scratch (R1) ¶ whereas after H, a failed HT attempt (HH) still leaves you one H towards HT; the patterns overlap with themselves differently (R1)
f) [5] The coin is now biased with $P(\text{head}) = p$. Show that the expected number of tosses until HH is $\dfrac{1 + p}{p^2}$, check your answer to (c), and evaluate it for $p = 0.6$.
= 4.444 rel=0.005
M: $e = (1-p)(e + 1) + p(1-p)(e + 2) + 2p^2$ (M1 A1) ¶ $e\,p^2 = 1 + p$ (A1) ¶ $p = \tfrac12$: $\tfrac{1.5}{0.25} = 6$ ✓ (A1) ¶ $p = 0.6$: $\tfrac{1.6}{0.36} = 4.44$ (A1)
S: Conditioning on the first steps ("first-step analysis") turns an infinite process into a linear equation.

@struct M3 style=P3
Q: **Multiple angles as polynomials.** ¶ For $n \in \mathbb{N}$, $\cos n\theta$ can be written as a polynomial $T_n(x)$ in $x = \cos\theta$. So $T_0(x) = 1$ and $T_1(x) = x$.
a) [2] Show that $T_2(x) = 2x^2 - 1$.
M: $\cos2\theta = 2\cos^2\theta - 1$ (M1) ¶ so $T_2(x) = 2x^2 - 1$ (A1)
b) [4] Use compound angle formulae to show that $\cos(n+1)\theta + \cos(n-1)\theta = 2\cos\theta\cos n\theta$. Hence show that $T_{n+1}(x) = 2xT_n(x) - T_{n-1}(x)$.
M: Expand $\cos(n\theta \pm \theta) = \cos n\theta\cos\theta \mp \sin n\theta\sin\theta$ (M1) ¶ Adding, the sine terms cancel (A1) ¶ Substitute $x = \cos\theta$ (M1) ¶ Rearrange to obtain the recurrence (A1)
c) [3] Find $T_3(x)$ and $T_4(x)$, and use $T_4$ to evaluate $\cos\dfrac{4\pi}{3}$.
= -0.5 abs=0.001
M: $T_3 = 4x^3 - 3x$ (A1) ¶ $T_4 = 8x^4 - 8x^2 + 1$ (A1) ¶ $x = \cos\tfrac{\pi}{3} = \tfrac12$: $\tfrac12 - 2 + 1 = -\tfrac12$ (A1)
d) [3] Conjecture the leading coefficient of $T_n(x)$ for $n \ge 1$ and justify your answer from the recurrence.
M: $2^{n-1}$ (A1) ¶ The recurrence multiplies the leading term of $T_n$ by $2x$ (R1) ¶ and $T_{n-1}$ has lower degree, so the coefficient doubles each step from $T_1$ (R1)
e) [4] By solving $\cos3\theta = 0$ for $0 \le \theta \le \pi$, find the roots of $T_3(x) = 0$. Give the largest root.
= 0.866 rel=0.002
M: $3\theta = \tfrac{\pi}{2}, \tfrac{3\pi}{2}, \tfrac{5\pi}{2}$ (M1) ¶ $\theta = \tfrac{\pi}{6}, \tfrac{\pi}{2}, \tfrac{5\pi}{6}$ (A1) ¶ $x = \tfrac{\sqrt3}{2}, 0, -\tfrac{\sqrt3}{2}$ (A1) ¶ Largest $= 0.866$; agrees with $4x^3 - 3x = x(4x^2 - 3)$ (A1)
f) [4] Hence solve $8x^3 - 6x - 1 = 0$. Give the largest root to 3 significant figures.
= 0.940 rel=0.003
M: $2T_3(x) = 1 \Rightarrow \cos3\theta = \tfrac12$ (M1) ¶ $3\theta = 60°, 300°, 420°$ (A1) ¶ $x = \cos20°, \cos100°, \cos140°$ (A1) ¶ $= 0.940, -0.174, -0.766$ (A1)
S: The substitution $x = \cos\theta$ turns a cubic with three real roots into a trigonometric equation; this is the idea behind trigonometric solutions of cubics.
`,
);
