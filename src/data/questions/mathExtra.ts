import { parseQuestions, parseStructured } from '../dsl';

/** Additional original Math AA HL questions (bank expansion). Numeric answers verified in Python. */
const short = String.raw`
@num M1 value=185 abs=0
Q: Evaluate $\displaystyle\sum_{r=1}^{10}(3r + 2)$.
S: $3(55) + 10(2) = 185$.

@num M1 value=4 abs=0
Q: Solve $\log_2 x + \log_2(x - 2) = 3$.
S: $x(x - 2) = 8 \Rightarrow x^2 - 2x - 8 = 0 \Rightarrow x = 4$ ($x = -2$ rejected: log undefined).

@num M1 value=1 abs=0
Q: A geometric sequence has $u_1 = 81$ and $r = \tfrac13$. Find $u_5$.
S: $81 \times (1/3)^4 = 1$.

@num M1 value=15 abs=0
Q: An investment grows by $5\%$ per year. Find the least number of whole years for it to more than double.
S: $1.05^n > 2 \Rightarrow n > \ln2/\ln1.05 = 14.2$, so $n = 15$.

@num M1 value=210 abs=0
Q: (AHL) How many ways are there to choose a team of 4 from 10 people?
S: $\binom{10}{4} = 210$.

@num M1 value=120 abs=0
Q: (AHL) In how many ways can 6 people sit around a circular table (rotations considered the same)?
S: $(6 - 1)! = 120$.

@num M1 value=2 abs=0
Q: (AHL) Write $\dfrac{5x + 1}{(x + 1)(x - 1)} = \dfrac{A}{x + 1} + \dfrac{B}{x - 1}$. Find $A$.
S: $5x + 1 = A(x - 1) + B(x + 1)$; $x = -1$: $-4 = -2A \Rightarrow A = 2$ (and $B = 3$).

@num M1 value=12 abs=0
Q: (AHL) $|z_1| = 3$ and $|z_2| = 4$. Find $|z_1z_2|$.
S: $|z_1z_2| = |z_1||z_2| = 12$.

@num M2 value=3 abs=0
Q: Given $f(x) = 3x - 4$, find $f^{-1}(5)$.
S: $f^{-1}(x) = \dfrac{x + 4}{3}$, so $f^{-1}(5) = 3$.

@num M2 value=4 abs=0
Q: Find the minimum value of $f(x) = x^2 + 2x + 5$.
S: $(x + 1)^2 + 4$: minimum $4$ at $x = -1$.

@num M2 value=4 abs=0
Q: $f(x) = \ln(x + 1)$ and $g(x) = e^x$. Find $(g \circ f)(3)$.
S: $e^{\ln 4} = 4$.

@mc M2
Q: (AHL) Solve $|2x - 3| < 5$.
O: $x < 4$
O*: $-1 < x < 4$
O: $x < -1$ or $x > 4$
O: $-4 < x < 1$
S: $-5 < 2x - 3 < 5 \Rightarrow -2 < 2x < 8$.

@num M3 value=-0.8 abs=0.001
Q: $\theta$ is obtuse and $\sin\theta = 0.6$. Find $\cos\theta$.
S: $\cos\theta = -\sqrt{1 - 0.36} = -0.8$ (negative in the second quadrant).

@num M3 value=5.236 rel=0.002
Q: Solve $2\cos x = 1$ for $0 \le x \le 2\pi$ and give the larger solution in radians.
S: $x = \tfrac{\pi}{3}$ or $\tfrac{5\pi}{3} \approx 5.236$.

@num M3 value=37.7 rel=0.003
Q: Find the volume of a cone with radius $3$ cm and height $4$ cm.
S: $\tfrac13\pi(9)(4) = 12\pi = 37.7\ \text{cm}^3$.

@num M3 value=13 abs=0
Q: Find the distance between $(1, 2, 3)$ and $(4, 6, 15)$.
S: $\sqrt{9 + 16 + 144} = 13$.

@num M3 value=7 abs=0
Q: (AHL) The line $\mathbf{r} = (1, 0, 2) + t(2, 1, -1)$ meets the plane $x + y + z = 9$. Find the $x$-coordinate of the intersection.
S: $(1 + 2t) + t + (2 - t) = 9 \Rightarrow t = 3$; point $(7, 3, -1)$.

@num M3 value=45 abs=0.1 unit=°
Q: (AHL) Find the angle between the planes $x = 0$ and $x + y = 0$.
S: Normals $(1, 0, 0)$ and $(1, 1, 0)$: $\cos\theta = \tfrac{1}{\sqrt2}$, $\theta = 45^\circ$.

@num M4 value=5 abs=0
Q: Find the mean of $2, 4, 4, 5, 7, 8$.
S: $30/6 = 5$.

@num M4 value=0.4095 rel=0.002
Q: $X \sim B(5, 0.1)$. Find $P(X \ge 1)$.
S: $1 - 0.9^5 = 0.410$.

@num M4 value=11.88 rel=0.005
Q: $X \sim N(100, \sigma^2)$ and $P(X < 110) = 0.8$. Find $\sigma$.
S: $z = 0.8416$; $\sigma = 10/0.8416 = 11.9$.

@num M4 value=0.15 abs=0.001
Q: $A$ and $B$ are independent with $P(A) = 0.3$ and $P(B) = 0.5$. Find $P(A \cap B)$.
S: $0.3 \times 0.5 = 0.15$.

@num M4 value=0.6667 rel=0.002
Q: (AHL) $X$ has probability density function $f(x) = 2x$ for $0 \le x \le 1$. Find $E(X)$.
S: $\int_0^1 2x^2\,dx = \tfrac23$.

@num M4 value=4 abs=0
Q: (AHL) $E(X) = 3$ and $E(X^2) = 13$. Find $\text{Var}(X)$.
S: $13 - 9 = 4$.

@num M5 value=-9.87 rel=0.003
Q: Find the derivative of $x^2\sin x$ at $x = \pi$.
S: $2x\sin x + x^2\cos x$; at $\pi$: $0 - \pi^2 = -9.87$.

@num M5 value=2 abs=0.001
Q: Evaluate $\displaystyle\int_0^{\pi}\sin x\,dx$.
S: $[-\cos x]_0^{\pi} = 1 + 1 = 2$.

@num M5 value=0.3679 rel=0.002
Q: Find the maximum value of $f(x) = xe^{-x}$ for $x \ge 0$.
S: $f'(x) = e^{-x}(1 - x) = 0 \Rightarrow x = 1$; $f(1) = e^{-1} = 0.368$.

@num M5 value=-2 abs=0
Q: Find the $y$-intercept of the tangent to $y = x^3$ at $x = 1$.
S: Gradient 3, point $(1, 1)$: $y = 3x - 2$.

@num M5 value=2 abs=0
Q: (AHL) Find $\dfrac{d}{dx}\arctan(2x)$ at $x = 0$.
S: $\dfrac{2}{1 + 4x^2} = 2$.

@num M5 value=0.7854 rel=0.002
Q: (AHL) Evaluate $\displaystyle\int_0^1\frac{1}{1 + x^2}\,dx$.
S: $[\arctan x]_0^1 = \tfrac{\pi}{4}$.

@num M5 value=6 abs=0.001
Q: (AHL) Solve $\dfrac{dy}{dx} = y$ with $y(0) = 2$ and find $y(\ln 3)$.
S: $y = 2e^x$; $y(\ln3) = 6$.

@num M5 value=28.27 rel=0.003
Q: (AHL) The region under $y = x$ for $0 \le x \le 3$ is rotated $2\pi$ about the $x$-axis. Find the volume.
S: $\pi\int_0^3 x^2\,dx = 9\pi = 28.3$.
`;

const structured = String.raw`
@struct M5
Q: A ball is thrown upwards; its height in metres after $t$ seconds is $h(t) = 20t - 4.9t^2$.
a) [2] Find the time at which the ball reaches its maximum height.
= 2.041 rel=0.003 unit=s
M: $h'(t) = 20 - 9.8t = 0$ (1) ¶ $t = 2.04$ s (1)
b) [1] Find the maximum height.
= 20.41 rel=0.003 unit=m
M: $h(2.04) = 20.4$ m (1)
c) [2] Find the time at which the ball returns to its starting height.
= 4.082 rel=0.003 unit=s
M: $t(20 - 4.9t) = 0$ (1) ¶ $t = 4.08$ s (1)
d) [1] Find the velocity at $t = 3$ s and interpret its sign.
= -9.4 abs=0.01 unit=m s^-1
M: $h'(3) = -9.4\ \text{m s}^{-1}$: negative, so the ball is moving downwards (1)

@struct M4
Q: 60 % of students travel to school by bus. Of those who take the bus, 10 % arrive late; of those who do not, 5 % arrive late.
a) [1] Draw a tree diagram (on paper) and find $P(\text{bus and late})$.
= 0.06 abs=0.001
M: $0.6 \times 0.1 = 0.06$ (1)
b) [2] Find the probability that a randomly chosen student is late.
= 0.08 abs=0.001
M: $0.6(0.1) + 0.4(0.05)$ (1) ¶ $= 0.08$ (1)
c) [2] Given that a student is late, find the probability that they took the bus.
= 0.75 abs=0.001
M: $\dfrac{0.06}{0.08}$ (1) ¶ $= 0.75$ (1)
`;

export const mathExtra = [...parseQuestions('math', short), ...parseStructured('math', structured)];
