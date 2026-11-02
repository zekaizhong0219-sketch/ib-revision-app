import { parseQuestions } from '../dsl';

export const MATH_QUESTIONS_VERSION = 1;

/** Original practice questions (not taken from IB papers). */
const source = String.raw`
@num M1 value=62 abs=0
Q: An arithmetic sequence has $u_1 = 5$ and $d = 3$. Find $u_{20}$.
S: $u_{20} = 5 + 19 \times 3 = 62$.

@num M1 value=670 abs=0
Q: An arithmetic sequence has $u_1 = 5$ and $d = 3$. Find the sum of its first 20 terms.
S: $S_{20} = \tfrac{20}{2}(5 + 62) = 670$.

@num M1 value=16 abs=0
Q: Find the sum to infinity of the geometric series with first term $12$ and common ratio $0.25$.
S: $S_\infty = \dfrac{12}{1 - 0.25} = 16$.

@num M1 value=2322.94 abs=0.01
Q: $2000$ is invested at a nominal annual rate of $5\%$ compounded monthly. Find its value after 3 years, to 2 decimal places.
S: $FV = 2000\left(1 + \dfrac{5}{1200}\right)^{36} = 2322.94$.

@num M1 value=5.644 rel=0.001
Q: Solve $2^x = 50$, giving $x$ to 4 significant figures.
S: $x = \dfrac{\ln 50}{\ln 2} = 5.644$.

@num M1 value=1 abs=0
Q: Find the exact value of $\log_2 8 + \log_3 \dfrac19$.
S: $3 + (-2) = 1$.

@num M1 value=160 abs=0
Q: Find the coefficient of $x^3$ in the expansion of $(2 + x)^6$.
S: $\binom{6}{3}2^3 = 20 \times 8 = 160$.

@num M1 value=5 abs=0
Q: (AHL) Find $|z|$ for $z = 3 - 4i$.
S: $|z| = \sqrt{9 + 16} = 5$.

@num M1 value=2.356 rel=0.002
Q: (AHL) Find $\arg z$ for $z = -1 + i$, in radians with $-\pi < \arg z \le \pi$.
S: $z$ lies in the second quadrant: $\arg z = \pi - \tfrac{\pi}{4} = \tfrac{3\pi}{4} \approx 2.356$.

@num M1 value=16 abs=0
Q: (AHL) Use De Moivre's theorem to evaluate $(1 + i)^8$.
S: $1 + i = \sqrt2\,e^{i\pi/4}$, so $(1+i)^8 = (\sqrt2)^8e^{2\pi i} = 16$.

@num M1 value=30 abs=0
Q: (AHL) In how many distinct ways can the letters of the word LEVEL be arranged?
S: $\dfrac{5!}{2!\,2!} = 30$ (two L's, two E's).

@num M1 value=-0.125 abs=0.0005
Q: (AHL) Find the coefficient of $x^2$ in the expansion of $\sqrt{1 + x}$.
S: $\dfrac{\tfrac12\left(-\tfrac12\right)}{2!} = -\dfrac18$.

@open M1
Q: (AHL) Prove by induction that $1 + 3 + 5 + \dots + (2n - 1) = n^2$ for all $n \in \mathbb{Z}^+$.
A: Base: $n = 1$: LHS $= 1$, RHS $= 1$ ✓. ¶ Assume true for $n = k$: $1 + 3 + \dots + (2k - 1) = k^2$. ¶ For $n = k + 1$: LHS $= k^2 + (2k + 1) = (k + 1)^2$ = RHS. ¶ True for $n = 1$, and true for $k$ implies true for $k + 1$, so true for all $n \in \mathbb{Z}^+$ by induction.

@num M2 value=19 abs=0
Q: Given $f(x) = 2x + 1$ and $g(x) = x^2$, find $(f \circ g)(3)$.
S: $g(3) = 9$, $f(9) = 19$.

@num M2 value=10 abs=0
Q: Given $f(x) = \dfrac{x - 4}{3}$, find $f^{-1}(2)$.
S: $f^{-1}(x) = 3x + 4$, so $f^{-1}(2) = 10$.

@num M2 value=6 abs=0
Q: Find the positive value of $k$ for which $x^2 + kx + 9 = 0$ has exactly one (repeated) real root.
S: $\Delta = k^2 - 36 = 0 \Rightarrow k = 6$.

@mc M2
Q: The graph of $y = f(x)$ is transformed to $y = f(x - 2) + 3$. Describe the transformation.
O: Translation 2 left and 3 up
O*: Translation 2 right and 3 up
O: Translation 2 right and 3 down
O: Translation 3 right and 2 up
S: $f(x - 2)$: shift right 2; $+3$: shift up 3, i.e. by the vector $\binom{2}{3}$.

@num M2 value=2 abs=0
Q: Write down the equation of the horizontal asymptote of $y = \dfrac{2x + 1}{x - 3}$ (give the $y$-value).
S: Ratio of leading coefficients: $y = 2$. (Vertical asymptote $x = 3$.)

@num M2 value=1 abs=0
Q: (AHL) Find the remainder when $x^3 - 2x + 5$ is divided by $x + 2$.
S: $p(-2) = -8 + 4 + 5 = 1$.

@num M2 value=2.5 abs=0.001
Q: (AHL) Find the sum of the roots of $2x^3 - 5x^2 + x - 7 = 0$.
S: Sum $= -\dfrac{-5}{2} = 2.5$.

@mc M2
Q: (AHL) Which function is odd?
O: $f(x) = \cos x$
O: $f(x) = x^2 + 1$
O*: $f(x) = x^3 - \sin x$
O: $f(x) = e^x$
S: $f(-x) = -x^3 + \sin x = -f(x)$.

@num M3 value=7.55 rel=0.005
Q: In triangle ABC, $a = 7$, $b = 8$ and $C = 60^\circ$. Find $c$.
S: $c^2 = 49 + 64 - 2(7)(8)\cos60^\circ = 57$, $c = 7.55$.

@num M3 value=7.5 abs=0.01
Q: Find the area of a triangle with sides $5$ cm and $6$ cm and included angle $30^\circ$.
S: $A = \tfrac12(5)(6)\sin30^\circ = 7.5\ \text{cm}^2$.

@num M3 value=60 abs=0.01
Q: A sector has radius $10$ cm and angle $1.2$ radians. Find its area.
S: $A = \tfrac12 r^2\theta = \tfrac12(100)(1.2) = 60\ \text{cm}^2$ (arc length $= 12$ cm).

@num M3 value=0.28 abs=0.001
Q: Given $\sin\theta = 0.6$, find the exact value of $\cos 2\theta$.
S: $\cos2\theta = 1 - 2\sin^2\theta = 1 - 0.72 = 0.28$.

@num M3 value=4 abs=0
Q: How many solutions does $\sin 2x = 0.5$ have for $0 \le x \le 2\pi$?
S: $2x \in [0, 4\pi]$: $2x = \tfrac{\pi}{6}, \tfrac{5\pi}{6}, \tfrac{13\pi}{6}, \tfrac{17\pi}{6}$ → 4 solutions.

@num M3 value=63.6 rel=0.003 unit=°
Q: (AHL) Find the angle between the vectors $\begin{pmatrix}1\\2\\2\end{pmatrix}$ and $\begin{pmatrix}2\\-1\\2\end{pmatrix}$, in degrees.
S: $\cos\theta = \dfrac{2 - 2 + 4}{3 \times 3} = \dfrac49$, $\theta = 63.6^\circ$.

@num M3 value=2.5 abs=0.001
Q: (AHL) Find the area of the triangle with two sides given by $\mathbf{a} = \begin{pmatrix}2\\1\\0\end{pmatrix}$ and $\mathbf{b} = \begin{pmatrix}1\\3\\0\end{pmatrix}$.
S: $\mathbf{a}\times\mathbf{b} = \begin{pmatrix}0\\0\\5\end{pmatrix}$, area $= \tfrac12(5) = 2.5$.

@num M3 value=1 abs=0
Q: (AHL) Given $\tan A = \tfrac12$ and $\tan B = \tfrac13$, find $\tan(A + B)$.
S: $\dfrac{\tfrac12 + \tfrac13}{1 - \tfrac16} = \dfrac{5/6}{5/6} = 1$ (so $A + B = \tfrac{\pi}{4}$).

@num M4 value=0.7 abs=0.001
Q: $P(A) = 0.5$, $P(B) = 0.4$, $P(A \cap B) = 0.2$. Find $P(A \cup B)$.
S: $0.5 + 0.4 - 0.2 = 0.7$.

@num M4 value=0.5 abs=0.001
Q: $P(B) = 0.4$ and $P(A \cap B) = 0.2$. Find $P(A \mid B)$.
S: $0.2/0.4 = 0.5$.

@num M4 value=0.2668 rel=0.002
Q: $X \sim B(10, 0.3)$. Find $P(X = 3)$ to 4 significant figures.
S: $\binom{10}{3}(0.3)^3(0.7)^7 = 120 \times 0.027 \times 0.08235 = 0.2668$.

@num M4 value=3 abs=0
Q: $X \sim B(20, 0.15)$. Write down $E(X)$.
S: $E(X) = np = 3$.

@num M4 value=0.9332 rel=0.001
Q: $X \sim N(50, 4^2)$. Find $P(X < 56)$ to 4 significant figures.
S: $z = (56 - 50)/4 = 1.5$; $P(Z < 1.5) = 0.9332$.

@num M4 value=32 abs=0
Q: A data set has $Q_1 = 12$ and $Q_3 = 20$. Find the value above which a data point is considered an outlier.
S: IQR $= 8$; $Q_3 + 1.5 \times 8 = 32$.

@num M4 value=0.7 abs=0.001
Q: $X$ takes values $0, 1, 2$ with probabilities $0.5, 0.3, 0.2$. Find $E(X)$.
S: $0(0.5) + 1(0.3) + 2(0.2) = 0.7$.

@num M4 value=0.161 rel=0.01
Q: (AHL) A disease affects $1\%$ of a population. A test detects it in $95\%$ of people who have it, but also gives a positive result for $5\%$ of people who do not. Find the probability that a person who tests positive has the disease.
S: $P(D \mid +) = \dfrac{0.01 \times 0.95}{0.01 \times 0.95 + 0.99 \times 0.05} = \dfrac{0.0095}{0.059} = 0.161$.

@num M4 value=36 abs=0
Q: (AHL) $\text{Var}(X) = 4$. Find $\text{Var}(3X + 2)$.
S: $3^2 \times 4 = 36$.

@num M4 value=0.5 abs=0.001
Q: (AHL) $f(x) = kx$ for $0 \le x \le 2$ (and 0 otherwise) is a probability density function. Find $k$.
S: $\int_0^2 kx\,dx = 2k = 1 \Rightarrow k = 0.5$.

@num M5 value=12 abs=0
Q: Given $f(x) = x^3$, find $f'(2)$.
S: $f'(x) = 3x^2$, $f'(2) = 12$.

@num M5 value=2 abs=0
Q: Find the gradient of the tangent to $y = e^{2x}$ at $x = 0$.
S: $\dfrac{dy}{dx} = 2e^{2x} = 2$ at $x = 0$.

@num M5 value=10 abs=0
Q: Evaluate $\displaystyle\int_0^2 (3x^2 + 1)\,dx$.
S: $[x^3 + x]_0^2 = 8 + 2 = 10$.

@num M5 value=0.1667 rel=0.003
Q: Find the area enclosed between $y = x$ and $y = x^2$.
S: Intersections at $x = 0, 1$: $\int_0^1 (x - x^2)\,dx = \tfrac12 - \tfrac13 = \tfrac16$.

@num M5 value=3 abs=0
Q: Find the $x$-coordinate of the stationary point of $y = x^2 - 6x + 1$.
S: $\dfrac{dy}{dx} = 2x - 6 = 0 \Rightarrow x = 3$.

@num M5 value=23 abs=0.01 unit=m
Q: A particle moves with velocity $v = 3t^2 - 12$ m s$^{-1}$. Find the total distance travelled from $t = 0$ to $t = 3$.
S: $v = 0$ at $t = 2$. $\int_0^2 v\,dt = -16$, $\int_2^3 v\,dt = 7$. Distance $= 16 + 7 = 23$ m (displacement $= -9$ m).

@num M5 value=0.5 abs=0.001
Q: (AHL) Find $\displaystyle\lim_{x \to 0}\frac{1 - \cos x}{x^2}$.
S: L'Hôpital twice: $\lim\dfrac{\sin x}{2x} = \lim\dfrac{\cos x}{2} = \dfrac12$.

@num M5 value=1 abs=0.001
Q: (AHL) Evaluate $\displaystyle\int_0^1 xe^x\,dx$.
S: By parts: $[xe^x - e^x]_0^1 = (e - e) - (0 - 1) = 1$.

@num M5 value=25.13 rel=0.003
Q: (AHL) The region under $y = \sqrt{x}$ for $0 \le x \le 4$ is rotated $2\pi$ about the $x$-axis. Find the volume.
S: $V = \pi\int_0^4 x\,dx = 8\pi = 25.13$.

@num M5 value=1.22 abs=0.001
Q: (AHL) Use Euler's method with step $h = 0.1$ to approximate $y(0.2)$ for $\dfrac{dy}{dx} = x + y$, $y(0) = 1$.
S: $y_1 = 1 + 0.1(0 + 1) = 1.1$; $y_2 = 1.1 + 0.1(0.1 + 1.1) = 1.22$.

@num M5 value=-0.75 abs=0.001
Q: (AHL) Find $\dfrac{dy}{dx}$ at $(3, 4)$ on the curve $x^2 + y^2 = 25$.
S: $2x + 2y\dfrac{dy}{dx} = 0 \Rightarrow \dfrac{dy}{dx} = -\dfrac{x}{y} = -\dfrac34$.

@num M5 value=1.3333 rel=0.002
Q: (AHL) Find the coefficient of $x^3$ in the Maclaurin series of $e^{2x}$.
S: $\dfrac{(2x)^3}{3!} = \dfrac{8}{6}x^3$, coefficient $\dfrac43$.

@open M5
Q: Show from first principles that the derivative of $f(x) = x^2$ is $2x$.
A: $f'(x) = \lim_{h\to0}\dfrac{(x + h)^2 - x^2}{h} = \lim_{h\to0}\dfrac{2xh + h^2}{h} = \lim_{h\to0}(2x + h) = 2x$.

@mc CT
Q: A part (b) starts with "**Hence**, find…". What does this mean?
O: Any valid method earns full marks.
O*: You must use the result from the previous part; other methods earn no marks.
O: Only a final answer is required.
O: You should verify the previous result first.
S: "Hence" requires using the preceding work; "hence or otherwise" allows other methods.

@mc CT
Q: Which command term indicates that working does not need to be shown?
O: Find
O: Show that
O*: Write down
O: Determine
S: "Write down" means the answer can be obtained with little or no calculation.
`;

export const mathQuestions = parseQuestions('math', source);
