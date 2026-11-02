/** Math AA HL — Topics 1–2. Original wording. */
export const mathAlgebraFunctionsSource = String.raw`
# M1
[f] Arithmetic sequence: nth term and sum :: $u_n = u_1 + (n-1)d$ ¶ $S_n = \dfrac{n}{2}\big(2u_1 + (n-1)d\big) = \dfrac{n}{2}(u_1 + u_n)$
[f] Geometric sequence: nth term and sum :: $u_n = u_1r^{n-1}$ ¶ $S_n = \dfrac{u_1(r^n - 1)}{r - 1} = \dfrac{u_1(1 - r^n)}{1 - r}$, $r \ne 1$
[f] Sum to infinity of a geometric series :: $S_\infty = \dfrac{u_1}{1 - r}$, valid only when $|r| < 1$
[f] Compound interest :: $FV = PV\left(1 + \dfrac{r}{100k}\right)^{kn}$ — $k$ compounding periods per year, $n$ years, $r$ % nominal annual rate.
[f] Laws of exponents :: $a^m a^n = a^{m+n}$, $\dfrac{a^m}{a^n} = a^{m-n}$, $(a^m)^n = a^{mn}$, $a^{-n} = \dfrac{1}{a^n}$, $a^{m/n} = \sqrt[n]{a^m}$
[f] Definition of a logarithm :: $a^x = b \iff x = \log_a b$ ($a > 0$, $a \ne 1$, $b > 0$)
[f] Laws of logarithms :: $\log_a xy = \log_a x + \log_a y$ ¶ $\log_a \dfrac{x}{y} = \log_a x - \log_a y$ ¶ $\log_a x^m = m\log_a x$
[f] Change of base :: $\log_b a = \dfrac{\log_c a}{\log_c b}$
[f] Exponential and natural log :: $a^x = e^{x\ln a}$ ¶ $\log_a a^x = x = a^{\log_a x}$
[f] Binomial theorem :: $(a + b)^n = \sum_{r=0}^{n}\binom{n}{r}a^{n-r}b^r$, $\quad \binom{n}{r} = \dfrac{n!}{r!(n-r)!}$
[f] Extended binomial theorem (AHL) :: $(1 + x)^n = 1 + nx + \dfrac{n(n-1)}{2!}x^2 + \dfrac{n(n-1)(n-2)}{3!}x^3 + \dots$ for $n \in \mathbb{Q}$, valid for $|x| < 1$
[f] Permutations (AHL) :: $ {}^nP_r = \dfrac{n!}{(n-r)!}$ — ordered selections of $r$ from $n$.
[k] Permutations vs combinations :: Permutations: order matters ($ {}^nP_r$). Combinations: order does not matter ($\binom{n}{r} = \dfrac{{}^nP_r}{r!}$).
[k] Partial fractions (AHL) :: $\dfrac{px + q}{(x-a)(x-b)} = \dfrac{A}{x-a} + \dfrac{B}{x-b}$ — find $A, B$ by multiplying through and substituting $x = a$, $x = b$.
[f] Complex numbers: Cartesian form (AHL) :: $z = a + bi$, $i^2 = -1$ ¶ $|z| = \sqrt{a^2 + b^2}$, conjugate $z^* = a - bi$, $zz^* = |z|^2$
[f] Modulus–argument and Euler forms (AHL) :: $z = r(\cos\theta + i\sin\theta) = r\,\text{cis}\,\theta = re^{i\theta}$
[f] Multiplying and dividing in polar form (AHL) :: $|z_1z_2| = |z_1||z_2|$, $\arg(z_1z_2) = \arg z_1 + \arg z_2$ ¶ $\left|\dfrac{z_1}{z_2}\right| = \dfrac{|z_1|}{|z_2|}$, $\arg\dfrac{z_1}{z_2} = \arg z_1 - \arg z_2$
[f] De Moivre's theorem (AHL) :: $\big[r(\cos\theta + i\sin\theta)\big]^n = r^n(\cos n\theta + i\sin n\theta)$
[k] nth roots of a complex number (AHL) :: $z^n = re^{i\theta}$ has $n$ roots $z_k = r^{1/n}e^{i(\theta + 2k\pi)/n}$, $k = 0, \dots, n-1$, equally spaced on a circle (vertices of a regular $n$-gon).
[k] Complex roots of real polynomials (AHL) :: If a polynomial has real coefficients, non-real roots occur in conjugate pairs $a \pm bi$.
[k] Proof by mathematical induction (AHL) :: 1. Show true for the base case ($n = 1$). 2. Assume true for $n = k$. 3. Prove true for $n = k + 1$ using the assumption. 4. Conclude: true for all $n \ge 1$ by induction.
[k] Proof by contradiction (AHL) :: Assume the negation of the statement, deduce something impossible, conclude the original statement is true (e.g. $\sqrt2$ irrational).
[k] Disproof by counterexample :: A single example where the statement fails is enough to disprove a general claim.
[k] Systems of linear equations (AHL) :: Up to 3 unknowns: unique solution, no solution (inconsistent) or infinitely many solutions (expressed with a parameter).
[f] Euler's identity (AHL) :: $e^{i\pi} + 1 = 0$
[k] Deductive proof (LHS to RHS) :: Start from one side of an identity and transform it step by step into the other side; never work on both sides of an unproven equation at once.
[f] Sum of the first n natural numbers / squares :: $\sum_{r=1}^{n} r = \dfrac{n(n+1)}{2}$ ¶ $\sum_{r=1}^{n} r^2 = \dfrac{n(n+1)(2n+1)}{6}$

# M2
[d] Function, domain, range :: A function maps each element of the domain (input set) to exactly one element of the range (set of outputs).
[f] Composite function :: $(f\circ g)(x) = f(g(x))$ — apply $g$ first. Domain: $x$ in domain of $g$ with $g(x)$ in domain of $f$.
[k] Inverse function :: $f^{-1}$ undoes $f$: $f(f^{-1}(x)) = f^{-1}(f(x)) = x$. Exists only if $f$ is one-to-one. Graph is the reflection of $f$ in $y = x$. Domain of $f^{-1}$ = range of $f$.
[f] Quadratic formula and discriminant :: $x = \dfrac{-b \pm \sqrt{\Delta}}{2a}$, $\Delta = b^2 - 4ac$ ¶ $\Delta > 0$: two real roots; $\Delta = 0$: one repeated root; $\Delta < 0$: no real roots.
[f] Forms of a quadratic :: Standard $y = ax^2 + bx + c$ (axis $x = -\tfrac{b}{2a}$) ¶ Vertex $y = a(x - h)^2 + k$ (vertex $(h, k)$) ¶ Factorised $y = a(x - p)(x - q)$ (roots $p$, $q$)
[k] Graph transformations :: $f(x) + b$: up $b$ ¶ $f(x - a)$: right $a$ ¶ $pf(x)$: vertical stretch factor $p$ ¶ $f(qx)$: horizontal stretch factor $1/q$ ¶ $-f(x)$: reflect in $x$-axis ¶ $f(-x)$: reflect in $y$-axis
[k] Asymptotes of $f(x) = \dfrac{ax + b}{cx + d}$ :: Vertical: $x = -\dfrac{d}{c}$. Horizontal: $y = \dfrac{a}{c}$.
[k] Graphs of $e^x$ and $\ln x$ :: $y = e^x$: domain $\mathbb{R}$, range $y > 0$, horizontal asymptote $y = 0$, passes $(0, 1)$. ¶ $y = \ln x$: domain $x > 0$, vertical asymptote $x = 0$, passes $(1, 0)$. They are inverses.
[k] Factor and remainder theorems (AHL) :: Remainder when $p(x)$ is divided by $(x - a)$ is $p(a)$. $(x - a)$ is a factor iff $p(a) = 0$. (For $ax - b$: remainder $p(b/a)$.)
[f] Sum and product of roots (AHL) :: For $a_nx^n + a_{n-1}x^{n-1} + \dots + a_0 = 0$: ¶ sum $= -\dfrac{a_{n-1}}{a_n}$, product $= \dfrac{(-1)^n a_0}{a_n}$
[d] Odd and even functions (AHL) :: Even: $f(-x) = f(x)$ — symmetric in the $y$-axis. Odd: $f(-x) = -f(x)$ — rotational symmetry of order 2 about the origin.
[d] Self-inverse function (AHL) :: $f(x) = f^{-1}(x)$ for all $x$ in the domain, i.e. $f(f(x)) = x$; graph symmetric about $y = x$ (e.g. $f(x) = 1/x$).
[k] Graphs of $|f(x)|$ and $f(|x|)$ (AHL) :: $y = |f(x)|$: reflect parts below the $x$-axis upward. ¶ $y = f(|x|)$: keep the part for $x \ge 0$ and reflect it in the $y$-axis.
[k] Graph of $y = \dfrac{1}{f(x)}$ (AHL) :: Zeros of $f$ become vertical asymptotes; $f \to \pm\infty$ gives $1/f \to 0$; points where $f = \pm1$ are invariant; max ↔ min swap.
[k] Graph of $y = [f(x)]^2$ (AHL) :: Non-negative everywhere; zeros of $f$ become tangent points on the $x$-axis; values with $|f| < 1$ shrink, $|f| > 1$ grow.
[k] Oblique asymptote of a rational function (AHL) :: When the numerator's degree is one more than the denominator's: divide; the quotient (linear) is the oblique asymptote.
[k] Solving inequalities (AHL) :: Find the critical values (roots/asymptotes), then test sign on each interval or use a graph. Never multiply by an expression whose sign is unknown.
[d] One-to-one vs many-to-one :: One-to-one: each output comes from exactly one input (passes horizontal-line test); many-to-one: some outputs come from several inputs. Only one-to-one functions have inverses.
[k] Finding an inverse algebraically :: Write $y = f(x)$, swap $x$ and $y$, rearrange for $y$; state the domain of $f^{-1}$ (= range of $f$).
[f] Exponential growth/decay model :: $f(x) = ka^x + c$ or $f(x) = ke^{rx} + c$; horizontal asymptote $y = c$.
[k] Graphical solution of equations with a GDC :: Solve $f(x) = g(x)$ by graphing both and finding intersection points (or zeros of $f - g$).
[f] Vertex of $y = ax^2 + bx + c$ :: $\left(-\dfrac{b}{2a},\ c - \dfrac{b^2}{4a}\right)$
[d] Rational function :: A quotient of two polynomials, $f(x) = \dfrac{p(x)}{q(x)}$, undefined where $q(x) = 0$.
`;
