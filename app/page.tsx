import Link from "next/link";

const tickerItems = [
  "Live: Tactical Rhythm Analysis - 14'",
  "Ticket Release: Mediterranean Derby - Oct 24",
  "Archive: The 1974 Ritual Re-examined",
  "Dispatch: Conviction in the Midfield",
];

const cultureStories = [
  {
    title: "Rituals of the Rambla",
    excerpt: "The pre-match liturgy that binds the city to the crest.",
    href: "/about",
  },
  {
    title: "Concrete & Soul",
    excerpt: "The Brutalist poetry of the stadium's third tier.",
    href: "/article/the-weave-of-the-blau",
  },
  {
    title: "Textiles of Identity",
    excerpt: "The sensory history of the Blaugrana weave.",
    href: "/article/the-weave-of-the-blau",
  },
];

const briefDispatches = [
  {
    stamp: "10:42 AM - DISPATCH",
    body: '"The rhythm of the passing game is not a tactic; it is a philosophy of patience."',
    featured: true,
  },
  {
    stamp: "Yesterday - DISPATCH",
    body: "New training ground rituals observed. Focus on silent communication.",
  },
  {
    stamp: "Oct 19 - DISPATCH",
    body: "Notes on the legacy of the Catalan youth system.",
  },
];

const vaultItems = [
  {
    issue: "Issue 04, 1974",
    title: "The Dutch Influence",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSluL7_QGAmz3bQ8oZs10-zQm7AcaileH9H_kvujw8Xqynkx71uR_7bMUYJc2dPikwnAwcMUsSHm6_tcllHT87JEgDqZPpTWAC_aW5S2Z_3kEfbml6SDyXP7rQjFrMim0mw44hbEkHYZhXLpu1UWAi0da-fPle5VFIk2GMkjEj-cnAfyBs9Ba-sS-QAPDi_U-zk3jaEQ5hj5wGl3oakvCYeoy2Evvz9lB1qylFAFy0sdPCQxrugJnIBcFhyR00sJ553ZLQSykgAA-4",
  },
  {
    issue: "Issue 12, 1992",
    title: "Wembley's Midnight Sun",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9oV0w67ns25NYqiuop3nczZGkq-0ZrIbFMeN6h4dWdQnZRLHMosVVBHS8m9fa6_jQdpP6NYok6bjS7CIO7wHuc2yV2dOJS24kE0EsreuUaw09y37bcACaFS95ivufHvULlfh2YQkbDTKVcFIm8OqpkChxUm3MZbY8tiNv87TMeHBrUldERakEbeJ6W4FMrtk3P_tpDEUnTzO3bTdrOOe8qswKkG18_p8JA6V_QFBJBYrQRevqB7nSoiJTVpdrbhINHD4ui6Wc89Gu",
  },
  {
    issue: "Issue 28, 2009",
    title: "Rome and the Six Seals",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_hv0tep9knrTq3gBczsOZEzWQ95RNSDKToJzu_2BMj_0S8U5fj8f3gKfI_Qe_R1GdzdyOsOVaWJu6OsiRYV7FF5-mKS72bgrsJatBzDKvYNOeKXUAnlIWOmUT3okfkt4dX2YS205p-htHuTjPrwssYhbyQQZVVLIWbOr0xDdfGg4zuzpgV6ilhDrg1dTOyttYG5TGeclFgvdii1_-FbXamAdc57MahODGSWSNC88pNfUFMHrEgNIllG0di4XAUwh0G_Z6MEuEkrlR",
  },
];

const reflections = [
  {
    quote:
      "To watch the team this season is to witness a return to the quiet confidence of the late 80s. It's not just the wins; it's the way the grass seems to settle after every pass.",
    byline: "Jordi V., Member since 1982",
  },
  {
    quote:
      "Inheritance is a burden for some, but for us, it is the only way to breathe.",
    byline: "Elena M., Journalism Fellow",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero home-shell" id="match-review">
        <div className="home-hero__copy">
          <div className="home-hero__meta">
            <span>Longform Journalism</span>
            <span className="home-hero__line" aria-hidden="true" />
            <span>14 Minute Read</span>
          </div>
          <h1 className="home-hero__title">The Last of the Catalan Romantics</h1>
          <p className="home-hero__dek">
            Inheritance is not merely about what is left behind, but what is carried
            forward with conviction. A deep dive into the ritual of identity at the
            modern Camp Nou.
          </p>
          <div className="home-hero__byline">
            <span>By Martí Perarnau</span>
            <Link href="/article/the-weave-of-the-blau">Read the Story</Link>
          </div>
        </div>
        <div className="home-hero__image">
          <img
            alt="Dramatic high-contrast black and white shot of concrete stadium arches with sharp shadows and morning mist"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8PKbGR5K3fjHL_XJo8kBBGWkAQnv_7VHEv5n309MxiLNJWOaepXFkdIWTTm7o7xlP5sNrH6hkNRKRruLSqLIx527bcU73glgIuEChx1e0s_WUIYuaqFh_QiWlj3rnh-ydpPbecyP39Zw_BNhLylzhHjyHhlNnVDnTMiUByLVZlX5FwkldKTchzgSyps1sdbr9Q1wWCpLip7FsOuuDxVJgGBlRK89SM2Fa-VEtdPuMczYQ7qpppSdvJgg5IW_KY6XbiOaOFKMrrFTJ"
          />
        </div>
      </section>

      <section className="home-ticker" id="match-notes" aria-label="Publication ticker">
        <div className="home-ticker__track">
          {[0, 1].map((index) => (
            <div className="home-ticker__group" key={index}>
              {tickerItems.map((item) => (
                <span className="home-ticker__item" key={`${index}-${item}`}>
                  <span className="home-ticker__dot" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="home-bento home-shell" id="cultural-heart">
        <article className="home-analysis-card">
          <div>
            <span className="home-kicker home-kicker--rose">Analysis & Tactics</span>
            <h2>The Geometry of Silence</h2>
            <p>
              How structural discipline creates the space for creative rebellion. A
              study of defensive positioning and collective soul.
            </p>
          </div>
          <div className="home-analysis-card__image">
            <img
              alt="Aerial view of empty football pitch markings at dusk with long geometric shadows across the grass"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwFBdCO85Tb4xlWqipX_mo3fyf2gZ3ikk1pOEgJGpT-7ivt4veXj8WmvIQAnvxkC4z-9jNpMxa5voEgccs3wJsy3jVYHOYXNIylBfJKyY335CvscGl_tiENZgtYmoDxZPd_Bh9C1F5hldwCze9wMyeSJYJkw-kewvW_jLChD6HaEhgolYnftvkYDXhFYiKzgr6oAgFLuIJVnZ3VoNFBuuO8epPiME6wwCY9gzewCsuzGGsEKeeiwfqCe37_c8Qnbit95zklFxL2SLx"
            />
          </div>
          <Link className="home-inline-link" href="/article/the-weave-of-the-blau">
            Read Analysis
          </Link>
        </article>

        <div className="home-culture-column">
          <span className="home-kicker home-kicker--gold">Culture</span>
          <div className="home-culture-column__stack">
            {cultureStories.map((story) => (
              <article key={story.title}>
                <h3>
                  <Link href={story.href}>{story.title}</Link>
                </h3>
                <p>{story.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="home-brief-column" id="brief">
          <span className="home-kicker">The Brief</span>
          <div className="home-brief-column__stack">
            {briefDispatches.map((item) => (
              <article
                className={item.featured ? "home-dispatch-card is-featured" : "home-dispatch-card"}
                key={item.stamp}
              >
                <span>{item.stamp}</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-vault" id="archive">
        <div className="home-vault__inner home-shell">
          <div className="home-vault__heading">
            <div>
              <span className="home-kicker home-kicker--gold">The Vault</span>
              <h2>The Archive of Conviction</h2>
            </div>
            <Link className="home-inline-link home-inline-link--light" href="/article/the-weave-of-the-blau">
              Enter Library
            </Link>
          </div>
          <div className="home-vault__grid">
            {vaultItems.map((item) => (
              <Link className="home-vault-card" href="/article/the-weave-of-the-blau" key={item.issue}>
                <div className="home-vault-card__image">
                  <img alt={item.title} src={item.image} />
                </div>
                <span>{item.issue}</span>
                <h3>{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-reflections home-shell" id="journalism">
        <div className="home-reflections__quotes">
          <span className="home-kicker home-kicker--rose">Reflections</span>
          <div className="home-reflections__stack">
            {reflections.map((item) => (
              <blockquote className="home-quote" key={item.byline}>
                <p>"{item.quote}"</p>
                <cite>- {item.byline}</cite>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="home-newsletter">
          <div id="dispatch" />
          <h2>The Weekly Dispatch</h2>
          <p>
            Literary dispatches, tactical deep-dives, and club history delivered
            every Sunday morning. No noise. Just conviction.
          </p>
          <form>
            <label className="sr-only" htmlFor="dispatch-email">
              Your electronic mail
            </label>
            <div className="home-newsletter__field">
              <input id="dispatch-email" name="email" placeholder="Your electronic mail" type="email" />
            </div>
            <button type="button">Subscribe to the Review</button>
            <p className="home-newsletter__note">
              Privacy is part of our ritual. We never share your data.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
