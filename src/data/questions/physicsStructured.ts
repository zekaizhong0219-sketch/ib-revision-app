import { parseStructured } from '../dsl';

/** Original multi-part (Paper 2-style) physics questions. Numeric answers verified in Python. g = 9.81 m s⁻². */
const source = String.raw`
@struct A.1
Q: A football is kicked from level ground at $18\ \text{m s}^{-1}$ at $35^\circ$ above the horizontal. Ignore air resistance.
a) [2] Calculate the vertical component of the initial velocity.
= 10.32 unit=m s^-1
M: $u_y = u\sin\theta$ (1) ¶ $= 18\sin35^\circ = 10.3\ \text{m s}^{-1}$ (1)
b) [2] Calculate the time of flight.
= 2.105 unit=s
M: $t = \dfrac{2u_y}{g}$ (1) ¶ $= 2.10$ s (1)
c) [2] Calculate the horizontal range.
= 31.04 unit=m
M: $u_x = 18\cos35^\circ = 14.7\ \text{m s}^{-1}$ (1) ¶ $R = u_x t = 31$ m (1)
d) [2] State and explain the effect of air resistance on the range.
M: range decreases (1) ¶ air resistance opposes motion, so horizontal velocity decreases during flight (and maximum height is lower) (1)

@struct A.2
Q: A car of mass $1500$ kg travelling at $12\ \text{m s}^{-1}$ collides with a stationary car of mass $900$ kg. The cars stick together.
a) [2] Calculate the velocity of the cars immediately after the collision.
= 7.5 unit=m s^-1
M: momentum conserved: $1500 \times 12 = 2400v$ (1) ¶ $v = 7.5\ \text{m s}^{-1}$ (1)
b) [2] Calculate the kinetic energy lost in the collision.
= 40500 unit=J
M: initial $E_k = 1.08\times10^5$ J; final $E_k = 6.75\times10^4$ J (1) ¶ loss $= 4.05\times10^4$ J (1)
c) [2] The collision lasts $0.15$ s. Calculate the average force on the $900$ kg car.
= 45000 unit=N
M: $F = \dfrac{\Delta p}{\Delta t} = \dfrac{900 \times 7.5}{0.15}$ (1) ¶ $= 4.5\times10^4$ N (1)
d) [2] Explain how a crumple zone reduces injury to passengers.
M: increases the time over which the momentum changes (1) ¶ so the average force (deceleration) on passengers is smaller, since $F = \Delta p/\Delta t$ (1)

@struct A.3
Q: An electric motor lifts a $120$ kg load vertically at a constant speed of $0.50\ \text{m s}^{-1}$. The electrical power input is $800$ W.
a) [2] Calculate the useful power output of the motor.
= 588.6 unit=W
M: $P = Fv = mgv$ (1) ¶ $= 120 \times 9.81 \times 0.50 = 589$ W (1)
b) [1] Calculate the efficiency of the motor as a percentage.
= 73.58 unit=%
M: $589/800 = 74\%$ (1)
c) [2] Calculate the energy wasted in one minute.
= 12684 unit=J
M: wasted power $= 800 - 589 = 211$ W (1) ¶ $211 \times 60 = 1.27\times10^4$ J (1)
d) [1] State one form into which the wasted energy is transferred.
M: thermal energy (internal energy) of the motor/surroundings, or sound (1)

@struct A.4
Q: (AHL) A disc of moment of inertia $0.20\ \text{kg m}^2$ and radius $0.25$ m is initially at rest. A string wrapped around its rim is pulled with a constant tangential force of $4.0$ N for $3.0$ s.
a) [1] Calculate the torque on the disc.
= 1.0 unit=N m
M: $\tau = Fr = 4.0 \times 0.25 = 1.0$ N m (1)
b) [1] Calculate the angular acceleration.
= 5.0 unit=rad s^-2
M: $\alpha = \tau/I = 5.0\ \text{rad s}^{-2}$ (1)
c) [1] Calculate the angular velocity after $3.0$ s.
= 15 unit=rad s^-1
M: $\omega = \alpha t = 15\ \text{rad s}^{-1}$ (1)
d) [2] Calculate the rotational kinetic energy after $3.0$ s.
= 22.5 unit=J
M: $E_k = \tfrac12 I\omega^2$ (1) ¶ $= \tfrac12 \times 0.20 \times 15^2 = 22.5$ J (1)

@struct A.5
Q: (AHL) A spacecraft travels from Earth to a star $12$ light-years away (measured in the Earth frame) at a constant speed of $0.60c$.
a) [1] Calculate the Lorentz factor.
= 1.25
M: $\gamma = 1/\sqrt{1 - 0.36} = 1.25$ (1)
b) [1] Calculate the journey time in the Earth frame, in years.
= 20 unit=years
M: $t = 12/0.60 = 20$ years (1)
c) [2] Calculate the journey time measured by the crew, in years.
= 16 unit=years
M: the crew measure the proper time (1) ¶ $\Delta t_0 = 20/1.25 = 16$ years (1)
d) [2] Calculate the Earth–star distance measured by the crew, in light-years, and state the name of this effect.
= 9.6 unit=ly
M: $L = 12/1.25 = 9.6$ ly (1) ¶ length contraction (1)

@struct B.1
Q: A $0.30$ kg aluminium block at $90\,^\circ$C is placed in $0.50$ kg of water at $20\,^\circ$C in an insulated container. $c_{Al} = 900\ \text{J kg}^{-1}\,\text{K}^{-1}$, $c_w = 4200\ \text{J kg}^{-1}\,\text{K}^{-1}$.
a) [3] Calculate the final temperature.
= 27.97 rel=0.01 unit=°C
M: energy lost by block = energy gained by water (1) ¶ $0.30 \times 900 \times (90 - T) = 0.50 \times 4200 \times (T - 20)$ (1) ¶ $T = 28\,^\circ$C (1)
b) [1] Calculate the energy gained by the water.
= 16743 rel=0.03 unit=J
M: $0.50 \times 4200 \times 7.97 = 1.7\times10^4$ J (1)
c) [2] In a real experiment the final temperature is lower. Explain why.
M: thermal energy is lost to the surroundings / container (1) ¶ so less energy goes to the water, giving a smaller temperature rise (1)

@struct B.3
Q: A cylinder of volume $0.020\ \text{m}^3$ contains an ideal gas at $300$ K and $5.0\times10^5$ Pa.
a) [2] Calculate the amount of gas in moles.
= 4.011 unit=mol
M: $n = \dfrac{PV}{RT}$ (1) ¶ $= 4.0$ mol (1)
b) [2] The gas is heated to $450$ K at constant volume. Calculate the new pressure.
= 750000 unit=Pa
M: $P/T$ constant (1) ¶ $P = 7.5\times10^5$ Pa (1)
c) [1] Calculate the number of molecules.
= 2.415e24
M: $N = nN_A = 2.4\times10^{24}$ (1)
d) [2] Explain, in molecular terms, why the pressure increases when the gas is heated at constant volume.
M: average kinetic energy / speed of molecules increases (1) ¶ collisions with the walls are more frequent and involve a larger change in momentum, so greater force per unit area (1)

@struct B.4
Q: (AHL) $2.0$ mol of an ideal monatomic gas expands at a constant pressure of $1.0\times10^5$ Pa from $0.040\ \text{m}^3$ to $0.060\ \text{m}^3$.
a) [1] Calculate the work done by the gas.
= 2000 unit=J
M: $W = P\Delta V = 2.0\times10^3$ J (1)
b) [2] Calculate the increase in temperature.
= 120.3 unit=K
M: $P\Delta V = nR\Delta T$ (1) ¶ $\Delta T = 120$ K (1)
c) [2] Calculate the increase in internal energy.
= 3000 unit=J
M: $\Delta U = \tfrac32 nR\Delta T$ (1) ¶ $= 3.0\times10^3$ J (1)
d) [1] Calculate the thermal energy supplied.
= 5000 unit=J
M: $Q = \Delta U + W = 5.0\times10^3$ J (1)

@struct B.5
Q: A cell of emf $12$ V and internal resistance $1.0\ \Omega$ is connected to a $4.0\ \Omega$ resistor and a $6.0\ \Omega$ resistor in parallel.
a) [1] Calculate the total external resistance.
= 2.4 unit=Ω
M: $\left(\tfrac14 + \tfrac16\right)^{-1} = 2.4\ \Omega$ (1)
b) [2] Calculate the current in the cell.
= 3.529 unit=A
M: $I = \dfrac{\varepsilon}{R + r} = \dfrac{12}{3.4}$ (1) ¶ $= 3.5$ A (1)
c) [1] Calculate the terminal potential difference.
= 8.471 unit=V
M: $V = \varepsilon - Ir = 12 - 3.53 = 8.5$ V (1)
d) [2] Calculate the power dissipated in the $4.0\ \Omega$ resistor.
= 17.94 unit=W
M: p.d. across it is the terminal p.d. (1) ¶ $P = V^2/R = 8.47^2/4.0 = 18$ W (1)

@struct C.1
Q: A $0.40$ kg mass on a spring of spring constant $160\ \text{N m}^{-1}$ oscillates with simple harmonic motion of amplitude $0.050$ m.
a) [1] Calculate the angular frequency.
= 20 unit=rad s^-1
M: $\omega = \sqrt{k/m} = 20\ \text{rad s}^{-1}$ (1)
b) [1] Calculate the period.
= 0.3142 unit=s
M: $T = 2\pi/\omega = 0.31$ s (1)
c) [1] Calculate the maximum speed.
= 1.0 unit=m s^-1
M: $v_{max} = \omega x_0 = 1.0\ \text{m s}^{-1}$ (1)
d) [2] Calculate the speed when the displacement is $0.030$ m.
= 0.8 unit=m s^-1
M: $v = \omega\sqrt{x_0^2 - x^2}$ (1) ¶ $= 20 \times 0.040 = 0.80\ \text{m s}^{-1}$ (1)
e) [1] Calculate the total energy of the oscillation.
= 0.2 unit=J
M: $E = \tfrac12 kx_0^2 = 0.20$ J (1)

@struct C.3
Q: (AHL) Light of wavelength $589$ nm is incident normally on a diffraction grating with $600$ lines per mm.
a) [1] Calculate the line spacing $d$.
= 1.667e-6 unit=m
M: $d = \dfrac{1\times10^{-3}}{600} = 1.67\times10^{-6}$ m (1)
b) [2] Calculate the angle of the first-order maximum.
= 20.69 rel=0.01 unit=°
M: $\sin\theta = \lambda/d = 0.353$ (1) ¶ $\theta = 20.7^\circ$ (1)
c) [2] Determine the highest order that can be observed.
= 2 abs=0
M: $n_{max} \le d/\lambda = 2.83$ (1) ¶ so the highest order is 2 (1)
d) [2] Explain why the maxima are much sharper than with a double slit.
M: many slits contribute (1) ¶ destructive interference occurs for any small change of angle away from the maxima, so maxima are narrow and bright (1)

@struct C.4
Q: A string of length $0.65$ m is fixed at both ends. Waves travel along it at $286\ \text{m s}^{-1}$.
a) [2] Calculate the fundamental frequency.
= 220 unit=Hz
M: $\lambda_1 = 2L = 1.30$ m (1) ¶ $f_1 = v/\lambda_1 = 220$ Hz (1)
b) [1] Calculate the frequency of the third harmonic.
= 660 unit=Hz
M: $3f_1 = 660$ Hz (1)
c) [1] State the number of nodes in the third harmonic, including the ends.
= 4 abs=0
M: 4 nodes (1)
d) [2] Outline how this standing wave differs from a travelling wave in terms of energy and amplitude.
M: no net transfer of energy along the string (1) ¶ amplitude varies with position (zero at nodes), unlike a travelling wave where all points have the same amplitude (1)

@struct D.1
Q: A satellite orbits Earth at a height of $400$ km. Radius of Earth $= 6.37\times10^6$ m; mass of Earth $= 5.97\times10^{24}$ kg.
a) [1] State the orbital radius.
= 6.77e6 unit=m
M: $r = 6.37\times10^6 + 4.0\times10^5 = 6.77\times10^6$ m (1)
b) [2] Calculate the orbital speed.
= 7669 unit=m s^-1
M: $v = \sqrt{GM/r}$ (1) ¶ $= 7.67\times10^3\ \text{m s}^{-1}$ (1)
c) [2] Calculate the orbital period in minutes.
= 92.44 unit=min
M: $T = 2\pi r/v = 5.55\times10^3$ s (1) ¶ $= 92$ min (1)
d) [2] Explain why astronauts on board feel "weightless".
M: astronauts and spacecraft are both in free fall with the same acceleration $g$ (1) ¶ so there is no (or negligible) normal contact force on the astronaut (1)

@struct D.3
Q: An electron is accelerated from rest through a potential difference of $2000$ V and then enters a uniform magnetic field of $5.0$ mT at right angles to its velocity.
a) [1] Calculate the kinetic energy gained, in joules.
= 3.2e-16 unit=J
M: $E_k = eV = 3.2\times10^{-16}$ J (1)
b) [2] Calculate the speed of the electron.
= 2.651e7 unit=m s^-1
M: $v = \sqrt{2E_k/m_e}$ (1) ¶ $= 2.65\times10^7\ \text{m s}^{-1}$ (1)
c) [2] Calculate the radius of its circular path.
= 0.03019 unit=m
M: $r = \dfrac{mv}{eB}$ (1) ¶ $= 3.0\times10^{-2}$ m (1)
d) [2] Explain why the kinetic energy of the electron does not change in the magnetic field.
M: the magnetic force is perpendicular to the velocity (1) ¶ so no work is done on the electron (1)

@struct D.4
Q: (AHL) A metal rod of length $0.40$ m slides at a constant $3.0\ \text{m s}^{-1}$ along rails in a uniform magnetic field of $0.25$ T perpendicular to the plane of the rails. The circuit resistance is $0.50\ \Omega$.
a) [1] Calculate the induced emf.
= 0.3 unit=V
M: $\varepsilon = BvL = 0.30$ V (1)
b) [1] Calculate the induced current.
= 0.6 unit=A
M: $I = 0.30/0.50 = 0.60$ A (1)
c) [2] Calculate the magnetic force on the rod.
= 0.06 unit=N
M: $F = BIL$ (1) ¶ $= 0.060$ N (1)
d) [2] Calculate the power needed to keep the rod moving and state where this energy goes.
= 0.18 unit=W
M: $P = Fv = 0.18$ W (equal to $I^2R$) (1) ¶ dissipated as thermal energy in the resistance (1)

@struct E.3
Q: A sample of iodine-131 (half-life $8.0$ days) has an initial activity of $4.0\times10^6$ Bq.
a) [2] Calculate the decay constant in $\text{s}^{-1}$.
= 1.003e-6 unit=s^-1
M: $T_{1/2} = 8.0 \times 86400 = 6.91\times10^5$ s (1) ¶ $\lambda = \ln 2/T_{1/2} = 1.0\times10^{-6}\ \text{s}^{-1}$ (1)
b) [2] Calculate the activity after $20$ days.
= 707100 unit=Bq
M: $A = A_0(1/2)^{20/8}$ (1) ¶ $= 7.1\times10^5$ Bq (1)
c) [2] Calculate the initial number of iodine-131 nuclei.
= 3.989e12
M: $N = A/\lambda$ (1) ¶ $= 4.0\times10^{12}$ (1)
d) [1] State why the activity of a single small sample fluctuates when measured repeatedly.
M: radioactive decay is random (1)

@struct E.2
Q: (AHL) Ultraviolet light of wavelength $250$ nm falls on a metal with work function $4.3$ eV.
a) [2] Calculate the photon energy in eV.
= 4.973 unit=eV
M: $E = hc/\lambda = 7.96\times10^{-19}$ J (1) ¶ $= 4.97$ eV (1)
b) [1] Calculate the maximum kinetic energy of the photoelectrons in eV.
= 0.6725 rel=0.03 unit=eV
M: $4.97 - 4.3 = 0.67$ eV (1)
c) [1] State the stopping potential.
= 0.6725 rel=0.03 unit=V
M: $0.67$ V (1)
d) [2] Calculate the threshold wavelength.
= 2.891e-7 unit=m
M: $\lambda_0 = \dfrac{hc}{\Phi}$ (1) ¶ $= 2.9\times10^{-7}$ m (289 nm) (1)

@struct E.5
Q: A star has surface temperature $9000$ K and radius $2.0\times10^9$ m. It is $25$ pc from Earth ($1$ pc $= 3.086\times10^{16}$ m).
a) [2] Calculate the luminosity of the star.
= 1.87e28 unit=W
M: $L = \sigma 4\pi R^2 T^4$ (1) ¶ $= 1.9\times10^{28}$ W (1)
b) [1] Calculate the peak wavelength of its spectrum.
= 3.222e-7 unit=m
M: $\lambda_{max} = 2.9\times10^{-3}/9000 = 3.2\times10^{-7}$ m (1)
c) [2] Calculate its apparent brightness at Earth.
= 2.5e-9 unit=W m^-2
M: $d = 7.7\times10^{17}$ m (1) ¶ $b = L/(4\pi d^2) = 2.5\times10^{-9}\ \text{W m}^{-2}$ (1)
d) [1] State the parallax angle of the star.
= 0.04 unit=arc-second
M: $p = 1/25 = 0.040$ arc-second (1)
`;

export const physicsStructured = parseStructured('physics', source);
