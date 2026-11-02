/** Chemistry — Structure 1–3. Written for this app; original wording. */
export const chemistryStructureSource = String.raw`
# S1.1
[d] Element, compound, mixture :: Element: made of only one type of atom. ¶ Compound: two or more elements chemically bonded in a fixed ratio. ¶ Mixture: two or more substances physically combined, in variable proportions, keeping their own properties.
[d] Homogeneous vs heterogeneous mixture :: Homogeneous: uniform composition and a single phase throughout (e.g. salt solution, air). ¶ Heterogeneous: non-uniform, with visibly separate phases (e.g. sand in water).
[k] Separation techniques and what they exploit :: Filtration — particle size (insoluble solid from liquid). ¶ Crystallisation — solubility decreasing on cooling/evaporation. ¶ Distillation — boiling point. ¶ Paper chromatography — different affinity for stationary vs mobile phase. ¶ Solvent extraction — different solubility in two immiscible solvents.
[d] Changes of state :: Melting (s→l), freezing (l→s), vaporisation (l→g), condensation (g→l), sublimation (s→g), deposition (g→s).
[k] Kinetic molecular theory: solids, liquids, gases :: Solid: particles vibrate about fixed positions, close-packed. ¶ Liquid: close together, move past each other. ¶ Gas: far apart, fast random motion, negligible intermolecular forces.
[k] Kelvin temperature :: The Kelvin temperature is proportional to the average kinetic energy of the particles. $T/\text{K} = \theta/^\circ\text{C} + 273.15$. Absolute zero (0 K) is the lowest possible temperature.
[k] Why is temperature constant during a change of state? :: The energy absorbed overcomes intermolecular forces (increases potential energy) rather than increasing average kinetic energy.

# S1.2
[x] Relative masses and charges of subatomic particles :: Proton: mass 1, charge +1. ¶ Neutron: mass 1, charge 0. ¶ Electron: mass ≈ 1/1836 (≈ 0.0005), charge −1.
[d] Atomic number and mass number :: Atomic number $Z$: number of protons. Mass number $A$: number of protons + neutrons. Neutrons = $A - Z$.
[d] Isotopes :: Atoms of the same element with the same number of protons but different numbers of neutrons. Same chemical properties, different physical properties (e.g. mass, density, rate of diffusion).
[f] Relative atomic mass from isotopic abundances :: $A_r = \dfrac{\sum (\text{isotope mass} \times \text{abundance})}{\sum \text{abundance}}$ — a weighted mean.
[k] Mass spectrum of an element :: Each peak corresponds to an isotope: $m/z$ gives the isotopic mass, peak height gives relative abundance → used to calculate $A_r$.
[k] Counting electrons in ions :: Electrons = $Z$ − charge. E.g. $\ce{S^2-}$ has $16 + 2 = 18$ electrons; $\ce{Fe^3+}$ has $26 - 3 = 23$.
[d] Relative atomic mass, $A_r$ :: The weighted mean mass of the atoms of an element compared with 1/12 of the mass of a carbon-12 atom (dimensionless).

# S1.3
[k] Continuous vs line spectrum :: Continuous: all wavelengths/colours present (e.g. white light). ¶ Line (emission) spectrum: only specific wavelengths — evidence that electron energy levels are quantised.
[k] Hydrogen emission spectrum and energy levels :: Lines arise when excited electrons fall to lower levels, emitting photons with $\Delta E = hf$. Lines converge at higher frequency because energy levels get closer together further from the nucleus.
[x] Hydrogen spectral series :: Transitions to $n = 1$: ultraviolet (Lyman). ¶ Transitions to $n = 2$: visible (Balmer). ¶ Transitions to $n = 3$: infrared (Paschen).
[x] Maximum electrons per sublevel and per level :: s: 2, p: 6, d: 10, f: 14. ¶ Main level $n$ holds $2n^2$ electrons.
[d] Aufbau, Pauli, Hund :: Aufbau: electrons fill the lowest-energy orbitals first. ¶ Pauli exclusion: an orbital holds at most two electrons, with opposite spins. ¶ Hund: in degenerate orbitals, electrons occupy separate orbitals with parallel spins before pairing.
[x] Exceptional electron configurations of Cr and Cu :: Cr: $[\text{Ar}]\,3d^5\,4s^1$ ¶ Cu: $[\text{Ar}]\,3d^{10}\,4s^1$ (half-filled / filled d sublevel is more stable).
[k] Which electrons are lost first from transition-metal atoms? :: The 4s electrons are removed before the 3d electrons. E.g. $\ce{Fe^2+}$ is $[\text{Ar}]\,3d^6$.
[d] First ionisation energy :: The minimum energy needed to remove one mole of electrons from one mole of gaseous atoms in their ground state: $\ce{X(g) -> X+(g) + e-}$.
[k] Trend in first IE across a period and its exceptions :: Generally increases (greater nuclear charge, similar shielding). Dips at group 13 (electron removed from a higher-energy p orbital) and group 16 (removal of a paired electron — spin-pair repulsion).
[k] Successive ionisation energies :: Always increase (removing electrons from an increasingly positive ion). A large jump shows an electron is being removed from a new, inner main energy level → reveals group number.
[k] Determining IE from the convergence limit (AHL) :: The convergence limit of the Lyman series corresponds to $n = \infty$; $IE = hf_{\text{limit}}$ per atom (× $N_A$ per mole).
[f] Photon energy relations :: $E = hf$, $\quad c = f\lambda$

# S1.4
[d] The mole :: The amount of substance containing exactly $6.02214076\times10^{23}$ elementary entities (the Avogadro constant, $N_A$).
[f] Amount, mass and molar mass :: $n = \dfrac{m}{M}$ ($M$ in g mol$^{-1}$) ¶ $N = nN_A$
[d] Empirical vs molecular formula :: Empirical: simplest whole-number ratio of atoms of each element. Molecular: actual number of atoms of each element in a molecule (a whole-number multiple of the empirical formula).
[f] Concentration of a solution :: $c = \dfrac{n}{V}$ (mol dm$^{-3}$); mass concentration in g dm$^{-3}$. Note $1\ \text{dm}^3 = 1000\ \text{cm}^3$.
[d] Avogadro's law :: Equal volumes of any gases at the same temperature and pressure contain equal numbers of particles (molecules).
[k] Method to find an empirical formula from percentage composition :: Divide each % (or mass) by $A_r$ → moles; divide by the smallest; scale to whole numbers.
[f] Dilution :: $c_1V_1 = c_2V_2$ (amount of solute unchanged)
[d] Standard solution :: A solution of accurately known concentration.

# S1.5
[k] Assumptions of the ideal gas model :: Particles in continuous random motion; negligible particle volume; no intermolecular forces; perfectly elastic collisions.
[f] Ideal gas equation :: $pV = nRT$ — SI units: $p$ in Pa, $V$ in m$^3$, $T$ in K; $R = 8.31\ \text{J K}^{-1}\,\text{mol}^{-1}$
[x] Molar volume of an ideal gas at STP (IB) :: $22.7\ \text{dm}^3\ \text{mol}^{-1}$ at 273.15 K and 100 kPa.
[k] Conditions where real gases deviate from ideal behaviour :: High pressure (particle volume matters) and low temperature (intermolecular forces matter).
[f] Combined gas law :: $\dfrac{p_1V_1}{T_1} = \dfrac{p_2V_2}{T_2}$ for a fixed amount of gas
[k] Finding molar mass from gas data :: $M = \dfrac{mRT}{pV}$
[u] Common unit conversions for $pV = nRT$ :: $1\ \text{dm}^3 = 10^{-3}\ \text{m}^3$, $1\ \text{cm}^3 = 10^{-6}\ \text{m}^3$, $1\ \text{kPa} = 10^3\ \text{Pa}$

# S2.1
[d] Ionic bond :: The electrostatic attraction between oppositely charged ions, formed by electron transfer (typically metal → non-metal).
[d] Lattice enthalpy :: The enthalpy change when one mole of a solid ionic compound is separated into its gaseous ions (endothermic, positive in the IB convention).
[k] Factors affecting lattice enthalpy :: Larger ionic charges and smaller ionic radii → stronger electrostatic attraction → larger lattice enthalpy.
[k] Properties of ionic compounds :: High melting/boiling points; conduct when molten or in aqueous solution (mobile ions) but not as solids; brittle; often soluble in polar solvents.
[x] Common polyatomic ions :: $\ce{NH4+}$ ammonium, $\ce{OH-}$ hydroxide, $\ce{NO3-}$ nitrate, $\ce{HCO3-}$ hydrogencarbonate, $\ce{CO3^2-}$ carbonate, $\ce{SO4^2-}$ sulfate, $\ce{PO4^3-}$ phosphate.
[k] Why are ionic solids brittle? :: A force shifts layers so that ions of like charge become adjacent; the repulsion splits the crystal.
[k] Ionic charge from group number :: Group 1 → +1, group 2 → +2, group 13 → +3 (Al), group 15 → −3, group 16 → −2, group 17 → −1.

# S2.2
[d] Covalent bond :: The electrostatic attraction between a shared pair of electrons and the positively charged nuclei of the bonded atoms.
[d] Coordination (dative) bond :: A covalent bond in which both shared electrons come from the same atom (e.g. in $\ce{NH4+}$, $\ce{H3O+}$, CO).
[k] Bond order, length and strength :: Triple > double > single in bond strength; triple < double < single in bond length (more shared electrons pull nuclei closer).
[d] Electronegativity :: The relative ability of an atom to attract a shared pair of electrons in a covalent bond.
[k] VSEPR: 2, 3 and 4 electron domains :: 2 domains: linear, 180°. ¶ 3: trigonal planar, 120° (one lone pair → bent, slightly less than 120°, e.g. $\ce{SO2}$ ≈ 119°). ¶ 4: tetrahedral, 109.5° (one lone pair → trigonal pyramidal ≈ 107°; two lone pairs → bent ≈ 104.5°).
[k] Why do lone pairs reduce bond angles? :: Lone pairs are closer to the nucleus and repel more strongly than bonding pairs (repulsion: LP–LP > LP–BP > BP–BP).
[k] VSEPR: 5 and 6 electron domains (AHL) :: 5: trigonal bipyramidal (90°, 120°); with lone pairs: see-saw, T-shaped, linear. ¶ 6: octahedral (90°); with lone pairs: square pyramidal, square planar.
[k] Bond polarity vs molecular polarity :: A bond is polar if the atoms' electronegativities differ. A molecule is polar only if the bond dipoles do not cancel — e.g. $\ce{CO2}$ has polar bonds but is non-polar (linear, symmetric).
[k] Types of intermolecular force (weakest → strongest, similar size molecules) :: London (dispersion) forces < dipole–induced dipole < dipole–dipole < hydrogen bonding.
[d] Hydrogen bond :: Attraction between an H atom bonded to N, O or F and a lone pair on another N, O or F atom.
[k] Factors increasing London dispersion forces :: More electrons (larger molar mass) and a larger contact area (e.g. unbranched chains).
[k] Covalent network structures :: Diamond (each C bonded to 4, tetrahedral, very hard, non-conductor); graphite (layers, each C bonded to 3, delocalised electrons → conducts); graphene (single layer); $\ce{SiO2}$ (each Si bonded to 4 O). Fullerene $\ce{C60}$ is molecular, not a network.
[f] Retardation factor in chromatography :: $R_F = \dfrac{\text{distance moved by the spot}}{\text{distance moved by the solvent front}}$
[f] Formal charge (AHL) :: $FC = V - \left(L + \tfrac12 S\right)$ — $V$ valence electrons, $L$ lone-pair electrons, $S$ shared electrons. The preferred structure has formal charges closest to zero.
[k] Sigma and pi bonds (AHL) :: σ: head-on overlap, electron density on the internuclear axis. π: sideways overlap of p orbitals, density above and below the axis. Single = 1σ; double = 1σ + 1π; triple = 1σ + 2π.
[k] Hybridisation (AHL) :: 4 electron domains → $sp^3$; 3 → $sp^2$; 2 → $sp$.
[d] Resonance (AHL) :: When more than one valid Lewis structure can be drawn, the actual structure is a hybrid with delocalised electrons (e.g. benzene, $\ce{CO3^2-}$, $\ce{O3}$); bond lengths are intermediate.

# S2.3
[d] Metallic bonding :: The electrostatic attraction between a lattice of positive metal ions and a sea of delocalised electrons.
[k] Why metals conduct electricity and are malleable :: Delocalised electrons can move through the structure carrying charge; layers of ions can slide without breaking the bonding because the electron sea is non-directional.
[k] Factors affecting the strength of metallic bonding :: Higher ionic charge (more delocalised electrons) and smaller ionic radius → stronger bonding → higher melting point.
[k] Melting points of group 1 metals down the group :: Decrease, because the ionic radius increases and attraction to the delocalised electrons weakens.
[k] Why transition metals have high melting points (AHL) :: Both 3d and 4s electrons can delocalise, giving more delocalised electrons and stronger metallic bonding.

# S2.4
[k] Bonding triangle (van Arkel–Ketelaar) :: Position depends on average electronegativity (horizontal) and electronegativity difference (vertical). Corners: ionic (large difference), metallic (low average), covalent (high average, small difference).
[d] Alloy :: A mixture of a metal with other elements (usually metals). Different-sized atoms disrupt the regular layers, so they slide less easily → harder and stronger than the pure metal.
[d] Addition polymer :: Formed when monomers containing a C=C double bond join without loss of any atoms (e.g. ethene → poly(ethene)).
[d] Condensation polymer (AHL) :: Formed when monomers with two functional groups join with the loss of a small molecule such as water or HCl (e.g. polyesters, polyamides).
[k] Environmental issues of plastics :: Not biodegradable (strong C–C/C–H bonds); persist in landfills and oceans (microplastics); combustion may release toxic gases; recycling requires sorting by type.
[d] Repeat unit :: The smallest section of a polymer chain that, repeated, gives the whole chain.

# S3.1
[k] Periods, groups and blocks :: Period number = number of occupied main energy levels. Group number relates to outer electrons. Blocks (s, p, d, f) show which sublevel is being filled.
[k] Atomic radius trends :: Decreases across a period (nuclear charge increases, shielding roughly constant). Increases down a group (more occupied energy levels).
[k] Ionic radius vs atomic radius :: Cations are smaller than their atoms (lose an outer level / less repulsion). Anions are larger (extra electron–electron repulsion, same nuclear charge).
[k] Electronegativity and IE trends :: Both increase across a period and decrease down a group.
[d] Electron affinity :: The energy change when one mole of electrons is added to one mole of gaseous atoms: $\ce{X(g) + e- -> X-(g)}$ (first EA usually exothermic).
[k] Acid–base nature of oxides :: Metal oxides are basic (e.g. $\ce{Na2O + H2O -> 2NaOH}$). Non-metal oxides are acidic (e.g. $\ce{SO3 + H2O -> H2SO4}$). $\ce{Al2O3}$ is amphoteric.
[k] Causes of acid deposition and ocean acidification :: Nitrogen and sulfur oxides form $\ce{HNO3}$/$\ce{H2SO4}$ in rain. Extra $\ce{CO2}$ dissolves in oceans: $\ce{CO2 + H2O <=> H2CO3}$, lowering pH.
[d] Oxidation state :: The charge an atom would have if all its bonds were ionic. Elements = 0; sum in a compound = 0; sum in an ion = ion's charge.
[d] Transition element (AHL) :: An element whose atom, or one of its common ions, has an incomplete d sublevel. Zinc is not one ($\ce{Zn^2+}$ is $3d^{10}$).
[k] Characteristic properties of transition elements (AHL) :: Variable oxidation states, coloured compounds, complex ion formation, catalytic activity, magnetic properties.
[k] Why are transition-metal complexes coloured? (AHL) :: Ligands split the d orbitals into two energy sets. An electron absorbs visible light to jump between them; the complementary colour is observed.
[d] Ligand (AHL) :: A species with a lone pair that forms a coordination bond to a central metal ion (a Lewis base), e.g. $\ce{H2O}$, $\ce{NH3}$, $\ce{Cl-}$, $\ce{CN-}$.

# S3.2
[x] Functional groups (1) :: Hydroxyl –OH (alcohol) ¶ Carbonyl C=O (aldehyde –CHO at chain end; ketone in chain) ¶ Carboxyl –COOH (carboxylic acid)
[x] Functional groups (2) :: Ester –COO– ¶ Ether –O– ¶ Amino –NH₂ (amine) ¶ Amido –CONH– (amide) ¶ Halogeno –X (halogenoalkane) ¶ Phenyl $\ce{-C6H5}$
[d] Homologous series :: A family of compounds with the same functional group and general formula, where successive members differ by $\ce{CH2}$, with similar chemical properties and gradually changing physical properties.
[k] Boiling point trend in a homologous series :: Increases with chain length (stronger London forces from more electrons/contact area).
[d] Structural isomers :: Compounds with the same molecular formula but different structural formulas (chain, position or functional-group isomers).
[k] Primary, secondary and tertiary alcohols :: Classified by the number of carbon atoms attached to the carbon bearing the –OH group: 1 → primary, 2 → secondary, 3 → tertiary.
[d] Stereoisomers: cis–trans (AHL) :: Same structural formula, different spatial arrangement. Arise from restricted rotation about C=C (or in rings) when each carbon has two different groups.
[d] Optical isomers / chirality (AHL) :: A chiral carbon has four different groups attached. The two enantiomers are non-superimposable mirror images that rotate plane-polarised light in opposite directions; a racemic mixture (50:50) has no net rotation.
[f] Index of hydrogen deficiency (IHD) :: $\text{IHD} = \dfrac{2C + 2 + N - H - X}{2}$ — each ring or π bond counts as 1.
[x] Key IR absorptions :: O–H (alcohols) 3200–3600 cm$^{-1}$ broad; O–H (acids) 2500–3000 broad; C=O 1700–1750; C–H 2850–3090; C=C 1620–1680.
[k] Information from a ¹H NMR spectrum :: Number of signals = number of hydrogen environments; chemical shift indicates the environment; integration ratio gives relative numbers of H; (AHL) splitting by the $n + 1$ rule gives neighbouring H count.
[k] Why TMS is the NMR reference standard (AHL) :: Tetramethylsilane gives one strong signal (12 equivalent H) at δ = 0, upfield of most signals; it is inert and volatile.
[k] Mass spectrometry of organic compounds :: The molecular ion peak gives $M_r$; fragment peaks indicate structure (e.g. $m/z$ 15 = $\ce{CH3+}$, 29 = $\ce{C2H5+}$ or $\ce{CHO+}$, 45 = $\ce{COOH+}$).
[k] IUPAC naming: chain-length stems :: meth- (1), eth- (2), prop- (3), but- (4), pent- (5), hex- (6).
`;
