import { parseQuestions, parseStructured } from '../dsl';

/** Additional original chemistry questions (bank expansion). Numeric answers verified in Python. */
const short = String.raw`
@num S1.2 value=10.81 abs=0.02
Q: Boron is $19.9\%$ $^{10}$B (mass 10.01) and $80.1\%$ $^{11}$B (mass 11.01). Calculate its relative atomic mass.
S: $0.199(10.01) + 0.801(11.01) = 10.81$.

@num S1.3 value=4.525e14 unit=Hz
Q: Calculate the frequency of a photon with energy $3.0\times10^{-19}$ J.
S: $f = E/h = 4.5\times10^{14}$ Hz.

@mc S1.3
Q: Which electron configuration is correct for $\ce{Cu}$?
O: $[\text{Ar}]\,3d^9\,4s^2$
O*: $[\text{Ar}]\,3d^{10}\,4s^1$
O: $[\text{Ar}]\,3d^{10}\,4s^2$
O: $[\text{Ar}]\,4s^2\,4p^9$
S: A full 3d sublevel is more stable; copper is one of the two exceptions in period 4.

@num S1.4 value=0.02498 unit=mol
Q: Calculate the amount of $\ce{CaCO3}$ ($M = 100.09$) in $2.50$ g.
S: $2.50/100.09 = 0.0250$ mol.

@num S1.4 value=14.71 unit=g
Q: Calculate the mass of $0.150$ mol of $\ce{H2SO4}$ ($M = 98.09$).
S: $0.150 \times 98.09 = 14.7$ g.

@num S1.4 value=0.2 unit=mol dm^-3
Q: $25.0\ \text{cm}^3$ of $2.00\ \text{mol dm}^{-3}$ HCl is diluted to $250\ \text{cm}^3$. Calculate the new concentration.
S: $c_2 = c_1V_1/V_2 = 0.200\ \text{mol dm}^{-3}$.

@mc S1.4
Q: A hydrocarbon contains $85.6\%$ carbon and $14.4\%$ hydrogen by mass. What is its empirical formula?
O: $\ce{CH}$
O*: $\ce{CH2}$
O: $\ce{CH3}$
O: $\ce{CH4}$
S: $85.6/12.01 = 7.13$; $14.4/1.01 = 14.3$; ratio 1 : 2.

@num S1.5 value=2.269 unit=dm^3
Q: Calculate the volume of $4.40$ g of $\ce{CO2}$ ($M = 44.01$) at STP ($22.7\ \text{dm}^3\ \text{mol}^{-1}$).
S: $n = 0.100$ mol; $V = 2.27\ \text{dm}^3$.

@num S1.5 value=99720 unit=Pa
Q: Calculate the pressure of $0.200$ mol of an ideal gas in $5.00\ \text{dm}^3$ at $300$ K.
S: $p = nRT/V = 0.200 \times 8.31 \times 300/5.00\times10^{-3} = 9.97\times10^4$ Pa.

@match S2.2
Q: Match each molecule to its shape.
P: $\ce{CO2}$ => linear
P: $\ce{BF3}$ => trigonal planar
P: $\ce{H2O}$ => bent
P: $\ce{CH4}$ => tetrahedral
P: $\ce{SF6}$ => octahedral
S: Count electron domains, then remove lone pairs to name the molecular geometry.

@mc S2.2
Q: Which substance forms hydrogen bonds between its molecules?
O: $\ce{CH4}$
O: $\ce{CH3Cl}$
O*: $\ce{CH3OH}$
O: $\ce{CH3OCH3}$
S: Hydrogen bonding requires H bonded directly to N, O or F.

@mc S3.1
Q: How does first ionisation energy change down group 1, and why?
O*: Decreases: the outer electron is further from the nucleus and more shielded.
O: Increases: nuclear charge increases.
O: Stays constant: same number of outer electrons.
O: Decreases: nuclear charge decreases.
S: Greater distance and shielding outweigh the increase in nuclear charge.

@text S3.2
Q: Give the IUPAC name of $\ce{CH3CH2CH2OH}$.
A: propan-1-ol | 1-propanol | propan 1 ol
S: Three carbons, OH on carbon 1.

@mc S3.2
Q: Which functional group is present in ethanoic acid, $\ce{CH3COOH}$?
O: Hydroxyl only
O: Carbonyl only
O*: Carboxyl
O: Ester
S: The –COOH group combines a carbonyl and a hydroxyl on the same carbon.

@num R1.1 value=2090 unit=J
Q: Calculate the heat needed to raise the temperature of $100$ g of water by $5.0$ K ($c = 4.18\ \text{J g}^{-1}\,\text{K}^{-1}$).
S: $Q = mc\Delta T = 2090$ J.

@num R1.2 value=-808 abs=1 unit=kJ mol^-1
Q: Using bond enthalpies (kJ mol⁻¹: C–H 414, O=O 498, C=O 804, O–H 463), calculate $\Delta H$ for $\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)}$.
S: Broken: $4(414) + 2(498) = 2652$. Formed: $2(804) + 4(463) = 3460$. $\Delta H = 2652 - 3460 = -808$ kJ mol⁻¹.

@num R1.4 value=10 abs=0.1 unit=kJ mol^-1
Q: (AHL) For a reaction, $\Delta H = -50\ \text{kJ mol}^{-1}$ and $\Delta S = -100\ \text{J K}^{-1}\,\text{mol}^{-1}$. Calculate $\Delta G$ at $600$ K.
S: $\Delta G = -50 - 600(-0.100) = +10$ kJ mol⁻¹: not spontaneous at 600 K.

@num R2.1 value=63.8 unit=g
Q: Calculate the mass of oxygen needed to burn $16.0$ g of methane completely ($M(\ce{CH4}) = 16.05$, $M(\ce{O2}) = 32.00$).
S: $n(\ce{CH4}) = 0.997$ mol; 2 mol $\ce{O2}$ per mol; $1.99 \times 32.00 = 63.8$ g.

@num R2.1 value=17.88 unit=g
Q: Calculate the maximum mass of water formed from $2.00$ g of hydrogen and excess oxygen ($M(\ce{H2}) = 2.016$, $M(\ce{H2O}) = 18.02$).
S: $n(\ce{H2}) = 0.992$ mol $= n(\ce{H2O})$; mass $= 17.9$ g.

@num R2.2 value=0.005 unit=mol dm^-3 s^-1
Q: The concentration of a reactant falls from $0.50$ to $0.20\ \text{mol dm}^{-3}$ in $60$ s. Calculate the average rate of reaction.
S: $0.30/60 = 5.0\times10^{-3}\ \text{mol dm}^{-3}\,\text{s}^{-1}$.

@num R2.2 value=0.0154 unit=s^-1
Q: (AHL) A first-order reaction has a half-life of $45$ s. Calculate the rate constant.
S: $k = \ln 2/t_{1/2} = 0.0154\ \text{s}^{-1}$.

@num R2.3 value=0.36
Q: For $\ce{N2O4(g) <=> 2NO2(g)}$, the equilibrium concentrations are $[\ce{N2O4}] = 0.040$ and $[\ce{NO2}] = 0.12\ \text{mol dm}^{-3}$. Calculate $K$.
S: $K = 0.12^2/0.040 = 0.36$.

@mc R2.3
Q: (AHL) For a reaction, $Q = 0.5$ and $K = 2.0$. What happens?
O*: The reaction proceeds in the forward direction until $Q = K$.
O: The reaction proceeds in the reverse direction.
O: The system is at equilibrium.
O: $K$ decreases to 0.5.
S: $Q < K$: there are too few products, so the net reaction is forward.

@num R3.1 value=11 abs=0.02
Q: Calculate the pH of $1.0\times10^{-3}\ \text{mol dm}^{-3}$ NaOH at 298 K.
S: pOH $= 3.00$; pH $= 11.00$.

@num R3.1 value=3.162e-5 unit=mol dm^-3
Q: A solution has pH $4.50$. Calculate $[\ce{H+}]$.
S: $10^{-4.50} = 3.16\times10^{-5}\ \text{mol dm}^{-3}$.

@num R3.1 value=25 unit=cm^3
Q: Calculate the volume of $0.200\ \text{mol dm}^{-3}$ NaOH needed to neutralise $25.0\ \text{cm}^3$ of $0.100\ \text{mol dm}^{-3}$ $\ce{H2SO4}$.
S: $n(\ce{H2SO4}) = 2.50\times10^{-3}$; NaOH needed $= 5.00\times10^{-3}$ mol; $V = 25.0\ \text{cm}^3$.

@mc R3.2
Q: What is the oxidation state of chromium in $\ce{Cr2O7^2-}$?
O: +3
O: +4
O*: +6
O: +7
S: $2x + 7(-2) = -2 \Rightarrow x = +6$.

@num R3.2 value=1.185 unit=g
Q: (AHL) A current of $2.0$ A passes through copper(II) sulfate solution for $30$ minutes. Calculate the mass of copper deposited ($F = 96\,500\ \text{C mol}^{-1}$, $A_r(\ce{Cu}) = 63.55$).
S: $Q = 3600$ C; $n(e^-) = 0.0373$ mol; $n(\ce{Cu}) = 0.0187$ mol; mass $= 1.19$ g.

@mc R3.3
Q: Which equation is an initiation step in the reaction of methane with chlorine?
O*: $\ce{Cl2 -> 2Cl^.}$
O: $\ce{CH4 + Cl^. -> CH3^. + HCl}$
O: $\ce{CH3^. + Cl^. -> CH3Cl}$
O: $\ce{CH3^. + Cl2 -> CH3Cl + Cl^.}$
S: Initiation produces radicals from a non-radical (UV homolytic fission).

@mc R3.4
Q: Which species is a nucleophile?
O: $\ce{NO2+}$
O: $\ce{H+}$
O*: $\ce{OH-}$
O: $\ce{BF3}$
S: Nucleophiles donate an electron pair; the others are electrophiles / Lewis acids.
`;

const structured = String.raw`
@struct R1.1
Q: Excess zinc powder was added to $50.0\ \text{cm}^3$ of $0.200\ \text{mol dm}^{-3}$ copper(II) sulfate solution. The temperature rose by $10.2$ K. $\ce{Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s)}$ ($c = 4.18\ \text{J g}^{-1}\,\text{K}^{-1}$; density $1.00\ \text{g cm}^{-3}$)
a) [1] Calculate the heat released.
= 2131.8 unit=J
M: $50.0 \times 4.18 \times 10.2 = 2.13\times10^3$ J (1)
b) [1] Calculate the amount of copper(II) sulfate that reacted.
= 0.01 unit=mol
M: $0.0500 \times 0.200 = 0.0100$ mol (1)
c) [2] Calculate the enthalpy change of the reaction in $\text{kJ mol}^{-1}$.
= -213.2 unit=kJ mol^-1
M: $\Delta H = -Q/n$ (1) ¶ $= -213\ \text{kJ mol}^{-1}$ (sign required) (1)
d) [1] Explain why zinc is added in excess.
M: so that all the copper(II) sulfate reacts and it is the limiting reactant used in the calculation (1)

@struct R2.3
Q: In the Haber process, $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, $\Delta H = -92\ \text{kJ mol}^{-1}$. Industry uses about $450\,^\circ$C, a high pressure and an iron catalyst.
a) [2] Predict the effect of increasing the temperature on the equilibrium yield of ammonia and explain.
M: yield decreases (1) ¶ the forward reaction is exothermic, so higher T shifts equilibrium to the endothermic (reverse) side (1)
b) [2] Explain why a moderately high temperature is still used.
M: higher temperature increases the rate (1) ¶ compromise between an acceptable rate and an acceptable yield (1)
c) [2] Explain the effect of high pressure on the yield.
M: equilibrium shifts to the side with fewer moles of gas (2 vs 4) (1) ¶ so the yield of ammonia increases (1)
d) [1] State the effect of the catalyst on the equilibrium position.
M: none: it increases the rates of forward and reverse reactions equally (1)
`;

export const chemistryExtra = [...parseQuestions('chemistry', short), ...parseStructured('chemistry', structured)];
