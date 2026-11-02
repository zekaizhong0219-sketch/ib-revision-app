/** Math AA HL — Topics 3–4. Original wording. */
export const mathGeometryStatsSource = String.raw`
# M3
[f] Distance and midpoint in 3D :: $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$ ¶ $M = \left(\tfrac{x_1+x_2}{2}, \tfrac{y_1+y_2}{2}, \tfrac{z_1+z_2}{2}\right)$
[f] Volume and surface area: sphere, cone, pyramid :: Sphere: $V = \tfrac43\pi r^3$, $A = 4\pi r^2$ ¶ Cone: $V = \tfrac13\pi r^2h$, curved area $= \pi rl$ ¶ Pyramid: $V = \tfrac13 Ah$
[f] Sine rule :: $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$
[f] Cosine rule :: $c^2 = a^2 + b^2 - 2ab\cos C$ ¶ $\cos C = \dfrac{a^2 + b^2 - c^2}{2ab}$
[f] Area of a triangle :: $A = \tfrac12 ab\sin C$
[k] Ambiguous case of the sine rule :: Given two sides and a non-included acute angle, there may be two triangles: if $\sin B = k$, both $B$ and $180^\circ - B$ may be valid (check angle sum < 180°).
[f] Arc length and sector area (radians) :: $l = r\theta$, $\quad A = \tfrac12 r^2\theta$
[f] Degrees ↔ radians :: $\pi \text{ rad} = 180^\circ$
[f] Pythagorean identity and tangent :: $\cos^2\theta + \sin^2\theta = 1$, $\quad \tan\theta = \dfrac{\sin\theta}{\cos\theta}$
[f] Double-angle identities :: $\sin 2\theta = 2\sin\theta\cos\theta$ ¶ $\cos 2\theta = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta$
[f] Double angle for tangent (AHL) :: $\tan 2\theta = \dfrac{2\tan\theta}{1 - \tan^2\theta}$
[x] Exact trig values :: $\sin 30^\circ = \tfrac12$, $\cos 30^\circ = \tfrac{\sqrt3}{2}$, $\tan 30^\circ = \tfrac{1}{\sqrt3}$ ¶ $\sin 45^\circ = \cos 45^\circ = \tfrac{\sqrt2}{2}$, $\tan 45^\circ = 1$ ¶ $\sin 60^\circ = \tfrac{\sqrt3}{2}$, $\cos 60^\circ = \tfrac12$, $\tan 60^\circ = \sqrt3$
[f] Circular function graphs: $y = a\sin(b(x - c)) + d$ :: Amplitude $|a|$, period $\dfrac{2\pi}{b}$, horizontal shift $c$, principal axis $y = d$.
[f] Reciprocal trig functions (AHL) :: $\sec\theta = \dfrac{1}{\cos\theta}$, $\csc\theta = \dfrac{1}{\sin\theta}$, $\cot\theta = \dfrac{\cos\theta}{\sin\theta}$
[f] Pythagorean identities (AHL) :: $1 + \tan^2\theta = \sec^2\theta$ ¶ $1 + \cot^2\theta = \csc^2\theta$
[f] Compound-angle identities (AHL) :: $\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B$ ¶ $\cos(A \pm B) = \cos A\cos B \mp \sin A\sin B$ ¶ $\tan(A \pm B) = \dfrac{\tan A \pm \tan B}{1 \mp \tan A\tan B}$
[x] Ranges of inverse trig functions (AHL) :: $\arcsin x \in \left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right]$, $\arccos x \in [0, \pi]$, $\arctan x \in \left(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right)$
[f] Magnitude of a vector (AHL) :: $|\mathbf{v}| = \sqrt{v_1^2 + v_2^2 + v_3^2}$; unit vector $\hat{\mathbf{v}} = \dfrac{\mathbf{v}}{|\mathbf{v}|}$
[f] Scalar (dot) product (AHL) :: $\mathbf{v}\cdot\mathbf{w} = v_1w_1 + v_2w_2 + v_3w_3 = |\mathbf{v}||\mathbf{w}|\cos\theta$ — zero iff perpendicular.
[f] Vector equation of a line (AHL) :: $\mathbf{r} = \mathbf{a} + \lambda\mathbf{b}$ ($\mathbf{a}$ a point, $\mathbf{b}$ a direction vector). Parametric: $x = x_0 + \lambda l$, etc.
[f] Vector (cross) product (AHL) :: $\mathbf{v}\times\mathbf{w} = \begin{pmatrix} v_2w_3 - v_3w_2 \\ v_3w_1 - v_1w_3 \\ v_1w_2 - v_2w_1 \end{pmatrix}$, $|\mathbf{v}\times\mathbf{w}| = |\mathbf{v}||\mathbf{w}|\sin\theta$ — perpendicular to both.
[f] Areas using the cross product (AHL) :: Parallelogram: $A = |\mathbf{v}\times\mathbf{w}|$ ¶ Triangle: $A = \tfrac12|\mathbf{v}\times\mathbf{w}|$
[f] Equations of a plane (AHL) :: Vector: $\mathbf{r} = \mathbf{a} + \lambda\mathbf{b} + \mu\mathbf{c}$ ¶ Normal form: $\mathbf{r}\cdot\mathbf{n} = \mathbf{a}\cdot\mathbf{n}$ ¶ Cartesian: $ax + by + cz = d$, normal $\mathbf{n} = (a, b, c)$
[f] Angle between a line and a plane (AHL) :: $\sin\theta = \dfrac{|\mathbf{b}\cdot\mathbf{n}|}{|\mathbf{b}||\mathbf{n}|}$ ($\mathbf{b}$ direction of line, $\mathbf{n}$ normal)
[k] Relationships between two lines in 3D (AHL) :: Parallel (direction vectors are multiples), intersecting (solve for a common point) or skew (not parallel and no intersection).
[f] Angle between two planes (AHL) :: $\cos\theta = \dfrac{|\mathbf{n}_1\cdot\mathbf{n}_2|}{|\mathbf{n}_1||\mathbf{n}_2|}$
[k] Kinematics with vectors (AHL) :: Position $\mathbf{r} = \mathbf{r}_0 + t\mathbf{v}$; speed is $|\mathbf{v}|$.

# M4
[d] Population, sample, random sample :: Population: the whole group of interest. Sample: a subset. Random sample: every member has an equal chance of selection.
[f] Interquartile range and outliers :: $\text{IQR} = Q_3 - Q_1$. Outlier: value $< Q_1 - 1.5\,\text{IQR}$ or $> Q_3 + 1.5\,\text{IQR}$.
[f] Mean of a data set :: $\bar{x} = \dfrac{\sum_{i} f_ix_i}{n}$, $n = \sum f_i$
[k] Effect of linear transformation on summary statistics :: Adding $k$ to every value: mean +$k$, standard deviation unchanged. Multiplying by $k$: mean ×$k$, SD ×$|k|$, variance ×$k^2$.
[f] Pearson's correlation coefficient :: $-1 \le r \le 1$. $|r|$ close to 1: strong linear correlation. Correlation does not imply causation.
[k] Regression line of $y$ on $x$ :: Used to predict $y$ from $x$; passes through $(\bar{x}, \bar{y})$. Reliable only for interpolation within the data range when $|r|$ is high. Use $x$ on $y$ to predict $x$.
[f] Probability of complementary and combined events :: $P(A') = 1 - P(A)$ ¶ $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
[f] Conditional probability :: $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$
[d] Mutually exclusive vs independent events :: Mutually exclusive: $P(A \cap B) = 0$. Independent: $P(A \cap B) = P(A)P(B)$, equivalently $P(A \mid B) = P(A)$.
[f] Expected value of a discrete random variable :: $E(X) = \sum x\,P(X = x)$; the probabilities must sum to 1. A game is fair if $E(\text{gain}) = 0$.
[f] Binomial distribution :: $X \sim B(n, p)$: $P(X = r) = \binom{n}{r}p^r(1-p)^{n-r}$ ¶ $E(X) = np$, $\text{Var}(X) = np(1-p)$
[k] Conditions for a binomial model :: Fixed number of trials $n$; each trial has two outcomes; constant probability $p$; trials independent.
[f] Normal distribution and standardisation :: $X \sim N(\mu, \sigma^2)$, $z = \dfrac{x - \mu}{\sigma}$, $Z \sim N(0, 1)$
[x] Normal distribution percentages :: About 68 % within $\mu \pm \sigma$, 95 % within $\mu \pm 2\sigma$, 99.7 % within $\mu \pm 3\sigma$.
[f] Bayes' theorem (AHL) :: $P(B \mid A) = \dfrac{P(B)P(A \mid B)}{P(B)P(A \mid B) + P(B')P(A \mid B')}$
[f] Variance of a discrete random variable (AHL) :: $\text{Var}(X) = E\big((X - \mu)^2\big) = E(X^2) - \big(E(X)\big)^2$
[f] Linear transformations of a random variable (AHL) :: $E(aX + b) = aE(X) + b$ ¶ $\text{Var}(aX + b) = a^2\,\text{Var}(X)$
[f] Continuous random variable (AHL) :: $\int_{-\infty}^{\infty} f(x)\,dx = 1$, $P(a < X < b) = \int_a^b f(x)\,dx$ ¶ $E(X) = \int x f(x)\,dx$, $\text{Var}(X) = \int x^2f(x)\,dx - \mu^2$
[k] Median and mode of a continuous distribution (AHL) :: Median $m$: $\int_{-\infty}^{m} f(x)\,dx = \tfrac12$. Mode: the $x$ value where $f(x)$ is maximum.
[k] Tree diagrams and sampling with/without replacement :: Multiply along branches, add between outcomes. Without replacement, probabilities on later branches change.
[f] Standard deviation of a population :: $\sigma = \sqrt{\dfrac{\sum f(x - \mu)^2}{n}}$ — find with a GDC in exams.
[k] Reading a cumulative frequency graph :: Median at $n/2$, $Q_1$ at $n/4$, $Q_3$ at $3n/4$ on the vertical axis; read across to the curve and down.
[k] Inverse normal problems :: When $\mu$ or $\sigma$ is unknown, convert the given probability to a $z$-value with inverse normal, then solve $z = \dfrac{x - \mu}{\sigma}$.
`;
