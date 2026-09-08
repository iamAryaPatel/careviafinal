import SearchBar from './SearchBar';

export default function HeroSection({ onSearch }) {
  return <>
    <section className="hero">
      <div className="container hero__content">
        <div className="hero__eyebrow"><span className="hero__status" /> JOB INTELLIGENCE / 01</div>
        <div className="hero__layout">
          <div>
            <h1 className="hero__title">Your next role.<br /><em>Properly sourced.</em></h1>
            <p className="hero__subtitle">One clean search across the job boards developers actually use. Less tab-switching, more signal.</p>
            <div className="hero__search-wrapper"><SearchBar onSearch={onSearch} /></div>
            <p className="hero__note">No account needed to explore. Sign in when you are ready to search.</p>
          </div>
          <aside className="hero__terminal" aria-label="Live source status">
            <div className="hero__terminal-head"><span>CARVIA / NETWORK</span><span>LIVE</span></div>
            <div className="hero__terminal-body">
              <p><i /> FINDWORK <b>CONNECTED</b></p><p><i /> ARBEITNOW <b>CONNECTED</b></p><p><i /> JOBICY <b>CONNECTED</b></p>
              <div className="hero__terminal-rule" /><p className="hero__terminal-search">&gt; waiting for query<span>_</span></p>
            </div>
          </aside>
        </div>
        <div className="hero__stats"><div><strong>05</strong><span>indexed sources</span></div><div><strong>&lt;8s</strong><span>search response target</span></div><div><strong>24/7</strong><span>freshness monitoring</span></div></div>
      </div>
    </section>
    <section className="proof-strip"><div className="container"><span>BUILT FOR PEOPLE WHO BUILD</span><span>FULL-STACK</span><span>DATA</span><span>PRODUCT</span><span>DESIGN</span><span>ENGINEERING</span></div></section>
    <section className="workflow container"><p className="section-kicker">THE SIMPLEST WAY TO FIND SIGNAL</p><div className="workflow__head"><h2>Search widely.<br />Decide quickly.</h2><p>Carvia keeps your hunt focused: a shared search layer, clear source attribution, and direct paths to each original listing.</p></div><div className="workflow__grid"><article><span>01</span><h3>Name the craft</h3><p>Search roles, technologies, or teams in your own words.</p></article><article><span>02</span><h3>Compare sources</h3><p>Filter the noise and see exactly where every listing came from.</p></article><article><span>03</span><h3>Move directly</h3><p>Open the original job post when a role earns your attention.</p></article></div></section>
  </>;
}
