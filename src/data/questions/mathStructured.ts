import { parseStructured } from '../dsl';

/** Original multi-part (Paper 1/2-style) Math AA HL questions. Numeric answers verified in Python. */
const source = String.raw`
@struct M1
Q: A geometric sequence has first term $3$ and common ratio $2$.
a) [2] Find the 10th term.
= 1536 abs=0
M: $u_{10} = 3 \times 2^9$ (1) ¶ $= 1536$ (1)
b) [2] Find the sum of the first 10 terms.
= 3069 abs=0
M: $S_{10} = \dfrac{3(2^{10} - 1)}{2 - 1}$ (1) ¶ $= 3069$ (1)
c) [3] Find the smallest $n$ for which $S_n > 10\,000$.
= 12 abs=0
M: $3(2^n - 1) > 10\,000$ (1) ¶ $2^n > 3334.3$, $n > 11.7$ (1) ¶ $n = 12$ (1)

@struct M1
Q: The 3rd term of an arithmetic sequence is $11$ and the 8th term is $26$.
a) [2] Find the common difference.
= 3 abs=0
M: $5d = 26 - 11$ (1) ¶ $d = 3$ (1)
b) [1] Find the first term.
= 5 abs=0
M: $u_1 = 11 - 2(3) = 5$ (1)
c) [2] Find the sum of the first 20 terms.
= 670 abs=0
M: $S_{20} = \dfrac{20}{2}\big(2(5) + 19(3)\big)$ (1) ¶ $= 670$ (1)

@struct M2
Q: Let $f(x) = \dfrac{2x + 3}{x - 1}$, $x \ne 1$.
a) [2] Write down the equations of the asymptotes (give the horizontal asymptote's $y$-value).
= 2 abs=0
M: vertical $x = 1$ (1) ¶ horizontal $y = 2$ (1)
b) [1] Find the $x$-intercept.
= -1.5 abs=0.001
M: $2x + 3 = 0$, $x = -1.5$ (1)
c) [3] Find $f^{-1}(x)$ and hence $f^{-1}(4)$.
= 3.5 abs=0.001
M: $y(x - 1) = 2x + 3$ (1) ¶ $f^{-1}(x) = \dfrac{x + 3}{x - 2}$ (1) ¶ $f^{-1}(4) = 3.5$ (1)

@struct M2
Q: Let $f(x) = 2x^2 - 8x + 3$.
a) [2] Find the $x$-coordinate of the vertex.
= 2 abs=0
M: $x = -\dfrac{b}{2a} = 2$ (or complete the square) (1)(1)
b) [1] Find the minimum value of $f$.
= -5 abs=0
M: $f(2) = -5$ (1)
c) [2] Find the larger root of $f(x) = 0$, to 3 significant figures.
= 3.581 rel=0.002
M: $x = \dfrac{8 \pm \sqrt{40}}{4}$ (1) ¶ $x = 3.58$ (1)

@struct M3
Q: In triangle ABC, $AB = 7$ cm, $AC = 9$ cm and $\hat{A} = 50^\circ$.
a) [3] Find BC.
= 7.001 rel=0.005 unit=cm
M: $BC^2 = 7^2 + 9^2 - 2(7)(9)\cos50^\circ$ (1)(1) ¶ $BC = 7.00$ cm (1)
b) [2] Find the area of the triangle.
= 24.13 rel=0.005 unit=cm^2
M: $\tfrac12(7)(9)\sin50^\circ$ (1) ¶ $= 24.1\ \text{cm}^2$ (1)
c) [2] Find angle $\hat{B}$.
= 80 rel=0.005 unit=°
M: $\dfrac{\sin B}{9} = \dfrac{\sin50^\circ}{7.00}$ (1) ¶ $B = 80.0^\circ$ (acute solution is consistent: $A + B + C = 180^\circ$ with $C = 50^\circ$) (1)

@struct M3
Q: (AHL) Points A(1, 2, −1), B(3, 0, 1) and C(2, 5, 0) are given.
a) [2] Find $|\vec{AB}|$.
= 3.464 rel=0.003
M: $\vec{AB} = (2, -2, 2)$ (1) ¶ $|\vec{AB}| = \sqrt{12} = 3.46$ (1)
b) [2] Find $\vec{AB}\cdot\vec{AC}$.
= -2 abs=0
M: $\vec{AC} = (1, 3, 1)$ (1) ¶ $2 - 6 + 2 = -2$ (1)
c) [2] Find angle BAC in degrees.
= 100 rel=0.003 unit=°
M: $\cos\theta = \dfrac{-2}{\sqrt{12}\sqrt{11}}$ (1) ¶ $\theta = 100^\circ$ (1)
d) [3] Find the area of triangle ABC.
= 5.657 rel=0.003
M: $\vec{AB}\times\vec{AC} = (-8, 0, 8)$ (1)(1) ¶ area $= \tfrac12\sqrt{128} = 5.66$ (1)

@struct M4
Q: A bag contains 5 red and 3 blue counters. Two counters are taken at random without replacement.
a) [2] Find the probability that both are red.
= 0.3571 rel=0.003
M: $\dfrac58 \times \dfrac47$ (1) ¶ $= \dfrac{5}{14}$ (1)
b) [2] Find the probability that one of each colour is taken.
= 0.5357 rel=0.003
M: $2 \times \dfrac58 \times \dfrac37$ (1) ¶ $= \dfrac{15}{28}$ (1)
c) [2] Given that the first counter is red, find the probability that the second is blue.
= 0.4286 rel=0.003
M: 7 counters remain, 3 blue (1) ¶ $\dfrac37$ (1)

@struct M4
Q: 20 % of seeds of a certain type fail to germinate. 15 seeds are planted. Let $X$ be the number that fail.
a) [1] State the distribution of $X$.
M: $X \sim B(15, 0.2)$ (1)
b) [2] Find $P(X = 3)$.
= 0.2501 rel=0.003
M: $\binom{15}{3}(0.2)^3(0.8)^{12}$ (1) ¶ $= 0.250$ (1)
c) [2] Find $P(X \le 2)$.
= 0.398 rel=0.003
M: sum of $P(X = 0), P(X = 1), P(X = 2)$ (1) ¶ $= 0.398$ (1)
d) [1] Find $E(X)$.
= 3 abs=0
M: $np = 3$ (1)

@struct M4
Q: Heights of students are normally distributed with mean $165$ cm and standard deviation $8$ cm.
a) [2] Find the probability that a student is taller than $175$ cm.
= 0.1056 rel=0.003
M: $z = 1.25$ or GDC (1) ¶ $0.106$ (1)
b) [2] Find the height exceeded by 5 % of students.
= 178.2 rel=0.002 unit=cm
M: inverse normal with area 0.95 (1) ¶ $178$ cm (1)
c) [2] Find the probability that a student's height is between $160$ and $170$ cm.
= 0.468 rel=0.003
M: correct use of GDC/standardisation (1) ¶ $0.468$ (1)

@struct M5
Q: An open box is made from a $24$ cm by $24$ cm sheet of card by cutting a square of side $x$ cm from each corner and folding up the sides.
a) [1] Show that the volume is $V = x(24 - 2x)^2$.
M: base $(24 - 2x)$ by $(24 - 2x)$, height $x$ (1)
b) [3] Find the value of $x$ that maximises the volume.
= 4 abs=0
M: $V' = (24 - 2x)^2 - 4x(24 - 2x)$ (1) ¶ $(24 - 2x)(24 - 6x) = 0$ (1) ¶ $x = 4$ (reject $x = 12$) (1)
c) [1] Find the maximum volume.
= 1024 abs=0 unit=cm^3
M: $V = 4 \times 16^2 = 1024\ \text{cm}^3$ (1)
d) [2] Justify that this is a maximum.
M: $V''(x) = 24x - 192$ (1) ¶ $V''(4) = -96 < 0$, so maximum (1)

@struct M5
Q: A particle moves in a straight line with velocity $v = 6t - t^2\ \text{m s}^{-1}$ for $0 \le t \le 8$.
a) [2] Find the maximum velocity.
= 9 abs=0 unit=m s^-1
M: $v' = 6 - 2t = 0$, $t = 3$ (1) ¶ $v = 9\ \text{m s}^{-1}$ (1)
b) [1] Find the acceleration when $t = 5$.
= -4 abs=0 unit=m s^-2
M: $a = 6 - 2(5) = -4\ \text{m s}^{-2}$ (1)
c) [3] Find the total distance travelled.
= 50.67 rel=0.003 unit=m
M: $v = 0$ at $t = 6$ (1) ¶ $\int_0^6 v\,dt = 36$, $\int_6^8 v\,dt = -\tfrac{44}{3}$ (1) ¶ distance $= 36 + \tfrac{44}{3} = 50.7$ m (1)
d) [1] Find the displacement after 8 s.
= 21.33 rel=0.003 unit=m
M: $36 - \tfrac{44}{3} = 21.3$ m (1)

@struct M5
Q: A population grows according to $P(t) = 500e^{0.04t}$, where $t$ is in years.
a) [1] Find $P(10)$.
= 745.9 rel=0.002
M: $500e^{0.4} = 746$ (1)
b) [2] Find the time for the population to double.
= 17.33 rel=0.003 unit=years
M: $e^{0.04t} = 2$ (1) ¶ $t = \dfrac{\ln 2}{0.04} = 17.3$ years (1)
c) [2] Find the rate of increase when $t = 10$.
= 29.84 rel=0.003 unit=per year
M: $P'(t) = 20e^{0.04t}$ (1) ¶ $P'(10) = 29.8$ per year (1)

@struct M1
Q: (AHL) Let $z = 1 + \sqrt3\,i$.
a) [1] Find $|z|$.
= 2 abs=0
M: $\sqrt{1 + 3} = 2$ (1)
b) [1] Find $\arg z$ in radians.
= 1.0472 rel=0.002
M: $\dfrac{\pi}{3}$ (1)
c) [2] Use De Moivre's theorem to find $z^6$.
= 64 abs=0
M: $z^6 = 2^6\,\text{cis}(2\pi)$ (1) ¶ $= 64$ (1)
d) [2] Find the modulus of each cube root of $z$ and the argument of the root with the smallest positive argument.
= 1.26 rel=0.005
M: modulus $2^{1/3} = 1.26$ (1) ¶ argument $\dfrac{\pi}{9}$ (1)

@struct M5
Q: (AHL) Consider $\dfrac{dy}{dx} = 2xy$ with $y(0) = 3$.
a) [3] Solve the differential equation and find $y(1)$.
= 8.155 rel=0.003
M: separate: $\int\dfrac{dy}{y} = \int 2x\,dx$ (1) ¶ $y = 3e^{x^2}$ (1) ¶ $y(1) = 3e = 8.15$ (1)
b) [2] Use Euler's method with step $h = 0.5$ to estimate $y(1)$.
= 4.5 abs=0.001
M: $y_1 = 3 + 0.5(0) = 3$ (1) ¶ $y_2 = 3 + 0.5(2 \times 0.5 \times 3) = 4.5$ (1)
c) [2] Explain why the Euler estimate is too small and how to improve it.
M: the gradient increases across each step (the curve is concave up), so using the gradient at the start of each step underestimates (1) ¶ use a smaller step size (1)

@struct M5
Q: (AHL) Consider $f(x) = e^x\sin x$.
a) [3] Find the Maclaurin series of $f$ up to the term in $x^3$.
M: multiply $\left(1 + x + \tfrac{x^2}{2}\right)\left(x - \tfrac{x^3}{6}\right)$ (1) ¶ collect terms (1) ¶ $x + x^2 + \tfrac{x^3}{3}$ (1)
b) [1] Write down the coefficient of $x^3$.
= 0.3333 rel=0.002
M: $\tfrac13$ (1)
c) [2] Use your series to estimate $f(0.1)$.
= 0.110333 rel=0.0005
M: $0.1 + 0.01 + 0.000333$ (1) ¶ $= 0.110333$ (1)
`;

export const mathStructured = parseStructured('math', source);
