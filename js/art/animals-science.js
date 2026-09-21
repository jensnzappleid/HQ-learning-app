/* Harper Learning — science mascots: New Zealand natives, drawn in the same style as the maths set.
 * Registers into HL.animal via HL.addAnimals(). */
window.HL = window.HL || {};
(function (HL) {
  const A = {
    // kiwi — brown, long beak, round body
    kiwi: (m) => `<ellipse cx="46" cy="60" rx="33" ry="30" fill="#B98A5E" stroke="#9C6F46" stroke-width="2"/>
      <path d="M14 52 q-11 2 -13 11 q9 2 13 -3" fill="#8A6039"/>
      <path d="M77 58 q17 3 25 12 q-10 5 -26 -3z" fill="#D8B48C" stroke="#9C6F46" stroke-width="1.5"/>
      <line x1="86" y1="63" x2="99" y2="69" stroke="#9C6F46" stroke-width="1.2"/>
      <ellipse cx="38" cy="90" rx="7" ry="4" fill="#E8A33A"/><ellipse cx="56" cy="90" rx="7" ry="4" fill="#E8A33A"/>
      <path d="M26 44 q10 -9 22 -5 M30 52 q9 -7 19 -4" stroke="#9C6F46" stroke-width="1.6" fill="none" opacity=".65"/>
      <circle cx="28" cy="66" r="4.5" fill="#D99B8B" opacity=".75"/><circle cx="62" cy="66" r="4.5" fill="#D99B8B" opacity=".75"/>
      ${m === 'cheer'
        ? `<path d="M32 54 q4 -5 8 0" stroke="#4A3B48" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 54 q4 -5 8 0" stroke="#4A3B48" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M38 66 q8 9 16 0z" fill="#C43F73"/>`
        : `<circle cx="36" cy="55" r="3.4" fill="#4A3B48"/><circle cx="56" cy="55" r="3.4" fill="#4A3B48"/><circle cx="37.3" cy="53.7" r="1.1" fill="#fff"/><circle cx="57.3" cy="53.7" r="1.1" fill="#fff"/><path d="M38 66 q8 7 16 0" stroke="#4A3B48" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}`,
    // tuatara / gecko — green, spiky crest
    gecko: (m, face) => `<path d="M28 34 l6 -10 l6 10 l6 -10 l6 10 l6 -10 l6 10 l6 -10 l6 10" fill="#7CB86A"/>
      <ellipse cx="50" cy="58" rx="33" ry="29" fill="#A8D98F" stroke="#7CB86A" stroke-width="2"/>
      <path d="M83 62 q18 8 20 26" stroke="#A8D98F" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="34" cy="74" r="5" fill="#8FC97A"/><circle cx="66" cy="74" r="5" fill="#8FC97A"/>
      ${face(m, { eyeY: 52, mouthY: 66, cheek: '#F2C4A0' })}`,
    // ruru / morepork owl
    owl: (m, face) => `<path d="M22 30 l8 -16 l10 12z" fill="#8A6F5C"/><path d="M78 30 l-8 -16 l-10 12z" fill="#8A6F5C"/>
      <ellipse cx="50" cy="56" rx="33" ry="32" fill="#B99A82" stroke="#8A6F5C" stroke-width="2"/>
      <path d="M22 60 q28 34 56 0 q-14 -8 -28 -8 q-14 0 -28 8z" fill="#EAD9C6"/>
      <circle cx="39" cy="50" r="12" fill="#F6EDE2"/><circle cx="61" cy="50" r="12" fill="#F6EDE2"/>
      <circle cx="39" cy="50" r="6" fill="#4A3B48"/><circle cx="61" cy="50" r="6" fill="#4A3B48"/>
      <circle cx="41" cy="48" r="2" fill="#fff"/><circle cx="63" cy="48" r="2" fill="#fff"/>
      <path d="M46 60 l4 6 l4 -6z" fill="#E8A33A"/>
      ${m === 'cheer' ? '<path d="M44 70 q6 7 12 0z" fill="#E0568C"/>' : '<path d="M44 70 q6 5 12 0" stroke="#4A3B48" stroke-width="2.4" fill="none" stroke-linecap="round"/>'}`,
    // whale — blue, spout
    whale: (m, face) => `<path d="M50 22 q-4 -10 4 -14 q-2 8 4 12" stroke="#A9D8F5" stroke-width="3" fill="none"/>
      <ellipse cx="50" cy="60" rx="38" ry="27" fill="#7FB6DE" stroke="#5F98C4" stroke-width="2"/>
      <path d="M12 58 q-10 -12 -8 -22 q12 8 16 16z" fill="#7FB6DE"/>
      <path d="M20 70 q30 18 62 0 q-16 8 -31 8 q-15 0 -31 -8z" fill="#DCEEF9"/>
      ${face(m, { eyeY: 54, mouthY: 68, cheek: '#F3C4D6' })}`,
    // sea turtle
    turtle: (m, face) => `<ellipse cx="50" cy="58" rx="34" ry="28" fill="#8FBF6A" stroke="#6FA04C" stroke-width="2"/>
      <path d="M50 30 v56 M22 58 h56 M30 40 l40 36 M70 40 l-40 36" stroke="#6FA04C" stroke-width="2" opacity=".7"/>
      <circle cx="20" cy="82" r="8" fill="#A8D98F"/><circle cx="80" cy="82" r="8" fill="#A8D98F"/>
      <ellipse cx="50" cy="26" rx="16" ry="13" fill="#C8E6AE"/>
      <circle cx="44" cy="24" r="2.6" fill="#4A3B48"/><circle cx="56" cy="24" r="2.6" fill="#4A3B48"/>
      ${m === 'cheer' ? '<path d="M45 30 q5 6 10 0z" fill="#E0568C"/>' : '<path d="M45 30 q5 4 10 0" stroke="#4A3B48" stroke-width="2" fill="none" stroke-linecap="round"/>'}`,
    // bee
    bee: (m, face) => `<ellipse cx="34" cy="34" rx="16" ry="11" fill="#DCEEF9" opacity=".85" transform="rotate(-25 34 34)"/>
      <ellipse cx="66" cy="34" rx="16" ry="11" fill="#DCEEF9" opacity=".85" transform="rotate(25 66 34)"/>
      <ellipse cx="50" cy="60" rx="31" ry="28" fill="#FFE07A" stroke="#E8C24A" stroke-width="2"/>
      <path d="M32 44 q18 -6 36 0 M26 60 h48 M32 76 q18 6 36 0" stroke="#4A3B48" stroke-width="5" fill="none" opacity=".85"/>
      <path d="M42 24 q-4 -10 -10 -12 M58 24 q4 -10 10 -12" stroke="#4A3B48" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="31" cy="12" r="3" fill="#4A3B48"/><circle cx="69" cy="12" r="3" fill="#4A3B48"/>
      ${face(m, { eyeY: 54, mouthY: 66, cheek: '#F3A6A6' })}`,
    // seal pup
    seal: (m, face) => `<ellipse cx="50" cy="60" rx="32" ry="30" fill="#B9C3CE" stroke="#98A4B2" stroke-width="2"/>
      <path d="M18 76 q-12 6 -14 16 q12 2 20 -8z" fill="#98A4B2"/><path d="M82 76 q12 6 14 16 q-12 2 -20 -8z" fill="#98A4B2"/>
      <ellipse cx="50" cy="64" rx="13" ry="10" fill="#E7ECF1"/>
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#4A3B48"/>
      <path d="M34 66 h10 M34 70 h10 M56 66 h10 M56 70 h10" stroke="#98A4B2" stroke-width="1.5"/>
      ${face(m, { eyeY: 48, mouthY: 70, cheek: '#F3C4D6', noMouth: true })}`,
    // crab
    crab: (m, face) => `<path d="M18 46 q-12 -12 -4 -22 q10 6 12 16z" fill="#F08A6A"/><path d="M82 46 q12 -12 4 -22 q-10 6 -12 16z" fill="#F08A6A"/>
      <ellipse cx="50" cy="60" rx="35" ry="26" fill="#F4A183" stroke="#DE7A5C" stroke-width="2"/>
      <path d="M20 78 l-12 12 M30 84 l-8 14 M80 78 l12 12 M70 84 l8 14" stroke="#DE7A5C" stroke-width="4" stroke-linecap="round"/>
      <line x1="40" y1="40" x2="38" y2="26" stroke="#DE7A5C" stroke-width="3"/><line x1="60" y1="40" x2="62" y2="26" stroke="#DE7A5C" stroke-width="3"/>
      <circle cx="38" cy="24" r="6" fill="#fff" stroke="#DE7A5C" stroke-width="2"/><circle cx="62" cy="24" r="6" fill="#fff" stroke="#DE7A5C" stroke-width="2"/>
      <circle cx="38" cy="24" r="2.6" fill="#4A3B48"/><circle cx="62" cy="24" r="2.6" fill="#4A3B48"/>
      ${m === 'cheer' ? '<path d="M42 62 q8 9 16 0z" fill="#C43F73"/>' : '<path d="M42 62 q8 7 16 0" stroke="#4A3B48" stroke-width="2.6" fill="none" stroke-linecap="round"/>'}
      <circle cx="30" cy="62" r="4.5" fill="#F3C4D6" opacity=".8"/><circle cx="70" cy="62" r="4.5" fill="#F3C4D6" opacity=".8"/>`,
  };
  HL.addAnimals(A);
})(window.HL);
