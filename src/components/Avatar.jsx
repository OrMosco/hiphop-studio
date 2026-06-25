import { AVATAR_COLORS } from '../lib/constants';

/**
 * Single avatar circle showing the first letter of a name.
 * @param {string}  name     – student name (displays first char)
 * @param {number}  index    – palette index (cycles through AVATAR_COLORS)
 * @param {number}  size     – diameter in px (default 28)
 * @param {number}  fontSize – override font size
 * @param {string}  border   – border color (match parent card bg)
 * @param {boolean} overlap  – if true, adds negative left margin for stacking
 */
export function Avatar({ name, index = 0, size = 28, fontSize, border = '#141414', overlap = false }) {
  const { bg, text } = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const fs = fontSize ?? Math.round(size * 0.4);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      color: text,
      fontSize: fs,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${border}`,
      flexShrink: 0,
      marginRight: overlap ? -Math.round(size * 0.25) : 0,
      position: 'relative',
      zIndex: 10,
    }}>
      {name?.[0] ?? '?'}
    </div>
  );
}

/**
 * Overlapping row of avatars + overflow count chip.
 * @param {Array}  students   – array of { name, id }
 * @param {number} max        – max avatars to show before +N chip (default 4)
 * @param {number} size       – avatar diameter in px
 * @param {string} cardBg     – parent card background color (for border)
 */
export function AvatarStack({ students = [], max = 4, size = 26, cardBg = '#141414' }) {
  const visible  = students.slice(0, max);
  const overflow = students.length - visible.length;

  return (
    <div style={{ display: 'flex', direction: 'ltr', alignItems: 'center' }}>
      {visible.map((s, i) => (
        <Avatar
          key={s.id ?? i}
          name={s.name}
          index={i}
          size={size}
          border={cardBg}
          overlap={i < visible.length - 1 || overflow > 0}
        />
      ))}
      {overflow > 0 && (
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#1e1e1e',
          color: '#666',
          fontSize: Math.round(size * 0.38),
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${cardBg}`,
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  );
}
