import { parseQuestions } from '../dsl';

export const CHEMISTRY_QUESTIONS_VERSION = 1;

/** Original practice questions (not taken from IB papers). */
const source = String.raw`
@num S1.2 value=35.48 abs=0.03
Q: Chlorine consists of $75.8\%$ $^{35}$Cl and $24.2\%$ $^{37}$Cl (take isotopic masses as 35.0 and 37.0). Calculate the relative atomic mass to two decimal places.
S: $A_r = 0.758(35.0) + 0.242(37.0) = 26.53 + 8.954 = 35.48$.

@mc S1.2
Q: How many neutrons are in one atom of $^{56}_{26}$Fe?
O: 26
O*: 30
O: 56
O: 82
S: Neutrons $= A - Z = 56 - 26 = 30$.

@mc S1.3
Q: What is the electron configuration of $\ce{Fe^3+}$?
O: $[\text{Ar}]\,3d^3\,4s^2$
O*: $[\text{Ar}]\,3d^5$
O: $[\text{Ar}]\,3d^6$
O: $[\text{Ar}]\,3d^4\,4s^1$
S: Fe is $[\text{Ar}]\,3d^6 4s^2$. The 4s electrons are lost first, then one 3d: $[\text{Ar}]\,3d^5$.

@mc S1.3
Q: The first four successive ionisation energies of element X are 578, 1817, 2745 and 11 577 kJ mol$^{-1}$. In which group is X?
O: 1
O: 2
O*: 13
O: 15
S: The large jump comes after the 3rd electron, so X has 3 outer electrons → group 13 (aluminium).

@mc S1.3
Q: Which period 3 element has the highest first ionisation energy?
O: Na
O: Cl
O: P
O*: Ar
S: Ionisation energy generally increases across a period; the noble gas argon has the highest.

@num S1.3 value=6.17e14 unit=Hz
Q: Calculate the frequency of a photon of wavelength $486$ nm.
S: $f = c/\lambda = 3.00\times10^8/486\times10^{-9} = 6.17\times10^{14}$ Hz.

@num S1.4 value=0.499 rel=0.01 unit=mol
Q: Calculate the amount (mol) of water in $9.00$ g of $\ce{H2O}$ ($M = 18.02$ g mol$^{-1}$).
S: $n = 9.00/18.02 = 0.499$ mol.

@num S1.4 value=1.51e23
Q: How many molecules are in $0.250$ mol of $\ce{CO2}$?
S: $N = nN_A = 0.250 \times 6.02\times10^{23} = 1.51\times10^{23}$.

@num S1.4 value=6 abs=0
Q: A compound contains $40.0\%$ C, $6.7\%$ H and $53.3\%$ O by mass and has $M_r = 180$. How many carbon atoms are in one molecule?
S: Ratio C : H : O = 40.0/12.01 : 6.7/1.01 : 53.3/16.00 = 3.33 : 6.63 : 3.33 = 1 : 2 : 1 → $\ce{CH2O}$ ($M_r = 30$). $180/30 = 6$ → $\ce{C6H12O6}$, so 6 C atoms.

@num S1.4 value=0.400 unit=mol dm^-3
Q: $5.85$ g of NaCl ($M = 58.44$ g mol$^{-1}$) is dissolved to make $250\ \text{cm}^3$ of solution. Calculate the concentration.
S: $n = 5.85/58.44 = 0.100$ mol; $c = 0.100/0.250 = 0.400$ mol dm$^{-3}$.

@num S1.5 value=11.35 unit=dm^3
Q: Calculate the volume occupied by $0.500$ mol of an ideal gas at STP (molar volume $22.7\ \text{dm}^3\ \text{mol}^{-1}$).
S: $V = 0.500 \times 22.7 = 11.4\ \text{dm}^3$.

@num S1.5 value=49.5 unit=g mol^-1
Q: $1.00$ g of a gas occupies $0.500\ \text{dm}^3$ at $100$ kPa and $298$ K. Calculate its molar mass.
S: $M = \dfrac{mRT}{pV} = \dfrac{1.00 \times 8.31 \times 298}{1.00\times10^5 \times 5.00\times10^{-4}} = 49.5\ \text{g mol}^{-1}$.

@mc S2.1
Q: Which compound has the largest lattice enthalpy?
O: NaCl
O: KCl
O*: MgO
O: KBr
S: MgO has doubly charged ions ($\ce{Mg^2+}$, $\ce{O^2-}$) that are also small → strongest electrostatic attraction.

@mc S2.2
Q: What is the shape of an ammonia molecule, $\ce{NH3}$?
O: Trigonal planar
O*: Trigonal pyramidal
O: Tetrahedral
O: Bent
S: Four electron domains (3 bonding, 1 lone pair) → trigonal pyramidal, bond angle ≈ 107°.

@mc S2.2
Q: Which molecule is non-polar but contains polar bonds?
O: $\ce{H2O}$
O: $\ce{NH3}$
O*: $\ce{CCl4}$
O: $\ce{CH3Cl}$
S: $\ce{CCl4}$ is tetrahedral and symmetric, so the four C–Cl dipoles cancel.

@mc S2.2
Q: Which substance has the highest boiling point?
O: $\ce{CH4}$
O: $\ce{H2S}$
O*: $\ce{H2O}$
O: Ne
S: Water molecules form hydrogen bonds, the strongest intermolecular force here.

@mc S2.2
Q: (AHL) What is the molecular geometry of $\ce{SF4}$?
O: Tetrahedral
O: Square planar
O*: See-saw
O: Trigonal pyramidal
S: S has 5 electron domains (4 bonding + 1 lone pair) → see-saw.

@mc S2.2
Q: (AHL) What is the hybridisation of each carbon atom in ethene, $\ce{C2H4}$?
O: $sp$
O*: $sp^2$
O: $sp^3$
O: $sp^3d$
S: Each carbon has three electron domains (trigonal planar) → $sp^2$; the unhybridised p orbitals form the π bond.

@num S2.2 value=1 abs=0
Q: (AHL) What is the formal charge on the nitrogen atom in $\ce{NH4+}$?
S: $FC = V - (L + \tfrac12 S) = 5 - (0 + 4) = +1$.

@open S2.3
Q: Explain why magnesium has a higher melting point than sodium.
A: Both have metallic bonding. $\ce{Mg^2+}$ has a greater charge and smaller radius than $\ce{Na+}$, and Mg contributes two delocalised electrons per atom instead of one. The electrostatic attraction between the cations and delocalised electrons is therefore stronger, so more energy is needed to overcome it.

@open S2.4
Q: Explain why alloys are generally harder than the pure metals they are made from.
A: Atoms of the added element have a different size, which distorts the regular arrangement of layers in the lattice. The layers can no longer slide over each other easily, so the alloy is harder and less malleable.

@mc S3.1
Q: Which oxide forms an acidic solution in water?
O: $\ce{Na2O}$
O: $\ce{MgO}$
O*: $\ce{SO2}$
O: $\ce{CaO}$
S: Non-metal oxides are acidic: $\ce{SO2 + H2O -> H2SO3}$.

@mc S3.1
Q: Which correctly describes the trend in atomic radius across period 3 from Na to Cl?
O*: Decreases, because nuclear charge increases with similar shielding.
O: Increases, because more electrons are added.
O: Decreases, because more energy levels are occupied.
O: Stays constant, because electrons enter the same level.
S: The extra protons pull the same outer level closer, while shielding by inner electrons hardly changes.

@mc S3.2
Q: To which homologous series does ethyl ethanoate, $\ce{CH3COOCH2CH3}$, belong?
O: Carboxylic acids
O: Ethers
O*: Esters
O: Ketones
S: It contains the –COO– ester linkage.

@num S3.2 value=4 abs=0
Q: Calculate the index of hydrogen deficiency of benzene, $\ce{C6H6}$.
S: $\text{IHD} = \dfrac{2(6) + 2 - 6}{2} = 4$ (one ring + three C=C).

@mc S3.2
Q: How many signals appear in the low-resolution ¹H NMR spectrum of ethanol, $\ce{CH3CH2OH}$?
O: 2
O*: 3
O: 4
O: 6
S: Three hydrogen environments: $\ce{CH3}$, $\ce{CH2}$ and OH (ratio 3 : 2 : 1).

@mc S3.2
Q: (AHL) Which compound shows optical isomerism?
O: Propan-2-ol
O*: Butan-2-ol
O: 2-methylpropan-2-ol
O: Pentan-3-ol
S: In butan-2-ol, C2 is bonded to H, OH, $\ce{CH3}$ and $\ce{C2H5}$ — four different groups, so it is chiral.

@num R1.1 value=-56.8 unit=kJ mol^-1
Q: $50.0\ \text{cm}^3$ of $1.00$ mol dm$^{-3}$ HCl is mixed with $50.0\ \text{cm}^3$ of $1.00$ mol dm$^{-3}$ NaOH. The temperature rises by $6.8$ K. Assuming $c = 4.18$ J g$^{-1}$ K$^{-1}$ and a solution density of $1.00$ g cm$^{-3}$, calculate $\Delta H$ of neutralisation in kJ mol$^{-1}$.
S: $Q = 100 \times 4.18 \times 6.8 = 2842$ J. $n(\ce{H2O}) = 0.0500$ mol. $\Delta H = -2.842/0.0500 = -56.8$ kJ mol$^{-1}$.

@num R1.1 value=-1156 unit=kJ mol^-1
Q: Burning $0.500$ g of ethanol ($M = 46.08$ g mol$^{-1}$) heats $200$ g of water by $15.0$ K. Calculate the experimental enthalpy of combustion of ethanol in kJ mol$^{-1}$.
S: $Q = 200 \times 4.18 \times 15.0 = 12\,540$ J. $n = 0.500/46.08 = 0.01085$ mol. $\Delta H_c = -12.54/0.01085 = -1156$ kJ mol$^{-1}$ (less exothermic than the data value because of heat loss).

@num R1.2 value=-184 unit=kJ
Q: Using bond enthalpies H–H $436$, Cl–Cl $242$, H–Cl $431$ kJ mol$^{-1}$, calculate $\Delta H$ for $\ce{H2(g) + Cl2(g) -> 2HCl(g)}$.
S: Broken: $436 + 242 = 678$. Formed: $2 \times 431 = 862$. $\Delta H = 678 - 862 = -184$ kJ.

@num R1.2 value=-890.3 rel=0.005 unit=kJ mol^-1
Q: (AHL) Given $\Delta H_f^\ominus$ values: $\ce{CH4(g)}$ $-74.8$, $\ce{CO2(g)}$ $-393.5$, $\ce{H2O(l)}$ $-285.8$ kJ mol$^{-1}$, calculate $\Delta H_c^\ominus$ of methane.
S: $\ce{CH4 + 2O2 -> CO2 + 2H2O}$. $\Delta H = [-393.5 + 2(-285.8)] - [-74.8] = -890.3$ kJ mol$^{-1}$.

@mc R1.3
Q: Which product forms during incomplete combustion of methane but not during complete combustion?
O: $\ce{CO2}$
O: $\ce{H2O}$
O*: CO
O: $\ce{H2}$
S: With limited oxygen, carbon monoxide (and/or soot) forms.

@num R1.4 value=130 unit=kJ mol^-1
Q: (AHL) For $\ce{CaCO3(s) -> CaO(s) + CO2(g)}$, $\Delta H^\ominus = +178$ kJ mol$^{-1}$ and $\Delta S^\ominus = +161$ J K$^{-1}$ mol$^{-1}$. Calculate $\Delta G^\ominus$ at 298 K.
S: $\Delta G = 178 - 298(0.161) = 178 - 48.0 = +130$ kJ mol$^{-1}$ (not spontaneous at 298 K).

@num R1.4 value=1106 unit=K
Q: (AHL) Using $\Delta H^\ominus = +178$ kJ mol$^{-1}$ and $\Delta S^\ominus = +161$ J K$^{-1}$ mol$^{-1}$, calculate the minimum temperature at which the decomposition of $\ce{CaCO3}$ becomes spontaneous.
S: $\Delta G = 0$ when $T = \Delta H/\Delta S = 178/0.161 = 1106$ K.

@num R2.1 value=4.40 unit=g
Q: Calculate the mass of $\ce{CO2}$ produced when $10.0$ g of $\ce{CaCO3}$ ($M = 100.09$) decomposes completely. ($M(\ce{CO2}) = 44.01$)
S: $n = 10.0/100.09 = 0.0999$ mol; mass $= 0.0999 \times 44.01 = 4.40$ g.

@num R2.1 value=80.0 unit=%
Q: The theoretical yield of a product is $4.40$ g but only $3.52$ g is obtained. Calculate the percentage yield.
S: $3.52/4.40 \times 100 = 80.0\%$.

@mc R2.1
Q: $4.0$ mol of $\ce{H2}$ reacts with $3.0$ mol of $\ce{O2}$: $\ce{2H2 + O2 -> 2H2O}$. Which statement is correct?
O*: $\ce{H2}$ is limiting and 1.0 mol of $\ce{O2}$ is left over.
O: $\ce{O2}$ is limiting and 2.0 mol of $\ce{H2}$ is left over.
O: Neither is in excess.
O: $\ce{H2}$ is limiting and 2.0 mol of $\ce{O2}$ is left over.
S: 4.0 mol $\ce{H2}$ needs 2.0 mol $\ce{O2}$; 3.0 mol is available, so 1.0 mol $\ce{O2}$ remains.

@num R2.1 value=51.1 unit=%
Q: Calculate the atom economy for making ethanol by fermentation: $\ce{C6H12O6 -> 2C2H5OH + 2CO2}$. ($M$: glucose 180.18, ethanol 46.08)
S: $\dfrac{2 \times 46.08}{180.18} \times 100 = 51.1\%$.

@mc R2.2
Q: How does a catalyst increase the rate of a reaction?
O: It increases the kinetic energy of the particles.
O: It increases the frequency of collisions only.
O*: It provides an alternative pathway with lower activation energy.
O: It shifts the equilibrium position to the right.
S: A larger fraction of collisions have $E \ge E_a$ (new, lower $E_a$).

@num R2.2 value=30.0 unit=s
Q: (AHL) A first-order reaction has rate constant $k = 0.0231\ \text{s}^{-1}$. Calculate its half-life.
S: $t_{1/2} = \ln 2/k = 0.693/0.0231 = 30.0$ s.

@mc R2.2
Q: (AHL) For rate $= k[\text{A}]^2[\text{B}]$, what happens to the rate if [A] is doubled and [B] halved?
O: No change
O*: It doubles
O: It quadruples
O: It halves
S: Factor $= 2^2 \times \tfrac12 = 2$.

@num R2.2 value=52.9 unit=kJ mol^-1
Q: (AHL) A rate constant doubles when the temperature rises from $298$ K to $308$ K. Use the Arrhenius equation to calculate the activation energy in kJ mol$^{-1}$.
S: $\ln\dfrac{k_2}{k_1} = \dfrac{E_a}{R}\left(\dfrac{1}{T_1} - \dfrac{1}{T_2}\right)$ → $E_a = \dfrac{8.31 \ln 2}{1/298 - 1/308} = 5.29\times10^4$ J mol$^{-1}$ = 52.9 kJ mol$^{-1}$.

@mc R2.3
Q: For $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, $\Delta H < 0$, which change increases the equilibrium yield of ammonia?
O: Increasing the temperature
O*: Increasing the pressure
O: Adding a catalyst
O: Removing $\ce{N2}$
S: Higher pressure favours the side with fewer gas moles (2 vs 4). Higher T favours the endothermic reverse; a catalyst has no effect on position.

@num R2.3 value=0.25
Q: The equilibrium constant for a reaction is $K = 4.0$. What is $K$ for the reverse reaction at the same temperature?
S: $K_{reverse} = 1/K = 0.25$.

@num R3.1 value=2.00 abs=0.02
Q: Calculate the pH of $0.010$ mol dm$^{-3}$ HCl.
S: Strong acid: $[\ce{H+}] = 0.010$; pH $= -\log 0.010 = 2.00$.

@num R3.1 value=12.70 abs=0.02
Q: Calculate the pH of $0.050$ mol dm$^{-3}$ NaOH at 298 K.
S: pOH $= -\log 0.050 = 1.30$; pH $= 14.00 - 1.30 = 12.70$.

@num R3.1 value=2.87 abs=0.03
Q: (AHL) Calculate the pH of $0.10$ mol dm$^{-3}$ ethanoic acid ($K_a = 1.8\times10^{-5}$).
S: $[\ce{H+}] \approx \sqrt{K_a c} = \sqrt{1.8\times10^{-6}} = 1.34\times10^{-3}$; pH $= 2.87$.

@num R3.1 value=4.76 abs=0.02
Q: (AHL) A buffer contains equal concentrations of ethanoic acid ($\text{p}K_a = 4.76$) and sodium ethanoate. What is its pH?
S: $\text{pH} = \text{p}K_a + \log 1 = 4.76$.

@mc R3.1
Q: What is the conjugate base of $\ce{H2PO4-}$?
O: $\ce{H3PO4}$
O*: $\ce{HPO4^2-}$
O: $\ce{PO4^3-}$
O: $\ce{H2PO4^2-}$
S: Remove one $\ce{H+}$: $\ce{H2PO4- -> HPO4^2- + H+}$.

@mc R3.2
Q: What is the oxidation state of manganese in $\ce{KMnO4}$?
O: +4
O: +6
O*: +7
O: +8
S: $+1 + x + 4(-2) = 0 \Rightarrow x = +7$.

@num R3.2 value=1.10 abs=0.01 unit=V
Q: (AHL) Calculate $E^\ominus_{cell}$ for a Zn/Cu cell. ($E^\ominus$: $\ce{Zn^2+/Zn}$ $-0.76$ V, $\ce{Cu^2+/Cu}$ $+0.34$ V)
S: $E_{cell} = E_{cathode} - E_{anode} = 0.34 - (-0.76) = +1.10$ V.

@num R3.2 value=-212 unit=kJ mol^-1
Q: (AHL) Calculate $\Delta G^\ominus$ for the Zn/Cu cell ($E^\ominus_{cell} = 1.10$ V, $n = 2$, $F = 96\,500$ C mol$^{-1}$) in kJ mol$^{-1}$.
S: $\Delta G = -nFE = -2 \times 96\,500 \times 1.10 = -2.12\times10^5$ J mol$^{-1}$ = $-212$ kJ mol$^{-1}$.

@mc R3.2
Q: In a galvanic cell, which statement is correct?
O: Reduction occurs at the anode.
O*: Electrons flow through the external wire from anode to cathode.
O: The anode is the positive electrode.
O: Ions flow through the external wire.
S: Oxidation at the (negative) anode releases electrons, which flow through the wire to the cathode. Ions move through the salt bridge.

@open R3.3
Q: Write equations for the initiation, two propagation steps and one termination step in the reaction of methane with bromine in UV light.
A: Initiation: $\ce{Br2 -> 2Br^.}$ ¶ Propagation: $\ce{CH4 + Br^. -> CH3^. + HBr}$; $\ce{CH3^. + Br2 -> CH3Br + Br^.}$ ¶ Termination (any one): $\ce{Br^. + Br^. -> Br2}$, $\ce{CH3^. + Br^. -> CH3Br}$, $\ce{CH3^. + CH3^. -> C2H6}$

@mc R3.4
Q: (AHL) Which rate equation is consistent with an SN2 mechanism for $\ce{RBr + OH- -> ROH + Br-}$?
O: rate $= k[\ce{RBr}]$
O*: rate $= k[\ce{RBr}][\ce{OH-}]$
O: rate $= k[\ce{OH-}]$
O: rate $= k[\ce{RBr}]^2$
S: SN2 is a single bimolecular step involving both species.

@mc R3.4
Q: (AHL) What is the major product when HBr reacts with propene?
O: 1-bromopropane
O*: 2-bromopropane
O: 1,2-dibromopropane
O: Propan-2-ol
S: Markovnikov: H adds to $\ce{CH2}$ (more H atoms), forming the more stable secondary carbocation, so Br bonds to C2.

@open R3.4
Q: (AHL) Explain why tertiary halogenoalkanes react mainly by an SN1 mechanism.
A: Three bulky alkyl groups sterically hinder backside attack by a nucleophile, preventing SN2. The tertiary carbocation formed by heterolysis is relatively stable because the alkyl groups are electron-releasing (positive inductive effect), so the two-step SN1 route is favoured.
`;

export const chemistryQuestions = parseQuestions('chemistry', source);
