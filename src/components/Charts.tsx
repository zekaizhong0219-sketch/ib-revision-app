interface BarSeries {
  label: string;
  values: number[];
  color: string;
}

/** Simple stacked vertical bar chart rendered as SVG. */
export function BarChart({ labels, series, height = 140, title }: { labels: string[]; series: BarSeries[]; height?: number; title: string }) {
  const n = labels.length;
  const W = 600;
  const H = height;
  const pad = { l: 28, r: 6, t: 8, b: 20 };
  const totals = labels.map((_, i) => series.reduce((s, x) => s + x.values[i], 0));
  const max = Math.max(1, ...totals);
  const niceMax = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
  const bw = (W - pad.l - pad.r) / n;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / niceMax);
  const ticks = [0, niceMax / 2, niceMax];
  const every = Math.ceil(n / 8);
  return (
    <figure className="chart" style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        <title>{title}</title>
        {ticks.map((t) => (
          <g key={t}>
            <line className="axis" x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} strokeDasharray={t === 0 ? undefined : '3 4'} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {labels.map((lab, i) => {
          let acc = 0;
          return (
            <g key={i}>
              {series.map((s) => {
                const v = s.values[i];
                const y0 = y(acc);
                acc += v;
                const y1 = y(acc);
                return v > 0 ? (
                  <rect key={s.label} x={pad.l + i * bw + bw * 0.15} width={bw * 0.7} y={y1} height={Math.max(0, y0 - y1)} rx={2} fill={s.color}>
                    <title>{`${lab}: ${v} ${s.label}`}</title>
                  </rect>
                ) : null;
              })}
              {i % every === 0 && (
                <text x={pad.l + i * bw + bw / 2} y={H - 5} textAnchor="middle">
                  {lab}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {series.length > 1 && (
        <figcaption className="row small muted" style={{ marginTop: 4 }}>
          {series.map((s) => (
            <span key={s.label} className="row" style={{ gap: 4 }}>
              <span className="dot" style={{ background: s.color }} /> {s.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

export interface HBarItem {
  key: string;
  name: string;
  value: number | null;
  detail?: string;
}

/** Horizontal percentage bars, coloured by value (red → amber → green). */
export function HBars({ items, emptyText = 'No data yet' }: { items: HBarItem[]; emptyText?: string }) {
  if (!items.length) return <p className="muted small">{emptyText}</p>;
  return (
    <div className="hbars">
      {items.map((it) => {
        const v = it.value;
        const color = v === null ? 'var(--border)' : v < 0.5 ? 'var(--bad)' : v < 0.75 ? 'var(--warn)' : 'var(--good)';
        return (
          <div className="hbar" key={it.key} title={it.detail}>
            <span className="name">{it.name}</span>
            <span className="track">
              <span className="fill" style={{ display: 'block', width: `${(v ?? 0) * 100}%`, background: color }} />
            </span>
            <span className="val">{v === null ? '—' : `${Math.round(v * 100)}%`}</span>
          </div>
        );
      })}
    </div>
  );
}
