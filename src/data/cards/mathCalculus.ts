/** Math AA HL — Topic 5. Original wording. */
export const mathCalculusSource = String.raw`
# M5
[f] Derivative from first principles :: $f'(x) = \lim_{h \to 0}\dfrac{f(x + h) - f(x)}{h}$
[f] Power rule :: $\dfrac{d}{dx}x^n = nx^{n-1}$
[f] Chain rule :: $\dfrac{dy}{dx} = \dfrac{dy}{du}\cdot\dfrac{du}{dx}$
[f] Product and quotient rules :: $(uv)' = uv' + vu'$ ¶ $\left(\dfrac{u}{v}\right)' = \dfrac{vu' - uv'}{v^2}$
[f] Standard derivatives :: $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, $(\tan x)' = \sec^2 x$ ¶ $(e^x)' = e^x$, $(\ln x)' = \dfrac1x$
[f] Further derivatives (AHL) :: $(\sec x)' = \sec x\tan x$, $(\csc x)' = -\csc x\cot x$, $(\cot x)' = -\csc^2 x$ ¶ $(a^x)' = a^x\ln a$, $(\log_a x)' = \dfrac{1}{x\ln a}$
[f] Derivatives of inverse trig functions (AHL) :: $(\arcsin x)' = \dfrac{1}{\sqrt{1 - x^2}}$, $(\arccos x)' = -\dfrac{1}{\sqrt{1 - x^2}}$, $(\arctan x)' = \dfrac{1}{1 + x^2}$
[f] Tangent and normal at $x = a$ :: Tangent: $y - f(a) = f'(a)(x - a)$ ¶ Normal: gradient $-\dfrac{1}{f'(a)}$
[k] Increasing and decreasing functions :: $f'(x) > 0$: increasing; $f'(x) < 0$: decreasing.
[k] Stationary points and the second-derivative test :: Stationary where $f'(x) = 0$. If $f''(x) < 0$: local maximum; $f''(x) > 0$: local minimum; $f''(x) = 0$: test fails — use a sign table of $f'$.
[d] Point of inflection :: A point where the concavity changes, so $f''$ changes sign (not merely $f''(x) = 0$, e.g. $y = x^4$ at 0 is not one).
[k] Concavity :: $f''(x) > 0$: concave up; $f''(x) < 0$: concave down.
[f] Standard integrals :: $\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C$ ($n \ne -1$) ¶ $\int \dfrac1x\,dx = \ln|x| + C$ ¶ $\int e^x\,dx = e^x + C$ ¶ $\int \sin x\,dx = -\cos x + C$, $\int \cos x\,dx = \sin x + C$
[f] Integral of a linear composite :: $\int f(ax + b)\,dx = \dfrac1a F(ax + b) + C$ where $F' = f$
[f] Area between curve and $x$-axis :: $A = \int_a^b |y|\,dx$ — split at roots, since area below the axis gives a negative integral.
[f] Area between two curves :: $A = \int_a^b |f(x) - g(x)|\,dx$
[f] Kinematics with calculus :: $v = \dfrac{ds}{dt}$, $a = \dfrac{dv}{dt} = \dfrac{d^2s}{dt^2}$ ¶ Displacement $= \int_{t_1}^{t_2} v\,dt$ ¶ Distance $= \int_{t_1}^{t_2}|v|\,dt$
[k] Fundamental theorem of calculus :: $\int_a^b f'(x)\,dx = f(b) - f(a)$ — differentiation and integration are inverse processes.
[f] Limit results (AHL) :: $\lim_{x\to0}\dfrac{\sin x}{x} = 1$
[f] L'Hôpital's rule (AHL) :: If $\lim \dfrac{f}{g}$ gives $\dfrac00$ or $\dfrac{\infty}{\infty}$, then $\lim\dfrac{f(x)}{g(x)} = \lim\dfrac{f'(x)}{g'(x)}$ (if this exists). May be repeated.
[k] Continuity and differentiability (AHL) :: Continuous at $a$: $\lim_{x\to a} f(x) = f(a)$. Differentiable at $a$: left and right derivatives exist and are equal. Differentiable ⇒ continuous, not conversely (e.g. $|x|$ at 0).
[k] Implicit differentiation (AHL) :: Differentiate both sides with respect to $x$, treating $y$ as a function of $x$ (e.g. $\dfrac{d}{dx}y^2 = 2y\dfrac{dy}{dx}$), then solve for $\dfrac{dy}{dx}$.
[k] Related rates (AHL) :: Write an equation linking the variables, differentiate with respect to time using the chain rule, substitute known values.
[f] Integration by parts (AHL) :: $\int u\dfrac{dv}{dx}\,dx = uv - \int v\dfrac{du}{dx}\,dx$ — choose $u$ that simplifies when differentiated (LIATE order as a guide).
[k] Integration by substitution :: Choose $u = g(x)$, replace $dx$ using $du = g'(x)\,dx$, change limits for definite integrals, integrate in $u$.
[f] Standard integrals involving inverse trig (AHL) :: $\int\dfrac{1}{a^2 + x^2}\,dx = \dfrac1a\arctan\dfrac{x}{a} + C$ ¶ $\int\dfrac{1}{\sqrt{a^2 - x^2}}\,dx = \arcsin\dfrac{x}{a} + C$, $|x| < a$
[f] Volumes of revolution (AHL) :: About $x$-axis: $V = \int_a^b \pi y^2\,dx$ ¶ About $y$-axis: $V = \int_a^b \pi x^2\,dy$
[f] Area with respect to the $y$-axis (AHL) :: $A = \int_c^d |x|\,dy$
[k] Separable differential equations (AHL) :: Rearrange to $g(y)\,dy = f(x)\,dx$, integrate both sides, add one constant, apply initial conditions.
[f] Homogeneous differential equations (AHL) :: For $\dfrac{dy}{dx} = f\left(\dfrac{y}{x}\right)$, substitute $y = vx$, so $\dfrac{dy}{dx} = v + x\dfrac{dv}{dx}$, then separate.
[f] Integrating factor (AHL) :: For $\dfrac{dy}{dx} + P(x)y = Q(x)$: multiply by $I(x) = e^{\int P(x)\,dx}$, giving $\dfrac{d}{dx}(Iy) = IQ$.
[f] Euler's method (AHL) :: $y_{n+1} = y_n + h\,f(x_n, y_n)$, $x_{n+1} = x_n + h$ — smaller step $h$ gives better accuracy.
[f] Maclaurin series (AHL) :: $f(x) = f(0) + xf'(0) + \dfrac{x^2}{2!}f''(0) + \dots$
[f] Standard Maclaurin series (AHL) :: $e^x = 1 + x + \dfrac{x^2}{2!} + \dots$ ¶ $\ln(1 + x) = x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \dots$ ¶ $\sin x = x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \dots$ ¶ $\cos x = 1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \dots$ ¶ $\arctan x = x - \dfrac{x^3}{3} + \dfrac{x^5}{5} - \dots$
[k] Optimisation problems :: Write the quantity as a function of one variable using the constraint, differentiate, set to zero, verify max/min (second derivative or endpoints), answer in context.
[k] Using the graph of $f'$ to describe $f$ :: Roots of $f'$ (with sign change) → stationary points of $f$; turning points of $f'$ → inflection points of $f$.
[f] Definite integral properties :: $\int_a^b f\,dx = -\int_b^a f\,dx$ ¶ $\int_a^b f\,dx + \int_b^c f\,dx = \int_a^c f\,dx$ ¶ $\int_a^b kf\,dx = k\int_a^b f\,dx$
`;
