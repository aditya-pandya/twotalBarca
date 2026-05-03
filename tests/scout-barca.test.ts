import { describe, expect, it } from "vitest";

import { buildScoutArtifact, parseGoogleNewsRss, runScoutDiscovery } from "../scripts/newsroom/scout-barca-lib.mjs";

const NOW = "2026-04-09T18:10:00.000Z";

function makeTweet(
  id: string,
  text: string,
  {
    username = "FCBarcelona",
    createdAt = NOW,
    likeCount = 50,
    retweetCount = 10,
    replyCount = 6,
    photos,
  }: {
    username?: string;
    createdAt?: string;
    likeCount?: number;
    retweetCount?: number;
    replyCount?: number;
    photos?: Array<{ url: string; alt_text?: string }>;
  } = {},
) {
  return {
    id,
    text,
    createdAt,
    author: { username },
    likeCount,
    retweetCount,
    replyCount,
    photos,
  };
}

function makeRedditPost(
  id: string,
  title: string,
  {
    selftext = "",
    subreddit = "Barca",
    createdUtc = 1_775_759_800,
    score = 120,
    numComments = 18,
  }: {
    selftext?: string;
    subreddit?: string;
    createdUtc?: number;
    score?: number;
    numComments?: number;
  } = {},
) {
  return {
    kind: "t3",
    data: {
      id,
      title,
      selftext,
      permalink: `/r/${subreddit}/comments/${id}/sample/`,
      created_utc: createdUtc,
      score,
      num_comments: numComments,
    },
  };
}

async function runTrustedDiscoveryFixture() {
  const seenQueries: string[] = [];
  const seenJsonUrls: string[] = [];
  const seenTextUrls: string[] = [];
  const seenYouTubeChannels: string[] = [];
  const seenYouTubeVideos: string[] = [];

  const results = await runScoutDiscovery({
    now: NOW,
    fetchTextImpl: async (url) => {
      seenTextUrls.push(url);

      if (url.includes("fcbarcelona.com/en/football/first-team/news")) {
        return [
          "Pedri trains ahead of Espanyol derby and Atletico second leg.",
          "Frenkie de Jong and Dani Olmo are back in focus before Madrid.",
        ].join("\n");
      }
      if (url.includes("fcbarcelona.com/en/football/first-team/results")) {
        return ["FC Barcelona 2-1 Espanyol", "Atletico Madrid 0-2 FC Barcelona"].join("\n");
      }
      if (url.includes("fcbarcelona.com/en/football/first-team/squad")) {
        return ["Pedri Midfielder", "Frenkie de Jong Midfielder", "Lamine Yamal Forward"].join("\n");
      }
      if (url.includes("fcbarcelona.com/en/football/womens-football/news")) {
        return [
          "Aitana Bonmati leads Barça Femení into the Champions League semi-final against Bayern.",
          "Alexia Putellas returns as Barça Women prepare for Bayern.",
        ].join("\n");
      }
      if (url.includes("fcbarcelona.com/en/football/womens-football/results")) {
        return ["FC Barcelona Women 4-0 Madrid CFF", "Barcelona Women 3-1 Chelsea Women"].join("\n");
      }
      if (url.includes("fcbarcelona.com/en/football/womens-football/squad")) {
        return ["Aitana Bonmati Midfielder", "Alexia Putellas Midfielder", "Claudia Pina Forward"].join("\n");
      }
      if (url.includes("news.google.com") && url.includes("Barcelona%20Atletico%20Espanyol")) {
        return `
          <rss><channel>
            <item>
              <title>Barcelona balance Espanyol derby with Atletico second leg - Reuters</title>
              <link>https://example.com/reuters-derby</link>
              <pubDate>Thu, 09 Apr 2026 17:40:00 GMT</pubDate>
              <description><![CDATA[Pedri and Frenkie de Jong are central to Flick's selection call before Madrid.]]></description>
              <source url="https://www.reuters.com">Reuters</source>
            </item>
            <item>
              <title>Republic World speculates on Barcelona rotation</title>
              <link>https://example.com/republic-world</link>
              <pubDate>Thu, 09 Apr 2026 16:10:00 GMT</pubDate>
              <description><![CDATA[This should be filtered out.]]></description>
              <source url="https://www.republicworld.com">Republic World</source>
            </item>
          </channel></rss>
        `;
      }
      if (url.includes("news.google.com") && url.includes("FC%20Barcelona%20Pedri%20Rashford%20Olmo%20Yamal")) {
        return `
          <rss><channel>
            <item>
              <title>Pedri and Olmo shape Barcelona's derby plan - ESPN</title>
              <link>https://example.com/espn-pedri</link>
              <pubDate>Thu, 09 Apr 2026 16:55:00 GMT</pubDate>
              <description><![CDATA[Selection questions now define Barcelona's current week.]]></description>
              <source url="https://www.espn.com">ESPN</source>
            </item>
            <item>
              <title>Barca Universal aggregates rumors again</title>
              <link>https://example.com/barca-universal</link>
              <pubDate>Thu, 09 Apr 2026 16:00:00 GMT</pubDate>
              <description><![CDATA[This should also be filtered out.]]></description>
              <source url="https://www.barcauniversal.com">Barca Universal</source>
            </item>
          </channel></rss>
        `;
      }
      if (url.includes("news.google.com") && url.includes("Barcelona%20Women%20Aitana%20Alexia%20Bayern%20Liga%20F")) {
        return `
          <rss><channel>
            <item>
              <title>Barcelona Women lean on Aitana and Alexia before Bayern - Reuters</title>
              <link>https://example.com/reuters-femeni</link>
              <pubDate>Thu, 09 Apr 2026 17:15:00 GMT</pubDate>
              <description><![CDATA[Liga F form and the Bayern semi-final are setting the latest Femení frame.]]></description>
              <source url="https://www.reuters.com">Reuters</source>
            </item>
            <item>
              <title>Bayern test sharpens for Barcelona Women - BBC Sport</title>
              <link>https://example.com/bbc-femeni</link>
              <pubDate>Thu, 09 Apr 2026 16:45:00 GMT</pubDate>
              <description><![CDATA[Aitana Bonmati and Alexia Putellas headline the build-up.]]></description>
              <source url="https://www.bbc.com/sport">BBC Sport</source>
            </item>
          </channel></rss>
        `;
      }
      if (url.includes("news.google.com") && url.includes("Barcelona%20Flick%20press%20conference%20Espanyol%20Atletico%20mixed%20zone")) {
        return `
          <rss><channel>
            <item>
              <title>Flick says Barcelona must manage Espanyol before Atletico return - AP News</title>
              <link>https://example.com/ap-presser</link>
              <pubDate>Thu, 09 Apr 2026 17:25:00 GMT</pubDate>
              <description><![CDATA[The coach used his pre-match press conference to frame selection and minute management.]]></description>
              <source url="https://apnews.com">AP News</source>
            </item>
            <item>
              <title>Barcelona mixed-zone talk keeps Pedri and Frenkie central - Reuters</title>
              <link>https://example.com/reuters-mixed-zone</link>
              <pubDate>Thu, 09 Apr 2026 17:05:00 GMT</pubDate>
              <description><![CDATA[The post-training line remained focused on availability before the derby and Madrid trip.]]></description>
              <source url="https://www.reuters.com">Reuters</source>
            </item>
          </channel></rss>
        `;
      }
      if (url.includes("espn.com/soccer/team/fixtures")) {
        return "Sun, Apr 12 Espanyol vs Barcelona";
      }
      if (url.includes("espn.com/soccer/team/results")) {
        return "Wed, Apr 8 Atletico Madrid 0 - 2 Barcelona";
      }
      if (url.includes("espn.com/soccer/standings")) {
        return "1 Barcelona 72 pts\n2 Atletico Madrid 69 pts";
      }

      throw new Error(`Unexpected text URL: ${url}`);
    },
    fetchJsonImpl: async (url) => {
      seenJsonUrls.push(url);

      if (url.includes("/r/Barca/new.json")) {
        return {
          data: {
            children: [
              makeRedditPost(
                "espanyol-rotation",
                "Espanyol between the legs is now Flick's biggest selection problem",
                {
                  selftext: "Pedri, Frenkie and Olmo all matter before the second leg.",
                },
              ),
            ],
          },
        };
      }
      if (url.includes("/r/Barca/top.json")) {
        return {
          data: {
            children: [
              makeRedditPost("cubarsi-support", "Keep the Cubarsi blame in proportion after the red card", {
                selftext: "Support him, but keep the focus on the wider football problem.",
              }),
            ],
          },
        };
      }
      if (url.includes("/r/soccer/search.json")) {
        return {
          data: {
            children: [
              makeRedditPost(
                "second-leg",
                "Barcelona vs Atletico second leg talk turns to Cubarsi and midfield balance",
                {
                  subreddit: "soccer",
                },
              ),
            ],
          },
        };
      }
      if (url.includes("/r/FCBFemeni/new.json")) {
        return {
          data: {
            children: [
              makeRedditPost(
                "femeni-bayern",
                "Aitana and Alexia set the tone for Barça Femení before Bayern",
                {
                  subreddit: "FCBFemeni",
                  selftext: "Champions League semi-final chatter is building.",
                },
              ),
            ],
          },
        };
      }
      if (url.includes("/r/WomensSoccer/search.json")) {
        return {
          data: {
            children: [
              makeRedditPost(
                "woso-barca-bayern",
                "Barcelona Women vs Bayern already feels like the tie of the round",
                {
                  subreddit: "WomensSoccer",
                  selftext: "Aitana remains central to the whole conversation.",
                },
              ),
            ],
          },
        };
      }

      throw new Error(`Unexpected JSON URL: ${url}`);
    },
    birdSearchImpl: async (query) => {
      seenQueries.push(query);

      if (query.includes("from:FCBarcelona OR from:FCBarcelona_es")) {
        return [
          makeTweet("official-men-1", "Training continues ahead of Espanyol and the Atletico return leg."),
          makeTweet("official-men-2", "Pedri, Frenkie and Dani Olmo work with the group before the derby."),
        ];
      }
      if (query.includes("from:FCBFemeni")) {
        return [
          makeTweet(
            "official-women-1",
            "Aitana, Alexia and Barça Femení prepare for Bayern in the Champions League semi-final.",
            { username: "FCBFemeni" },
          ),
        ];
      }
      if (query.includes("from:TheAthleticFC OR from:ESPNFC")) {
        return [
          makeTweet(
            "trusted-media-1",
            "ESPNFC: Pedri and Frenkie de Jong are central to Barcelona's Espanyol-before-Atletico selection puzzle.",
            {
              username: "ESPNFC",
              photos: [
                {
                  url: "https://images.example.com/pedri-frenkie-training.jpg",
                  alt_text: "Pedri and Frenkie de Jong in training before the derby.",
                },
              ],
            },
          ),
          makeTweet(
            "trusted-media-2",
            "The Athletic: Aitana drives Barcelona Women into the Bayern semi-final with Alexia back in the frame.",
            { username: "TheAthleticFC" },
          ),
        ];
      }
      if (query.includes("from:OptaJose")) {
        return [
          makeTweet(
            "trusted-stats-1",
            "OptaJose: Barcelona have won their last three league matches before a Champions League second leg.",
            { username: "OptaJose", likeCount: 140, retweetCount: 42, replyCount: 8 },
          ),
        ];
      }

      throw new Error(`Unexpected bird query: ${query}`);
    },
    listYouTubeVideosImpl: async (channelUrl) => {
      seenYouTubeChannels.push(channelUrl);

      if (channelUrl.includes("@FCBarcelona/videos")) {
        return [
          {
            id: "men-presser-1",
            title: "Hansi Flick press conference before Espanyol and Atletico",
            url: "https://www.youtube.com/watch?v=men-presser-1",
            publishedAt: NOW,
          },
          {
            id: "women-presser-1",
            title: "Barça Femení press conference before Bayern",
            url: "https://www.youtube.com/watch?v=women-presser-1",
            publishedAt: NOW,
          },
        ];
      }

      throw new Error(`Unexpected YouTube channel URL: ${channelUrl}`);
    },
    fetchYouTubeTranscriptImpl: async (videoUrl) => {
      seenYouTubeVideos.push(videoUrl);

      if (videoUrl.endsWith("women-presser-1")) {
        return {
          title: "Barça Femení press conference before Bayern",
          publishedAt: NOW,
          transcript:
            "Aitana says Barça Femení are ready for Bayern and Alexia calls the semi-final the biggest test of the month.",
        };
      }
      if (videoUrl.endsWith("men-presser-1")) {
        return {
          title: "Hansi Flick press conference before Espanyol and Atletico",
          publishedAt: NOW,
          transcript:
            "Flick says Pedri and Frenkie are fit enough for the derby. The coach says Barcelona must manage minutes before the Atletico second leg.",
        };
      }

      throw new Error(`Unexpected YouTube video URL: ${videoUrl}`);
    },
  });

  return { results, seenQueries, seenJsonUrls, seenTextUrls, seenYouTubeChannels, seenYouTubeVideos };
}

describe("Barca scout discovery", () => {
  it("filters Google News RSS to trusted publishers only", () => {
    const items = parseGoogleNewsRss(
      `
        <rss><channel>
          <item>
            <title>Barcelona manage derby and second leg - Reuters</title>
            <link>https://example.com/reuters</link>
            <pubDate>Thu, 09 Apr 2026 17:40:00 GMT</pubDate>
            <description><![CDATA[Trusted coverage.]]></description>
            <source url="https://www.reuters.com">Reuters</source>
          </item>
          <item>
            <title>Pedri shapes Barca's week - ESPN FC</title>
            <link>https://example.com/espnfc</link>
            <pubDate>Thu, 09 Apr 2026 17:00:00 GMT</pubDate>
            <description><![CDATA[Trusted coverage.]]></description>
            <source url="https://www.espn.com">ESPN FC</source>
          </item>
          <item>
            <title>Barca Universal rumour round-up</title>
            <link>https://example.com/barca-universal</link>
            <pubDate>Thu, 09 Apr 2026 16:30:00 GMT</pubDate>
            <description><![CDATA[Should be filtered.]]></description>
            <source url="https://www.barcauniversal.com">Barca Universal</source>
          </item>
          <item>
            <title>Sports Mole predicts Barcelona lineup</title>
            <link>https://example.com/sports-mole</link>
            <pubDate>Thu, 09 Apr 2026 16:10:00 GMT</pubDate>
            <description><![CDATA[Should be filtered.]]></description>
            <source url="https://www.sportsmole.co.uk">Sports Mole</source>
          </item>
          <item>
            <title>AP News reviews Barcelona's derby choices</title>
            <link>https://example.com/ap</link>
            <pubDate>Thu, 09 Apr 2026 15:55:00 GMT</pubDate>
            <description><![CDATA[Trusted coverage.]]></description>
            <source url="https://apnews.com">AP News</source>
          </item>
        </channel></rss>
      `,
      "rss:google-news-player-watch",
      { fallbackPublishedAt: NOW },
    );

    expect(items.map((item) => item.label)).toEqual([
      "Barcelona manage derby and second leg - Reuters",
      "Pedri shapes Barca's week - ESPN FC",
      "AP News reviews Barcelona's derby choices",
    ]);
    expect(JSON.stringify(items)).not.toMatch(/Barca Universal|Sports Mole/i);
  });

  it("uses trusted X, official transcripts, and women's source tranches without fan-account queries", async () => {
    const { results, seenQueries, seenJsonUrls, seenTextUrls, seenYouTubeChannels, seenYouTubeVideos } = await runTrustedDiscoveryFixture();

    expect(results.map((result) => result.source)).toEqual(
      expect.arrayContaining([
        "x:official-club-men",
        "x:official-club-women",
        "x:trusted-football-media",
        "x:trusted-football-stats",
        "reddit:r/Barca:new",
        "reddit:r/Barca:top-week",
        "reddit:r/soccer:barca-search",
        "reddit:r/FCBFemeni:new",
        "reddit:r/WomensSoccer:barca-search",
        "web:fcbarcelona-women-news",
        "web:fcbarcelona-women-results",
        "web:fcbarcelona-women-squad",
        "web:fcbarcelona-men-video-transcripts",
        "web:fcbarcelona-women-video-transcripts",
        "rss:google-news-women-watch",
        "rss:google-news-press-conference-watch",
      ]),
    );
    expect(results.map((result) => result.source)).not.toContain("x:BarcaUniversal");
    expect(results.map((result) => result.source)).not.toContain("x:barcacentre");
    expect(seenQueries.some((query) => /BarcaUniversal|barcacentre/i.test(query))).toBe(false);
    expect(seenJsonUrls.some((url) => url.includes("/r/FCBFemeni/new.json"))).toBe(true);
    expect(seenJsonUrls.some((url) => url.includes("/r/WomensSoccer/search.json"))).toBe(true);
    expect(seenTextUrls.some((url) => url.includes("/football/womens-football/news"))).toBe(true);
    expect(seenTextUrls.some((url) => url.includes("Barcelona%20Women%20Aitana%20Alexia%20Bayern%20Liga%20F"))).toBe(true);
    expect(seenTextUrls.some((url) => url.includes("Barcelona%20Flick%20press%20conference%20Espanyol%20Atletico%20mixed%20zone"))).toBe(true);
    expect(seenYouTubeChannels).toContain("https://www.youtube.com/@FCBarcelona/videos");
    expect(seenYouTubeVideos).toEqual(
      expect.arrayContaining([
        "https://www.youtube.com/watch?v=men-presser-1",
        "https://www.youtube.com/watch?v=women-presser-1",
      ]),
    );
  });

  it("lets women's sources create candidates while keeping Reddit chatter subordinate to trusted evidence", async () => {
    const { results } = await runTrustedDiscoveryFixture();
    const artifact = buildScoutArtifact(results, NOW);

    const espanyolCandidate = artifact.candidates.find((candidate) => candidate.id === "espanyol-between-the-legs");
    const womenCandidate = artifact.candidates.find((candidate) => candidate.id === "femeni-bayern-pulse");
    const redditStatus = artifact.sourceStatuses.find((status) => status.source === "reddit:r/Barca:new");
    const femeniStatus = artifact.sourceStatuses.find((status) => status.source === "web:fcbarcelona-women-news");
    const womenTranscriptStatus = artifact.sourceStatuses.find((status) => status.source === "web:fcbarcelona-women-video-transcripts");

    expect(artifact.candidates[0]?.id).toBe("espanyol-between-the-legs");
    expect(espanyolCandidate?.evidence[0]?.source).not.toMatch(/^reddit:/);
    expect(redditStatus?.matchedCandidateIds).toContain("espanyol-between-the-legs");
    expect(redditStatus?.contributionCount).toBeGreaterThan(0);

    expect(womenCandidate).toBeDefined();
    expect(womenCandidate?.evidence.map((item) => item.source)).toEqual(
      expect.arrayContaining([
        "web:fcbarcelona-women-news",
        "web:fcbarcelona-women-video-transcripts",
        "rss:google-news-women-watch",
        "x:official-club-women",
        "reddit:r/FCBFemeni:new",
      ]),
    );
    expect(womenCandidate?.calibration.needsWomenDepth).toBe(false);
    expect(femeniStatus?.matchedCandidateIds).toContain("femeni-bayern-pulse");
    expect(womenTranscriptStatus?.matchedCandidateIds).toContain("femeni-bayern-pulse");
  });

  it("adds cluster, feedback, and image summaries to the scout artifact", async () => {
    const { results } = await runTrustedDiscoveryFixture();
    const artifact = buildScoutArtifact(results, NOW, {
      operatorFeedback: [
        {
          id: "feedback-1",
          targetType: "candidate",
          targetId: "espanyol-between-the-legs",
          targetLabel: "Espanyol between the legs is the real selection test",
          verdict: "imagery-needed",
          note: "Keep one review-only social preview around until a reusable replacement exists.",
          createdAt: NOW,
        },
      ],
    });

    const espanyolCluster = artifact.themeClusters.find((cluster) => cluster.candidateIds.includes("espanyol-between-the-legs"));
    const womenTrack = artifact.coverageSummary.tracks.find((track) => track.id === "women");
    const espanyolCandidate = artifact.candidates.find((candidate) => candidate.id === "espanyol-between-the-legs");

    expect(artifact.qualitySummary.crossPlatformClusterCount).toBeGreaterThan(0);
    expect(artifact.qualitySummary.trustedBackedCandidateCount).toBeGreaterThan(0);
    expect(espanyolCluster?.crossPlatform).toBe(true);
    expect(espanyolCluster?.title).toBe("Espanyol selection squeeze");
    expect(espanyolCluster?.theme).toMatch(/Selection and availability around Espanyol/i);
    expect(espanyolCluster?.theme).not.toMatch(/^Pedri, Frenkie/i);
    expect(espanyolCluster?.sourceFamilies).toEqual(expect.arrayContaining(["reddit", "x"]));
    expect(espanyolCluster?.representativeEvidence.length).toBeGreaterThan(0);
    expect(womenTrack?.candidateCount).toBeGreaterThan(0);
    expect(womenTrack?.trustedEvidenceCount).toBeGreaterThan(0);
    expect(espanyolCandidate?.calibration.label).toBe("well-backed");
    expect(espanyolCandidate?.imageLead).toMatchObject({
      src: "https://images.example.com/pedri-frenkie-training.jpg",
      alt: "Pedri and Frenkie de Jong in training before the derby.",
      status: "review-needed-social-preview",
    });
    expect(espanyolCluster?.imageLead).toMatchObject({
      src: "https://images.example.com/pedri-frenkie-training.jpg",
      status: "review-needed-social-preview",
    });
    expect(artifact.imageSummary.reviewNeededCount).toBeGreaterThan(0);
    expect(artifact.feedbackSummary.entryCount).toBe(1);
    expect(artifact.feedbackSummary.verdictCounts["imagery-needed"]).toBe(1);
  });

  it("keeps the scout running when transcript lanes are unavailable", async () => {
    const results = await runScoutDiscovery({
      now: NOW,
      fetchTextImpl: async () => "",
      fetchJsonImpl: async () => ({ data: { children: [] } }),
      birdSearchImpl: async () => [],
      listYouTubeVideosImpl: async () => {
        throw new Error("yt-dlp unavailable");
      },
      fetchYouTubeTranscriptImpl: async () => {
        throw new Error("transcript unavailable");
      },
    });

    expect(results.find((result) => result.source === "web:fcbarcelona-men-video-transcripts")?.ok).toBe(false);
    expect(results.find((result) => result.source === "web:fcbarcelona-women-video-transcripts")?.ok).toBe(false);
    expect(results.some((result) => result.source === "x:official-club-men")).toBe(true);
  });

  it("flags repeated low-signal sources for calibration review", () => {
    const artifact = buildScoutArtifact(
      [
        {
          source: "web:espn-standings",
          family: "web",
          label: "ESPN standings via Jina",
          target: "https://example.com/standings",
          ok: true,
          fetchedAt: NOW,
          itemCount: 1,
          detail: "Checked standings context.",
          items: [
            {
              id: "standings-1",
              family: "web",
              source: "web:espn-standings",
              label: "League table snapshot",
              text: "Mallorca and Sevilla trade places in midtable.",
              publishedAt: NOW,
              engagement: 0,
            },
          ],
        },
      ],
      NOW,
      {
        previousArtifact: {
          schemaVersion: 1,
          generatedAt: "2026-04-09T16:00:00.000Z",
          sourceStatuses: [
            {
              source: "web:espn-standings",
              family: "web",
              label: "ESPN standings via Jina",
              target: "https://example.com/standings",
              ok: true,
              fetchedAt: "2026-04-09T16:00:00.000Z",
              itemCount: 1,
              detail: "Checked standings context.",
              sourceRole: "trusted",
              sampleItems: ["League table snapshot"],
              contributionCount: 0,
              contributionEfficiency: 0,
              contributionSample: [],
              matchedCandidateIds: [],
              matchedCandidateTitles: [],
              qualityLabel: "quiet",
              repeatLowSignal: false,
            },
          ],
          candidates: [],
          themeClusters: [],
          calibrationPrompts: [],
          sourceExpansionSuggestions: [],
          qualitySummary: {
            headline: "quiet run",
            evidenceCount: 1,
            sourceCount: 1,
            healthySourceCount: 1,
            candidateCount: 0,
            clusterCount: 0,
            crossPlatformClusterCount: 0,
            trustedBackedCandidateCount: 0,
            chatterHeavyCandidateCount: 0,
            womenCoverageGapCount: 0,
            weakSourceCount: 1,
          },
          coverageSummary: {
            tracks: [],
            weakSpots: ["No Barça-specific evidence surfaced from standings context."],
          },
          sources: [],
        },
      },
    );

    expect(artifact.sourceStatuses[0]?.repeatLowSignal).toBe(true);
    expect(artifact.calibrationPrompts.some((prompt) => prompt.kind === "source-quality-gap")).toBe(true);
  });
});
