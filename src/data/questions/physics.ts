import { parseQuestions } from '../dsl';

export const PHYSICS_QUESTIONS_VERSION = 1;

/** Original practice questions (not taken from IB papers). Use g = 9.81 m s⁻² unless stated. */
const source = String.raw`
@num A.1 value=80 unit=m
Q: A car starts from rest and accelerates uniformly at $2.5\ \text{m s}^{-2}$ for $8.0$ s. Calculate the distance travelled.
S: $s = ut + \tfrac12at^2 = 0 + \tfrac12(2.5)(8.0)^2 = 80$ m.

@num A.1 value=11.47 unit=m
Q: A ball is thrown vertically upwards at $15\ \text{m s}^{-1}$. Ignoring air resistance, determine its maximum height.
S: At the top $v = 0$: $h = \dfrac{u^2}{2g} = \dfrac{15^2}{2(9.81)} = 11.5$ m.

@num A.1 value=24.2 unit=m
Q: A stone is thrown horizontally at $12\ \text{m s}^{-1}$ from the top of a $20$ m vertical cliff. Calculate the horizontal distance from the base of the cliff to where it lands.
S: Time to fall: $t = \sqrt{2h/g} = \sqrt{40/9.81} = 2.02$ s. Horizontal distance $= 12 \times 2.02 = 24.2$ m.

@mc A.1
Q: What does the area under a velocity–time graph represent?
O: Acceleration
O*: Displacement
O: Change in acceleration
O: Average speed
S: Area = $\int v\,dt$ = displacement. The gradient gives acceleration.

@num A.2 value=525 unit=N
Q: A $0.15$ kg ball travelling at $20\ \text{m s}^{-1}$ hits a wall and rebounds along the same line at $15\ \text{m s}^{-1}$. Contact lasts $0.010$ s. Calculate the magnitude of the average force on the ball.
S: $\Delta p = 0.15(15 - (-20)) = 5.25$ N s. $F = \Delta p/\Delta t = 5.25/0.010 = 525$ N.

@num A.2 value=2.0 unit=m s^-1
Q: A $2.0$ kg trolley moving at $3.0\ \text{m s}^{-1}$ collides with a stationary $1.0$ kg trolley and they stick together. Calculate their common velocity.
S: Momentum conserved: $2.0 \times 3.0 = 3.0\,v \Rightarrow v = 2.0\ \text{m s}^{-1}$.

@mc A.2
Q: A book rests on a table. According to Newton's third law, the force paired with the book's weight is
O: the normal force of the table on the book.
O: the normal force of the book on the table.
O*: the gravitational force of the book on the Earth.
O: the weight of the table.
S: Third-law pairs act on different bodies and are the same type of force. Weight = Earth pulls book (gravitational), so the pair is the book pulling the Earth.

@num A.2 value=5400 unit=N
Q: A $1200$ kg car travels round a horizontal bend of radius $50$ m at $15\ \text{m s}^{-1}$. Calculate the centripetal force required.
S: $F = \dfrac{mv^2}{r} = \dfrac{1200 \times 15^2}{50} = 5400$ N.

@num A.3 value=736 unit=W
Q: A motor lifts a $50$ kg load vertically through $12$ m at constant speed in $8.0$ s. Calculate the useful power output.
S: $P = \dfrac{mgh}{t} = \dfrac{50 \times 9.81 \times 12}{8.0} = 736$ W.

@num A.3 value=15 unit=%
Q: A lamp takes $2000$ W of electrical power and emits $300$ W of visible light. Calculate its efficiency as a percentage.
S: $\eta = 300/2000 = 0.15 = 15\%$.

@open A.3
Q: A skydiver falls at terminal velocity. Describe the energy transfers taking place.
A: Speed (and kinetic energy) is constant, so the loss of gravitational potential energy is transferred entirely to thermal energy (internal energy of the air and skydiver) by work done against air resistance.

@num A.4 value=25 unit=rad s^-1
Q: A flywheel with moment of inertia $0.40\ \text{kg m}^2$ starts from rest and a constant resultant torque of $2.0$ N m acts for $5.0$ s. Calculate its final angular velocity.
S: $\alpha = \tau/I = 2.0/0.40 = 5.0\ \text{rad s}^{-2}$; $\omega = \alpha t = 25\ \text{rad s}^{-1}$.

@num A.4 value=125 unit=J
Q: A flywheel with $I = 0.40\ \text{kg m}^2$ rotates at $25\ \text{rad s}^{-1}$. Calculate its rotational kinetic energy.
S: $E_k = \tfrac12 I\omega^2 = \tfrac12(0.40)(25)^2 = 125$ J.

@mc A.4
Q: A spinning ice skater pulls her arms in. Which statement is correct?
O: Angular momentum increases and kinetic energy is constant.
O: Angular velocity increases and kinetic energy is constant.
O*: Angular momentum is constant and kinetic energy increases.
O: Angular velocity is constant and moment of inertia decreases.
S: No external torque, so $L = I\omega$ is constant. $I$ falls so $\omega$ rises; $E_k = L^2/2I$ increases (the skater does work pulling her arms in).

@num A.5 value=1.667
Q: Calculate the Lorentz factor $\gamma$ for a speed of $0.80c$.
S: $\gamma = 1/\sqrt{1 - 0.64} = 1/0.6 = 1.67$.

@num A.5 value=11.06 unit=μs
Q: Muons have a proper mean lifetime of $2.2\ \mu\text{s}$. Calculate their mean lifetime measured in the Earth frame when they travel at $0.98c$ (answer in μs).
S: $\gamma = 1/\sqrt{1 - 0.98^2} = 5.03$. $\Delta t = \gamma\Delta t_0 = 5.03 \times 2.2 = 11.1\ \mu\text{s}$.

@num A.5 value=0.846 unit=c
Q: A rocket moves at $0.60c$ relative to Earth and fires a probe forwards at $0.50c$ relative to the rocket. Calculate the speed of the probe relative to Earth, as a multiple of $c$.
S: $u = \dfrac{0.60 + 0.50}{1 + 0.60 \times 0.50} = \dfrac{1.10}{1.30} = 0.846c$.

@num B.1 value=125.4 unit=kJ
Q: Calculate the energy (in kJ) needed to heat $0.50$ kg of water from $20\,^\circ$C to $80\,^\circ$C. ($c = 4180\ \text{J kg}^{-1}\,\text{K}^{-1}$)
S: $Q = mc\Delta T = 0.50 \times 4180 \times 60 = 1.25\times10^5$ J = 125 kJ.

@num B.1 value=6.68e4 unit=J
Q: Calculate the energy needed to melt $0.20$ kg of ice at $0\,^\circ$C. ($L_f = 3.34\times10^5\ \text{J kg}^{-1}$)
S: $Q = mL = 0.20 \times 3.34\times10^5 = 6.68\times10^4$ J.

@num B.1 value=5800 unit=K
Q: A star's emission spectrum peaks at $500$ nm. Estimate its surface temperature.
S: $T = \dfrac{2.9\times10^{-3}}{500\times10^{-9}} = 5800$ K.

@num B.1 value=7.13e5 unit=W
Q: A black-body sphere of radius $1.0$ m is at $1000$ K. Calculate the power it radiates.
S: $L = \sigma A T^4 = 5.67\times10^{-8} \times 4\pi(1.0)^2 \times 1000^4 = 7.1\times10^5$ W.

@num B.2 value=255 rel=0.01 unit=K
Q: A planet receives a mean intensity of $340\ \text{W m}^{-2}$ averaged over its surface, has albedo $0.30$ and behaves as a black body ($e = 1$). Calculate its equilibrium surface temperature.
S: $(1 - 0.30)(340) = \sigma T^4 \Rightarrow T = \left(\dfrac{238}{5.67\times10^{-8}}\right)^{1/4} = 255$ K.

@mc B.2
Q: Why do molecules such as $\text{CO}_2$ absorb infrared radiation?
O: Infrared photons have enough energy to ionise them.
O*: Infrared frequencies match natural vibrational frequencies of their bonds.
O: They are larger than $\text{N}_2$ and $\text{O}_2$ molecules.
O: Infrared radiation is reflected by their electron clouds.
S: Resonance: the IR frequency matches the natural frequency of bond vibrations, so energy is absorbed.

@num B.3 value=99700 unit=Pa
Q: $2.0$ mol of an ideal gas at $300$ K occupies $0.050\ \text{m}^3$. Calculate its pressure.
S: $P = nRT/V = 2.0 \times 8.31 \times 300 / 0.050 = 9.97\times10^4$ Pa.

@num B.3 value=133 unit=kPa
Q: A fixed mass of gas at $100$ kPa and $27\,^\circ$C is heated to $127\,^\circ$C at constant volume. Calculate the new pressure in kPa.
S: Use kelvin: $P_2 = 100 \times \dfrac{400}{300} = 133$ kPa.

@num B.4 value=0.50
Q: Calculate the Carnot efficiency (as a decimal) of an engine working between $600$ K and $300$ K.
S: $\eta = 1 - T_c/T_h = 1 - 300/600 = 0.50$.

@num B.4 value=3000 unit=J
Q: A gas expands at a constant pressure of $2.0\times10^5$ Pa from $0.010\ \text{m}^3$ to $0.025\ \text{m}^3$. Calculate the work done by the gas.
S: $W = P\Delta V = 2.0\times10^5 \times 0.015 = 3.0\times10^3$ J.

@mc B.4
Q: An ideal gas is compressed adiabatically. Which is correct?
O: $Q > 0$ and temperature is constant.
O: $W = 0$ and internal energy increases.
O*: $Q = 0$ and temperature increases.
O: $Q = 0$ and internal energy decreases.
S: Adiabatic: $Q = 0$. Work is done **on** the gas ($W < 0$), so $\Delta U = -W > 0$ and the temperature rises.

@num B.5 value=2.0 unit=Ω
Q: Calculate the combined resistance of a $6.0\ \Omega$ and a $3.0\ \Omega$ resistor connected in parallel.
S: $\dfrac{1}{R} = \dfrac16 + \dfrac13 = \dfrac12 \Rightarrow R = 2.0\ \Omega$.

@num B.5 value=8.0 unit=V
Q: A cell of emf $9.0$ V and internal resistance $0.50\ \Omega$ is connected to a $4.0\ \Omega$ resistor. Calculate the terminal potential difference.
S: $I = \dfrac{9.0}{4.5} = 2.0$ A; $V = \varepsilon - Ir = 9.0 - 1.0 = 8.0$ V.

@num B.5 value=0.17 unit=Ω
Q: A copper wire is $10$ m long with cross-sectional area $1.0\times10^{-6}\ \text{m}^2$. The resistivity of copper is $1.7\times10^{-8}\ \Omega$ m. Calculate its resistance.
S: $R = \rho L/A = 1.7\times10^{-8} \times 10 / 1.0\times10^{-6} = 0.17\ \Omega$.

@num C.1 value=0.314 unit=s
Q: A $0.50$ kg mass oscillates on a spring of spring constant $200\ \text{N m}^{-1}$. Calculate the period.
S: $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{0.0025} = 0.314$ s.

@num C.1 value=0.503 unit=m s^-1
Q: An object performs SHM with amplitude $0.040$ m and frequency $2.0$ Hz. Calculate its maximum speed.
S: $v_{max} = \omega x_0 = 2\pi(2.0)(0.040) = 0.503\ \text{m s}^{-1}$.

@num C.2 value=340 unit=m s^-1
Q: A sound wave has frequency $250$ Hz and wavelength $1.36$ m. Calculate its speed.
S: $v = f\lambda = 250 \times 1.36 = 340\ \text{m s}^{-1}$.

@num C.3 value=25.4 unit=°
Q: Light passes from air into glass ($n = 1.50$) at an angle of incidence of $40^\circ$. Calculate the angle of refraction.
S: $\sin\theta_2 = \sin 40^\circ / 1.50 = 0.429 \Rightarrow \theta_2 = 25.4^\circ$.

@num C.3 value=41.8 unit=°
Q: Calculate the critical angle for light travelling from glass ($n = 1.50$) to air.
S: $\sin\theta_c = 1/1.50 \Rightarrow \theta_c = 41.8^\circ$.

@num C.3 value=4.0 unit=mm
Q: Light of wavelength $600$ nm passes through two slits $0.30$ mm apart onto a screen $2.0$ m away. Calculate the fringe spacing in mm.
S: $s = \dfrac{\lambda D}{d} = \dfrac{600\times10^{-9} \times 2.0}{0.30\times10^{-3}} = 4.0\times10^{-3}$ m = 4.0 mm.

@num C.4 value=352 unit=m s^-1
Q: A string of length $0.80$ m fixed at both ends has a fundamental frequency of $220$ Hz. Calculate the wave speed on the string.
S: $\lambda_1 = 2L = 1.60$ m; $v = f\lambda = 220 \times 1.60 = 352\ \text{m s}^{-1}$.

@num C.4 value=250 unit=Hz
Q: A pipe closed at one end is $0.34$ m long. The speed of sound is $340\ \text{m s}^{-1}$. Calculate its fundamental frequency.
S: $\lambda = 4L = 1.36$ m; $f = 340/1.36 = 250$ Hz.

@mc C.4
Q: Which frequencies can a pipe closed at one end with fundamental $f_1$ produce?
O: $f_1, 2f_1, 3f_1, \dots$
O*: $f_1, 3f_1, 5f_1, \dots$
O: $2f_1, 4f_1, 6f_1, \dots$
O: $f_1/2, f_1, 3f_1/2, \dots$
S: A closed end must be a node and the open end an antinode, so only odd harmonics fit.

@num C.5 value=1097 unit=Hz
Q: An ambulance siren emits $1000$ Hz and approaches a stationary observer at $30\ \text{m s}^{-1}$. Speed of sound $= 340\ \text{m s}^{-1}$. Calculate the observed frequency.
S: $f' = f\dfrac{v}{v - u_s} = 1000 \times \dfrac{340}{310} = 1097$ Hz.

@num C.5 value=3.02e6 unit=m s^-1
Q: A hydrogen line with laboratory wavelength $656.3$ nm is observed at $662.9$ nm in a galaxy's spectrum. Estimate the galaxy's recession speed.
S: $v \approx c\dfrac{\Delta\lambda}{\lambda} = 3.00\times10^8 \times \dfrac{6.6}{656.3} = 3.0\times10^6\ \text{m s}^{-1}$.

@num D.1 value=2.45 unit=N kg^-1
Q: Gravitational field strength at Earth's surface is $9.81\ \text{N kg}^{-1}$. Calculate it at a height above the surface equal to one Earth radius.
S: Distance from centre doubles, so $g$ falls by a factor of 4: $9.81/4 = 2.45\ \text{N kg}^{-1}$.

@num D.1 value=7540 unit=m s^-1
Q: Calculate the orbital speed of a satellite in a circular orbit of radius $7.0\times10^6$ m around Earth ($M = 5.97\times10^{24}$ kg).
S: $v = \sqrt{GM/r} = \sqrt{6.67\times10^{-11} \times 5.97\times10^{24}/7.0\times10^6} = 7.5\times10^3\ \text{m s}^{-1}$.

@num D.1 value=2370 unit=m s^-1
Q: Calculate the escape speed from the surface of the Moon ($M = 7.35\times10^{22}$ kg, $R = 1.74\times10^6$ m).
S: $v = \sqrt{2GM/R} = \sqrt{2 \times 6.67\times10^{-11} \times 7.35\times10^{22}/1.74\times10^6} = 2.37\times10^3\ \text{m s}^{-1}$.

@mc D.1
Q: A satellite in a low circular orbit experiences a small atmospheric drag. What happens to its orbital radius and speed?
O: Radius decreases, speed decreases.
O*: Radius decreases, speed increases.
O: Radius increases, speed decreases.
O: Radius constant, speed decreases.
S: Total energy $-GMm/2r$ decreases, so $r$ decreases; $v = \sqrt{GM/r}$ then increases.

@num D.2 value=5.39 unit=N
Q: Calculate the electric force between charges of $+2.0\ \mu\text{C}$ and $+3.0\ \mu\text{C}$ separated by $0.10$ m in a vacuum.
S: $F = kq_1q_2/r^2 = 8.99\times10^9 \times 6.0\times10^{-12}/0.010 = 5.4$ N (repulsive).

@num D.2 value=2.5e4 unit=V m^-1
Q: Two parallel plates $2.0$ cm apart have a potential difference of $500$ V. Calculate the electric field strength between them.
S: $E = V/d = 500/0.020 = 2.5\times10^4\ \text{V m}^{-1}$.

@num D.3 value=1.14e-2 unit=m
Q: An electron moving at $2.0\times10^7\ \text{m s}^{-1}$ enters a uniform magnetic field of $0.010$ T at right angles. Calculate the radius of its path. ($m_e = 9.11\times10^{-31}$ kg)
S: $r = \dfrac{mv}{qB} = \dfrac{9.11\times10^{-31} \times 2.0\times10^7}{1.60\times10^{-19} \times 0.010} = 1.1\times10^{-2}$ m.

@num D.3 value=0.30 unit=N
Q: A $0.50$ m wire carrying $3.0$ A lies perpendicular to a uniform $0.20$ T magnetic field. Calculate the force on it.
S: $F = BIL = 0.20 \times 3.0 \times 0.50 = 0.30$ N.

@num D.4 value=10 unit=V
Q: A coil of $200$ turns and area $0.010\ \text{m}^2$ is perpendicular to a $0.50$ T field. The field falls uniformly to zero in $0.10$ s. Calculate the average induced emf.
S: $\varepsilon = N\dfrac{\Delta\Phi}{\Delta t} = 200 \times \dfrac{0.50 \times 0.010}{0.10} = 10$ V.

@open D.4
Q: A bar magnet is dropped north pole first through a vertical coil connected to a resistor. Explain, using Lenz's law, why the magnet falls with an acceleration less than $g$ while entering the coil.
A: The changing flux induces a current in the coil. By Lenz's law the current opposes the change, so the top of the coil becomes a north pole and repels the approaching magnet. This upward magnetic force reduces the resultant force, so acceleration < g. Energy: some GPE is converted to electrical energy then thermal energy in the resistor.

@num E.1 value=2.49 unit=eV
Q: Calculate the energy, in eV, of a photon of wavelength $500$ nm.
S: $E = \dfrac{hc}{\lambda} = \dfrac{6.63\times10^{-34} \times 3.00\times10^8}{500\times10^{-9}} = 3.98\times10^{-19}$ J $= 2.49$ eV.

@num E.1 value=1.89 unit=eV
Q: Using $E_n = -13.6/n^2$ eV, calculate the energy of the photon emitted when an electron in hydrogen falls from $n = 3$ to $n = 2$.
S: $\Delta E = 13.6\left(\tfrac14 - \tfrac19\right) = 1.89$ eV (the red Balmer line, 656 nm).

@num E.2 value=0.81 rel=0.03 unit=eV
Q: Light of wavelength $400$ nm falls on a metal with work function $2.3$ eV. Calculate the maximum kinetic energy of the photoelectrons in eV.
S: Photon energy $= hc/\lambda = 4.97\times10^{-19}$ J $= 3.11$ eV. $E_{k,max} = 3.11 - 2.3 = 0.81$ eV.

@num E.2 value=7.28e-10 unit=m
Q: Calculate the de Broglie wavelength of an electron moving at $1.0\times10^6\ \text{m s}^{-1}$.
S: $\lambda = \dfrac{h}{mv} = \dfrac{6.63\times10^{-34}}{9.11\times10^{-31} \times 1.0\times10^6} = 7.3\times10^{-10}$ m.

@mc E.2
Q: In a photoelectric experiment the intensity of light is doubled at constant frequency (above threshold). What happens?
O: Maximum kinetic energy of photoelectrons doubles.
O*: The number of photoelectrons emitted per second doubles.
O: The threshold frequency halves.
O: Both the current and the maximum kinetic energy double.
S: Doubling intensity doubles the photon rate; each photon still has energy $hf$, so $E_{k,max}$ is unchanged.

@num E.3 value=0.125
Q: A radioactive isotope has a half-life of $8.0$ days. What fraction of the original nuclei remains after $24$ days?
S: 24 days = 3 half-lives: $(1/2)^3 = 0.125$.

@num E.3 value=1.21e-4 unit=yr^-1
Q: Carbon-14 has a half-life of $5730$ years. Calculate its decay constant in $\text{yr}^{-1}$.
S: $\lambda = \ln 2 / T_{1/2} = 0.693/5730 = 1.21\times10^{-4}\ \text{yr}^{-1}$.

@mc E.3
Q: Carbon-14 ($Z = 6$) undergoes $\beta^-$ decay. What is the daughter nucleus?
O: $^{14}_{5}\text{B}$
O*: $^{14}_{7}\text{N}$
O: $^{13}_{6}\text{C}$
O: $^{10}_{4}\text{Be}$
S: In $\beta^-$ decay a neutron becomes a proton: $A$ unchanged, $Z$ increases by 1 → nitrogen-14.

@num E.3 value=28.3 unit=MeV
Q: The mass defect of a helium-4 nucleus is $0.0304$ u. Calculate its binding energy in MeV.
S: $E = 0.0304 \times 931.5 = 28.3$ MeV (≈ 7.1 MeV per nucleon).

@open E.4
Q: Outline the role of the moderator in a thermal fission reactor.
A: The moderator (e.g. water or graphite) slows down fast neutrons released by fission through repeated elastic collisions with light nuclei, until they reach thermal energies. Slow (thermal) neutrons are much more likely to be absorbed by U-235 and cause further fission, sustaining the chain reaction.

@num E.5 value=4.0 unit=pc
Q: A star has a parallax angle of $0.25$ arc-seconds. Calculate its distance in parsecs.
S: $d = 1/p = 1/0.25 = 4.0$ pc.

@mc E.5
Q: On a Hertzsprung–Russell diagram, the horizontal axis shows
O: luminosity increasing to the right.
O: mass increasing to the right.
O*: surface temperature decreasing to the right.
O: radius increasing to the right.
S: By convention temperature decreases from left (hot, blue O stars) to right (cool, red M stars), on a logarithmic scale.

@open E.5
Q: Explain why nuclear fusion in stars requires extremely high temperatures.
A: Nuclei are positively charged and repel electrostatically. They must approach to within ~$10^{-15}$ m for the strong force to act, which requires very high kinetic energies — i.e. very high temperature (≈ $10^7$ K). High density also ensures collisions are frequent enough.

@mc CT
Q: A question asks you to "**State**" the unit of magnetic flux. What is required?
O: A derivation of the unit from base units.
O*: A brief answer with no explanation or working.
O: An answer with reasons and causes.
O: A judgement weighing strengths and limitations.
S: "State" = give a name, value or brief answer without explanation. Answer: weber (Wb).

@mc CT
Q: Which command term requires you to give reasons or causes?
O: Describe
O: Outline
O*: Explain
O: State
S: "Explain" asks for a detailed account including reasons or causes; "Describe" does not require reasons.
`;

export const physicsQuestions = parseQuestions('physics', source);
