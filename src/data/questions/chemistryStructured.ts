import { parseStructured } from '../dsl';

/** Original multi-part (Paper 2-style) chemistry questions. Numeric answers verified in Python. */
const source = String.raw`
@struct S1.4
Q: $0.230$ g of an organic compound containing only C, H and O was burned completely, producing $0.440$ g of $\ce{CO2}$ and $0.270$ g of $\ce{H2O}$. ($A_r$: C 12.01, H 1.008, O 16.00)
a) [1] Calculate the mass of carbon in the sample.
= 0.1201 unit=g
M: $0.440 \times \dfrac{12.01}{44.01} = 0.120$ g (1)
b) [1] Calculate the mass of hydrogen in the sample.
= 0.03021 unit=g
M: $0.270 \times \dfrac{2.016}{18.02} = 0.0302$ g (1)
c) [1] Calculate the mass of oxygen in the sample.
= 0.07972 rel=0.03 unit=g
M: $0.230 - 0.120 - 0.0302 = 0.080$ g (1)
d) [2] Determine the empirical formula.
M: mole ratio C : H : O $= 0.0100 : 0.0300 : 0.00498$ (1) ¶ $= 2 : 6 : 1$, so $\ce{C2H6O}$ (1)

@struct S1.5
Q: $0.500$ g of a volatile liquid is vaporised. The vapour occupies $0.218\ \text{dm}^3$ at $373$ K and $101$ kPa.
a) [1] Convert the volume to $\text{m}^3$.
= 2.18e-4 unit=m^3
M: $2.18\times10^{-4}\ \text{m}^3$ (1)
b) [2] Calculate the amount of vapour in moles.
= 0.007103 unit=mol
M: $n = \dfrac{pV}{RT}$ with SI units (1) ¶ $= 7.10\times10^{-3}$ mol (1)
c) [1] Calculate the molar mass of the liquid.
= 70.39 unit=g mol^-1
M: $M = 0.500/7.10\times10^{-3} = 70.4\ \text{g mol}^{-1}$ (1)
d) [2] Suggest why the experimental molar mass may differ from the true value.
M: any two: some vapour condenses / not all liquid vaporises; vapour does not behave ideally (intermolecular forces near the boiling point); mass or volume measurement error; temperature not uniform (1 each)

@struct R1.1
Q: $25.0\ \text{cm}^3$ of $2.00\ \text{mol dm}^{-3}$ HCl was mixed with $25.0\ \text{cm}^3$ of $2.00\ \text{mol dm}^{-3}$ NaOH in a polystyrene cup. The temperature rose by $13.5$ K. Assume the solution has density $1.00\ \text{g cm}^{-3}$ and $c = 4.18\ \text{J g}^{-1}\,\text{K}^{-1}$.
a) [1] Calculate the heat released.
= 2821.5 unit=J
M: $Q = 50.0 \times 4.18 \times 13.5 = 2.82\times10^3$ J (1)
b) [1] Calculate the amount of water formed.
= 0.05 unit=mol
M: $0.0250 \times 2.00 = 0.0500$ mol (1)
c) [2] Calculate the enthalpy change of neutralisation in $\text{kJ mol}^{-1}$.
= -56.43 unit=kJ mol^-1
M: $\Delta H = -Q/n$ (1) ¶ $= -56.4\ \text{kJ mol}^{-1}$ (sign required) (1)
d) [2] Suggest two reasons why the experimental value is less exothermic than the literature value.
M: heat lost to the surroundings / cup (1) ¶ heat capacity of the cup ignored, or solution's specific heat capacity and density not exactly those of water (1)

@struct R1.2
Q: Use these standard enthalpies of formation (in $\text{kJ mol}^{-1}$): $\ce{C2H5OH(l)}$ $-277.0$, $\ce{CO2(g)}$ $-393.5$, $\ce{H2O(l)}$ $-285.8$.
a) [1] Write the balanced equation for the complete combustion of ethanol.
M: $\ce{C2H5OH + 3O2 -> 2CO2 + 3H2O}$ (1)
b) [2] Calculate the standard enthalpy of combustion of ethanol.
= -1367.4 rel=0.005 unit=kJ mol^-1
M: $\sum\Delta H_f(\text{products}) - \sum\Delta H_f(\text{reactants})$ (1) ¶ $= [2(-393.5) + 3(-285.8)] - (-277.0) = -1367\ \text{kJ mol}^{-1}$ (1)
c) [2] Explain why a value calculated from average bond enthalpies would differ.
M: bond enthalpies are averages over many compounds (1) ¶ and apply to gaseous species, whereas ethanol and water here are liquids (1)

@struct R2.1
Q: $25.00\ \text{cm}^3$ of sodium carbonate solution was titrated with $0.100\ \text{mol dm}^{-3}$ HCl. The mean titre was $22.40\ \text{cm}^3$. $\ce{Na2CO3 + 2HCl -> 2NaCl + H2O + CO2}$ ($M(\ce{Na2CO3}) = 105.99$)
a) [1] Calculate the amount of HCl used.
= 0.00224 unit=mol
M: $0.100 \times 0.02240 = 2.24\times10^{-3}$ mol (1)
b) [1] Calculate the amount of sodium carbonate.
= 0.00112 unit=mol
M: ratio 1 : 2, so $1.12\times10^{-3}$ mol (1)
c) [1] Calculate the concentration of the sodium carbonate solution.
= 0.0448 unit=mol dm^-3
M: $1.12\times10^{-3}/0.02500 = 0.0448\ \text{mol dm}^{-3}$ (1)
d) [1] Calculate its mass concentration.
= 4.748 unit=g dm^-3
M: $0.0448 \times 105.99 = 4.75\ \text{g dm}^{-3}$ (1)
e) [1] Explain why the titration is repeated until concordant titres are obtained.
M: to reduce the effect of random errors / increase reliability of the mean titre (1)

@struct R2.1
Q: $5.00$ g of magnesium ($A_r = 24.31$) is added to $100\ \text{cm}^3$ of $1.00\ \text{mol dm}^{-3}$ HCl. $\ce{Mg + 2HCl -> MgCl2 + H2}$
a) [2] Determine the limiting reactant, showing your working.
M: $n(\ce{Mg}) = 0.206$ mol; $n(\ce{HCl}) = 0.100$ mol (1) ¶ 0.206 mol Mg would need 0.411 mol HCl, so HCl is limiting (1)
b) [1] Calculate the amount of hydrogen formed.
= 0.05 unit=mol
M: $0.100/2 = 0.0500$ mol (1)
c) [1] Calculate the volume of hydrogen at STP.
= 1.135 unit=dm^3
M: $0.0500 \times 22.7 = 1.14\ \text{dm}^3$ (1)
d) [1] $1.02\ \text{dm}^3$ was collected. Calculate the percentage yield.
= 89.87 rel=0.01 unit=%
M: $1.02/1.135 \times 100 = 89.9\%$ (1)

@struct R2.2
Q: (AHL) For the reaction $\text{A} + \text{B} \to \text{C}$ these initial rates were measured: ¶ Exp 1: [A] = 0.10, [B] = 0.10, rate = $2.0\times10^{-4}$ ¶ Exp 2: [A] = 0.20, [B] = 0.10, rate = $8.0\times10^{-4}$ ¶ Exp 3: [A] = 0.10, [B] = 0.20, rate = $4.0\times10^{-4}$ ¶ (concentrations in $\text{mol dm}^{-3}$, rates in $\text{mol dm}^{-3}\,\text{s}^{-1}$)
a) [1] Deduce the order with respect to A.
= 2 abs=0
M: doubling [A] quadruples the rate → second order (1)
b) [1] Deduce the order with respect to B.
= 1 abs=0
M: doubling [B] doubles the rate → first order (1)
c) [2] Calculate the rate constant and give its units.
= 0.2 unit=dm^6 mol^-2 s^-1
M: $k = \dfrac{2.0\times10^{-4}}{(0.10)^2(0.10)} = 0.20$ (1) ¶ $\text{dm}^6\,\text{mol}^{-2}\,\text{s}^{-1}$ (1)
d) [1] Calculate the rate when $[\text{A}] = [\text{B}] = 0.30\ \text{mol dm}^{-3}$.
= 0.0054 unit=mol dm^-3 s^-1
M: $0.20 \times 0.30^2 \times 0.30 = 5.4\times10^{-3}$ (1)

@struct R2.2
Q: (AHL) The rate constant of a reaction is $3.0\times10^{-3}\ \text{s}^{-1}$ at $300$ K and $1.2\times10^{-2}\ \text{s}^{-1}$ at $320$ K.
a) [1] Calculate $\ln(k_2/k_1)$.
= 1.386
M: $\ln 4 = 1.39$ (1)
b) [2] Calculate the activation energy in $\text{kJ mol}^{-1}$.
= 55.3 unit=kJ mol^-1
M: $\ln\dfrac{k_2}{k_1} = \dfrac{E_a}{R}\left(\dfrac{1}{T_1} - \dfrac{1}{T_2}\right)$ (1) ¶ $E_a = 5.53\times10^4\ \text{J mol}^{-1} = 55.3\ \text{kJ mol}^{-1}$ (1)
c) [2] Explain, using collision theory, why the rate increases with temperature.
M: particles have more kinetic energy, so a greater proportion of collisions have energy ≥ $E_a$ (1) ¶ (and collisions are more frequent) — the first effect is the main one (1)

@struct R2.3
Q: $1.00$ mol of $\ce{H2}$ and $1.00$ mol of $\ce{I2}$ are heated in a sealed $1.00\ \text{dm}^3$ vessel. At equilibrium there are $1.56$ mol of HI. $\ce{H2(g) + I2(g) <=> 2HI(g)}$
a) [1] Calculate the equilibrium concentration of $\ce{H2}$.
= 0.22 unit=mol dm^-3
M: $1.00 - 1.56/2 = 0.22\ \text{mol dm}^{-3}$ (1)
b) [2] Calculate the equilibrium constant $K$.
= 50.28 rel=0.01
M: $K = \dfrac{[\ce{HI}]^2}{[\ce{H2}][\ce{I2}]}$ (1) ¶ $= \dfrac{1.56^2}{0.22^2} = 50$ (1)
c) [2] Predict and explain the effect of increasing the pressure on the position of equilibrium.
M: no effect on the position (1) ¶ equal numbers of moles of gas on both sides (1)

@struct R3.1
Q: (AHL) A $0.150\ \text{mol dm}^{-3}$ solution of a weak monoprotic acid HA has a pH of $2.85$.
a) [1] Calculate $[\ce{H+}]$.
= 0.001413 unit=mol dm^-3
M: $10^{-2.85} = 1.41\times10^{-3}\ \text{mol dm}^{-3}$ (1)
b) [2] Calculate $K_a$, stating one assumption.
= 1.331e-5
M: $K_a = \dfrac{[\ce{H+}]^2}{[\ce{HA}]} = 1.33\times10^{-5}$ (1) ¶ assumption: dissociation is small, so $[\ce{HA}] \approx 0.150$ (1)
c) [1] Calculate $\text{p}K_a$.
= 4.876 abs=0.02
M: $-\log(1.33\times10^{-5}) = 4.88$ (1)
d) [2] State the pH of a buffer made from equal concentrations of HA and NaA, and explain how it resists added acid.
M: pH $= \text{p}K_a = 4.88$ (1) ¶ added $\ce{H+}$ reacts with $\ce{A-}$ to form HA, so $[\ce{H+}]$ hardly changes (1)

@struct R3.2
Q: (AHL) A voltaic cell is made from $\ce{Ag+/Ag}$ ($E^\ominus = +0.80$ V) and $\ce{Cu^2+/Cu}$ ($E^\ominus = +0.34$ V) half-cells.
a) [1] Calculate the standard cell potential.
= 0.46 unit=V
M: $0.80 - 0.34 = +0.46$ V (1)
b) [2] Calculate $\Delta G^\ominus$ for the cell reaction in $\text{kJ mol}^{-1}$ ($F = 96\,500\ \text{C mol}^{-1}$).
= -88.78 unit=kJ mol^-1
M: $n = 2$ (1) ¶ $\Delta G = -nFE = -88.8\ \text{kJ mol}^{-1}$ (1)
c) [2] Identify the anode and state the direction of electron flow in the external circuit.
M: copper is the anode (oxidised) (1) ¶ electrons flow from Cu to Ag through the wire (1)

@struct R1.4
Q: (AHL) For $\ce{N2(g) + 3H2(g) -> 2NH3(g)}$, $\Delta H^\ominus = -92.2\ \text{kJ mol}^{-1}$. Standard entropies ($\text{J K}^{-1}\,\text{mol}^{-1}$): $\ce{N2}$ 191.6, $\ce{H2}$ 130.7, $\ce{NH3}$ 192.5.
a) [2] Calculate $\Delta S^\ominus$.
= -198.7 unit=J K^-1 mol^-1
M: $2(192.5) - [191.6 + 3(130.7)]$ (1) ¶ $= -198.7\ \text{J K}^{-1}\,\text{mol}^{-1}$ (1)
b) [2] Calculate $\Delta G^\ominus$ at $298$ K.
= -32.99 unit=kJ mol^-1
M: $\Delta G = \Delta H - T\Delta S$ with consistent units (1) ¶ $= -92.2 - 298(-0.1987) = -33.0\ \text{kJ mol}^{-1}$ (1)
c) [1] Calculate the temperature above which the reaction is not spontaneous.
= 464 unit=K
M: $T = \Delta H/\Delta S = 464$ K (1)

@struct S2.1
Q: (AHL) Data for NaCl (in $\text{kJ mol}^{-1}$): $\Delta H_f(\ce{NaCl}) = -411$; atomisation of Na $= +107$; first ionisation energy of Na $= +496$; atomisation of Cl ($\tfrac12\ce{Cl2} \to \ce{Cl}$) $= +121$; electron affinity of Cl $= -349$.
a) [3] Calculate the lattice enthalpy of NaCl (endothermic convention).
= 786 abs=1 unit=kJ mol^-1
M: correct Born–Haber cycle (1) ¶ $\Delta H_{lat} = -(-411) + 107 + 496 + 121 - 349$ (1) ¶ $= +786\ \text{kJ mol}^{-1}$ (1)
b) [2] Explain why the lattice enthalpy of MgO is much larger.
M: $\ce{Mg^2+}$ and $\ce{O^2-}$ have higher charges than $\ce{Na+}$ and $\ce{Cl-}$ (1) ¶ and smaller ionic radii, so stronger electrostatic attraction (1)

@struct S3.2
Q: (AHL) A compound has molecular formula $\ce{C3H6O}$. Its IR spectrum shows a strong absorption at $1715\ \text{cm}^{-1}$ and no broad absorption above $3000\ \text{cm}^{-1}$. Its ¹H NMR spectrum shows a single peak.
a) [1] Calculate the index of hydrogen deficiency.
= 1 abs=0
M: $(2 \times 3 + 2 - 6)/2 = 1$ (1)
b) [2] Identify the functional group, using the IR data.
M: C=O (carbonyl) absorbs at 1700–1750 (1) ¶ no O–H, so not an alcohol or acid (1)
c) [2] Deduce the structure and name of the compound.
M: one H environment: two equivalent $\ce{CH3}$ groups (1) ¶ propanone, $\ce{CH3COCH3}$ (1)
`;

export const chemistryStructured = parseStructured('chemistry', source);
