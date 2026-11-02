import { parseCards } from '../dsl';
import { commandTermCards } from './commandTerms';

export const PHYSICS_DECK_VERSION = 1;

const source = String.raw`
# A.1
[d] Displacement :: The change in position of an object: a **vector** from the initial to the final position (m).
[k] Distance vs displacement :: Distance is a scalar — total path length travelled. Displacement is a vector — straight-line change in position, with direction.
[d] Velocity :: Rate of change of displacement: $\vec{v} = \dfrac{\Delta \vec{s}}{\Delta t}$ (vector, $\text{m s}^{-1}$).
[d] Acceleration :: Rate of change of velocity: $\vec{a} = \dfrac{\Delta \vec{v}}{\Delta t}$ (vector, $\text{m s}^{-2}$).
[f] Equations of motion for uniform acceleration (suvat) :: $v = u + at$ ¶ $s = ut + \tfrac12 at^2$ ¶ $v^2 = u^2 + 2as$ ¶ $s = \dfrac{(u+v)}{2}\,t$
[k] Gradient of a displacement–time graph :: Velocity. For a curve, the instantaneous velocity is the gradient of the tangent at that time.
[k] Gradient and area of a velocity–time graph :: Gradient = acceleration. Area between the graph and the time axis = displacement.
[k] Area under an acceleration–time graph :: The change in velocity, $\Delta v$.
[f] Components of projectile motion (no air resistance) :: Horizontal: $a_x = 0$, so $v_x = u\cos\theta$ is constant. ¶ Vertical: $a_y = -g$, $v_y = u\sin\theta - gt$.
[f] Maximum height and level-ground range of a projectile (launch speed $u$, angle $\theta$) :: $H = \dfrac{u^2\sin^2\theta}{2g}$, $\quad R = \dfrac{u^2\sin 2\theta}{g}$ (range is maximum at $45^\circ$).
[k] Effect of air resistance on a projectile's trajectory :: Lower maximum height and shorter range; horizontal velocity decreases; the path is no longer symmetric — the descent is steeper than the ascent.
[d] Terminal velocity :: The constant maximum velocity reached when the drag force equals the weight (resultant force zero, so acceleration zero).
[x] Acceleration of free fall near Earth's surface (data booklet) :: $g = 9.81\ \text{m s}^{-2}$

# A.2
[d] Newton's first law :: A body remains at rest or moves with constant velocity unless acted on by a resultant (net) external force.
[d] Newton's second law :: The resultant force equals the rate of change of momentum, $F = \dfrac{\Delta p}{\Delta t}$; for constant mass, $F = ma$.
[d] Newton's third law :: If body A exerts a force on body B, then B exerts a force on A that is equal in magnitude, opposite in direction and of the same type.
[d] Linear momentum :: $p = mv$ — a vector, units $\text{kg m s}^{-1}$ (equivalently N s).
[d] Impulse :: $J = F\Delta t = \Delta p$. Equal to the area under a force–time graph. Units N s.
[d] Law of conservation of linear momentum :: The total momentum of a system remains constant provided no resultant external force acts on it.
[k] Elastic vs inelastic collisions :: Momentum is conserved in both (isolated system). ¶ Elastic: total kinetic energy conserved. ¶ Inelastic: kinetic energy not conserved. Perfectly inelastic: bodies stick together.
[f] Kinetic energy in terms of momentum :: $E_k = \dfrac{p^2}{2m}$
[f] Friction forces :: Static: $F_f \le \mu_s F_N$ ¶ Dynamic (kinetic): $F_f = \mu_d F_N$, with $\mu_d < \mu_s$ normally.
[f] Hooke's law :: $F_H = -kx$ — restoring force proportional to extension, directed opposite to it ($k$ = spring constant, $\text{N m}^{-1}$).
[f] Viscous drag on a small sphere (Stokes' law) :: $F_d = 6\pi\eta r v$ — valid for small spheres at low speed in laminar flow ($\eta$ = viscosity).
[f] Buoyancy (Archimedes) :: $F_b = \rho V g$ — equal to the weight of fluid displaced ($\rho$ = fluid density, $V$ = displaced volume).
[f] Centripetal acceleration :: $a = \dfrac{v^2}{r} = \omega^2 r = \dfrac{4\pi^2 r}{T^2}$, directed towards the centre of the circle.
[f] Angular velocity :: $\omega = \dfrac{\Delta\theta}{\Delta t} = \dfrac{2\pi}{T} = \dfrac{v}{r}$ (rad $\text{s}^{-1}$)
[k] Why does uniform circular motion require a force, yet the speed stays constant? :: Velocity direction changes continuously, so there is an acceleration towards the centre requiring a centripetal resultant force. The force is perpendicular to the velocity, so it does no work and kinetic energy is unchanged.
[d] Free-body diagram :: Diagram of a single body showing all external forces acting **on** it as labelled arrows starting at the body, length proportional to magnitude.
[d] Translational equilibrium :: Resultant force on the body is zero: it is at rest or moves with constant velocity.

# A.3
[f] Work done by a constant force :: $W = Fs\cos\theta$, where $\theta$ is the angle between force and displacement. Unit: joule.
[k] Work from a force–displacement graph :: Work done = area under the force–displacement graph.
[d] Principle of conservation of energy :: Energy cannot be created or destroyed; it can only be transferred or transformed. The total energy of an isolated system is constant.
[f] Kinetic, gravitational potential and elastic potential energy :: $E_k = \tfrac12 mv^2$ ¶ $\Delta E_p = mg\Delta h$ ¶ $E_H = \tfrac12 k(\Delta x)^2$
[d] Power :: Rate of doing work (rate of energy transfer): $P = \dfrac{\Delta W}{\Delta t}$. For constant force and velocity, $P = Fv$. Unit: watt (W = J s$^{-1}$).
[f] Efficiency :: $\eta = \dfrac{\text{useful work out}}{\text{total work in}} = \dfrac{\text{useful power out}}{\text{total power in}}$
[d] Energy density of a fuel :: Energy released per unit **volume** of fuel ($\text{J m}^{-3}$). (Specific energy is energy per unit **mass**, $\text{J kg}^{-1}$.)
[k] Sankey diagram :: Flow diagram for energy transfers; arrow widths are proportional to energy (or power). Useful output continues forward, wasted energy branches off.
[k] Work–energy theorem :: The net work done on a body equals the change in its kinetic energy.
[u] The joule in SI base units :: $1\ \text{J} = 1\ \text{N m} = 1\ \text{kg m}^2\,\text{s}^{-2}$
[u] The watt in SI base units :: $1\ \text{W} = 1\ \text{J s}^{-1} = 1\ \text{kg m}^2\,\text{s}^{-3}$

# A.4
[f] Torque (moment) of a force :: $\tau = Fr\sin\theta$ — $r$ is the distance from the axis to the point of application, $\theta$ the angle between $\vec F$ and $\vec r$. Unit N m.
[d] Moment of inertia :: $I = \sum mr^2$ ($\text{kg m}^2$): a body's resistance to angular acceleration, depending on its mass **and** how that mass is distributed about the axis.
[f] Newton's second law for rotation :: $\tau = I\alpha$ (resultant torque = moment of inertia × angular acceleration)
[f] Angular momentum and angular impulse :: $L = I\omega$ ¶ $\Delta L = \tau\Delta t$
[d] Conservation of angular momentum :: The total angular momentum of a system is constant if no resultant external torque acts. (E.g. a skater pulling arms in decreases $I$, so $\omega$ increases.)
[f] Rotational kinetic energy :: $E_k = \tfrac12 I\omega^2 = \dfrac{L^2}{2I}$
[f] Equations for uniform angular acceleration :: $\omega_f = \omega_i + \alpha t$ ¶ $\theta = \omega_i t + \tfrac12\alpha t^2$ ¶ $\omega_f^2 = \omega_i^2 + 2\alpha\theta$ ¶ $\theta = \dfrac{\omega_f + \omega_i}{2}\,t$
[d] Rotational equilibrium :: The resultant torque about any axis is zero. Full (static) equilibrium needs zero resultant force **and** zero resultant torque.
[d] Couple :: Two equal, antiparallel, non-collinear forces. Produces a resultant torque but zero resultant force (rotation without translation).
[k] Rolling without slipping :: $v = \omega r$ for the centre of mass. Total KE = $\tfrac12 mv^2 + \tfrac12 I\omega^2$. Objects with larger $I/(mr^2)$ accelerate more slowly down a slope.

# A.5
[d] Inertial reference frame :: A frame of reference that is not accelerating (moves with constant velocity), in which Newton's first law holds.
[f] Galilean transformations :: $x' = x - vt$, $\quad t' = t$, $\quad u' = u - v$
[d] Postulates of special relativity :: 1. The laws of physics are the same in all inertial reference frames. ¶ 2. The speed of light in a vacuum, $c$, is the same for all inertial observers.
[f] Lorentz factor :: $\gamma = \dfrac{1}{\sqrt{1 - \dfrac{v^2}{c^2}}}$ (always $\ge 1$)
[f] Lorentz transformations :: $x' = \gamma(x - vt)$ ¶ $t' = \gamma\left(t - \dfrac{vx}{c^2}\right)$ ¶ $\Delta x' = \gamma(\Delta x - v\Delta t)$, $\Delta t' = \gamma\left(\Delta t - \dfrac{v\Delta x}{c^2}\right)$
[f] Relativistic velocity addition :: $u' = \dfrac{u - v}{1 - \dfrac{uv}{c^2}}$
[d] Proper time interval :: The time between two events measured in the frame in which both events occur at the same position. It is the shortest measured interval.
[f] Time dilation :: $\Delta t = \gamma\,\Delta t_0$ where $\Delta t_0$ is the proper time.
[d] Proper length :: The length of an object measured in the frame in which the object is at rest. It is the longest measured length.
[f] Length contraction :: $L = \dfrac{L_0}{\gamma}$ — contraction occurs only along the direction of motion.
[f] Invariant spacetime interval :: $(ct')^2 - (x')^2 = (ct)^2 - x^2$ — the same in all inertial frames.
[k] Relativity of simultaneity :: Two events that are simultaneous in one inertial frame are **not** simultaneous in another frame moving relative to it, unless they occur at the same place.
[k] Muon decay evidence for special relativity :: Many muons created high in the atmosphere reach the ground despite their short half-life. Earth frame: the muon's lifetime is time-dilated. Muon frame: the atmosphere's thickness is length-contracted.
[k] Spacetime diagrams: worldline of light and of a moving frame :: Light travels along lines at $45^\circ$ (axes $ct$ vs $x$). The $ct'$ and $x'$ axes of a frame moving at $v$ are each tilted by $\theta = \tan^{-1}\left(\dfrac{v}{c}\right)$ towards the light line.

# B.1
[d] Internal energy :: The total random kinetic energy plus the total intermolecular potential energy of the particles in a system.
[d] Temperature (kinetic interpretation) :: A measure of the average random kinetic energy of the particles: $\bar{E}_k = \tfrac32 k_B T$.
[f] Kelvin–Celsius conversion :: $T/\text{K} = \theta/^\circ\text{C} + 273$ (more precisely 273.15). A temperature *difference* of 1 K equals 1 °C.
[d] Specific heat capacity :: Energy required to raise the temperature of 1 kg of a substance by 1 K: $Q = mc\Delta T$ ($\text{J kg}^{-1}\,\text{K}^{-1}$).
[d] Specific latent heat :: Energy required to change the phase of 1 kg of a substance at constant temperature: $Q = mL$ ($\text{J kg}^{-1}$).
[k] Why does temperature stay constant during melting or boiling? :: The energy supplied increases the intermolecular potential energy (separating particles), not their average kinetic energy — so the temperature is constant.
[f] Thermal conduction rate :: $\dfrac{\Delta Q}{\Delta t} = kA\dfrac{\Delta T}{\Delta x}$, with $k$ the thermal conductivity ($\text{W m}^{-1}\,\text{K}^{-1}$).
[d] Convection :: Thermal energy transfer by bulk movement of a fluid, driven by density differences caused by temperature differences.
[d] Black body :: An idealised object that absorbs all incident electromagnetic radiation and is a perfect emitter of thermal radiation.
[f] Stefan–Boltzmann law :: $L = \sigma A T^4$, $\sigma = 5.67\times10^{-8}\ \text{W m}^{-2}\,\text{K}^{-4}$
[f] Wien's displacement law :: $\lambda_{\max} T = 2.9\times10^{-3}\ \text{m K}$ — hotter bodies peak at shorter wavelengths.
[f] Apparent brightness :: $b = \dfrac{L}{4\pi d^2}$ ($\text{W m}^{-2}$) — the power received per unit area at distance $d$.
[f] Density :: $\rho = \dfrac{m}{V}$ ($\text{kg m}^{-3}$)

# B.2
[d] Emissivity :: $e = \dfrac{\text{power emitted per unit area}}{\sigma T^4}$ — ratio of power radiated by a body to that of a black body at the same temperature ($0 \le e \le 1$).
[d] Albedo :: $\alpha = \dfrac{\text{total scattered (reflected) power}}{\text{total incident power}}$. Earth's mean albedo ≈ 0.3; depends on cloud cover, ice, season, latitude.
[x] Solar constant :: $S \approx 1.36\times10^3\ \text{W m}^{-2}$ — the intensity of solar radiation at Earth's mean distance, above the atmosphere.
[k] Why is the mean intensity on Earth $S/4$? :: Earth intercepts radiation over its cross-section $\pi R^2$ but the energy is spread over its whole surface $4\pi R^2$.
[f] Earth's energy balance (simple model) :: Absorbed = emitted: $(1-\alpha)\dfrac{S}{4} = e\sigma T^4$
[k] Mechanism of the greenhouse effect :: Short-wavelength solar radiation passes through the atmosphere and warms the surface. The surface emits infrared. Greenhouse gases absorb IR and re-emit it in all directions, partly back towards the surface, raising its equilibrium temperature.
[k] Why do greenhouse gases absorb infrared? :: IR frequencies match natural vibrational frequencies of the bonds in molecules such as $\text{CO}_2$ and $\text{H}_2\text{O}$ (resonance), changing their dipole moment.
[x] Main greenhouse gases :: $\text{H}_2\text{O}$, $\text{CO}_2$, $\text{CH}_4$, $\text{N}_2\text{O}$ — each with natural and anthropogenic (human) sources.
[k] Enhanced greenhouse effect :: Human activity (burning fossil fuels, deforestation, agriculture) increases greenhouse-gas concentrations, so more IR is absorbed and re-emitted → global warming.
[x] Earth's surface temperature with and without an atmosphere :: Without greenhouse effect ≈ 255 K (−18 °C); actual mean ≈ 288 K (15 °C).

# B.3
[f] Pressure :: $P = \dfrac{F}{A}$, force per unit area acting normally to a surface. Unit: Pa = $\text{N m}^{-2}$.
[f] Ideal gas equation :: $PV = nRT = Nk_BT$ (T in kelvin, V in m³, P in Pa)
[f] Amount of substance :: $n = \dfrac{N}{N_A}$, $N_A = 6.02\times10^{23}\ \text{mol}^{-1}$
[x] Boltzmann and gas constants :: $k_B = \dfrac{R}{N_A} = 1.38\times10^{-23}\ \text{J K}^{-1}$, $\quad R = 8.31\ \text{J K}^{-1}\,\text{mol}^{-1}$
[f] Pressure from kinetic theory :: $P = \tfrac13 \rho \overline{v^2}$, where $\overline{v^2}$ is the mean square speed of the molecules.
[f] Internal energy of an ideal monatomic gas :: $U = \tfrac32 Nk_BT = \tfrac32 nRT$ (all kinetic — ideal gases have no intermolecular PE)
[k] Assumptions of the kinetic model of an ideal gas :: Large number of identical particles in random motion; volume of particles negligible; no intermolecular forces except during collisions; collisions are elastic and of negligible duration.
[k] When does a real gas deviate from ideal behaviour? :: At high pressure, low temperature (near condensation) and high density — particle volume and intermolecular forces become significant.
[f] Gas laws for a fixed mass of ideal gas :: Boyle ($T$ const): $PV$ = const ¶ Charles ($P$ const): $V/T$ = const ¶ Gay-Lussac ($V$ const): $P/T$ = const ¶ Combined: $\dfrac{P_1V_1}{T_1} = \dfrac{P_2V_2}{T_2}$
[k] Molecular explanation of pressure :: Molecules collide with the walls and change momentum; the wall exerts a force on them so they exert an equal and opposite force on the wall. Pressure = total force per unit area.

# B.4
[f] First law of thermodynamics :: $Q = \Delta U + W$, where $Q$ = thermal energy transferred **into** the system and $W$ = work done **by** the system.
[f] Work done by a gas at constant pressure :: $W = P\Delta V$ — in general, the area under the P–V curve.
[f] Change in internal energy of an ideal monatomic gas :: $\Delta U = \tfrac32 nR\Delta T = \tfrac32 Nk_B\Delta T$
[d] Isovolumetric, isobaric, isothermal, adiabatic :: Isovolumetric: $\Delta V = 0$, so $W = 0$ ¶ Isobaric: constant $P$ ¶ Isothermal: $\Delta T = 0$, so $\Delta U = 0$ and $Q = W$ ¶ Adiabatic: $Q = 0$, so $\Delta U = -W$
[f] Adiabatic process for a monatomic ideal gas :: $PV^{5/3} = \text{constant}$
[d] Second law of thermodynamics (three forms) :: Clausius: thermal energy cannot spontaneously flow from a colder to a hotter body. ¶ Kelvin: no cyclic engine can convert heat completely into work. ¶ Entropy: the entropy of an isolated system never decreases.
[f] Entropy change (macroscopic) :: $\Delta S = \dfrac{\Delta Q}{T}$ ($\text{J K}^{-1}$), for heat $\Delta Q$ transferred at temperature $T$.
[f] Entropy (microscopic / statistical) :: $S = k_B \ln\Omega$, with $\Omega$ the number of possible microstates.
[f] Efficiency of a heat engine; Carnot efficiency :: $\eta = \dfrac{\text{useful work}}{\text{input energy}}$ ¶ $\eta_{\text{Carnot}} = 1 - \dfrac{T_c}{T_h}$ — the maximum possible (T in kelvin).
[k] Stages of the Carnot cycle :: 1. Isothermal expansion at $T_h$ ¶ 2. Adiabatic expansion ($T_h \to T_c$) ¶ 3. Isothermal compression at $T_c$ ¶ 4. Adiabatic compression ($T_c \to T_h$)
[k] Net work in a cyclic process :: Equals the area enclosed by the cycle on a P–V diagram; $\Delta U = 0$ over a complete cycle.

# B.5
[d] Electric current :: Rate of flow of charge: $I = \dfrac{\Delta q}{\Delta t}$ (ampere, A = C s$^{-1}$).
[d] Potential difference :: Energy transferred (work done) per unit charge between two points: $V = \dfrac{W}{q}$ (volt = J C$^{-1}$).
[d] Electromotive force (emf) :: Energy transferred from other forms to electrical energy per unit charge by a source, when charge moves round a complete circuit.
[f] Resistance and resistivity :: $R = \dfrac{V}{I}$ ¶ $\rho = \dfrac{RA}{L}$ ($\Omega\,\text{m}$)
[d] Ohm's law :: For an ohmic conductor at constant temperature, the current is directly proportional to the potential difference across it.
[f] Electrical power :: $P = IV = I^2R = \dfrac{V^2}{R}$
[f] Combining resistors :: Series: $R_s = R_1 + R_2 + \dots$ ¶ Parallel: $\dfrac{1}{R_p} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dots$
[f] Internal resistance :: $\varepsilon = I(R + r)$; terminal p.d. $V = \varepsilon - Ir$
[k] Kirchhoff's laws :: Junction rule: $\sum I = 0$ at a junction (conservation of charge). ¶ Loop rule: $\sum V = 0$ around a closed loop (conservation of energy).
[k] Ideal ammeter and voltmeter :: Ideal ammeter: zero resistance (in series). Ideal voltmeter: infinite resistance (in parallel).
[k] Potential divider with a thermistor or LDR :: NTC thermistor: resistance decreases as temperature rises. LDR: resistance decreases as light intensity increases. Output $V_{out} = V_{in}\dfrac{R_2}{R_1 + R_2}$.
[k] I–V characteristic of a filament lamp :: Curve with decreasing gradient: as current increases the filament heats up and its resistance increases (non-ohmic).
[k] Why does resistance of a metal increase with temperature? :: Lattice ions vibrate with greater amplitude, so conduction electrons collide with them more frequently.

# C.1
[d] Simple harmonic motion :: Motion in which acceleration is proportional to displacement from equilibrium and directed towards equilibrium: $a = -\omega^2 x$.
[f] Period and angular frequency :: $T = \dfrac{1}{f} = \dfrac{2\pi}{\omega}$
[f] Period of a mass–spring system :: $T = 2\pi\sqrt{\dfrac{m}{k}}$
[f] Period of a simple pendulum :: $T = 2\pi\sqrt{\dfrac{l}{g}}$ (small-amplitude approximation)
[f] SHM displacement and velocity :: $x = x_0\sin(\omega t + \phi)$ ¶ $v = \omega x_0\cos(\omega t + \phi)$ ¶ $v = \pm\,\omega\sqrt{x_0^2 - x^2}$
[f] Energy in SHM :: $E_T = \tfrac12 m\omega^2 x_0^2$ ¶ $E_p = \tfrac12 m\omega^2 x^2$ ¶ $E_k = \tfrac12 m\omega^2(x_0^2 - x^2)$
[k] Where are speed and acceleration maximum in SHM? :: Speed is maximum ($\omega x_0$) at equilibrium, where acceleration is zero. Acceleration is maximum ($\omega^2 x_0$) at the extremes, where speed is zero.
[k] Isochronous oscillation :: Period is independent of amplitude — true for SHM.
[k] Phase relationship between $x$, $v$ and $a$ in SHM :: $v$ leads $x$ by $\pi/2$; $a$ is in antiphase with $x$ (phase difference $\pi$).

# C.2
[d] Transverse vs longitudinal waves :: Transverse: oscillations perpendicular to the direction of energy transfer (e.g. EM waves, waves on a string). ¶ Longitudinal: oscillations parallel to the direction of energy transfer (e.g. sound), forming compressions and rarefactions.
[f] Wave equation :: $v = f\lambda$, with $f = \dfrac{1}{T}$
[d] Wavelength :: The shortest distance between two points on a wave that are in phase (e.g. crest to crest).
[d] Amplitude :: The maximum displacement of a particle of the medium from its equilibrium position.
[k] Properties of electromagnetic waves :: Transverse; travel at $c = 3.00\times10^8\ \text{m s}^{-1}$ in vacuum; need no medium; consist of oscillating electric and magnetic fields perpendicular to each other.
[x] EM spectrum from longest to shortest wavelength :: Radio → microwave → infrared → visible (red → violet) → ultraviolet → X-ray → gamma.
[x] Wavelength range of visible light :: Approximately 400 nm (violet) to 700 nm (red).
[k] Mechanical vs electromagnetic waves :: Mechanical waves (sound, water waves) need a medium; EM waves can travel through a vacuum.
[k] Sound speed in different media :: Generally fastest in solids, slower in liquids, slowest in gases (≈ 340 m s$^{-1}$ in air at room temperature).

# C.3
[d] Wavefront and ray :: Wavefront: a line/surface joining points in phase. Ray: a line showing the direction of energy transfer, perpendicular to wavefronts.
[d] Law of reflection :: The angle of incidence equals the angle of reflection (both measured from the normal); incident ray, reflected ray and normal are in the same plane.
[f] Snell's law :: $n_1\sin\theta_1 = n_2\sin\theta_2$ ¶ $\dfrac{n_1}{n_2} = \dfrac{\sin\theta_2}{\sin\theta_1} = \dfrac{v_2}{v_1}$
[f] Critical angle and total internal reflection :: $\sin\theta_c = \dfrac{n_2}{n_1}$ (light going from higher $n_1$ to lower $n_2$). TIR occurs when the angle of incidence exceeds $\theta_c$.
[k] When is diffraction significant? :: When the aperture or obstacle size is comparable to the wavelength.
[d] Principle of superposition :: When two or more waves meet, the resultant displacement is the vector sum of the individual displacements.
[k] Conditions for constructive and destructive interference (coherent sources in phase) :: Constructive: path difference $= n\lambda$. ¶ Destructive: path difference $= \left(n + \tfrac12\right)\lambda$.
[f] Double-slit fringe spacing :: $s = \dfrac{\lambda D}{d}$ ($D$ = slit–screen distance, $d$ = slit separation)
[f] Single-slit diffraction: first minimum :: $\theta = \dfrac{\lambda}{b}$ (small angles, $b$ = slit width)
[f] Diffraction grating :: $n\lambda = d\sin\theta$, $d$ = line spacing
[d] Coherent sources :: Sources with a constant phase difference (and the same frequency).

# C.4
[k] How a standing wave forms :: Superposition of two waves of the same frequency, wavelength and amplitude travelling in opposite directions (usually a wave and its reflection).
[k] Standing vs travelling waves :: Standing: no net energy transfer; amplitude varies with position (nodes, antinodes); all points between adjacent nodes are in phase. ¶ Travelling: transfers energy; all points have the same amplitude; phase varies continuously.
[x] Distance between adjacent nodes :: $\lambda/2$ (node to adjacent antinode = $\lambda/4$)
[f] String fixed at both ends / pipe open at both ends :: $\lambda_n = \dfrac{2L}{n}$, $f_n = nf_1$, $n = 1, 2, 3, \dots$ (all harmonics)
[f] Pipe closed at one end :: $\lambda_n = \dfrac{4L}{n}$, $n = 1, 3, 5, \dots$ — only odd harmonics.
[d] Resonance :: Large-amplitude oscillation that occurs when a system is driven at a frequency equal to its natural frequency.
[d] Damping :: Loss of energy from an oscillating system due to resistive forces, so amplitude decreases over time.
[k] Light, heavy and critical damping :: Light: oscillates with slowly decreasing amplitude. ¶ Heavy (over-damped): no oscillation, slow return. ¶ Critical: returns to equilibrium in the shortest time without oscillating.
[k] Effect of increased damping on a resonance curve :: Lower peak amplitude, broader peak, and the peak shifts to slightly lower frequency.

# C.5
[d] Doppler effect :: The change in observed frequency (and wavelength) of a wave when there is relative motion between the source and the observer.
[f] Doppler effect — moving source (sound) :: $f' = f\,\dfrac{v}{v \pm u_s}$ — use $+$ when the source moves **away**, $-$ when it approaches.
[f] Doppler effect — moving observer (sound) :: $f' = f\,\dfrac{v \pm u_o}{v}$ — use $+$ when the observer moves **towards** the source.
[f] Doppler effect for light ($v \ll c$) :: $\dfrac{\Delta f}{f} \approx \dfrac{\Delta\lambda}{\lambda} \approx \dfrac{v}{c}$
[k] Redshift and blueshift :: Source receding → wavelength increases (redshift). Source approaching → wavelength decreases (blueshift).
[k] Applications of the Doppler effect :: Radar speed guns; ultrasound measurement of blood-flow speed; measuring recession speeds of galaxies and orbital speeds of stars.
[k] Wavefront picture of a moving source :: Wavefronts bunch up in front of the source (shorter $\lambda$, higher $f$) and spread out behind it; the wave speed in the medium is unchanged.

# D.1
[f] Newton's law of gravitation :: $F = G\dfrac{m_1m_2}{r^2}$, $G = 6.67\times10^{-11}\ \text{N m}^2\,\text{kg}^{-2}$ (point masses or spheres, $r$ between centres)
[d] Gravitational field strength :: Force per unit mass on a small test mass: $g = \dfrac{F}{m}$. For a point/spherical mass: $g = \dfrac{GM}{r^2}$.
[d] Gravitational potential :: Work done per unit mass in bringing a small test mass from infinity to that point: $V_g = -\dfrac{GM}{r}$ ($\text{J kg}^{-1}$).
[k] Why is gravitational potential negative? :: Zero potential is defined at infinity and gravity is attractive, so work must be done to move a mass back out to infinity — every finite point has lower (negative) potential.
[f] Gravitational potential energy of two masses :: $E_p = -\dfrac{GMm}{r}$; work to move mass $m$: $W = m\Delta V_g$
[f] Field strength from potential gradient :: $g = -\dfrac{\Delta V_g}{\Delta r}$
[f] Escape speed :: $v_{esc} = \sqrt{\dfrac{2GM}{r}}$
[f] Orbital speed :: $v_{orbit} = \sqrt{\dfrac{GM}{r}}$ (from $\dfrac{GMm}{r^2} = \dfrac{mv^2}{r}$)
[f] Kepler's third law (circular orbits) :: $\dfrac{T^2}{r^3} = \dfrac{4\pi^2}{GM}$ — so $T^2 \propto r^3$
[k] Kepler's first and second laws :: 1. Planets move in ellipses with the Sun at one focus. ¶ 2. A line from the Sun to a planet sweeps out equal areas in equal times.
[f] Energy of a satellite in circular orbit :: $E_k = \dfrac{GMm}{2r}$, $\quad E_p = -\dfrac{GMm}{r}$, $\quad E_{total} = -\dfrac{GMm}{2r}$
[k] Equipotential surfaces :: Surfaces of constant potential; always perpendicular to field lines; no work is done moving along one.
[k] Effect of atmospheric drag on a satellite's orbit :: Total energy decreases, so the orbit radius decreases and the satellite's speed (and KE) **increases** — PE decreases by twice the KE gain.

# D.2
[f] Coulomb's law :: $F = k\dfrac{q_1q_2}{r^2}$, $k = \dfrac{1}{4\pi\varepsilon_0} = 8.99\times10^9\ \text{N m}^2\,\text{C}^{-2}$
[d] Electric field strength :: Force per unit positive test charge: $E = \dfrac{F}{q}$ ($\text{N C}^{-1}$ = $\text{V m}^{-1}$).
[f] Field of a point charge; field between parallel plates :: Point charge: $E = \dfrac{kQ}{r^2}$ ¶ Parallel plates (uniform): $E = \dfrac{V}{d}$
[d] Electric potential :: Work done per unit positive charge in bringing a small test charge from infinity to that point: $V_e = \dfrac{kQ}{r}$.
[f] Electric potential energy and field from potential :: $E_p = \dfrac{kqQ}{r}$ ¶ $E = -\dfrac{\Delta V_e}{\Delta r}$ ¶ $W = q\Delta V_e$
[x] Elementary charge and electronvolt :: $e = 1.60\times10^{-19}\ \text{C}$; $1\ \text{eV} = 1.60\times10^{-19}\ \text{J}$
[k] Conservation and quantisation of charge :: Charge is conserved in all processes. Charge comes in integer multiples of $e$ (Millikan's oil-drop experiment).
[k] Methods of charging :: Friction (electron transfer between surfaces), contact (conduction) and induction (charge separation by a nearby charged object, then earthing).
[k] Electric field-line conventions :: Lines start on positive and end on negative charges; they never cross; closer lines mean stronger field; lines meet conductor surfaces at right angles.
[k] Magnetic field patterns: straight wire and solenoid :: Straight wire: concentric circles around the wire (right-hand grip rule). ¶ Solenoid: uniform field inside, parallel to axis; outside similar to a bar magnet.
[x] Permittivity and permeability of free space :: $\varepsilon_0 = 8.85\times10^{-12}\ \text{C}^2\,\text{N}^{-1}\,\text{m}^{-2}$ ¶ $\mu_0 = 4\pi\times10^{-7}\ \text{T m A}^{-1}$

# D.3
[f] Magnetic force on a moving charge :: $F = qvB\sin\theta$ — perpendicular to both $\vec v$ and $\vec B$.
[f] Magnetic force on a current-carrying conductor :: $F = BIL\sin\theta$
[f] Force per unit length between parallel wires :: $\dfrac{F}{L} = \mu_0\dfrac{I_1I_2}{2\pi r}$ — currents in the same direction attract; opposite directions repel.
[f] Radius and period of a charged particle in a uniform magnetic field :: $r = \dfrac{mv}{qB}$ ¶ $T = \dfrac{2\pi m}{qB}$ — the period is independent of speed.
[k] Why doesn't a magnetic field change a charged particle's speed? :: The magnetic force is always perpendicular to the velocity, so it does no work; kinetic energy and speed remain constant (only direction changes).
[f] Velocity selector (crossed E and B fields) :: Undeflected when $qE = qvB$, i.e. $v = \dfrac{E}{B}$
[k] Charged particle entering a uniform electric field perpendicularly :: Constant force $qE$ parallel to the field → parabolic path (like a projectile); velocity component perpendicular to the field is unchanged.
[u] Definition of the tesla :: $1\ \text{T} = 1\ \text{N A}^{-1}\,\text{m}^{-1}$ — the field producing 1 N on 1 m of wire carrying 1 A perpendicular to the field.
[k] Direction of magnetic force :: Fleming's left-hand rule (or right-hand palm rule) — for negative charges the force is reversed.

# D.4
[f] Magnetic flux :: $\Phi = BA\cos\theta$ (weber, Wb = T m²); $\theta$ is between $\vec B$ and the normal to the area.
[d] Magnetic flux linkage :: $N\Phi$ — flux through one turn multiplied by the number of turns.
[f] Faraday's law of induction :: $\varepsilon = -N\dfrac{\Delta\Phi}{\Delta t}$ — induced emf equals the rate of change of flux linkage.
[d] Lenz's law :: The induced emf drives a current whose direction opposes the change in flux that produced it (a consequence of energy conservation).
[f] Emf induced in a straight conductor moving through a field :: $\varepsilon = BvL$ (single conductor); $\varepsilon = BvLN$ for $N$ conductors.
[k] AC generator :: A coil rotating at constant $\omega$ in a uniform field gives a sinusoidal emf. Doubling the rotation speed doubles both the peak emf and the frequency.
[k] When is the induced emf maximum for a rotating coil? :: When the plane of the coil is **parallel** to the field: flux is zero but changing fastest.

# E.1
[k] Geiger–Marsden–Rutherford experiment :: Alpha particles fired at thin gold foil: most passed straight through (atom mostly empty space); a few deflected through large angles (small, dense, positively charged nucleus containing most of the mass).
[f] Nuclear notation :: $^{A}_{Z}\text{X}$ — $A$ = nucleon (mass) number, $Z$ = proton (atomic) number; neutrons $N = A - Z$.
[d] Isotopes :: Atoms of the same element (same $Z$) with different numbers of neutrons (different $A$).
[f] Nuclear radius :: $R = R_0A^{1/3}$, $R_0 \approx 1.20\times10^{-15}$ m — implies all nuclei have roughly the same density.
[k] Emission vs absorption spectra :: Emission: bright lines on dark background — electrons drop between energy levels emitting photons. Absorption: dark lines in a continuous spectrum — photons of specific energies absorbed by a cooler gas.
[f] Photon energy :: $E = hf = \dfrac{hc}{\lambda}$, $h = 6.63\times10^{-34}$ J s
[f] Bohr model of hydrogen (AHL) :: $E = -\dfrac{13.6}{n^2}$ eV ¶ $mvr = \dfrac{nh}{2\pi}$ (quantised angular momentum)
[k] Distance of closest approach (alpha scattering) :: Initial kinetic energy = electric PE at closest approach: $E_k = \dfrac{k(2e)(Ze)}{d}$. Gives an upper limit for nuclear radius.
[k] Limitations of Rutherford scattering at high energy :: At high energies alpha particles get close enough for the strong nuclear force to act, so scattering deviates from Coulomb predictions.

# E.2
[f] Photoelectric equation :: $E_{k,\max} = hf - \Phi$ ($\Phi$ = work function)
[f] Threshold frequency :: $f_0 = \dfrac{\Phi}{h}$ — below this no electrons are emitted, whatever the intensity.
[k] Photoelectric observations that wave theory cannot explain :: Existence of a threshold frequency; emission is instantaneous; maximum KE depends on frequency but not intensity.
[k] Effect of increasing intensity in the photoelectric effect :: More photons per second → more photoelectrons per second (larger current); maximum KE unchanged.
[f] Stopping potential :: $eV_s = E_{k,\max}$
[f] de Broglie wavelength :: $\lambda = \dfrac{h}{p} = \dfrac{h}{mv}$
[k] Evidence for the wave nature of matter :: Electron diffraction (e.g. electrons through crystals or graphite produce diffraction rings) — Davisson–Germer.
[f] Compton scattering :: $\Delta\lambda = \lambda_f - \lambda_i = \dfrac{h}{m_ec}(1 - \cos\theta)$ — evidence that photons carry momentum $p = h/\lambda$.

# E.3
[d] Mass defect :: The difference between the total mass of the separate nucleons and the mass of the nucleus.
[d] Nuclear binding energy :: The energy required to separate a nucleus into its individual nucleons (= energy released when it forms): $\Delta E = \Delta m\,c^2$.
[x] Atomic mass unit :: $1\ \text{u} = 1.661\times10^{-27}$ kg $= 931.5\ \text{MeV}\,c^{-2}$
[k] Binding energy per nucleon curve :: Rises steeply for light nuclei, peaks near $^{56}$Fe/$^{62}$Ni (≈ 8.8 MeV), then falls slowly. Fusion of light and fission of heavy nuclei both increase BE per nucleon → release energy.
[k] Properties of α, β and γ radiation :: α: $^4_2$He nucleus, highly ionising, stopped by paper/few cm air. ¶ β: electron/positron, moderately ionising, stopped by few mm aluminium. ¶ γ: EM photon, weakly ionising, reduced by thick lead/concrete.
[f] Beta-minus and beta-plus decay :: $\beta^-$: $n \to p + e^- + \bar{\nu}_e$ ¶ $\beta^+$: $p \to n + e^+ + \nu_e$
[k] Evidence for the neutrino :: Beta particles are emitted with a continuous range of kinetic energies; a third particle (the (anti)neutrino) must share the energy and momentum.
[d] Half-life :: The time taken for the number of radioactive nuclei (or the activity) to halve.
[f] Radioactive decay law :: $N = N_0e^{-\lambda t}$, $\quad A = \lambda N = A_0e^{-\lambda t}$, $\quad T_{1/2} = \dfrac{\ln 2}{\lambda}$
[k] Random and spontaneous decay :: Random: cannot predict which nucleus decays next, only probability. Spontaneous: not affected by external conditions (temperature, pressure, chemistry).
[k] Strong nuclear force :: Acts between nucleons; very short range (≈ $10^{-15}$ m); strongly attractive at ~1 fm, repulsive at shorter separations; independent of charge.
[x] Sources of background radiation :: Natural: radon gas, rocks, cosmic rays, food/the body. Artificial: medical procedures, nuclear industry, fallout.

# E.4
[d] Nuclear fission :: Splitting of a heavy nucleus into two lighter nuclei (plus neutrons), releasing energy. Can be spontaneous or neutron-induced.
[f] Typical neutron-induced fission of U-235 :: $^{1}_{0}\text{n} + {}^{235}_{92}\text{U} \to {}^{236}_{92}\text{U} \to {}^{141}_{56}\text{Ba} + {}^{92}_{36}\text{Kr} + 3\,{}^{1}_{0}\text{n}$ (≈ 200 MeV released)
[d] Chain reaction and critical mass :: Neutrons from one fission cause further fissions. Critical mass: minimum mass for which, on average, each fission causes at least one further fission (self-sustaining reaction).
[k] Role of the moderator :: Slows fast neutrons to thermal speeds through elastic collisions with light nuclei (e.g. water, graphite), making further fission of U-235 more likely.
[k] Role of the control rods :: Absorb neutrons (e.g. boron, cadmium) to control the reaction rate; inserted further to slow down or shut down the reactor.
[k] Role of the heat exchanger and coolant :: Coolant carries thermal energy from the core to a heat exchanger where it boils water to drive turbines; keeps the radioactive coolant isolated.
[k] Shielding and waste in fission reactors :: Thick concrete/steel shielding absorbs radiation. Spent fuel is highly radioactive with long half-lives — stored under water, then in deep geological storage.

# E.5
[d] Nuclear fusion :: Two light nuclei combine to form a heavier nucleus, releasing energy (product has higher binding energy per nucleon).
[k] Conditions required for fusion :: Very high temperature (nuclei need enough KE to overcome electrostatic repulsion) and high density/pressure (high collision rate).
[k] Stellar equilibrium :: Inward gravitational pressure is balanced by outward radiation and thermal (gas) pressure from fusion in the core.
[k] Axes of the Hertzsprung–Russell diagram :: Vertical: luminosity (relative to the Sun, log scale). Horizontal: surface temperature, **decreasing** to the right (log scale), or spectral class OBAFGKM.
[f] Stellar parallax :: $d\,(\text{pc}) = \dfrac{1}{p\,(\text{arc-second})}$
[d] Parsec and light-year :: Parsec: distance at which 1 AU subtends an angle of 1 arc-second ($1\ \text{pc} = 3.26$ ly $= 3.09\times10^{16}$ m). Light-year: distance light travels in one year ($9.46\times10^{15}$ m).
[k] Evolution of a low-mass star (≲ 8 solar masses) :: Main sequence → red giant → planetary nebula + white dwarf.
[k] Evolution of a high-mass star :: Main sequence → red supergiant → supernova → neutron star or black hole.
[x] Chandrasekhar limit :: ≈ 1.4 solar masses: the maximum mass of a white dwarf supported by electron degeneracy pressure.
[k] How stellar spectra reveal composition :: Absorption lines in a star's spectrum are fingerprints of the elements in its outer layers; line positions match laboratory spectra.
`;

export const physicsCards = [
  ...parseCards('physics', source),
  ...commandTermCards('physics', [
    'Annotate', 'Calculate', 'Comment', 'Compare', 'Compare and contrast', 'Construct', 'Deduce', 'Define',
    'Derive', 'Describe', 'Determine', 'Discuss', 'Distinguish', 'Draw', 'Estimate', 'Evaluate', 'Explain',
    'Identify', 'Justify', 'Label', 'Outline', 'Predict', 'Show that', 'Sketch', 'State', 'Suggest',
  ]),
];
