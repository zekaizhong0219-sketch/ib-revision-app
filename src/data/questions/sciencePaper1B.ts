import { parseStructured } from '../dsl';

/**
 * Original Paper 1B-style data-based questions (Physics and Chemistry, first assessment 2025):
 * experimental data in a table, data processing, uncertainties and evaluation.
 * The data sets were generated from accepted values with realistic scatter; answers verified in Python.
 */
export const physicsPaper1B = parseStructured(
  'physics',
  String.raw`
@struct C.1 style=P1B
Q: A student investigates how the period $T$ of a simple pendulum depends on its length $L$. For each length the time for 10 oscillations is measured with a stopwatch (uncertainty $\pm0.2$ s) and divided by 10.
| $L$ / m ($\pm0.001$) | 0.200 | 0.400 | 0.600 | 0.800 | 1.000 |
|---|---|---|---|---|---|
| $T$ / s ($\pm0.02$) | 0.90 | 1.27 | 1.55 | 1.80 | 2.01 |
a) [1] Explain why the time for 10 oscillations was measured rather than for one.
M: Reduces the percentage (relative) uncertainty in $T$ due to reaction time, which is spread over 10 oscillations (R1)
b) [2] Calculate the percentage uncertainty in $T$ for $L = 0.200$ m.
= 2.2 rel=0.1 unit=%
M: $\dfrac{0.02}{0.90} \times 100$ (M1) ¶ $= 2.2\%$ (A1)
c) [1] State the percentage uncertainty in $T^2$ for $L = 0.200$ m.
= 4.4 rel=0.1 unit=%
M: Twice the percentage uncertainty in $T$: $4.4\%$ (A1)
d) [2] Theory predicts $T = 2\pi\sqrt{L/g}$. State the quantities you would plot to obtain a straight line through the origin, and give the gradient in terms of $g$.
M: $T^2$ against $L$ (A1) ¶ gradient $= \dfrac{4\pi^2}{g}$ (A1)
e) [3] Use the data to determine $g$.
= 9.8 rel=0.03 unit=m s^-2
M: $T^2$ values: $0.81, 1.61, 2.40, 3.24, 4.04$ s² (A1) ¶ gradient $\approx 4.04$ s² m⁻¹ (from a line of best fit, not one point) (M1) ¶ $g = 4\pi^2/4.04 \approx 9.8$ m s⁻² (A1)
f) [2] The student measured $L$ to the top of the bob instead of its centre. Describe the effect on the graph and on the value of $g$.
M: Every $L$ is too small by the same amount, so the line is shifted and has a non-zero intercept (A1) ¶ The gradient, and therefore $g$, is unaffected (R1)
S: Data-processing questions reward showing the processed values, a best-fit gradient (not two data points) and correct propagation of uncertainties.

@struct B.1 style=P1B
Q: An aluminium block of mass $1.00$ kg is heated by a $50.0$ W electrical heater placed in a hole in the block. The temperature $\theta$ is recorded every minute with a digital thermometer of resolution $0.1$ °C.
| $t$ / s | 0 | 60 | 120 | 180 | 240 | 300 |
|---|---|---|---|---|---|---|
| $\theta$ / °C | 20.0 | 23.1 | 26.3 | 29.4 | 32.5 | 35.5 |
a) [2] Determine the rate of temperature rise.
= 0.0517 rel=0.03 unit=K s^-1
M: gradient $= \dfrac{35.5 - 20.0}{300}$ (or line of best fit) (M1) ¶ $= 0.0517$ K s⁻¹ (A1)
b) [2] Calculate the specific heat capacity of aluminium from these data.
= 967 rel=0.03 unit=J kg^-1 K^-1
M: $P = mc\,\dfrac{\Delta\theta}{\Delta t} \Rightarrow c = \dfrac{50.0}{1.00 \times 0.0517}$ (M1) ¶ $\approx 970$ J kg⁻¹ K⁻¹ (A1)
c) [2] The accepted value is about 900 J kg⁻¹ K⁻¹. Explain why the experimental value is larger.
M: Some of the heater's energy is lost to the surroundings (and heats the heater/thermometer) (R1) ¶ so the temperature rises more slowly than if all energy heated the block, and $c = P/(m\cdot\text{rate})$ comes out too large (R1)
d) [2] Calculate the percentage uncertainty in the temperature rise from 0 to 300 s.
= 1.3 rel=0.1 unit=%
M: Two readings, each $\pm0.1$ °C: $\pm0.2$ °C on $15.5$ °C (M1) ¶ $1.3\%$ (A1)
e) [2] Suggest two improvements to the method.
M: Insulate the block (e.g. lagging) (A1) ¶ Use oil/thermal paste in the holes for good thermal contact, or start below room temperature and finish the same amount above it (A1)
S: In evaluation questions, link each error to its direction of effect on the final value.

@struct B.5 style=P1B
Q: To find the resistivity of a metal wire, a student measures its resistance $R$ for different lengths $L$. The diameter of the wire is $0.32 \pm 0.01$ mm.
| $L$ / m | 0.200 | 0.400 | 0.600 | 0.800 | 1.000 |
|---|---|---|---|---|---|
| $R$ / Ω | 1.24 | 2.41 | 3.68 | 4.86 | 6.10 |
a) [1] Identify the independent variable.
~ length | the length | L | length of the wire | length of wire
M: The length $L$ of the wire (A1)
b) [2] Determine the gradient of a graph of $R$ against $L$.
= 6.09 rel=0.03 unit=Ω m^-1
M: Line of best fit through the data (M1) ¶ gradient $\approx 6.1$ Ω m⁻¹ (A1)
c) [3] Calculate the resistivity of the metal.
= 4.9e-7 rel=0.04 unit=Ω m
M: $R = \dfrac{\rho L}{A} \Rightarrow \rho = \text{gradient} \times A$ (M1) ¶ $A = \pi(0.16 \times 10^{-3})^2 = 8.04 \times 10^{-8}$ m² (A1) ¶ $\rho \approx 4.9 \times 10^{-7}$ Ω m (A1)
d) [2] Calculate the percentage uncertainty in the cross-sectional area.
= 6.25 rel=0.1 unit=%
M: $\Delta d/d = 0.01/0.32 = 3.1\%$ (M1) ¶ $A \propto d^2$, so $6.3\%$ (A1)
e) [2] Explain why the gradient method is better than calculating $\rho$ from a single reading.
M: Averages out random errors across several readings (R1) ¶ A constant systematic error (e.g. contact resistance) appears as an intercept and does not affect the gradient (R1)
S: Notice that the diameter's uncertainty dominates: improving it (micrometer, several measurements along the wire) is the most effective improvement.

@struct E.3 style=P1B
Q: A Geiger–Müller tube measures the count rate from a radioactive sample. With no sample present, the background count rate is $20$ counts per minute.
| $t$ / min | 0 | 2 | 4 | 6 | 8 | 10 |
|---|---|---|---|---|---|---|
| measured count rate / min⁻¹ | 820 | 524 | 338 | 220 | 146 | 99 |
a) [1] Calculate the corrected count rate at $t = 6$ min.
= 200 abs=0.5 unit=min^-1
M: $220 - 20 = 200$ min⁻¹ (A1)
b) [3] Determine the half-life of the sample.
= 3.0 rel=0.05 unit=min
M: Corrected values $800, 504, 318, 200, 126, 79$ (M1) ¶ Falls from 800 to 400 in about 3 min (or gradient of $\ln$ graph) (M1) ¶ $T_{1/2} \approx 3.0$ min (A1)
c) [2] Calculate the decay constant.
= 0.231 rel=0.05 unit=min^-1
M: $\lambda = \dfrac{\ln2}{T_{1/2}}$ (M1) ¶ $= 0.23$ min⁻¹ (A1)
d) [2] Explain why the percentage uncertainty of the readings increases with time.
M: Radioactive decay is random; the uncertainty in a count $N$ is about $\sqrt N$ (R1) ¶ As $N$ decreases, $\sqrt N/N$ increases (R1)
e) [2] State what a graph of $\ln(\text{corrected count rate})$ against $t$ would look like, and what its gradient represents.
M: Straight line with negative gradient (A1) ¶ gradient $= -\lambda$ (A1)
S: Always subtract background before any further processing.
`,
);

export const chemistryPaper1B = parseStructured(
  'chemistry',
  String.raw`
@struct R2.2 style=P1B
Q: $50.0$ cm³ of aqueous hydrogen peroxide decomposes with a manganese(IV) oxide catalyst: $\ce{2H2O2(aq) -> 2H2O(l) + O2(g)}$. The oxygen is collected in a gas syringe (resolution $1$ cm³).
| $t$ / s | 0 | 20 | 40 | 60 | 80 | 100 | 120 |
|---|---|---|---|---|---|---|---|
| $V(\ce{O2})$ / cm³ | 0.0 | 17.5 | 30.7 | 40.5 | 47.9 | 53.4 | 57.6 |
After a long time the volume reached $70.0$ cm³.
a) [2] Calculate the average rate of oxygen production over the first 40 s.
= 0.77 rel=0.03 unit=cm^3 s^-1
M: $\dfrac{30.7}{40}$ (M1) ¶ $= 0.77$ cm³ s⁻¹ (A1)
b) [2] Explain, in terms of collision theory, why the rate decreases with time.
M: The concentration of $\ce{H2O2}$ falls as it is used up (R1) ¶ so there are fewer collisions per unit time with the catalyst surface (R1)
c) [3] The molar volume of a gas under the conditions of the experiment is $24.0$ dm³ mol⁻¹. Calculate the initial concentration of hydrogen peroxide.
= 0.117 rel=0.03 unit=mol dm^-3
M: $n(\ce{O2}) = 0.0700/24.0 = 2.92 \times 10^{-3}$ mol (M1) ¶ $n(\ce{H2O2}) = 2 \times n(\ce{O2}) = 5.83 \times 10^{-3}$ mol (M1) ¶ $c = 5.83 \times 10^{-3}/0.0500 = 0.117$ mol dm⁻³ (A1)
d) [2] Suggest one systematic error in this method and its effect on the calculated concentration.
M: Gas escapes before the bung is inserted / the syringe plunger sticks (A1) ¶ Measured volume too small, so the concentration is too low (A1)
e) [1] Suggest how the initial rate could be determined more accurately than in (a).
M: Draw a tangent to the volume–time curve at $t = 0$ (A1)
S: An average rate over an interval underestimates the initial rate when the curve flattens.

@struct R1.1 style=P1B
Q: $50.0$ cm³ of $1.00$ mol dm⁻³ $\ce{HCl}$ and $50.0$ cm³ of $1.00$ mol dm⁻³ $\ce{NaOH}$, both at $21.0$ °C, are mixed in a polystyrene cup at $t = 0$.
| $t$ / s | 30 | 60 | 90 | 120 | 150 | 180 |
|---|---|---|---|---|---|---|
| $T$ / °C | 26.9 | 27.2 | 27.1 | 27.0 | 26.9 | 26.8 |
a) [2] Explain why the cooling part of the graph is extrapolated back to $t = 0$.
M: Heat is lost to the surroundings while the mixture warms up (R1) ¶ Extrapolating estimates the maximum temperature with no heat loss (R1)
b) [1] By extrapolating the cooling line back to $t = 0$, determine the temperature change.
= 6.4 abs=0.15 unit=K
M: Cooling at $0.1$ K per 30 s from 27.2 °C at 60 s gives 27.4 °C at $t = 0$; $\Delta T = 6.4$ K (A1)
c) [3] Calculate the enthalpy change of neutralisation, in kJ mol⁻¹ (include the sign). Use $c = 4.18$ J g⁻¹ K⁻¹.
= -53.5 rel=0.03 unit=kJ mol^-1
M: $q = 100 \times 4.18 \times 6.4 = 2.68 \times 10^3$ J (M1) ¶ $n(\ce{H2O}) = 0.0500$ mol (M1) ¶ $\Delta H = -53.5$ kJ mol⁻¹ (negative: exothermic) (A1)
d) [2] The literature value is $-57.1$ kJ mol⁻¹. Calculate the percentage error.
= 6.3 rel=0.1 unit=%
M: $\dfrac{57.1 - 53.5}{57.1} \times 100$ (M1) ¶ $= 6.3\%$ (A1)
e) [2] State two assumptions made in the calculation.
M: Solution density 1.00 g cm⁻³ and specific heat capacity equal to water's (A1) ¶ No heat absorbed by the cup or thermometer / no heat loss after extrapolation (A1)
S: Compare percentage error with percentage uncertainty: if the error is larger, systematic errors (heat loss) dominate.

@struct R2.1 style=P1B
Q: A $25.00$ cm³ sample of sodium carbonate solution is titrated with $0.100$ mol dm⁻³ hydrochloric acid using methyl orange: $\ce{Na2CO3 + 2HCl -> 2NaCl + H2O + CO2}$. Each burette reading has an uncertainty of $\pm0.05$ cm³.
| Titration | rough | 1 | 2 | 3 |
|---|---|---|---|---|
| titre / cm³ | 24.60 | 24.15 | 24.25 | 24.20 |
a) [1] Suggest why the rough titre is not used.
M: The end point was overshot because the acid was added quickly to find its approximate position (R1)
b) [1] Calculate the mean titre.
= 24.20 abs=0.02 unit=cm^3
M: $(24.15 + 24.25 + 24.20)/3 = 24.20$ cm³ (A1)
c) [3] Calculate the concentration of the sodium carbonate solution.
= 0.0484 rel=0.02 unit=mol dm^-3
M: $n(\ce{HCl}) = 0.02420 \times 0.100 = 2.420 \times 10^{-3}$ mol (M1) ¶ $n(\ce{Na2CO3}) = 1.210 \times 10^{-3}$ mol (1 : 2 ratio) (M1) ¶ $c = 1.210 \times 10^{-3}/0.02500 = 0.0484$ mol dm⁻³ (A1)
d) [2] Calculate the percentage uncertainty in the mean titre.
= 0.41 rel=0.15 unit=%
M: Two readings: $\pm0.10$ cm³ (M1) ¶ $0.10/24.20 \times 100 = 0.41\%$ (A1)
e) [2] The pipette was rinsed with distilled water, not with the carbonate solution, before use. Predict the effect on the calculated concentration.
M: The sample is diluted, so fewer moles of carbonate are delivered and the titre is smaller (R1) ¶ The calculated concentration is too low (A1)
S: State the direction of the effect and the reason; "inaccurate" alone earns nothing.

@struct S1.5 style=P1B
Q: A fixed mass of air at $298$ K is compressed slowly in a sealed syringe connected to a pressure sensor.
| $V$ / cm³ | 50.0 | 40.0 | 30.0 | 25.0 | 20.0 |
|---|---|---|---|---|---|
| $p$ / kPa | 101 | 126 | 168 | 202 | 252 |
a) [2] Show that the data are consistent with Boyle's law.
M: $pV$ is constant within experimental uncertainty (M1) ¶ $pV \approx 5.04 \times 10^3$ kPa cm³ for every row (A1)
b) [1] State the graph that would give a straight line through the origin.
M: $p$ against $1/V$ (A1)
c) [3] Calculate the amount of air in the syringe. ($R = 8.31$ J K⁻¹ mol⁻¹)
= 0.00204 rel=0.03 unit=mol
M: $pV = 5.04 \times 10^3$ kPa cm³ $= 5.04$ J (convert: $10^3$ Pa × $10^{-6}$ m³) (M1) ¶ $n = \dfrac{pV}{RT} = \dfrac{5.04}{8.31 \times 298}$ (M1) ¶ $= 2.04 \times 10^{-3}$ mol (A1)
d) [2] Explain why the student waited before taking each reading.
M: Compressing the gas does work on it and raises its temperature (R1) ¶ Waiting lets it return to 298 K so the temperature is constant (R1)
e) [2] Explain why air behaves almost ideally under these conditions.
M: Low pressure: molecules are far apart, so their volume is negligible (R1) ¶ and intermolecular forces are negligible at room temperature (R1)
S: Unit conversion (kPa cm³ = mJ) is the most common slip in gas-law calculations.
`,
);
