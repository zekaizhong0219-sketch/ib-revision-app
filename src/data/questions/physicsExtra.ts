import { parseQuestions, parseStructured } from '../dsl';

/** Additional original physics questions (bank expansion). Numeric answers verified in Python; g = 9.81 m s⁻². */
const short = String.raw`
@num A.1 value=6.25 unit=m s^-2
Q: A car travelling at $25\ \text{m s}^{-1}$ brakes uniformly to rest in $50$ m. Calculate the magnitude of its deceleration.
S: $v^2 = u^2 + 2as \Rightarrow 0 = 625 + 100a$, $|a| = 6.25\ \text{m s}^{-2}$.

@num A.1 value=3.029 unit=s
Q: A stone is dropped from rest from a height of $45$ m. Calculate the time it takes to reach the ground (no air resistance).
S: $t = \sqrt{2h/g} = \sqrt{90/9.81} = 3.03$ s.

@mc A.1
Q: A ball is thrown vertically upwards. At the highest point, which is correct?
O: Velocity and acceleration are both zero.
O*: Velocity is zero and acceleration is $9.81\ \text{m s}^{-2}$ downwards.
O: Velocity is maximum and acceleration is zero.
O: Acceleration changes direction.
S: Gravity acts throughout, so the acceleration is constant at $g$ downwards.

@num A.2 value=7.057 unit=m s^-2
Q: A $2.0$ kg box is pulled along a horizontal floor by a horizontal force of $20$ N. The coefficient of dynamic friction is $0.30$. Calculate its acceleration.
S: $F_f = \mu_d mg = 5.89$ N; $a = (20 - 5.89)/2.0 = 7.06\ \text{m s}^{-2}$.

@num A.2 value=791.7 unit=N
Q: A $70$ kg person stands in a lift accelerating upwards at $1.5\ \text{m s}^{-2}$. Calculate the normal force from the floor.
S: $N - mg = ma \Rightarrow N = 70(9.81 + 1.5) = 792$ N.

@num A.2 value=30 unit=N s
Q: A force–time graph is a triangle with a peak of $300$ N and a duration of $0.20$ s. Calculate the impulse.
S: Area $= \tfrac12 \times 0.20 \times 300 = 30$ N s.

@mc A.2
Q: Two trolleys push apart from rest by a spring. Trolley A has twice the mass of trolley B. Which is correct just after separation?
O: Both have the same speed.
O*: B moves at twice the speed of A in the opposite direction.
O: A moves at twice the speed of B.
O: Both have the same kinetic energy.
S: Total momentum stays zero: $2m\,v_A = m\,v_B$, so $v_B = 2v_A$ (and B has more kinetic energy).

@num A.3 value=8.944 unit=m s^-1
Q: A spring of spring constant $400\ \text{N m}^{-1}$ is compressed by $0.10$ m and launches a $0.050$ kg ball horizontally. Calculate the launch speed (no energy losses).
S: $\tfrac12 kx^2 = \tfrac12 mv^2 \Rightarrow v = \sqrt{kx^2/m} = \sqrt{80} = 8.94\ \text{m s}^{-1}$.

@num A.3 value=15000 unit=W
Q: A car travels at a constant $25\ \text{m s}^{-1}$ against a total resistive force of $600$ N. Calculate the useful power output of the engine.
S: Constant velocity, so driving force $= 600$ N; $P = Fv = 1.5\times10^4$ W.

@num A.4 value=10.39 unit=N m
Q: (AHL) A force of $30$ N is applied at $0.40$ m from a pivot, at $60^\circ$ to the line joining the pivot to the point of application. Calculate the torque.
S: $\tau = Fr\sin\theta = 30 \times 0.40 \times \sin60^\circ = 10.4$ N m.

@num A.4 value=9 unit=rad s^-1
Q: (AHL) A skater spinning at $3.0\ \text{rad s}^{-1}$ reduces her moment of inertia from $2.4$ to $0.80\ \text{kg m}^2$. Calculate her new angular velocity.
S: $I_1\omega_1 = I_2\omega_2 \Rightarrow \omega_2 = 2.4 \times 3.0 / 0.80 = 9.0\ \text{rad s}^{-1}$.

@num A.5 value=60 unit=m
Q: (AHL) A spaceship of proper length $100$ m passes an observer at $0.80c$. Calculate its length measured by the observer.
S: $\gamma = 1/0.6$; $L = L_0/\gamma = 60$ m.

@num B.1 value=1672 unit=W
Q: Calculate the minimum power needed to heat $1.5$ kg of water from $20\,^\circ$C to $100\,^\circ$C in $5.0$ minutes. ($c = 4180\ \text{J kg}^{-1}\,\text{K}^{-1}$)
S: $Q = mc\Delta T = 5.02\times10^5$ J; $P = Q/t = 5.02\times10^5/300 = 1.67\times10^3$ W.

@num B.1 value=2.26e5 unit=J
Q: Calculate the energy needed to boil away $0.10$ kg of water at $100\,^\circ$C. ($L_v = 2.26\times10^6\ \text{J kg}^{-1}$)
S: $Q = mL = 2.26\times10^5$ J.

@num B.2 value=390.1 unit=W m^-2
Q: Calculate the power emitted per unit area by a black body at $288$ K.
S: $\sigma T^4 = 5.67\times10^{-8} \times 288^4 = 390\ \text{W m}^{-2}$.

@num B.3 value=6.21e-21 unit=J
Q: Calculate the average random kinetic energy of a molecule of an ideal gas at $300$ K.
S: $\bar{E}_k = \tfrac32 k_BT = 1.5 \times 1.38\times10^{-23} \times 300 = 6.21\times10^{-21}$ J.

@num B.3 value=0.02269 unit=m^3
Q: Calculate the volume of $1.0$ mol of an ideal gas at $273$ K and $1.0\times10^5$ Pa.
S: $V = nRT/P = 8.31 \times 273/10^5 = 2.27\times10^{-2}\ \text{m}^3$.

@num B.4 value=12.5 unit=J K^-1
Q: (AHL) $5000$ J of thermal energy is transferred into a reservoir at a constant $400$ K. Calculate the entropy change of the reservoir.
S: $\Delta S = Q/T = 12.5\ \text{J K}^{-1}$.

@num B.4 value=0.375
Q: (AHL) A heat engine takes in $1200$ J and does $450$ J of work per cycle. Calculate its efficiency as a decimal.
S: $\eta = 450/1200 = 0.375$.

@num B.5 value=8 unit=V
Q: A potential divider made of a $2.0\ \text{k}\Omega$ and a $4.0\ \text{k}\Omega$ resistor in series is connected to a $12$ V supply of negligible internal resistance. Calculate the p.d. across the $4.0\ \text{k}\Omega$ resistor.
S: $V = 12 \times \dfrac{4.0}{6.0} = 8.0$ V.

@num B.5 value=3.75e20
Q: A current of $0.50$ A flows for $2.0$ minutes. Calculate the number of electrons that pass a point.
S: $q = It = 60$ C; $N = q/e = 60/1.60\times10^{-19} = 3.75\times10^{20}$.

@mc B.5
Q: The temperature of an NTC thermistor in a potential divider rises. What happens to its resistance and to the p.d. across it?
O: Resistance increases, p.d. increases.
O*: Resistance decreases, p.d. decreases.
O: Resistance decreases, p.d. increases.
O: Resistance increases, p.d. decreases.
S: NTC: resistance falls with temperature, so it takes a smaller share of the supply p.d.

@num C.1 value=0.994 unit=m
Q: Calculate the length of a simple pendulum with a period of $2.0$ s.
S: $l = \dfrac{gT^2}{4\pi^2} = \dfrac{9.81 \times 4.0}{39.5} = 0.99$ m.

@num C.2 value=3.061 unit=m
Q: Calculate the wavelength of a $98$ MHz radio wave.
S: $\lambda = c/f = 3.00\times10^8/9.8\times10^7 = 3.06$ m.

@num C.3 value=2.256e8 unit=m s^-1
Q: Calculate the speed of light in water ($n = 1.33$).
S: $v = c/n = 2.26\times10^8\ \text{m s}^{-1}$.

@mc C.3
Q: When light passes from air into glass, which quantity stays the same?
O: Speed
O: Wavelength
O*: Frequency
O: Direction (always)
S: Frequency is set by the source; speed and wavelength both decrease in glass.

@num C.5 value=745.2 unit=Hz
Q: A police siren of frequency $800$ Hz moves away from a stationary listener at $25\ \text{m s}^{-1}$. Speed of sound $= 340\ \text{m s}^{-1}$. Calculate the observed frequency.
S: $f' = f\dfrac{v}{v + u_s} = 800 \times \dfrac{340}{365} = 745$ Hz.

@num D.1 value=3.726 unit=N kg^-1
Q: Calculate the gravitational field strength at the surface of Mars ($M = 6.42\times10^{23}$ kg, $R = 3.39\times10^6$ m).
S: $g = GM/R^2 = 3.73\ \text{N kg}^{-1}$.

@num D.1 value=4.223e7 unit=m
Q: Calculate the orbital radius of a geostationary satellite (period $86\,400$ s; $M_{Earth} = 5.97\times10^{24}$ kg).
S: $r^3 = \dfrac{GMT^2}{4\pi^2}$, $r = 4.22\times10^7$ m.

@num D.2 value=4.994e5 unit=N C^-1
Q: Calculate the electric field strength $0.30$ m from a point charge of $5.0\ \mu\text{C}$.
S: $E = kQ/r^2 = 8.99\times10^9 \times 5.0\times10^{-6}/0.090 = 5.0\times10^5\ \text{N C}^{-1}$.

@num D.2 value=6e-4 unit=J
Q: Calculate the work done moving a $2.0\ \mu\text{C}$ charge through a potential difference of $300$ V.
S: $W = qV = 6.0\times10^{-4}$ J.

@num D.3 value=0.1566 unit=m
Q: A proton ($m = 1.67\times10^{-27}$ kg) moves at $3.0\times10^6\ \text{m s}^{-1}$ perpendicular to a $0.20$ T magnetic field. Calculate the radius of its path.
S: $r = mv/(qB) = 0.157$ m.

@num D.4 value=0.003 unit=Wb
Q: (AHL) A uniform field of $0.30$ T makes an angle of $60^\circ$ with the normal to a coil of area $0.020\ \text{m}^2$. Calculate the flux through one turn.
S: $\Phi = BA\cos\theta = 0.30 \times 0.020 \times 0.5 = 3.0\times10^{-3}$ Wb.

@num E.1 value=1.219e-7 unit=m
Q: Calculate the wavelength of the photon emitted when an electron in hydrogen falls from $n = 2$ to $n = 1$ (energy difference $10.2$ eV).
S: $\lambda = hc/E = 1.22\times10^{-7}$ m (ultraviolet, Lyman series).

@num E.3 value=9e13 unit=J
Q: Calculate the energy equivalent of $1.0$ g of mass.
S: $E = mc^2 = 10^{-3} \times (3.00\times10^8)^2 = 9.0\times10^{13}$ J.

@num E.3 value=200 unit=Bq
Q: A sample has an activity of $1600$ Bq. Calculate its activity after three half-lives.
S: $1600/2^3 = 200$ Bq.

@num E.4 value=3.125e19 unit=s^-1
Q: Each fission of U-235 releases about $200$ MeV. Calculate the number of fissions per second needed for a thermal power of $1.0$ GW.
S: $200\ \text{MeV} = 3.2\times10^{-11}$ J; $10^9/3.2\times10^{-11} = 3.1\times10^{19}\ \text{s}^{-1}$.

@num E.5 value=16
Q: A star has the same radius as the Sun but twice its surface temperature. Calculate $L/L_\odot$.
S: $L \propto R^2T^4$, so $2^4 = 16$.

@mc E.5
Q: What is the source of energy of a main-sequence star?
O: Fission of heavy nuclei in the core
O*: Fusion of hydrogen into helium in the core
O: Gravitational collapse only
O: Chemical combustion
S: Hydrostatic equilibrium is maintained by radiation pressure from core fusion.
`;

const structured = String.raw`
@struct A.3
Q: A $500$ kg roller-coaster car starts from rest at the top of a track $30$ m above the lowest point.
a) [2] Calculate the speed at the lowest point if there are no energy losses.
= 24.26 unit=m s^-1
M: $mgh = \tfrac12 mv^2$ (1) ¶ $v = \sqrt{2gh} = 24.3\ \text{m s}^{-1}$ (1)
b) [2] In reality 20 % of the gravitational potential energy is dissipated. Calculate the actual speed at the lowest point.
= 21.7 unit=m s^-1
M: $\tfrac12 mv^2 = 0.80\,mgh$ (1) ¶ $v = 21.7\ \text{m s}^{-1}$ (1)
c) [1] Calculate the work done against resistive forces.
= 29430 unit=J
M: $0.20 \times 500 \times 9.81 \times 30 = 2.94\times10^4$ J (1)
d) [2] State two forms into which this energy is transferred.
M: thermal energy of the track, car and air (1) ¶ sound (1)

@struct E.2
Q: (AHL) In a photoelectric experiment the stopping potential is plotted against the frequency of the incident light. The graph is a straight line that crosses the frequency axis at $5.0\times10^{14}$ Hz.
a) [2] State what the gradient of the graph represents and calculate its value.
= 4.144e-15 unit=V s
M: gradient $= h/e$ (1) ¶ $= 4.14\times10^{-15}$ V s (1)
b) [2] Calculate the work function of the metal in eV.
= 2.072 rel=0.03 unit=eV
M: $\Phi = hf_0 = 3.3\times10^{-19}$ J (1) ¶ $= 2.07$ eV (1)
c) [2] Explain why no photoelectrons are emitted below $5.0\times10^{14}$ Hz, however intense the light.
M: each electron absorbs the energy of one photon, $hf$ (1) ¶ below the threshold $hf < \Phi$, so no single photon gives an electron enough energy to escape, regardless of the number of photons (1)

@struct B.3
Q: A sealed syringe contains $60\ \text{cm}^3$ of air at $1.0\times10^5$ Pa. The plunger is pushed in slowly so that the temperature stays constant.
a) [2] Calculate the volume when the pressure is $1.5\times10^5$ Pa.
= 40 unit=cm^3
M: $P_1V_1 = P_2V_2$ (1) ¶ $V_2 = 40\ \text{cm}^3$ (1)
b) [2] Explain, in terms of molecules, why the pressure increases.
M: same average speed / kinetic energy (constant temperature) (1) ¶ smaller volume, so more collisions with the walls per unit time and area (1)
c) [1] State why the plunger must be pushed in slowly.
M: so that thermal energy can be transferred to the surroundings and the temperature stays constant (1)
`;

export const physicsExtra = [...parseQuestions('physics', short), ...parseStructured('physics', structured)];
