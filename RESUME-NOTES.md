# Where the curriculum-gap audit got to

Paused mid-way at the user's request (usage window). Everything committed here is validated:
`node scripts/check-topics.js` passes for every topic and `scripts/browser-test.js` is clean.

## Landed (validated, in the app)

| Topic | What was added |
|---|---|
| `expanding.js` | factorising (take out the highest common factor), the reverse of expanding |
| `percentages.js` | simple interest, percentage profit / loss |
| `ratio.js` | the unitary method (find one first, then multiply) |
| `volume.js` | surface area of cubes and cuboids |

## Still to do — the gap list, by strand

**Geometry** (`angles.js`, `shapes.js`, `transformations.js`)
- complementary (90°) and supplementary (180°) angles — the parent asked for this one first
- naming an angle by size, reading a protractor, polygon angle sum, exterior angle, compass bearings
- rotational symmetry, congruent vs similar, plan / front / side views, circle vocabulary
- tessellation, describing a transformation fully, combining two transformations

**Statistics & probability** (`averages.js`, `data-displays.js`, `probability.js`)
- pie charts, line graphs (time series), scatter plots, choosing the right display
- outliers, which average suits a situation, comparing two data sets with mean and range
- tree diagrams for two events, theoretical vs experimental probability, fair / unfair games

**Measurement** (`units.js`, `perimeter-area.js`, `circles.js`, `time.js`, rest of `volume.js`)
- trapezium area properly covered (formula exists, check the generator really uses it)
- irregular / composite shapes for BOTH area and perimeter, including working out unlabelled sides
- shaded area: big shape minus the shape inside it (rectangle in rectangle, circle in square, border paths)
- missing side from a given area, rhombus / kite area, area by counting squares
- reading a scale (ruler, jug, scales, thermometer), choosing a sensible unit, accuracy
- circle parts vocabulary, semicircle perimeter (curve + diameter), diameter from area
- surface area of a triangular prism; durations across a day, calendars and leap years

**Algebra** (`equations.js`, `patterns.js`, `expressions.js`, `coordinates.js`)
- checking a solution by substitution, simple inequalities incl. a number line
- decreasing and non-linear sequences, term-to-term vs position-to-term named explicitly
- 12x ÷ 3 = 4x, the difference between 2x and x², two-step descriptions
- gradient informally, horizontal and vertical lines (y = 3, x = −2), collinear points

**Number** (`place-value-rounding.js`, `integers.js`, `factors-primes.js`, `decimals-ops.js`, `rates.js`, others)
- exchange rates / currency conversion (rate always given in the question)
- significant figures, divisibility rules, square and triangular numbers
- ordering integers, BEDMAS with negatives, recurring decimal notation, rounding after division

**New topic not yet written**: `money.js` — "Money & budgeting" (strand number, order 16).
Change from a note incl. NZ 10c cash rounding, splitting a bill, wages and time-and-a-half,
a budget table (income − expenses), saving towards a goal, reading a receipt or bank statement,
applying discount and GST, and comparing two ways to pay. Needs a `<script>` tag in index.html
after `estimation.js`.

## How to restart the work
Five audit agents plus one money-topic agent were running from these briefs:
`scratchpad/agent-audit.md` (shared), plus per-strand instructions in the conversation.
Re-launch them with the gap lists above; each must finish with the harness, the render check
(`scripts/render-learn.js`) and `scripts/browser-test.js` all clean.
