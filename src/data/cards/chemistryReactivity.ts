/** Chemistry — Reactivity 1–3. Written for this app; original wording. */
export const chemistryReactivitySource = String.raw`
# R1.1
[d] Exothermic vs endothermic :: Exothermic: releases energy to the surroundings, $\Delta H < 0$, surroundings warm up. ¶ Endothermic: absorbs energy from the surroundings, $\Delta H > 0$, surroundings cool.
[d] Standard enthalpy change :: Enthalpy change measured under standard conditions: 100 kPa, 298 K, solutions at 1 mol dm$^{-3}$, substances in standard states. Symbol $\Delta H^\ominus$.
[f] Heat transferred in calorimetry :: $Q = mc\Delta T$ ($c$ of water = 4.18 J g$^{-1}$ K$^{-1}$; $m$ is usually the mass of solution/water)
[f] Enthalpy change from calorimetry :: $\Delta H = -\dfrac{Q}{n}$ (negative sign: a temperature rise means an exothermic reaction)
[k] Main source of error in simple calorimetry :: Heat loss to the surroundings, so the measured $\Delta T$ is too small and the calculated $|\Delta H|$ too small. Reduce by insulation/lid and extrapolating a temperature–time graph.
[k] Energy profile diagram :: Shows reactants, products, $\Delta H$ and activation energy $E_a$. Exothermic: products lower than reactants.
[k] Relative stability and enthalpy :: The lower the enthalpy of a substance, the more energetically stable it is.

# R1.2
[d] Average bond enthalpy :: The energy needed to break one mole of a given bond in gaseous molecules, averaged over a range of compounds.
[f] Enthalpy change from bond enthalpies :: $\Delta H = \sum(\text{bonds broken}) - \sum(\text{bonds formed})$ — only exact for gaseous species.
[k] Why bond-enthalpy calculations are approximate :: They use average values (actual bond strength depends on the molecule) and assume all species are gaseous.
[d] Hess's law :: The total enthalpy change of a reaction is independent of the route taken, provided initial and final conditions are the same.
[d] Standard enthalpy of formation (AHL) :: Enthalpy change when one mole of a compound forms from its elements in their standard states under standard conditions. Zero for elements in their standard state.
[d] Standard enthalpy of combustion :: Enthalpy change when one mole of a substance burns completely in excess oxygen under standard conditions.
[f] $\Delta H$ from formation and combustion data (AHL) :: $\Delta H^\ominus = \sum\Delta H_f^\ominus(\text{products}) - \sum\Delta H_f^\ominus(\text{reactants})$ ¶ $\Delta H^\ominus = \sum\Delta H_c^\ominus(\text{reactants}) - \sum\Delta H_c^\ominus(\text{products})$
[k] Born–Haber cycle steps (AHL) :: Atomisation of metal and non-metal, ionisation energy(s) of the metal, electron affinity(ies) of the non-metal, lattice enthalpy, and enthalpy of formation — the cycle sums to zero (Hess's law).

# R1.3
[k] Complete vs incomplete combustion of hydrocarbons :: Complete (excess $\ce{O2}$): $\ce{CO2}$ and $\ce{H2O}$. Incomplete (limited $\ce{O2}$): CO and/or C (soot) and $\ce{H2O}$ — less energy released.
[k] Dangers of incomplete combustion products :: CO is toxic (binds to haemoglobin, preventing oxygen transport). Soot particulates cause respiratory problems and global dimming.
[d] Fossil fuels :: Coal, crude oil and natural gas — non-renewable fuels formed over millions of years from buried organic matter; their combustion releases $\ce{CO2}$.
[d] Biofuel :: A fuel produced from recently living biomass (e.g. bioethanol by fermentation, biodiesel). Regarded as more carbon-neutral but competes for land and water.
[f] Fermentation of glucose :: $\ce{C6H12O6 -> 2C2H5OH + 2CO2}$ (yeast enzymes, anaerobic)
[k] Hydrogen fuel cell (acidic electrolyte) :: Anode (−): $\ce{H2 -> 2H+ + 2e-}$ ¶ Cathode (+): $\ce{O2 + 4H+ + 4e- -> 2H2O}$ ¶ Overall: $\ce{2H2 + O2 -> 2H2O}$
[d] Specific energy and energy density :: Specific energy: energy released per unit mass (kJ kg$^{-1}$). Energy density: energy released per unit volume (kJ dm$^{-3}$).

# R1.4
[d] Entropy (AHL) :: A measure of the dispersal of energy and matter (the number of ways particles and energy can be arranged). Symbol $S$, unit J K$^{-1}$ mol$^{-1}$.
[k] Predicting the sign of $\Delta S$ (AHL) :: $S$(gas) ≫ $S$(liquid) > $S$(solid). An increase in the number of moles of gas usually means $\Delta S > 0$.
[f] Standard entropy change (AHL) :: $\Delta S^\ominus = \sum S^\ominus(\text{products}) - \sum S^\ominus(\text{reactants})$
[f] Gibbs energy change (AHL) :: $\Delta G^\ominus = \Delta H^\ominus - T\Delta S^\ominus$ — a reaction is spontaneous when $\Delta G < 0$. Convert $\Delta S$ to kJ K$^{-1}$ mol$^{-1}$ when $\Delta H$ is in kJ.
[k] Spontaneity for each sign combination of ΔH and ΔS (AHL) :: −ΔH, +ΔS: always spontaneous. ¶ +ΔH, −ΔS: never. ¶ −ΔH, −ΔS: spontaneous at low T. ¶ +ΔH, +ΔS: spontaneous at high T.
[f] Gibbs energy and equilibrium (AHL) :: $\Delta G^\ominus = -RT\ln K$ — $\Delta G^\ominus < 0$ means $K > 1$ (products favoured).

# R2.1
[k] Stoichiometric calculations :: Convert data to moles, use the mole ratio from the balanced equation, convert back to the required quantity.
[d] Limiting reactant :: The reactant that is completely used up first and so determines the maximum amount of product. Find it by comparing moles ÷ stoichiometric coefficient.
[f] Percentage yield :: $\%\ \text{yield} = \dfrac{\text{experimental yield}}{\text{theoretical yield}} \times 100$
[f] Atom economy :: $\dfrac{\text{molar mass of desired product}}{\text{total molar mass of all reactants}} \times 100$ — a measure of how much reactant ends up in the useful product.
[k] Why the experimental yield is usually below 100 % :: Incomplete or reversible reactions, side reactions, loss of product during transfer/purification.
[k] Titration calculation outline :: Moles of titrant = $cV$ → mole ratio → moles of analyte → concentration = $n/V$ (volumes in dm³).

# R2.2
[d] Rate of reaction :: The change in concentration of a reactant or product per unit time (mol dm$^{-3}$ s$^{-1}$); found from the gradient of a concentration–time graph.
[k] Collision theory :: Particles must collide with energy ≥ activation energy and with the correct orientation for a reaction to occur.
[d] Activation energy :: The minimum energy colliding particles need for a successful (reacting) collision.
[k] Effect of temperature on rate (Maxwell–Boltzmann) :: Higher T shifts the distribution to higher energies: many more particles have $E \ge E_a$ (main effect) and collisions are more frequent.
[k] Features of a Maxwell–Boltzmann distribution :: Starts at the origin, asymmetric, no maximum energy (approaches the axis); area under the curve = total number of particles, which stays constant at higher temperature (peak lower and to the right).
[d] Catalyst :: A substance that increases the rate of reaction by providing an alternative pathway with a lower activation energy, and is chemically unchanged at the end.
[k] Factors that increase reaction rate :: Higher concentration or pressure, higher temperature, greater surface area, presence of a catalyst.
[f] Rate equation (AHL) :: $\text{rate} = k[\text{A}]^m[\text{B}]^n$ — orders $m, n$ found experimentally; overall order $= m + n$.
[x] Units of the rate constant (AHL) :: Zero order: mol dm$^{-3}$ s$^{-1}$ ¶ First: s$^{-1}$ ¶ Second: dm$^3$ mol$^{-1}$ s$^{-1}$ ¶ Third: dm$^6$ mol$^{-2}$ s$^{-1}$
[k] Concentration–time and rate–concentration graphs for each order (AHL) :: Zero order: [A]–t straight line; rate constant. ¶ First: exponential decay, constant half-life; rate ∝ [A]. ¶ Second: rate ∝ [A]$^2$ (parabola).
[d] Rate-determining step (AHL) :: The slowest step in a reaction mechanism; species in it (and before it) appear in the rate equation.
[d] Molecularity (AHL) :: The number of particles taking part in an elementary step (unimolecular, bimolecular…).
[f] Arrhenius equation (AHL) :: $k = Ae^{-E_a/RT}$ ¶ $\ln k = -\dfrac{E_a}{R}\cdot\dfrac{1}{T} + \ln A$ — a plot of $\ln k$ vs $1/T$ has gradient $-E_a/R$.
[f] Half-life of a first-order reaction (AHL) :: $t_{1/2} = \dfrac{\ln 2}{k}$ — independent of initial concentration.
[k] Intermediate vs transition state (AHL) :: Intermediate: a species formed in one step and used in a later one (energy minimum between peaks). Transition state: the unstable arrangement at an energy maximum; cannot be isolated.

# R2.3
[d] Dynamic equilibrium :: In a closed system, the forward and reverse reaction rates are equal, so concentrations stay constant while both reactions continue.
[f] Equilibrium constant expression :: For $a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$: $K = \dfrac{[\text{C}]^c[\text{D}]^d}{[\text{A}]^a[\text{B}]^b}$ (equilibrium concentrations)
[k] What does the size of K tell you? :: $K \gg 1$: equilibrium lies far to the right (products). $K \ll 1$: lies to the left. $K$ says nothing about the rate.
[d] Le Châtelier's principle :: If a system at equilibrium is disturbed, the position of equilibrium shifts to partially counteract the change.
[k] Effect of changes on K :: Only temperature changes $K$. Concentration and pressure change the position but not $K$. A catalyst changes neither — it only speeds up reaching equilibrium.
[k] Effect of temperature on equilibrium :: Increasing T shifts the equilibrium in the endothermic direction. For an exothermic forward reaction, $K$ decreases as T increases.
[f] Reaction quotient (AHL) :: $Q$ has the same form as $K$ but uses current concentrations. $Q < K$: net forward reaction; $Q > K$: net reverse; $Q = K$: at equilibrium.
[k] Relationship between K for related equations :: Reverse the equation → $1/K$. Double the coefficients → $K^2$.

# R3.1
[d] Brønsted–Lowry acid and base :: Acid: proton ($\ce{H+}$) donor. Base: proton acceptor.
[d] Conjugate acid–base pair :: Two species differing by one proton, e.g. $\ce{CH3COOH}/\ce{CH3COO-}$, $\ce{NH4+}/\ce{NH3}$.
[d] Amphiprotic species :: Can both donate and accept a proton, e.g. $\ce{H2O}$, $\ce{HCO3-}$, $\ce{HSO4-}$, amino acids.
[f] pH and [H⁺] :: $\text{pH} = -\log_{10}[\ce{H+}]$ ¶ $[\ce{H+}] = 10^{-\text{pH}}$ — a change of 1 pH unit is a 10-fold change in $[\ce{H+}]$.
[f] Ionic product of water :: $K_w = [\ce{H+}][\ce{OH-}] = 1.00\times10^{-14}$ at 298 K; $\text{pH} + \text{pOH} = 14$ at 298 K.
[k] Strong vs weak acids :: Strong acids dissociate fully in water (HCl, $\ce{HNO3}$, $\ce{H2SO4}$). Weak acids dissociate partially (carboxylic acids, $\ce{H2CO3}$). Same concentration → strong acid has lower pH, higher conductivity, faster reaction with metals.
[k] Why pure water is neutral at all temperatures :: $[\ce{H+}] = [\ce{OH-}]$ always. $K_w$ increases with T (dissociation is endothermic), so neutral pH falls below 7 at higher T.
[f] $K_a$, $\text{p}K_a$ and $K_b$ (AHL) :: $K_a = \dfrac{[\ce{H+}][\ce{A-}]}{[\ce{HA}]}$, $\text{p}K_a = -\log K_a$ ¶ $K_a \times K_b = K_w$, $\text{p}K_a + \text{p}K_b = 14$ (298 K)
[d] Buffer solution (AHL) :: A solution that resists changes in pH when small amounts of acid or base are added — a weak acid and its conjugate base (or weak base and its conjugate acid).
[f] pH of a buffer (AHL) :: $\text{pH} = \text{p}K_a + \log\dfrac{[\ce{A-}]}{[\ce{HA}]}$ — when $[\ce{A-}] = [\ce{HA}]$ (half-equivalence), $\text{pH} = \text{p}K_a$.
[k] Choosing an indicator (AHL) :: Choose one whose colour change range ($\approx \text{p}K_{in} \pm 1$) lies within the steep vertical part of the titration curve around the equivalence point.
[k] pH at equivalence for different titrations (AHL) :: Strong acid + strong base: 7. Weak acid + strong base: > 7. Strong acid + weak base: < 7.

# R3.2
[d] Oxidation and reduction :: Oxidation: loss of electrons / increase in oxidation state. Reduction: gain of electrons / decrease in oxidation state. ("OIL RIG")
[d] Oxidising and reducing agents :: Oxidising agent: accepts electrons and is itself reduced. Reducing agent: donates electrons and is itself oxidised.
[k] Activity series of metals :: A more reactive metal displaces a less reactive metal from its salt solution. More reactive metals are stronger reducing agents.
[k] Galvanic (voltaic) cell :: Converts chemical energy to electrical energy from a spontaneous redox reaction. Anode (−): oxidation. Cathode (+): reduction. Electrons flow anode → cathode through the wire.
[d] Salt bridge :: Connects the half-cells, completing the circuit by allowing ion movement and maintaining electrical neutrality.
[k] Electrolytic cell :: Uses electrical energy to drive a non-spontaneous reaction. Anode (+): oxidation. Cathode (−): reduction.
[k] Electrolysis of molten NaCl :: Cathode: $\ce{Na+ + e- -> Na}$ ¶ Anode: $\ce{2Cl- -> Cl2 + 2e-}$
[k] Oxidation of alcohols :: Primary → aldehyde (distil off) → carboxylic acid (reflux). Secondary → ketone. Tertiary: not oxidised. Oxidising agent: acidified $\ce{K2Cr2O7}$ (orange → green).
[d] Standard hydrogen electrode (AHL) :: Reference half-cell assigned $E^\ominus = 0$ V: Pt electrode in 1 mol dm$^{-3}$ $\ce{H+}$ with $\ce{H2}$ gas at 100 kPa, 298 K.
[f] Standard cell potential (AHL) :: $E^\ominus_{\text{cell}} = E^\ominus_{\text{cathode}} - E^\ominus_{\text{anode}}$ (reduction potentials); positive means spontaneous.
[f] Gibbs energy and cell potential (AHL) :: $\Delta G^\ominus = -nFE^\ominus_{\text{cell}}$, $F = 96\,500$ C mol$^{-1}$
[k] Electroplating (AHL) :: The object to be plated is the cathode, the plating metal is the anode, and the electrolyte contains ions of the plating metal.

# R3.3
[d] Homolytic fission :: A covalent bond breaks with each atom taking one electron, forming two radicals.
[d] Radical :: A species with an unpaired electron; highly reactive.
[k] Radical substitution of methane with chlorine (UV) :: Initiation: $\ce{Cl2 -> 2Cl^.}$ ¶ Propagation: $\ce{CH4 + Cl^. -> CH3^. + HCl}$; $\ce{CH3^. + Cl2 -> CH3Cl + Cl^.}$ ¶ Termination: two radicals combine, e.g. $\ce{Cl^. + Cl^. -> Cl2}$.
[k] Why alkanes are unreactive :: Strong, non-polar C–C and C–H bonds; no lone pairs or π bonds to attract electrophiles or nucleophiles.
[k] Why UV light is needed in radical halogenation :: It provides the energy for homolytic fission of the halogen–halogen bond (initiation).

# R3.4
[d] Nucleophile and electrophile :: Nucleophile: an electron-rich species that donates a lone pair (e.g. $\ce{OH-}$, $\ce{H2O}$, $\ce{NH3}$). ¶ Electrophile: an electron-deficient species that accepts an electron pair (e.g. $\ce{H+}$, $\ce{NO2+}$, $\ce{Br2}$ when polarised).
[d] Lewis acid and base :: Lewis acid: electron-pair acceptor. Lewis base: electron-pair donor. They form a coordination bond.
[d] Heterolytic fission :: A covalent bond breaks with one atom taking both electrons, forming a cation and an anion.
[k] Nucleophilic substitution of halogenoalkanes :: The nucleophile attacks the δ+ carbon and the halide leaves, e.g. $\ce{CH3CH2Br + OH- -> CH3CH2OH + Br-}$.
[k] SN1 vs SN2 (AHL) :: SN2: one step, primary halogenoalkanes, rate = $k[\text{RX}][\text{Nu}^-]$, inversion of configuration. ¶ SN1: two steps via a carbocation, tertiary halogenoalkanes, rate = $k[\text{RX}]$, racemic product.
[k] Rate of substitution and the halogen (AHL) :: Iodoalkanes > bromo > chloro: the C–I bond is weakest, so iodide is the best leaving group.
[k] Electrophilic addition to alkenes :: The π electrons attack an electrophile (e.g. HBr, $\ce{Br2}$, $\ce{H2O}$/acid), forming a carbocation that a nucleophile then attacks.
[k] Test for unsaturation :: Bromine water decolourises (orange/brown → colourless) with alkenes (addition), but not with alkanes in the dark.
[d] Markovnikov's rule (AHL) :: When HX adds to an unsymmetrical alkene, H attaches to the carbon with more H atoms, because this forms the more stable (more substituted) carbocation.
[k] Electrophilic substitution of benzene: nitration (AHL) :: Conc. $\ce{HNO3}$ + conc. $\ce{H2SO4}$ generate $\ce{NO2+}$, which attacks the ring; $\ce{H+}$ is lost to restore the delocalised system, giving nitrobenzene.
[k] Why benzene undergoes substitution rather than addition :: Substitution keeps the stable delocalised π system; addition would destroy it.
`;
