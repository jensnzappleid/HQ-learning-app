/* Harper Learning — cute animal mascots as inline SVG. HL.animal('bunny', {size:64, mood:'happy'|'think'|'cheer'}) */
window.HL = window.HL || {};
(function (HL) {
  /** eyes + blush + mouth. opts.mouthY shifts the mouth for animals with a big nose/muzzle; opts.eyeY shifts the eyes. */
  const face = (mood, opts = {}) => {
    if (opts.noMouth) { const ey = opts.eyeY || 46; return `<circle cx="40" cy="${ey}" r="3.2" fill="#4A3B48"/><circle cx="60" cy="${ey}" r="3.2" fill="#4A3B48"/><circle cx="41.2" cy="${ey - 1.2}" r="1" fill="#fff"/><circle cx="61.2" cy="${ey - 1.2}" r="1" fill="#fff"/>`; }
    const ey = opts.eyeY || 46, my = opts.mouthY || 56;
    const eyes = mood === 'cheer'
      ? `<path d="M36 ${ey} q4 -5 8 0" stroke="#4A3B48" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M56 ${ey} q4 -5 8 0" stroke="#4A3B48" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : mood === 'think'
        ? `<circle cx="41" cy="${ey - 1}" r="3.2" fill="#4A3B48"/><circle cx="61" cy="${ey - 1}" r="3.2" fill="#4A3B48"/><circle cx="42.4" cy="${ey - 2.4}" r="1.1" fill="#fff"/><circle cx="62.4" cy="${ey - 2.4}" r="1.1" fill="#fff"/><path d="M33 ${ey - 8} q6 -3 10 -1" stroke="#4A3B48" stroke-width="2" fill="none" stroke-linecap="round"/>`
        : `<circle cx="40" cy="${ey}" r="3.2" fill="#4A3B48"/><circle cx="60" cy="${ey}" r="3.2" fill="#4A3B48"/><circle cx="41.2" cy="${ey - 1.2}" r="1" fill="#fff"/><circle cx="61.2" cy="${ey - 1.2}" r="1" fill="#fff"/>`;
    const mouth = mood === 'cheer'
      ? `<path d="M42 ${my - 1} q8 10 16 0 z" fill="#E0568C"/><path d="M45 ${my + 3} q5 3 10 0 z" fill="#FBB6CE"/>`
      : `<path d="M43 ${my - 1} q7 7 14 0" stroke="#4A3B48" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    return `<circle cx="32" cy="${my - 1}" r="4.5" fill="#FBB6CE" opacity=".8"/><circle cx="68" cy="${my - 1}" r="4.5" fill="#FBB6CE" opacity=".8"/>${eyes}${mouth}`;
  };
  const A = {
    bunny: (m) => `<ellipse cx="38" cy="18" rx="8" ry="18" fill="#FFFFFF" stroke="#F3C4D6" stroke-width="2"/><ellipse cx="38" cy="19" rx="4" ry="12" fill="#FBB6CE"/><ellipse cx="62" cy="18" rx="8" ry="18" fill="#FFFFFF" stroke="#F3C4D6" stroke-width="2"/><ellipse cx="62" cy="19" rx="4" ry="12" fill="#FBB6CE"/><circle cx="50" cy="52" r="30" fill="#FFFFFF" stroke="#F3C4D6" stroke-width="2"/><ellipse cx="50" cy="53" rx="3" ry="2" fill="#E0568C"/>${face(m)}`,
    cat: (m) => `<path d="M24 36 L26 10 L44 28 Z" fill="#D6C9F5" stroke="#B9A6EA" stroke-width="2"/><path d="M76 36 L74 10 L56 28 Z" fill="#D6C9F5" stroke="#B9A6EA" stroke-width="2"/><circle cx="50" cy="52" r="30" fill="#E7DEFA" stroke="#B9A6EA" stroke-width="2"/><path d="M47 52 h6 l-3 3z" fill="#9B7FE0"/><path d="M28 52 h12 M28 57 h12 M60 52 h12 M60 57 h12" stroke="#B9A6EA" stroke-width="1.5"/>${face(m)}`,
    fox: (m) => `<path d="M22 40 L24 8 L46 26 Z" fill="#FFB27A" stroke="#F19A5B" stroke-width="2"/><path d="M78 40 L76 8 L54 26 Z" fill="#FFB27A" stroke="#F19A5B" stroke-width="2"/><circle cx="50" cy="52" r="30" fill="#FFC79A" stroke="#F19A5B" stroke-width="2"/><path d="M28 58 q22 30 44 0 q-10 -6 -22 -6 q-12 0 -22 6z" fill="#FFF4EA"/><ellipse cx="50" cy="60" rx="3.5" ry="2.6" fill="#4A3B48"/>${face(m)}`,
    penguin: (m) => `<ellipse cx="50" cy="56" rx="32" ry="34" fill="#5C6B8A"/><ellipse cx="50" cy="60" rx="22" ry="26" fill="#FFFFFF"/><path d="M14 56 q-8 14 6 26" fill="#5C6B8A"/><path d="M86 56 q8 14 -6 26" fill="#5C6B8A"/><path d="M45 52 l5 6 l5 -6 z" fill="#F5A623"/><ellipse cx="40" cy="92" rx="8" ry="4" fill="#F5A623"/><ellipse cx="60" cy="92" rx="8" ry="4" fill="#F5A623"/>${face(m, { eyeY: 44, mouthY: 64 })}`,
    frog: (m) => `<circle cx="34" cy="26" r="10" fill="#A6E3B8" stroke="#7CCB95" stroke-width="2"/><circle cx="66" cy="26" r="10" fill="#A6E3B8" stroke="#7CCB95" stroke-width="2"/><ellipse cx="50" cy="56" rx="34" ry="28" fill="#B8EBD0" stroke="#7CCB95" stroke-width="2"/><circle cx="34" cy="27" r="4" fill="#4A3B48"/><circle cx="66" cy="27" r="4" fill="#4A3B48"/><circle cx="35.5" cy="25.5" r="1.3" fill="#fff"/><circle cx="67.5" cy="25.5" r="1.3" fill="#fff"/><circle cx="30" cy="60" r="5" fill="#FBB6CE" opacity=".8"/><circle cx="70" cy="60" r="5" fill="#FBB6CE" opacity=".8"/>${m === 'cheer' ? '<path d="M38 58 q12 12 24 0 z" fill="#E0568C"/>' : '<path d="M34 58 q16 14 32 0" stroke="#4A3B48" stroke-width="2.8" fill="none" stroke-linecap="round"/>'}`,
    chick: (m) => `<ellipse cx="50" cy="56" rx="31" ry="30" fill="#FFE98A" stroke="#F5D25A" stroke-width="2"/><path d="M42 20 q8 -12 16 0" stroke="#F5D25A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M45 54 l5 7 l5 -7 z" fill="#F5A623"/><path d="M20 58 q-10 6 -4 16" stroke="#F5D25A" stroke-width="3" fill="#FFE98A"/><path d="M80 58 q10 6 4 16" stroke="#F5D25A" stroke-width="3" fill="#FFE98A"/>${face(m, { mouthY: 66 })}`,
    panda: (m) => `<circle cx="28" cy="26" r="11" fill="#4A3B48"/><circle cx="72" cy="26" r="11" fill="#4A3B48"/><circle cx="50" cy="52" r="30" fill="#FFFFFF" stroke="#DDD" stroke-width="2"/><ellipse cx="39" cy="46" rx="8" ry="10" fill="#4A3B48"/><ellipse cx="61" cy="46" rx="8" ry="10" fill="#4A3B48"/><circle cx="40" cy="46" r="3.2" fill="#fff"/><circle cx="60" cy="46" r="3.2" fill="#fff"/><circle cx="40.8" cy="45.4" r="1.2" fill="#4A3B48"/><circle cx="60.8" cy="45.4" r="1.2" fill="#4A3B48"/><ellipse cx="50" cy="56" rx="3.5" ry="2.5" fill="#4A3B48"/><path d="M43 60 q7 7 14 0" stroke="#4A3B48" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="30" cy="58" r="4.5" fill="#FBB6CE" opacity=".8"/><circle cx="70" cy="58" r="4.5" fill="#FBB6CE" opacity=".8"/>`,
    bear: (m) => `<circle cx="27" cy="27" r="11" fill="#C9A27E"/><circle cx="73" cy="27" r="11" fill="#C9A27E"/><circle cx="27" cy="27" r="5" fill="#F3D6BE"/><circle cx="73" cy="27" r="5" fill="#F3D6BE"/><circle cx="50" cy="52" r="30" fill="#D9B48F" stroke="#C9A27E" stroke-width="2"/><ellipse cx="50" cy="60" rx="12" ry="9" fill="#F3D6BE"/><ellipse cx="50" cy="57" rx="4" ry="3" fill="#4A3B48"/>${face(m, { mouthY: 64 })}`,
    koala: (m) => `<circle cx="22" cy="34" r="15" fill="#B9BFC9"/><circle cx="78" cy="34" r="15" fill="#B9BFC9"/><circle cx="22" cy="34" r="8" fill="#F3C4D6"/><circle cx="78" cy="34" r="8" fill="#F3C4D6"/><circle cx="50" cy="52" r="29" fill="#CFD4DC" stroke="#B9BFC9" stroke-width="2"/><ellipse cx="50" cy="58" rx="7" ry="9" fill="#4A3B48"/>${face(m, { mouthY: 70 })}`,
    hedgehog: (m) => `<path d="M50 14 l6 12 l12 -8 l0 14 l14 -2 l-8 12 l14 6 l-14 6 l6 14 l-14 -6 l-2 14 l-10 -10 l-4 14 l-4 -14 l-10 10 l-2 -14 l-14 6 l6 -14 l-14 -6 l14 -6 l-8 -12 l14 2 l0 -14 l12 8z" fill="#8C6A56"/><circle cx="50" cy="56" r="24" fill="#F6DCC8"/><ellipse cx="50" cy="66" rx="4" ry="3" fill="#4A3B48"/>${face(m, { eyeY: 50, mouthY: 72 })}`,
  };
  HL.animalNames = Object.keys(A);
  /** register another pack of mascots; each drawer is fn(mood, face) => svg body */
  HL.addAnimals = function (pack) {
    Object.keys(pack).forEach((k) => { A[k] = (m) => pack[k](m, face); });
    HL.animalNames = Object.keys(A);
  };
  /* Harper's own animal pictures win over the drawn ones when there is one for that name.
   * They go in as a stylesheet, written once, so a page full of topic cards carries a short class
   * name per card instead of the same picture repeated in every one. */
  let stylesWritten = false;
  function writeAnimalStyles() {
    if (stylesWritten || typeof document === 'undefined' || !HL.animalImages) return;
    stylesWritten = true;
    const css = Object.keys(HL.animalImages)
      .map((k) => `.an-${k}{background-image:url(${HL.animalImages[k]})}`).join('\n');
    const el = document.createElement('style');
    el.id = 'animal-pictures';
    el.textContent = `.animal-img{display:inline-block;background-repeat:no-repeat;background-position:center bottom;background-size:contain;flex:none}\n${css}`;
    document.head.appendChild(el);
  }
  HL.animal = function (name, opts = {}) {
    const size = opts.size || 64;
    if (HL.animalImages && HL.animalImages[name]) {
      writeAnimalStyles();
      return `<span class="animal animal-img an-${name}" style="width:${size}px;height:${size}px" role="img" aria-label="${name}"></span>`;
    }
    // the three names that arrived with a picture but no drawing: if the pictures ever fail to
    // load, show something close rather than an unrelated bunny
    const fn = A[name] || A[{ dog: 'fox', giraffe: 'panda', dolphin: 'seal' }[name]] || A.bunny;
    const mood = opts.mood || 'happy';
    return `<svg class="animal animal-${name}" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${name}">${fn(mood)}</svg>`;
  };
})(window.HL);
