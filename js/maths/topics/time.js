/* Topic: Time — 12/24-hour clocks, durations, timetables, time zones, days and weeks. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const numAns = (value, unit) => Number.isInteger(value) ? { type: 'number', value, unit } : { type: 'number', value, unit, tolerance: 0.001 };
  const pad = (n) => String(n).padStart(2, '0');
  const wrap = (m) => ((m % 1440) + 1440) % 1440;
  /** minutes since midnight -> "2:30 pm" */
  const f12 = (m) => { m = wrap(m); const h = Math.floor(m / 60), mm = m % 60; const h12 = h % 12 || 12; return `${h12}:${pad(mm)} ${h < 12 ? 'am' : 'pm'}`; };
  /** minutes since midnight -> "14:30" */
  const f24 = (m) => { m = wrap(m); return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
  const accept12 = (m) => {
    m = wrap(m); const h = Math.floor(m / 60), mm = m % 60, h12 = h % 12 || 12, ap = h < 12 ? 'am' : 'pm';
    const list = [`${h12}:${pad(mm)}${ap}`, `${h12}.${pad(mm)} ${ap}`, `${h12}.${pad(mm)}${ap}`, `${h12}:${pad(mm)} ${ap[0]}.m.`, `${h12}:${pad(mm)} ${ap[0]}.m`, `${h12} ${pad(mm)} ${ap}`, `${h12}${pad(mm)} ${ap}`, `${h12}${pad(mm)}${ap}`];
    if (mm === 0) list.push(`${h12} ${ap}`, `${h12}${ap}`, `${h12} o'clock ${ap}`, `${h12}:00 ${ap}`);
    return list;
  };
  const accept24 = (m) => {
    m = wrap(m); const h = Math.floor(m / 60), mm = m % 60;
    return [`${pad(h)}${pad(mm)}`, `${pad(h)}.${pad(mm)}`, `${pad(h)} ${pad(mm)}`, `${h}:${pad(mm)}`, `${h}${pad(mm)}`, `${h}.${pad(mm)}`, `${pad(h)}:${pad(mm)} hours`, `${pad(h)}${pad(mm)} hours`, `${pad(h)}:${pad(mm)}h`, `${pad(h)}${pad(mm)}h`];
  };
  /** duration text answer "2 h 35 min" with generous accept */
  const hmAns = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    const value = m === 0 ? `${h} h` : `${h} h ${m} min`;
    const accept = [`${h} h ${m} min`, `${h} h`, `${h}h`, `${h} hours`, `${h} hour`, `${h} hrs`, `${h}hrs`, `${h} hr`, `${h} hours 0 minutes`, `${h}:00`, `${h}h ${m}min`, `${h}h${m}min`, `${h}:${pad(m)}`, `${h} hours ${m} minutes`, `${h} hour ${m} minutes`, `${h} hours ${m} mins`, `${h} hr ${m} min`, `${h} hrs ${m} mins`, `${h} hrs ${m} min`, `${h} hours ${m} min`, `${h} h ${m} m`, `${h}h ${m}m`, `${h}h${m}m`, `${h} hours and ${m} minutes`, `${h} hour and ${m} minutes`, `${h}h${m}`, `${h} ${m}`, `${h}hrs ${m}mins`, `${h}hr ${m}min`, `${h} hour ${m} minute`, `${h}hours ${m}minutes`];
    return { type: 'text', value, accept, placeholder: 'e.g. 2 h 35 min' };
  };
  const hmText = (mins) => { const h = Math.floor(mins / 60), m = mins % 60; return h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${m} min`; };
  /** choice answer built around a correct time (minutes since midnight) */
  const choiceTime = (correct, fmt = f12) => {
    const deltas = R.shuffle([60, -60, 30, -30, 15, -15, 10, -10, 720, 120, -120, 5, -5, 20, -20]);
    const set = new Set([wrap(correct)]);
    const opts = [wrap(correct)];
    for (const d of deltas) { if (opts.length >= 4) break; const v = wrap(correct + d); if (!set.has(v)) { set.add(v); opts.push(v); } }
    const shuffled = R.shuffle(opts);
    return { type: 'choice', value: shuffled.indexOf(wrap(correct)), choices: shuffled.map(fmt) };
  };
  const randTime = (hLo, hHi, step = 5) => R.int(hLo, hHi) * 60 + R.step(0, 55, step);

  /** duration working: count on from start to end */
  function durationWorking(start, end) {
    const steps = [];
    let cur = start;
    const toHour = (60 - (cur % 60)) % 60;
    if (toHour && cur + toHour <= end) { steps.push(`${f12(cur)} → ${f12(cur + toHour)} is ${toHour} min.`); cur += toHour; }
    const hours = Math.floor((end - cur) / 60);
    if (hours) { steps.push(`${f12(cur)} → ${f12(cur + hours * 60)} is ${hours} h.`); cur += hours * 60; }
    if (end - cur) { steps.push(`${f12(cur)} → ${f12(end)} is ${end - cur} min.`); }
    return steps;
  }
  function durationQ(start, end, asText, what) {
    const mins = end - start;
    const h = Math.floor(mins / 60), m = mins % 60;
    const total = `Total: ${h} h ${m} min` + (asText ? '' : ` = ${h} × 60 + ${m} = ${mins} min`);
    return {
      prompt: what || `How long is it from ${f12(start)} to ${f12(end)}? Give your answer in ${asText ? 'hours and minutes' : 'minutes'}.`,
      answer: asText ? hmAns(mins) : numAns(mins, 'min'),
      hint: 'Count on from the start time: first up to the next full hour, then the whole hours, then the leftover minutes.',
      working: durationWorking(start, end).concat([`${total}.`, `Answer: <b>${asText ? `${h} h ${m} min` : `${mins} min`}</b>.`]),
      finalAnswer: asText ? `${h} h ${m} min` : `${mins} min`, skill: 'duration',
    };
  }

  /** a duration that runs past midnight into the next day: count on to midnight, then on again */
  function overnightQ(level, promptText) {
    const start = R.int(19, 23) * 60 + R.step(0, 55, 5);
    const end = R.int(4, 9) * 60 + R.step(0, 55, 5);
    const toMid = 1440 - start, mins = toMid + end;
    const asText = R.chance(0.6);
    const h = Math.floor(mins / 60), m = mins % 60;
    return {
      prompt: promptText || `How long is it from ${f12(start)} one evening to ${f12(end)} the next morning? Give your answer in ${asText ? 'hours and minutes' : 'minutes'}.`,
      answer: asText ? hmAns(mins) : numAns(mins, 'min'),
      hint: 'Split it at <b>midnight</b>. First work out how long from the start time to midnight, then from midnight to the finish time, then add the two.',
      working: [
        `Split the time at midnight — that is the day boundary.`,
        `${f12(start)} → 12 midnight is ${hmText(toMid)}.`,
        `12 midnight → ${f12(end)} is ${hmText(end)}.`,
        `Add the two parts: ${hmText(toMid)} + ${hmText(end)} = ${hmText(mins)}${asText ? '' : ` = ${mins} min`}.`,
        `Answer: <b>${asText ? hmText(mins) : mins + ' min'}</b>.`,
      ],
      finalAnswer: asText ? hmText(mins) : `${mins} min`, skill: 'duration',
    };
  }

  const MONTHS = [['January', 31], ['February', 28], ['March', 31], ['April', 30], ['May', 31], ['June', 30], ['July', 31], ['August', 31], ['September', 30], ['October', 31], ['November', 30], ['December', 31]];
  const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  /** calendars: days in a month, leap years, and how many days between two dates */
  function calendarQ(level) {
    const t = level === 1 ? R.pick(['inMonth', 'inMonth', 'between1'])
      : level === 2 ? R.pick(['inMonth', 'leap', 'between1', 'between1', 'feb'])
      : R.pick(['between2', 'between2', 'leap', 'leapCentury', 'yearDays', 'between1']);
    if (t === 'inMonth') {
      const i = R.int(0, 11);
      const nm = MONTHS[i][0], d = MONTHS[i][1];
      if (i === 1) {
        return {
          prompt: 'How many days are there in February in a normal (non-leap) year?',
          answer: numAns(28, 'days'),
          hint: 'February is the odd one out: 28 days, or 29 in a leap year.',
          working: ['"30 days has September, April, June and November. All the rest have 31 — <b>except February</b>."', 'February has <b>28</b> days in a normal year (29 in a leap year).', '<b>28 days</b>.'],
          finalAnswer: '28 days', skill: 'calendar',
        };
      }
      return {
        prompt: `How many days are there in ${nm}?`,
        answer: numAns(d, 'days'),
        hint: '"30 days has September, April, June and November. All the rest have 31 — except February."',
        working: [
          '"30 days has <b>September, April, June</b> and <b>November</b>. All the rest have 31 — except February."',
          d === 30 ? `${nm} is in the 30-day list.` : `${nm} is not in the 30-day list and it is not February, so it has 31 days.`,
          `<b>${d} days</b>.`,
        ],
        finalAnswer: `${d} days`, skill: 'calendar',
      };
    }
    if (t === 'feb') {
      const y = R.pick([2024, 2028, 2032, 2020, 2023, 2025, 2026, 2027]);
      const d = isLeap(y) ? 29 : 28;
      return {
        prompt: `How many days are there in February ${y}?`,
        answer: numAns(d, 'days'),
        hint: 'February has 29 days in a leap year and 28 otherwise. A year is a leap year if it divides exactly by 4.',
        working: [`Is ${y} a leap year? Divide by 4: ${y} ÷ 4 = ${N.fmt(y / 4)}${isLeap(y) ? ', which is a whole number, so yes' : ', which is not a whole number, so no'}.`, `So February ${y} has <b>${d} days</b>.`],
        finalAnswer: `${d} days`, skill: 'calendar',
      };
    }
    if (t === 'leap') {
      const y = R.pick([2024, 2025, 2026, 2027, 2028, 2030, 2032, 2019, 2020, 2021, 2036, 2042]);
      const leap = isLeap(y);
      const choices = ['Yes', 'No'];
      return {
        prompt: `Is ${y} a leap year?`,
        answer: { type: 'choice', value: leap ? 0 : 1, choices },
        hint: 'A leap year divides exactly by 4.',
        working: [`Leap years divide exactly by <b>4</b>.`, `${y} ÷ 4 = ${N.fmt(y / 4)}${leap ? ' — a whole number.' : ', which is not a whole number.'}`, `So ${y} is <b>${leap ? '' : 'not '}a leap year</b>${leap ? ' (February has 29 days)' : ''}.`],
        finalAnswer: leap ? 'Yes' : 'No', skill: 'calendar',
      };
    }
    if (t === 'leapCentury') {
      const y = R.pick([1900, 2000, 2100, 2400, 1800]);
      const leap = isLeap(y);
      return {
        prompt: `Is ${y} a leap year? (Careful: it is the start of a century.)`,
        answer: { type: 'choice', value: leap ? 0 : 1, choices: ['Yes', 'No'] },
        hint: 'A century year (ending in 00) is only a leap year if it divides exactly by 400.',
        working: [
          `${y} divides by 4, so it looks like a leap year.`,
          `But it is a <b>century</b> year (ends in 00), so it must also divide by <b>400</b>.`,
          `${y} ÷ 400 = ${N.fmt(y / 400)}${leap ? ' — a whole number, so it IS a leap year.' : ', which is not a whole number, so it is NOT a leap year.'}`,
          `Answer: <b>${leap ? 'Yes' : 'No'}</b>.`,
        ],
        finalAnswer: leap ? 'Yes' : 'No', skill: 'calendar',
      };
    }
    if (t === 'yearDays') {
      const y = R.pick([2024, 2025, 2026, 2027, 2028, 2030]);
      const d = isLeap(y) ? 366 : 365;
      return {
        prompt: `How many days are there in the year ${y}?`,
        answer: numAns(d, 'days'),
        hint: 'A normal year has 365 days; a leap year has 366. Does the year divide exactly by 4?',
        working: [`${y} ÷ 4 = ${N.fmt(y / 4)}${isLeap(y) ? ', a whole number, so it is a leap year.' : ', not a whole number, so it is a normal year.'}`, `${isLeap(y) ? 'A leap year has 366 days (February gets an extra day).' : 'A normal year has 365 days.'}`, `<b>${d} days</b>.`],
        finalAnswer: `${d} days`, skill: 'calendar',
      };
    }
    // between1: two dates in months next to each other; between2: with a whole month in between
    const span = t === 'between2' ? 2 : 1;
    const m1 = R.int(2, 9 - span);                 // March … so February never gets in the way
    const m2 = m1 + span;
    const d1 = R.int(2, MONTHS[m1][1] - 3), d2 = R.int(2, MONTHS[m2][1] - 1);
    const left = MONTHS[m1][1] - d1;
    const middle = span === 2 ? MONTHS[m1 + 1][1] : 0;
    const total = left + middle + d2;
    return {
      prompt: `How many days are there from ${d1} ${MONTHS[m1][0]} to ${d2} ${MONTHS[m2][0]} in the same year?`,
      answer: numAns(total, 'days'),
      hint: 'Do it one month at a time: days left in the first month, then any whole months, then the days in the last month.',
      working: [
        `${MONTHS[m1][0]} has ${MONTHS[m1][1]} days, so from ${d1} ${MONTHS[m1][0]} to the end of ${MONTHS[m1][0]} is ${MONTHS[m1][1]} − ${d1} = <b>${left}</b> days.`,
      ].concat(span === 2 ? [`Then all of ${MONTHS[m1 + 1][0]}: <b>${middle}</b> days.`] : []).concat([
        `Then ${d2} days into ${MONTHS[m2][0]}: <b>${d2}</b> days.`,
        `Add them: ${left}${span === 2 ? ' + ' + middle : ''} + ${d2} = ${total}.`,
        `<b>${total} days</b>.`,
      ]),
      finalAnswer: `${total} days`, skill: 'calendar',
    };
  }

  const STOPS = ['Beach Rd', 'Kauri St', 'School', 'The Mall', 'Hospital', 'Library', 'Station', 'Marae', 'Pool', 'Town Hall'];
  function timetable(nBus = 3) {
    const stops = R.sample(STOPS, 4);
    const gaps = [R.int(6, 15), R.int(5, 18), R.int(7, 20)];
    const first = randTime(7, 9, 5), between = R.pick([20, 25, 30, 15]);
    const buses = [];
    for (let b = 0; b < nBus; b++) {
      const times = [first + b * between];
      for (const g of gaps) times.push(times[times.length - 1] + g);
      buses.push(times);
    }
    const th = 'style="padding:4px 10px;border:1px solid #C9B8F2;background:#EDE7FB"', td = 'style="padding:4px 10px;border:1px solid #C9B8F2;text-align:center"';
    let html = `<table style="border-collapse:collapse;font-size:15px;margin:0 auto 8px;font-family:system-ui,sans-serif"><tr><th ${th}>Stop</th>${buses.map((_, i) => `<th ${th}>Bus ${'ABCD'[i]}</th>`).join('')}</tr>`;
    stops.forEach((s, i) => { html += `<tr><td style="padding:4px 10px;border:1px solid #C9B8F2;text-align:left">${s}</td>${buses.map((t) => `<td ${td}>${f24(t[i])}</td>`).join('')}</tr>`; });
    html += '</table>';
    return { stops, buses, html };
  }

  function calc(level) {
    const t = level === 1 ? R.pick(['12to24', '24to12', 'hToMin', 'durEasy', 'weeks', 'hToMin', 'cal', 'cal'])
      : level === 2 ? R.pick(['12to24', '24to12', 'dur', 'dur', 'finish', 'minToH', 'hToMin2', 'start', 'dur', 'cal', 'cal', 'overnight'])
      : R.pick(['dur3', 'dur3', 'zone', 'days3', 'finish3', 'minToH3', 'zone', 'weeksText', 'cal', 'cal', 'overnight', 'overnight', 'crossMid']);
    switch (t) {
      case 'cal': return calendarQ(level);
      case 'overnight': return overnightQ(level);
      case 'crossMid': {
        const start = R.int(21, 23) * 60 + R.step(0, 55, 5);
        const dur = R.int(2, 7) * 60 + R.step(0, 55, 5);
        const end = start + dur;   // lands after midnight
        return {
          prompt: `A night bus leaves at ${f12(start)} and the journey takes ${hmText(dur)}. What time does it arrive the next morning?`,
          answer: choiceTime(end),
          hint: 'Count on to midnight first, then carry on into the new day.',
          working: [
            `${f12(start)} → 12 midnight is ${hmText(1440 - start)}.`,
            `That leaves ${hmText(dur - (1440 - start))} of the journey after midnight.`,
            `12 midnight + ${hmText(dur - (1440 - start))} = ${f12(end)}.`,
            `Arrives at <b>${f12(end)}</b>.`,
          ],
          finalAnswer: f12(end), skill: 'elapsed',
        };
      }
      case '12to24': {
        const m = level === 1 ? R.int(1, 11) * 60 + 720 + R.pick([0, 30, 15, 45]) : randTime(0, 23, 1);
        return {
          prompt: `Write ${f12(m)} in 24-hour time.`,
          answer: { type: 'text', value: f24(m), accept: accept24(m), placeholder: 'e.g. 14:30' },
          hint: m >= 720 ? 'For pm times, add 12 to the hour (12 pm stays 12).' : 'For am times the hour stays the same. Use two digits for the hour, like 07:15.',
          working: m >= 720 ? [`It is a pm time, so add 12 to the hour: ${Math.floor(m / 60) % 12 || 12} + 12 = ${Math.floor(m / 60)}${Math.floor(m / 60) === 12 ? ' (12 pm stays as 12)' : ''}.`, `Minutes stay the same.`, `<b>${f24(m)}</b>.`]
            : [`am times keep the same hour${Math.floor(m / 60) === 0 ? ', except 12 am which becomes 00' : ''}.`, `Write the hour with two digits.`, `<b>${f24(m)}</b>.`],
          finalAnswer: f24(m), skill: 'clock',
        };
      }
      case '24to12': {
        const m = level === 1 ? R.int(13, 23) * 60 + R.pick([0, 30, 15, 45]) : randTime(0, 23, 1);
        return {
          prompt: `Write ${f24(m)} in 12-hour time (with am or pm).`,
          answer: { type: 'text', value: f12(m), accept: accept12(m), placeholder: 'e.g. 2:30 pm' },
          hint: 'If the hour is 13 or more, subtract 12 and write pm. If it is less than 12, write am.',
          working: Math.floor(m / 60) >= 13 ? [`${Math.floor(m / 60)} is more than 12, so subtract 12: ${Math.floor(m / 60)} − 12 = ${Math.floor(m / 60) - 12}.`, `It is in the afternoon or evening, so it is pm.`, `<b>${f12(m)}</b>.`]
            : Math.floor(m / 60) === 12 ? [`12:xx in 24-hour time is midday, so it is 12 pm.`, `<b>${f12(m)}</b>.`]
            : [`The hour is less than 12, so it is a morning (am) time${Math.floor(m / 60) === 0 ? '; 00 means 12 am (midnight)' : ''}.`, `<b>${f12(m)}</b>.`],
          finalAnswer: f12(m), skill: 'clock',
        };
      }
      case 'hToMin': {
        const h = R.int(1, 5), extra = R.chance(0.5) ? R.pick([10, 15, 20, 30, 40, 45]) : 0;
        const mins = h * 60 + extra;
        return {
          prompt: extra ? `How many minutes are in ${h} hour${h > 1 ? 's' : ''} ${extra} minutes?` : `How many minutes are in ${h} hour${h > 1 ? 's' : ''}?`,
          answer: numAns(mins, 'min'),
          hint: '1 hour = 60 minutes.',
          working: [`${h} × 60 = ${h * 60}.`].concat(extra ? [`${h * 60} + ${extra} = ${mins}.`] : []).concat([`<b>${mins} min</b>.`]),
          finalAnswer: `${mins} min`, skill: 'convert',
        };
      }
      case 'hToMin2': {
        const h = R.pick([1.5, 2.5, 0.5, 1.25, 2.75, 0.75, 3.5, 1.75]);
        const mins = h * 60;
        return {
          prompt: `How many minutes are in ${N.fmt(h)} hours?`,
          answer: numAns(mins, 'min'),
          hint: 'Multiply the hours by 60. 0.5 h = 30 min, 0.25 h = 15 min.',
          working: [`${N.fmt(h)} × 60 = ${mins}.`, `<b>${mins} min</b>.`],
          finalAnswer: `${mins} min`, skill: 'convert',
        };
      }
      case 'minToH': {
        const h = R.pick([1.5, 2.5, 0.5, 1.25, 2.75, 0.75, 3.5, 1.75, 2.25]);
        const mins = h * 60;
        return {
          prompt: `Write ${mins} minutes as a number of hours (as a decimal).`,
          answer: numAns(h, 'h'),
          hint: 'Divide by 60. 30 min = 0.5 h, 15 min = 0.25 h, 45 min = 0.75 h.',
          working: [`${mins} ÷ 60 = ${N.fmt(h)}.`, `(${Math.floor(h)} whole hour${Math.floor(h) === 1 ? '' : 's'} and ${mins % 60} min = ${N.fmt(h)} h.)`, `<b>${N.fmt(h)} h</b>.`],
          finalAnswer: `${N.fmt(h)} h`, skill: 'convert',
        };
      }
      case 'minToH3': {
        const mins = R.pick([100, 130, 150, 200, 250, 95, 140, 170, 185, 215]);
        return {
          prompt: `Write ${mins} minutes in hours and minutes.`,
          answer: hmAns(mins),
          hint: 'How many whole 60s fit in? What is left over?',
          working: [`${mins} ÷ 60 = ${Math.floor(mins / 60)} remainder ${mins % 60}.`, `<b>${hmText(mins)}</b>.`],
          finalAnswer: hmText(mins), skill: 'convert',
        };
      }
      case 'durEasy': {
        const start = randTime(7, 18, 5);
        const dur = R.chance(0.5) ? R.int(1, 4) * 60 : R.step(5, 55 - (start % 60), 5) || 5;
        return durationQ(start, start + dur, false);
      }
      case 'dur': {
        const start = randTime(6, 12, 5), dur = R.int(1, 4) * 60 + R.step(5, 55, 5);
        return durationQ(start, start + dur, R.chance(0.3));
      }
      case 'dur3': {
        const start = randTime(8, 11, 1), dur = R.int(2, 6) * 60 + R.int(1, 59);
        return durationQ(start, start + dur, R.chance(0.4));
      }
      case 'finish': case 'finish3': {
        const start = randTime(t === 'finish' ? 7 : 8, t === 'finish' ? 18 : 11, 5), dur = t === 'finish' ? R.int(0, 2) * 60 + R.step(5, 55, 5) : R.int(1, 5) * 60 + R.int(1, 59);
        const end = start + dur;
        const use24 = R.chance(0.3);
        const fmt = use24 ? f24 : f12;
        return {
          prompt: `A lesson starts at ${fmt(start)} and lasts ${hmText(dur)}. What time does it finish?`,
          answer: choiceTime(end, fmt),
          hint: 'Add the hours first, then the minutes. If the minutes go past 60, move on to the next hour.',
          working: [`${fmt(start)} + ${Math.floor(dur / 60)} h = ${fmt(start + Math.floor(dur / 60) * 60)}.`, `${fmt(start + Math.floor(dur / 60) * 60)} + ${dur % 60} min = ${fmt(end)}.`, `Finishes at <b>${fmt(end)}</b>.`],
          finalAnswer: fmt(end), skill: 'elapsed',
        };
      }
      case 'start': {
        const end = randTime(10, 20, 5), dur = R.int(0, 2) * 60 + R.step(5, 55, 5);
        const start = end - dur;
        return {
          prompt: `A netball game finishes at ${f12(end)}. It lasted ${hmText(dur)}. What time did it start?`,
          answer: choiceTime(start),
          hint: 'Go backwards: subtract the hours, then the minutes.',
          working: [`${f12(end)} − ${Math.floor(dur / 60)} h = ${f12(end - Math.floor(dur / 60) * 60)}.`, `${f12(end - Math.floor(dur / 60) * 60)} − ${dur % 60} min = ${f12(start)}.`, `Started at <b>${f12(start)}</b>.`],
          finalAnswer: f12(start), skill: 'elapsed',
        };
      }
      case 'weeks': {
        const w = R.int(2, 8), d = R.chance(0.5) ? R.int(1, 6) : 0;
        const days = w * 7 + d;
        return {
          prompt: d ? `How many days are in ${w} weeks and ${d} days?` : `How many days are in ${w} weeks?`,
          answer: numAns(days, 'days'),
          hint: '1 week = 7 days.',
          working: [`${w} × 7 = ${w * 7}.`].concat(d ? [`${w * 7} + ${d} = ${days}.`] : []).concat([`<b>${days} days</b>.`]),
          finalAnswer: `${days} days`, skill: 'days',
        };
      }
      case 'weeksText': {
        const w = R.int(1, 7), d = R.int(1, 6), days = w * 7 + d;
        return {
          prompt: `A holiday lasts ${days} days. How many weeks and days is that?`,
          answer: { type: 'text', value: `${w} week${w > 1 ? 's' : ''} ${d} day${d > 1 ? 's' : ''}`, accept: [`${w} weeks ${d} days`, `${w} week ${d} day`, `${w}w ${d}d`, `${w} w ${d} d`, `${w} weeks and ${d} days`, `${w} week and ${d} days`, `${w} wk ${d} days`, `${w} wks ${d} days`, `${w} ${d}`, `${w}wk ${d}d`, `${w} weeks, ${d} days`], placeholder: 'e.g. 2 weeks 3 days' },
          hint: 'How many whole 7s fit into the number of days? The leftover is the extra days.',
          working: [`${days} ÷ 7 = ${w} remainder ${d}.`, `<b>${w} week${w > 1 ? 's' : ''} ${d} day${d > 1 ? 's' : ''}</b>.`],
          finalAnswer: `${w} week${w > 1 ? 's' : ''} ${d} day${d > 1 ? 's' : ''}`, skill: 'days',
        };
      }
      case 'days3': {
        const kind = R.pick(['dh', 'hm', 'dToH']);
        if (kind === 'dh') {
          const d = R.int(2, 6), h = R.int(1, 23), total = d * 24 + h;
          return {
            prompt: `How many hours are in ${d} days ${h} hours?`,
            answer: numAns(total, 'h'),
            hint: '1 day = 24 hours.',
            working: [`${d} × 24 = ${d * 24}.`, `${d * 24} + ${h} = ${total}.`, `<b>${total} hours</b>.`],
            finalAnswer: `${total} h`, skill: 'days',
          };
        }
        if (kind === 'dToH') {
          const hrs = R.int(2, 6) * 24 + R.int(1, 23), d = Math.floor(hrs / 24), h = hrs % 24;
          return {
            prompt: `Write ${hrs} hours in days and hours.`,
            answer: { type: 'text', value: `${d} days ${h} hours`, accept: [`${d} days ${h} hour`, `${d} day ${h} hours`, `${d}d ${h}h`, `${d} d ${h} h`, `${d} days and ${h} hours`, `${d} days ${h} h`, `${d} days ${h} hrs`, `${d} ${h}`, `${d}days ${h}hours`, `${d} days, ${h} hours`], placeholder: 'e.g. 2 days 5 hours' },
            hint: 'Divide by 24. The remainder is the leftover hours.',
            working: [`${hrs} ÷ 24 = ${d} remainder ${h}.`, `<b>${d} days ${h} hours</b>.`],
            finalAnswer: `${d} days ${h} hours`, skill: 'days',
          };
        }
        const h = R.pick([2.5, 3.25, 1.75, 4.5, 2.75, 3.5, 5.25]);
        return {
          prompt: `How many minutes are in ${N.fmt(h)} hours?`,
          answer: numAns(h * 60, 'min'),
          hint: 'Multiply by 60. 0.25 h = 15 min, 0.5 h = 30 min, 0.75 h = 45 min.',
          working: [`${Math.floor(h)} × 60 = ${Math.floor(h) * 60}, and ${N.fmt(h - Math.floor(h))} h = ${(h - Math.floor(h)) * 60} min.`, `${Math.floor(h) * 60} + ${(h - Math.floor(h)) * 60} = ${h * 60}.`, `<b>${h * 60} min</b>.`],
          finalAnswer: `${h * 60} min`, skill: 'convert',
        };
      }
      default: { // zone
        const z = R.pick(['syd-from-nz', 'nz-from-syd', 'nz-from-lon', 'lon-from-nz']);
        if (z === 'syd-from-nz' || z === 'nz-from-syd') {
          const fromNz = z === 'syd-from-nz';
          const nz = randTime(8, 21, 5), syd = nz - 120;
          const given = fromNz ? nz : syd, ans = fromNz ? syd : nz;
          return {
            prompt: `New Zealand is 2 hours ahead of Sydney. It is ${f12(given)} in ${fromNz ? 'Auckland' : 'Sydney'}. What time is it in ${fromNz ? 'Sydney' : 'Auckland'}?`,
            answer: choiceTime(ans),
            hint: fromNz ? 'Sydney is behind, so its time is earlier: subtract 2 hours.' : 'New Zealand is ahead, so its time is later: add 2 hours.',
            working: [fromNz ? `Sydney is 2 hours behind, so subtract 2 hours.` : `Auckland is 2 hours ahead, so add 2 hours.`, `${f12(given)} ${fromNz ? '−' : '+'} 2 h = ${f12(ans)}.`, `<b>${f12(ans)}</b>.`],
            finalAnswer: f12(ans), skill: 'zones',
          };
        }
        const fromNz = z === 'lon-from-nz';
        const nz = randTime(13, 23, 5), lon = nz - 720;
        const given = fromNz ? nz : lon, ans = fromNz ? lon : nz;
        return {
          prompt: `New Zealand is 12 hours ahead of London. It is ${f12(given)} in ${fromNz ? 'Wellington' : 'London'}. What time is it in ${fromNz ? 'London' : 'Wellington'} on the same day?`,
          answer: choiceTime(ans),
          hint: '12 hours difference keeps the same numbers but swaps am and pm.',
          working: [fromNz ? `London is 12 hours behind, so subtract 12 hours.` : `New Zealand is 12 hours ahead, so add 12 hours.`, `${f12(given)} ${fromNz ? '−' : '+'} 12 h = ${f12(ans)}.`, `<b>${f12(ans)}</b>.`],
          finalAnswer: f12(ans), skill: 'zones',
        };
      }
    }
  }

  function word(level) {
    const name = R.pick(['Harper', 'Aroha', 'Mia', 'Liam', 'Tane', 'Ruby']);
    const t = level === 1 ? R.pick(['movie1', 'bus1', 'netball1', 'school1', 'bake', 'holiday1'])
      : level === 2 ? R.pick(['bus2', 'bus2b', 'movie2', 'flight2', 'netball2', 'homework', 'nightShift', 'holiday2'])
      : R.pick(['bus3', 'flight3', 'netball3', 'movie3', 'bus3b', 'trip', 'nightShift', 'flightNight', 'holiday3']);
    switch (t) {
      case 'nightShift': {
        const job = R.pick(['works a night shift at the hospital', 'looks after the sheep during lambing', 'is on the overnight ferry']);
        const start = R.int(20, 23) * 60 + R.step(0, 45, 15);
        const end = R.int(5, 8) * 60 + R.step(0, 45, 15);
        const toMid = 1440 - start, mins = toMid + end;
        return {
          prompt: `${name}'s aunty ${job}. She starts at ${f12(start)} and finishes at ${f12(end)} the next morning. How long is that? Give your answer in hours and minutes.`,
          answer: hmAns(mins),
          hint: 'Split it at midnight: start time → midnight, then midnight → finish time. Add the two parts.',
          working: [
            `Split at <b>midnight</b>, because the time crosses into the next day.`,
            `${f12(start)} → 12 midnight is ${hmText(toMid)}.`,
            `12 midnight → ${f12(end)} is ${hmText(end)}.`,
            `${hmText(toMid)} + ${hmText(end)} = ${hmText(mins)}.`,
            `<b>${hmText(mins)}</b>.`,
          ],
          finalAnswer: hmText(mins),
        };
      }
      case 'flightNight': {
        const start = R.int(21, 23) * 60 + R.step(0, 55, 5);
        const len = R.pick([200, 220, 260, 300, 330, 380, 410]);
        const end = start + len;
        const city = R.pick(['Singapore', 'Nadi', 'Perth', 'Honolulu', 'Rarotonga']);
        return {
          prompt: `An overnight flight leaves Auckland at ${f12(start)} and takes ${hmText(len)} to reach ${city}. Ignoring time zones, what time does it land?`,
          answer: choiceTime(end),
          hint: 'Count on to midnight first, then keep counting into the next day.',
          working: [
            `${f12(start)} → 12 midnight is ${hmText(1440 - start)}.`,
            `Flight time left after midnight: ${hmText(len)} − ${hmText(1440 - start)} = ${hmText(len - (1440 - start))}.`,
            `12 midnight + ${hmText(len - (1440 - start))} = ${f12(end)}.`,
            `Lands at <b>${f12(end)}</b> the next morning.`,
          ],
          finalAnswer: f12(end),
        };
      }
      case 'holiday1': case 'holiday2': case 'holiday3': {
        const span = t === 'holiday3' ? 2 : t === 'holiday2' ? 1 : 0;
        const m1 = R.int(2, 9 - span), m2 = m1 + span;
        const d1 = span === 0 ? R.int(1, MONTHS[m1][1] - 6) : R.int(2, MONTHS[m1][1] - 3);
        const d2 = span === 0 ? d1 + R.int(3, Math.min(20, MONTHS[m1][1] - d1)) : R.int(2, MONTHS[m2][1] - 1);
        const left = span === 0 ? 0 : MONTHS[m1][1] - d1;
        const middle = span === 2 ? MONTHS[m1 + 1][1] : 0;
        const total = span === 0 ? d2 - d1 : left + middle + d2;
        const story = R.pick(['stays with her cousins', 'is away at netball camp', 'goes tramping with her whānau', 'is on school holidays']);
        return {
          prompt: span === 0
            ? `${name} ${story} from ${d1} ${MONTHS[m1][0]} until ${d2} ${MONTHS[m1][0]}. How many days is that?`
            : `${name} ${story} from ${d1} ${MONTHS[m1][0]} until ${d2} ${MONTHS[m2][0]} in the same year. How many days is that?`,
          answer: numAns(total, 'days'),
          hint: span === 0 ? 'Both dates are in the same month, so just subtract.' : 'Do it one month at a time: days left in the first month, then any whole months, then the days in the last month.',
          working: span === 0
            ? [`Both dates are in ${MONTHS[m1][0]}, so subtract: ${d2} − ${d1} = ${total}.`, `<b>${total} days</b>.`]
            : [`${MONTHS[m1][0]} has ${MONTHS[m1][1]} days, so ${MONTHS[m1][1]} − ${d1} = ${left} days left in ${MONTHS[m1][0]}.`]
              .concat(span === 2 ? [`All of ${MONTHS[m1 + 1][0]}: ${middle} days.`] : [])
              .concat([`Then ${d2} days into ${MONTHS[m2][0]}.`, `${left}${span === 2 ? ' + ' + middle : ''} + ${d2} = ${total}.`, `<b>${total} days</b>.`]),
          finalAnswer: `${total} days`,
        };
      }
      case 'movie1': {
        const start = R.int(10, 19) * 60 + R.pick([0, 30]), len = R.pick([90, 100, 110, 120, 105]);
        const end = start + len;
        return {
          prompt: `A movie starts at ${f12(start)} and runs for ${hmText(len)}. What time does it finish?`,
          answer: choiceTime(end),
          hint: 'Add the hours first, then the extra minutes.',
          working: [`${f12(start)} + ${Math.floor(len / 60)} h = ${f12(start + Math.floor(len / 60) * 60)}.`, `+ ${len % 60} min = ${f12(end)}.`, `Finishes at <b>${f12(end)}</b>.`],
          finalAnswer: f12(end),
        };
      }
      case 'movie2': {
        const start = randTime(11, 19, 5), end = start + R.int(1, 2) * 60 + R.step(5, 55, 5), asText = R.chance(0.3);
        return durationQ(start, end, asText, `A movie starts at ${f12(start)} and finishes at ${f12(end)}. How long is the movie? Give your answer in ${asText ? 'hours and minutes' : 'minutes'}.`);
      }
      case 'movie3': {
        const start = randTime(17, 19, 5), len = R.pick([95, 110, 125, 135, 140, 150]), ads = R.pick([15, 20, 25]);
        const end = start + ads + len;
        return {
          prompt: `A movie session starts at ${f12(start)}. There are ${ads} minutes of ads and trailers, then the movie runs for ${hmText(len)}. What time does the movie finish?`,
          answer: choiceTime(end),
          hint: 'Add the ads first, then the movie length.',
          working: [`Ads: ${f12(start)} + ${ads} min = ${f12(start + ads)}.`, `Movie: ${f12(start + ads)} + ${hmText(len)} = ${f12(end)}.`, `Finishes at <b>${f12(end)}</b>.`],
          finalAnswer: f12(end),
        };
      }
      case 'bus1': case 'bus2': case 'bus2b': case 'bus3': case 'bus3b': {
        const tt = timetable(3);
        const { stops, buses } = tt;
        if (t === 'bus1') {
          const b = R.int(0, 2), i = R.int(0, 2), j = R.int(i + 1, 3);
          const mins = buses[b][j] - buses[b][i];
          return {
            prompt: `Use the bus timetable. How long does Bus ${'ABC'[b]} take to travel from ${stops[i]} to ${stops[j]}?`,
            visual: tt.html,
            answer: numAns(mins, 'min'),
            hint: `Find the Bus ${'ABC'[b]} column. Read the times at ${stops[i]} and ${stops[j]}, then count the minutes between them.`,
            working: [`Bus ${'ABC'[b]} leaves ${stops[i]} at ${f24(buses[b][i])} and reaches ${stops[j]} at ${f24(buses[b][j])}.`, `From ${f24(buses[b][i])} to ${f24(buses[b][j])} is ${mins} min.`, `<b>${mins} min</b>.`],
            finalAnswer: `${mins} min`,
          };
        }
        if (t === 'bus2') {
          const b = R.int(0, 2), j = R.int(1, 3);
          return {
            prompt: `Use the bus timetable. What time does Bus ${'ABC'[b]} arrive at ${stops[j]}? Give the 12-hour time.`,
            visual: tt.html,
            answer: choiceTime(buses[b][j]),
            hint: `Find the Bus ${'ABC'[b]} column and the ${stops[j]} row. The timetable uses 24-hour time.`,
            working: [`The Bus ${'ABC'[b]} column shows ${f24(buses[b][j])} at ${stops[j]}.`, `${f24(buses[b][j])} in 12-hour time is <b>${f12(buses[b][j])}</b>.`],
            finalAnswer: f12(buses[b][j]),
          };
        }
        if (t === 'bus2b') {
          const i = R.int(0, 2), j = R.int(i + 1, 3), b = R.int(0, 2);
          const need = buses[b][j] + R.int(0, (buses[1][0] - buses[0][0]) - 1);
          const latest = buses.filter((bus) => bus[j] <= need).length - 1;
          return {
            prompt: `Use the bus timetable. ${name} needs to be at ${stops[j]} by ${f24(need)}. Which is the latest bus ${name} can catch from ${stops[i]}?`,
            visual: tt.html,
            answer: { type: 'choice', value: latest, choices: ['Bus A', 'Bus B', 'Bus C'] },
            hint: `Look along the ${stops[j]} row. Which buses arrive at or before ${f24(need)}? Pick the last one.`,
            working: [`Arrival times at ${stops[j]}: ${buses.map((bus, k) => `Bus ${'ABC'[k]} ${f24(bus[j])}`).join(', ')}.`, `The latest one that is not after ${f24(need)} is Bus ${'ABC'[latest]} (${f24(buses[latest][j])}).`, `<b>Bus ${'ABC'[latest]}</b>.`],
            finalAnswer: `Bus ${'ABC'[latest]}`,
          };
        }
        if (t === 'bus3') {
          const i = R.int(0, 1), b = R.int(0, 1);
          const arrive = buses[b][i] + R.int(1, 9); // just missed bus b
          const next = buses[b + 1][i];
          const wait = next - arrive;
          return {
            prompt: `Use the bus timetable. ${name} gets to the ${stops[i]} bus stop at ${f24(arrive)} and has just missed Bus ${'ABC'[b]}. How many minutes must ${name} wait for the next bus?`,
            visual: tt.html,
            answer: numAns(wait, 'min'),
            hint: `The next bus after ${f24(arrive)} at ${stops[i]} is Bus ${'ABC'[b + 1]}. Count the minutes until it comes.`,
            working: [`Bus ${'ABC'[b + 1]} leaves ${stops[i]} at ${f24(next)}.`, `From ${f24(arrive)} to ${f24(next)} is ${wait} min.`, `<b>${wait} min</b> wait.`],
            finalAnswer: `${wait} min`,
          };
        }
        // bus3b: total journey including walking
        const b = R.int(0, 2), walkBefore = R.pick([5, 8, 10, 12]), walkAfter = R.pick([4, 6, 7, 10]);
        const leaveHome = buses[b][0] - walkBefore;
        const arrive = buses[b][3] + walkAfter;
        const total = arrive - leaveHome;
        return {
          prompt: `Use the bus timetable. ${name} leaves home at ${f24(leaveHome)}, walks to ${stops[0]} and catches Bus ${'ABC'[b]} to ${stops[3]}, then walks ${walkAfter} more minutes to school. How many minutes does the whole trip take, from leaving home to arriving at school?`,
          visual: tt.html,
          answer: numAns(total, 'min'),
          hint: `Find when Bus ${'ABC'[b]} reaches ${stops[3]}, add the walk to get the arrival time, then count from ${f24(leaveHome)} to that time.`,
          working: [`Bus ${'ABC'[b]} reaches ${stops[3]} at ${f24(buses[b][3])}.`, `Add the walk: ${f24(buses[b][3])} + ${walkAfter} min = ${f24(arrive)} arrival at school.`, `From ${f24(leaveHome)} to ${f24(arrive)} is ${total} min.`, `<b>${total} min</b>.`],
          finalAnswer: `${total} min`,
        };
      }
      case 'netball1': {
        const q = R.pick([10, 12, 15]), n = 4;
        return {
          prompt: `A netball game has ${n} quarters of ${q} minutes each. How many minutes of playing time is that?`,
          answer: numAns(n * q, 'min'),
          hint: 'Multiply the number of quarters by the minutes in each.',
          working: [`${n} × ${q} = ${n * q}.`, `<b>${n * q} min</b>.`],
          finalAnswer: `${n * q} min`,
        };
      }
      case 'netball2': {
        const q = R.pick([10, 12, 15]), brk = R.pick([2, 3, 5]), start = R.int(9, 14) * 60 + R.pick([0, 30, 15]);
        const len = 4 * q + 3 * brk, end = start + len;
        return {
          prompt: `${name}'s netball game starts at ${f12(start)}. It has 4 quarters of ${q} minutes with ${brk} minute breaks between them. What time does the game finish?`,
          answer: choiceTime(end),
          hint: 'Work out the total length first: 4 quarters + 3 breaks. Then add it to the start time.',
          working: [`Playing: 4 × ${q} = ${4 * q} min. Breaks: 3 × ${brk} = ${3 * brk} min.`, `Total ${4 * q} + ${3 * brk} = ${len} min = ${hmText(len)}.`, `${f12(start)} + ${hmText(len)} = ${f12(end)}.`, `Finishes at <b>${f12(end)}</b>.`],
          finalAnswer: f12(end),
        };
      }
      case 'netball3': {
        const start = R.int(8, 10) * 60 + R.pick([0, 30]), game = R.pick([40, 45, 50, 60]), gap = R.pick([5, 10, 15]), n = R.int(3, 5);
        const gStart = start + (n - 1) * (game + gap);
        return {
          prompt: `At a netball tournament the first game starts at ${f12(start)}. Each game lasts ${game} minutes and there is a ${gap} minute gap between games. What time does game ${n} start?`,
          answer: choiceTime(gStart),
          hint: `Game ${n} starts after ${n - 1} games and ${n - 1} gaps.`,
          working: [`Each game plus gap = ${game} + ${gap} = ${game + gap} min.`, `Before game ${n} there are ${n - 1} of these: ${n - 1} × ${game + gap} = ${(n - 1) * (game + gap)} min = ${hmText((n - 1) * (game + gap))}.`, `${f12(start)} + ${hmText((n - 1) * (game + gap))} = ${f12(gStart)}.`, `Game ${n} starts at <b>${f12(gStart)}</b>.`],
          finalAnswer: f12(gStart),
        };
      }
      case 'school1': {
        const start = R.pick([8 * 60 + 45, 8 * 60 + 50, 9 * 60]), end = R.pick([14 * 60 + 50, 15 * 60, 15 * 60 + 10, 15 * 60 + 15]);
        return durationQ(start, end, true, `School starts at ${f12(start)} and finishes at ${f12(end)}. How long is the school day? Give your answer in hours and minutes.`);
      }
      case 'bake': {
        const start = randTime(9, 16, 5), mins = R.pick([25, 35, 40, 45, 50, 55]);
        const end = start + mins;
        return {
          prompt: `${name} puts a cake in the oven at ${f12(start)}. It needs ${mins} minutes. What time should it come out?`,
          answer: choiceTime(end),
          hint: 'Add the minutes. If you go past 60 minutes, move to the next hour.',
          working: [`${f12(start)} + ${mins} min = ${f12(end)}.`, `Take it out at <b>${f12(end)}</b>.`],
          finalAnswer: f12(end),
        };
      }
      case 'flight2': {
        const start = randTime(6, 18, 5), len = R.pick([65, 70, 75, 80, 85, 90, 55]);
        const end = start + len;
        const city = R.pick(['Wellington', 'Christchurch', 'Dunedin', 'Nelson']);
        return {
          prompt: `A flight leaves Auckland at ${f12(start)} and takes ${hmText(len)} to reach ${city}. What time does it land?`,
          answer: choiceTime(end),
          hint: 'Add the hour first, then the minutes.',
          working: [`${f12(start)} + ${Math.floor(len / 60)} h = ${f12(start + Math.floor(len / 60) * 60)}.`, `+ ${len % 60} min = ${f12(end)}.`, `Lands at <b>${f12(end)}</b>.`],
          finalAnswer: f12(end),
        };
      }
      case 'flight3': {
        const start = randTime(7, 14, 5), len = R.pick([200, 210, 215, 225, 230, 195]);
        const landNz = start + len, landSyd = landNz - 120;
        return {
          prompt: `A flight leaves Auckland at ${f12(start)} and takes ${hmText(len)} to fly to Sydney. Sydney is 2 hours behind New Zealand. What is the local time in Sydney when it lands?`,
          answer: choiceTime(landSyd),
          hint: 'First add the flight time (NZ time), then subtract 2 hours to change to Sydney time.',
          working: [`Landing in NZ time: ${f12(start)} + ${hmText(len)} = ${f12(landNz)}.`, `Sydney is 2 h behind: ${f12(landNz)} − 2 h = ${f12(landSyd)}.`, `Lands at <b>${f12(landSyd)}</b> Sydney time.`],
          finalAnswer: f12(landSyd),
        };
      }
      case 'homework': {
        const a = R.pick([25, 35, 40, 45, 50]), b = R.pick([20, 30, 35, 55]), c = R.pick([15, 20, 25, 30]);
        const total = a + b + c;
        return {
          prompt: `${name} spends ${a} minutes on maths homework, ${b} minutes on English and ${c} minutes on science. How long is that altogether? Give your answer in hours and minutes.`,
          answer: hmAns(total),
          hint: 'Add the minutes, then change every 60 minutes into 1 hour.',
          working: [`${a} + ${b} + ${c} = ${total} min.`, `${total} ÷ 60 = ${Math.floor(total / 60)} remainder ${total % 60}.`, `<b>${hmText(total)}</b>.`],
          finalAnswer: hmText(total),
        };
      }
      default: { // trip: multi-leg journey total minutes
        const legs = [R.int(1, 2) * 60 + R.step(5, 55, 5), R.int(20, 55), R.int(1, 3) * 60 + R.step(5, 55, 5)];
        const total = legs[0] + legs[1] + legs[2];
        const asText = R.chance(0.5);
        return {
          prompt: `${name}'s family drives ${hmText(legs[0])} to Taupō, stops for ${legs[1]} minutes for lunch, then drives ${hmText(legs[2])} to Wellington. How long does the whole trip take? Give your answer in ${asText ? 'hours and minutes' : 'minutes'}.`,
          answer: asText ? hmAns(total) : numAns(total, 'min'),
          hint: 'Change each part into minutes, add them up, then change back if needed.',
          working: [`${hmText(legs[0])} = ${legs[0]} min, lunch = ${legs[1]} min, ${hmText(legs[2])} = ${legs[2]} min.`, `${legs[0]} + ${legs[1]} + ${legs[2]} = ${total} min.`].concat(asText ? [`${total} min = ${hmText(total)}.`] : []).concat([`<b>${asText ? hmText(total) : total + ' min'}</b>.`]),
          finalAnswer: asText ? hmText(total) : `${total} min`,
        };
      }
    }
  }

  HL.registerTopic({
    id: 'time', subject: 'maths', strand: 'measurement', order: 5,
    name: 'Time', short: 'Time',
    blurb: '12-hour and 24-hour clocks, working out how long things take, and reading timetables.',
    example: '2:30 pm = 14:30 &nbsp;·&nbsp; 9:45 to 12:20 = 2 h 35 min',
    animal: 'chick',
    learn: (() => {
      const INK = '#4A3B48', BLUE = '#2A6FA5', ROSE = '#E0568C', GREEN = '#2FA97A';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // an analogue clock showing h:m, centre (cx, cy), radius r
      const clock = (h, m, cx, cy, r) => {
        const pt = (deg, len) => [cx + len * Math.sin(deg * Math.PI / 180), cy - len * Math.cos(deg * Math.PI / 180)].map((v) => v.toFixed(1));
        const ticks = Array.from({ length: 60 }, (_, i) => { const [a, b] = pt(i * 6, r - 3), [c, d] = pt(i * 6, i % 5 ? r - 7 : r - 11); return `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${INK}" stroke-width="${i % 5 ? 1 : 2}"/>`; }).join('');
        const nums = Array.from({ length: 12 }, (_, i) => { const [x, y] = pt((i + 1) * 30, r - 21); return `<text x="${x}" y="${+y + 5}" text-anchor="middle" fill="${INK}">${i + 1}</text>`; }).join('');
        const [hx, hy] = pt((h % 12) * 30 + m * 0.5, r * 0.5), [mx, my] = pt(m * 6, r * 0.78);
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>${ticks}${nums}<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="${BLUE}" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="4" fill="${ROSE}"/>`;
      };
      // "count on" jump diagram: times along a line, with labelled arcs between them (hours in blue, minutes in rose)
      const jumps = (times, arcs) => {
        const n = times.length, x0 = 44, gap = (360 - 88) / (n - 1), X = (i) => x0 + i * gap, y = 62;
        return SVG(360, 96, `<line x1="14" y1="${y}" x2="346" y2="${y}" stroke="${INK}" stroke-width="2"/>` +
          times.map((t, i) => `<circle cx="${X(i)}" cy="${y}" r="5" fill="${i === 0 ? ROSE : i === n - 1 ? GREEN : INK}"/><text x="${X(i)}" y="${y + 24}" text-anchor="middle" fill="${INK}">${t}</text>`).join('') +
          arcs.map((a, i) => { const c = /h/.test(a) ? BLUE : ROSE; return `<path d="M${X(i)} ${y - 8} Q${(X(i) + X(i + 1)) / 2} ${y - 52} ${X(i + 1) - 4} ${y - 8}" stroke="${c}" stroke-width="3" fill="none"/><polygon points="${X(i + 1)},${y - 6} ${X(i + 1) - 10},${y - 8} ${X(i + 1) - 4},${y - 17}" fill="${c}"/><text x="${(X(i) + X(i + 1)) / 2}" y="${y - 38}" text-anchor="middle" fill="${c}">${a}</text>`; }).join(''));
      };
      const strip = (y) => `<rect x="20" y="${y}" width="160" height="24" fill="#A9D8F5" stroke="${INK}" stroke-width="1.5"/><rect x="180" y="${y}" width="160" height="24" fill="#FFC79A" stroke="${INK}" stroke-width="1.5"/>` +
        [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h, i) => `<line x1="${20 + h * 40 / 3}" y1="${y}" x2="${20 + h * 40 / 3}" y2="${y + 24}" stroke="${INK}" stroke-width="1"/><text x="${20 + h * 40 / 3}" y="${y + 17}" text-anchor="middle" fill="${INK}">${h}</text><text x="${20 + h * 40 / 3}" y="${y + 42}" text-anchor="middle" fill="${h < 12 ? BLUE : h > 12 ? ROSE : INK}">${['12am', '3am', '6am', '9am', 'noon', '3pm', '6pm', '9pm', '12am'][i]}</text>`).join('');
      // a bus timetable shaped exactly like the ones in the questions: rows = stops, columns = buses
      const TT_STOPS = ['Beach Rd', 'Museum', 'Library', 'School'];
      const TT_TIMES = [['08:05', '08:25', '08:45'], ['08:14', '08:34', '08:54'], ['08:26', '08:46', '09:06'], ['08:40', '09:00', '09:20']];
      /** ttable({row, col, marks:[[row,col]…]}) — highlights one row, one column, and the cells being read */
      const ttable = (o) => {
        const rowHi = o.row == null ? -1 : o.row, colHi = o.col == null ? -1 : o.col, marks = o.marks || [];
        const marked = (r, c) => marks.some((k) => k[0] === r && k[1] === c);
        let h = `<table class="data"><tr><th>Stop</th>${['A', 'B', 'C'].map((b, i) => `<th${i === colHi ? ` style="background:#DCEBF8;color:${BLUE}"` : ''}>Bus ${b}</th>`).join('')}</tr>`;
        TT_STOPS.forEach((s, r) => {
          h += `<tr><td style="text-align:left${r === rowHi ? `;background:#FFE6F0;color:${ROSE}` : ''}">${s}</td>`
            + TT_TIMES[r].map((t, c) => {
              const st = marked(r, c) ? `background:${ROSE};color:#FFFFFF` : (r === rowHi || c === colHi) ? 'background:#FDF0F6' : '';
              return `<td${st ? ` style="${st}"` : ''}>${t}</td>`;
            }).join('') + '</tr>';
        });
        return h + '</table>';
      };
      return {
      what: '<p>Time does not work in tens: <b>60 minutes</b> make an hour, <b>24 hours</b> make a day and <b>7 days</b> make a week. That is why you cannot just add times like ordinary numbers.</p><p>The <b>24-hour clock</b> (used on bus timetables and phones) counts straight through from 00:00 (midnight) to 23:59, so there is no am or pm.</p>',
      visual: SVG(360, 212, `${clock(2, 30, 70, 82, 58)}
        <text x="142" y="50" fill="${ROSE}" font-size="20">2:30 pm</text>
        <text x="142" y="80" fill="${BLUE}" font-size="20">= 14:30</text>
        <text x="142" y="102" fill="${INK}">pm → 2 + 12 = 14</text>
        <text x="142" y="128" fill="${INK}">1 hour = 60 min</text>
        <text x="142" y="148" fill="${BLUE}">each number = 5 min</text>
        <text x="100" y="164" text-anchor="middle" fill="${BLUE}">am (morning)</text><text x="260" y="164" text-anchor="middle" fill="${ROSE}">pm (afternoon)</text>
        ${strip(170)}`),
      facts: [
        '<b>60 min</b> = 1 h &nbsp;·&nbsp; <b>24 h</b> = 1 day',
        'pm → <b>add 12</b> to the hour: 2:30 pm = 14:30 &nbsp;·&nbsp; hours 13–23 → <b>take away 12</b> and write pm: 19:15 = 7:15 pm',
        'am → same hour, two digits: 7:05 am = 07:05 &nbsp;·&nbsp; 12 am = 00:00',
        '<b>0.5 h = 30 min</b>, 0.25 h = 15 min, 0.75 h = 45 min',
        'How long? <b>Count on</b> to the next full hour first',
        'Crossing midnight: <b>split the time at 12 midnight</b> and add the two parts',
        'Timetable: find the <b>ROW</b> for the place, then the <b>COLUMN</b> for the bus — read where they cross',
        '<b>7 days</b> = 1 week &nbsp;·&nbsp; <b>365 days</b> = 1 year (<b>366</b> in a leap year)',
        '30 days: <b>September, April, June, November</b>. All the rest 31 — except <b>February</b> (28, or 29 in a leap year)',
        'Leap year: the year divides exactly by <b>4</b> (a century year must divide by <b>400</b>)',
      ],
      steps: [
        '<b>12-hour → 24-hour</b>: say "pm? add 12 to the hour" (2:30 pm → 14:30). am stays the same, written with two digits (7:05 am → 07:05). 12 am is 00:00.',
        '<b>24-hour → 12-hour</b>: say "13 or more? take away 12 and write pm" (19:15 → 7:15 pm). Less than 12 → am.',
        '<b>How long between two times?</b> Count on in jumps: first to the next full hour, then whole hours, then the leftover minutes. Add the jumps up.',
        '<b>Finish time</b> = start + duration. Add the hours first, then the minutes. If the minutes go past 60, carry 1 hour.',
        '<b>Decimal hours</b>: 0.5 h = 30 min, 0.25 h = 15 min, 0.75 h = 45 min. Minutes ÷ 60 = hours.',
        '<b>Reading a timetable</b>: find the <b>ROW</b> for the place, then the <b>COLUMN</b> for the bus, and read the time where they cross. Each column is one bus going down the route; each row is one stop.',
        '<b>Time zones</b>: "ahead" means later. NZ is 2 hours ahead of Sydney, so NZ time − 2 h = Sydney time.',
        '<b>Past midnight</b>: split the time at <b>12 midnight</b>. Work out start → midnight, then midnight → finish, then add the two parts. Never try to subtract straight across a day boundary.',
        '<b>Days between two dates</b>: work one month at a time. Days left in the first month + any whole months in between + the days into the last month.',
        '<b>Leap years</b>: divide the year by 4. If it goes exactly, it is a leap year and February has 29 days. (A year ending in 00 must divide by 400.)',
      ],
      examples: [
        { q: 'What time does the clock show?', working: ['<b>Picture:</b> the clock on the classroom wall. The short hand is the hour, the long hand is the minutes, and each number is <b>5 minutes</b>.', '1. Where is the long (minute) hand? On 10 → 10 × 5 = 50 minutes.', '2. Where is the short (hour) hand? Past 4, nearly at 5 → the hour is 4.', '4:50 — "ten to five"'], a: '4:50',
          visual: SVG(360, 128, `${clock(4, 50, 60, 64, 52)}<text x="126" y="34" fill="${BLUE}">minute hand → on 10</text><text x="126" y="54" fill="${BLUE}">10 × 5 = 50 min</text><text x="126" y="82" fill="${INK}">hour hand → past 4</text><text x="126" y="116" fill="${ROSE}" font-size="20">4:50</text>`) },
        { q: 'Write 2:30 pm in 24-hour time', working: ['<b>Picture:</b> the bus timetable at the stop — it has no am/pm, so afternoon hours keep counting past 12.', '1. Is it am or pm? pm → I add 12 to the hour.', '2. 2 + 12 = 14.', '3. Minutes stay the same: 30.', '14:30'], a: '14:30' },
        { q: 'Write 16:40 in 12-hour time', working: ['<b>Picture:</b> the timetable says 16:40 — is that morning or afternoon?', '1. Is the hour 13 or more? Yes (16) → it is <b>pm</b>, so I take away 12.', '2. 16 − 12 = 4.', '3. Minutes stay the same: 40.', '4:40 pm'], a: '4:40 pm' },
        { q: 'Use the timetable. What time does Bus B reach the Library?',
          visual: ttable({ row: 2, col: 1, marks: [[2, 1]] }),
          working: [
            '<b>Picture:</b> the timetable at the bus stop is a grid. The <b>places</b> go down the side, the <b>buses</b> go across the top.',
            '1. Which place am I looking for? <b>Library</b> → find that <b>row</b> (the pink row).',
            '2. Which bus? <b>Bus B</b> → find that <b>column</b> (the blue heading).',
            '3. Slide across the row and down the column. Where they <b>cross</b> is the time: 08:46.',
            'Bus B reaches the Library at 08:46 (8:46 am).',
          ], a: '08:46' },
        { q: 'How long from 9:45 am to 12:20 pm?', working: ['<b>Picture:</b> a timeline: I jump from the start time to the finish in easy hops.', '1. First hop: to the next full hour. 9:45 → 10:00 is 15 min.', '2. Whole hours: 10:00 → 12:00 is 2 h.', '3. Leftover minutes: 12:00 → 12:20 is 20 min.', '4. Add the hops: 15 min + 2 h + 20 min = 2 h 35 min'], a: '2 h 35 min',
          visual: jumps(['9:45', '10:00', '12:00', '12:20'], ['+15 min', '+2 h', '+20 min']) },
        { q: 'A movie starts at 7:20 pm and lasts 1 h 50 min. When does it finish?', working: ['<b>Picture:</b> the timeline again — start at 7:20 and jump forwards.', '1. Hours first: 7:20 + 1 h = 8:20.', '2. Then minutes: 20 + 50 = 70 min. Is that past 60? Yes → carry 1 hour: 70 min = 1 h 10 min.', '3. 8:20 + 1 h 10 min = 9:10.', '9:10 pm'], a: '9:10 pm',
          visual: jumps(['7:20 pm', '8:20 pm', '9:10 pm'], ['+1 h', '+50 min']) },
        { q: 'Harper\'s netball game starts at 10:15 am and lasts 1.5 hours. When does it finish?', working: ['<b>Picture:</b> the timeline. But first, 1.5 h is a decimal — I turn it into hours and minutes.', '1. What is 0.5 h? Half an hour = <b>30 min</b> (not 50!). So 1.5 h = 1 h 30 min.', '2. Hours first: 10:15 + 1 h = 11:15.', '3. Then minutes: 11:15 + 30 min = 11:45.', '11:45 am'], a: '11:45 am',
          visual: jumps(['10:15', '11:15', '11:45'], ['+1 h', '+30 min']) },
        { q: 'Use the timetable. Aroha must be at school by 8:50. Which is the last bus she can catch from the Museum?',
          visual: ttable({ row: 3, col: 0, marks: [[3, 0], [1, 0]] }),
          working: [
            '<b>Picture:</b> the same grid. This time I know where I must <b>end up</b>, so I start at the finish and work backwards.',
            '1. Which row tells me when I arrive? The <b>School</b> row: 08:40, 09:00, 09:20.',
            '2. Which of those is before 8:50? Only <b>08:40</b> (09:00 and 09:20 are too late).',
            '3. Which column is 08:40 in? <b>Bus A</b>. Now follow that column <b>up</b> to the Museum row: 08:14.',
            'She must catch Bus A, leaving the Museum at 08:14.',
          ], a: 'Bus A — leave the Museum at 08:14' },
        { q: 'How long is it from 9:40 pm to 6:15 am the next morning?', working: ['<b>Picture:</b> the timeline again, but this time it runs off the end of the day. I cut it in two at <b>midnight</b>.', '1. Does it cross midnight? Yes → so I split it there.', '2. Evening part: 9:40 pm → 10:00 pm is 20 min, then 10:00 pm → midnight is 2 h. That is <b>2 h 20 min</b>.', '3. Morning part: midnight → 6:00 am is 6 h, then 6:00 → 6:15 is 15 min. That is <b>6 h 15 min</b>.', '4. Add the two parts: 2 h 20 min + 6 h 15 min = 8 h 35 min'], a: '8 h 35 min',
          visual: jumps(['9:40 pm', '10:00', 'midnight', '6:00 am', '6:15 am'], ['+20 min', '+2 h', '+6 h', '+15 min']) },
        { q: 'How many days are there from 12 March to 25 April?', working: ['<b>Picture:</b> the calendar on the kitchen wall. I count in <b>chunks</b>, one month at a time — never all at once.', '1. How many days are left in March? March has <b>31</b> days, so 31 − 12 = <b>19</b>.', '2. That lands me on 31 March. How many more days to 25 April? <b>25</b>.', '3. Add the chunks: 19 + 25 = 44'], a: '44 days',
          visual: SVG(360, 190, (() => {
            const x0 = 20, y0 = 44, cw = 30, ch = 22;
            let g = `<text x="${x0}" y="24" fill="${INK}" font-size="15">March</text>`
              + ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => `<text x="${x0 + i * cw + cw / 2}" y="38" text-anchor="middle" fill="${BLUE}" font-size="12">${d}</text>`).join('');
            for (let d = 1; d <= 31; d++) {
              const col = (d - 1) % 7, row = Math.floor((d - 1) / 7);
              const x = x0 + col * cw, y = y0 + row * ch, on = d >= 13;
              g += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${on ? '#F9A8C9' : '#FFFFFF'}" stroke="#C9B8F2" stroke-width="1"/>`
                + `<text x="${x + cw / 2}" y="${y + 15}" text-anchor="middle" fill="${INK}" font-size="11">${d}</text>`;
            }
            const sx = x0 + 4 * cw, sy = y0 + 22;
            return g + `<rect x="${sx}" y="${sy}" width="${cw}" height="${ch}" fill="none" stroke="${GREEN}" stroke-width="2.5"/>`
              + `<text x="${x0}" y="${y0 + 5 * ch + 20}" fill="${ROSE}" font-size="12">the 19 pink days are the rest of March</text>`
              + `<text x="244" y="60" fill="${GREEN}">start: 12 Mar</text>`
              + `<text x="244" y="88" fill="${ROSE}">31 − 12 = 19</text>`
              + `<text x="244" y="112" fill="${BLUE}">+ 25 in April</text>`
              + `<text x="244" y="142" fill="${INK}" font-size="15">= 44 days</text>`;
          })()) },
        { q: 'Is 2026 a leap year, and how many days does February have that year?', working: ['<b>Picture:</b> every 4 years February gets one <b>extra day</b> squeezed in.', '1. Does 2026 divide exactly by 4? 2026 ÷ 4 = 506.5 — <b>not</b> a whole number.', '2. So 2026 is <b>not</b> a leap year.', '3. In a normal year February has 28 days.'], a: 'Not a leap year — February has 28 days',
          visual: SVG(360, 192, (() => {
            const M = [['Jan', 31], ['Feb', 28], ['Mar', 31], ['Apr', 30], ['May', 31], ['Jun', 30], ['Jul', 31], ['Aug', 31], ['Sep', 30], ['Oct', 31], ['Nov', 30], ['Dec', 31]];
            return M.map((m, i) => {
              const x = 16 + (i % 4) * 84, y = 26 + Math.floor(i / 4) * 40;
              const fill = m[1] === 28 ? '#F9A8C9' : m[1] === 30 ? '#A6E3B8' : '#FFE98A';
              return `<rect x="${x}" y="${y}" width="76" height="32" rx="8" fill="${fill}" stroke="${INK}" stroke-width="1.5"/><text x="${x + 38}" y="${y + 21}" text-anchor="middle" fill="${INK}" font-size="13">${m[0]} · ${m[1]}</text>`;
            }).join('')
              + `<text x="16" y="18" fill="${INK}" font-size="12">days in each month</text>`
              + `<text x="16" y="164" fill="${GREEN}" font-size="12">green = 30 days &nbsp;·&nbsp; yellow = 31 days</text>`
              + `<text x="16" y="182" fill="${ROSE}" font-size="12">pink = February: 28 days, or 29 in a leap year</text>`;
          })()) },
      ],
      tips: [
        'Never write 1.5 hours as "1 h 50 min". <b>1.5 h = 1 h 30 min.</b>',
        'On a 24-hour clock, <b>afternoon hours are 13 to 23</b>. If you see 15:00, think 15 − 12 = 3 pm.',
        'For durations, draw a quick <b>timeline</b> and jump to the next full hour first.',
        'Timetables run <b>down</b> the column for one bus. Always check which column you are in.',
        'Crossing midnight? <b>Split it at midnight</b> and add the two parts. Do not try to do it in one jump.',
        'Counting days between dates: go <b>one month at a time</b>, and check how many days that month has first.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
