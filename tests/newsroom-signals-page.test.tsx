import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/newsroom-io", () => ({
  loadNewsroomData: vi.fn(async () => ({
    signals: [
      {
        id: "barca-live-scout-espanyol-between-the-legs",
        slug: "barca-live-scout-espanyol-between-the-legs",
        sourceId: "source-barca-live-scout",
        sourceSlug: "barca-live-scout",
        signalType: "match",
        status: "new",
        title: "Espanyol between the legs is the real selection test",
        summary: "Selection context is active.",
        eventAt: "2026-04-09T18:10:00.000Z",
        createdAt: "2026-04-09T18:10:00.000Z",
        updatedAt: "2026-04-09T18:10:00.000Z",
        urgency: "critical",
        confidence: 0.9,
        tags: ["espanyol", "rotation"],
        assignmentSuggestion: {
          title: "Espanyol between the legs",
          kind: "article",
          owner: "editor-in-chief",
          approver: "editor-in-chief",
          deadline: "2026-04-10T02:10:00.000Z",
          brief: "Frame the selection question.",
          deliverables: ["Draft"],
        },
      },
    ],
    ingestionReport: {
      schemaVersion: 1,
      generatedAt: "2026-04-09T18:10:00.000Z",
      sourceCount: 1,
      enabledSourceCount: 1,
      signalCount: 1,
      assignmentSuggestionCount: 1,
      activeSignals: ["barca-live-scout-espanyol-between-the-legs"],
    },
  })),
  loadScoutFeedbackState: vi.fn(async () => ({
    schemaVersion: 1,
    updatedAt: "2026-04-09T19:05:00.000Z",
    entries: [
      {
        id: "feedback-1",
        targetType: "candidate",
        targetId: "espanyol-between-the-legs",
        targetLabel: "Espanyol between the legs is the real selection test",
        verdict: "promising",
        note: "Keep the derby framing, but ground it in concrete lineup choices.",
        createdAt: "2026-04-09T19:05:00.000Z",
      },
    ],
  })),
  loadBarcaScoutArtifact: vi.fn(async () => ({
    schemaVersion: 1,
    generatedAt: "2026-04-09T18:10:00.000Z",
    sourceStatuses: [
      {
        source: "x:trusted-football-media",
        family: "x",
        label: "Trusted football media X",
        target: "from:TheAthleticFC OR from:ESPNFC",
        ok: true,
        fetchedAt: "2026-04-09T18:10:00.000Z",
        itemCount: 2,
        detail: "Trusted football reporting.",
        sourceRole: "trusted",
        sampleItems: ["Pedri and Frenkie shape the derby plan"],
        contributionCount: 2,
        contributionEfficiency: 1,
        contributionSample: ["Pedri and Frenkie shape the derby plan"],
        matchedCandidateIds: ["espanyol-between-the-legs"],
        matchedCandidateTitles: ["Espanyol between the legs is the real selection test"],
        qualityLabel: "core",
        repeatLowSignal: false,
      },
    ],
    candidates: [
      {
        id: "espanyol-between-the-legs",
        title: "Espanyol between the legs is the real selection test",
        summary: "The derby now sits between the Atlético legs.",
        eventAt: "2026-04-09T18:10:00.000Z",
        signalType: "match",
        urgency: "critical",
        tags: ["espanyol", "rotation", "pedri"],
        priorityScore: 96,
        priorityReason: "Trusted, official, and chatter sources overlap.",
        assignmentTopic: "Espanyol vs Barcelona / rotation",
        assignmentSuggestion: {
          title: "Espanyol between the legs",
          kind: "article",
          owner: "editor-in-chief",
          approver: "editor-in-chief",
          deadline: "2026-04-10T02:10:00.000Z",
          brief: "Frame the selection question.",
          deliverables: ["Draft"],
        },
        calibration: {
          label: "well-backed",
          note: "Official, trusted, and chatter evidence all align on the same selection theme.",
          officialEvidenceCount: 2,
          trustedEvidenceCount: 2,
          chatterEvidenceCount: 1,
          referenceEvidenceCount: 0,
          sourceFamilyCount: 3,
          crossPlatform: true,
          needsTrustedConfirmation: false,
          needsWomenDepth: false,
        },
        imageStatus: "review-needed-social-preview",
        imageLead: {
          src: "https://images.example.com/pedri-frenkie-training.jpg",
          alt: "Pedri and Frenkie de Jong in training before the derby.",
          href: "https://x.com/ESPNFC/status/123",
          source: "x:trusted-football-media",
          label: "ESPNFC training preview",
          note: "Internal review only until licensing is confirmed.",
          status: "review-needed-social-preview",
        },
        evidence: [
          {
            source: "x:trusted-football-media",
            label: "ESPNFC: Pedri and Frenkie shape Barcelona's derby plan.",
            excerpt: "Selection questions now define Barcelona's current week.",
            publishedAt: "2026-04-09T18:00:00.000Z",
            image: {
              src: "https://images.example.com/pedri-frenkie-training.jpg",
              alt: "Pedri and Frenkie de Jong in training before the derby.",
              href: "https://x.com/ESPNFC/status/123",
              source: "x:trusted-football-media",
              label: "ESPNFC training preview",
              note: "Internal review only until licensing is confirmed.",
              status: "review-needed-social-preview",
            },
          },
        ],
      },
    ],
    themeClusters: [
      {
        id: "cluster-espanyol-selection",
        title: "Espanyol selection squeeze",
        theme: "Pedri, Frenkie, and derby rotation overlap across chatter and trusted reporting.",
        itemCount: 4,
        sourceFamilies: ["x", "reddit", "official"],
        sourceRoles: ["official", "trusted", "chatter"],
        officialEvidenceCount: 1,
        trustedEvidenceCount: 2,
        chatterEvidenceCount: 1,
        referenceEvidenceCount: 0,
        crossPlatform: true,
        healthLabel: "cross-platform-confirmed",
        reviewHint: "Good overlap, but keep checking for late training confirmation.",
        candidateIds: ["espanyol-between-the-legs"],
        candidateTitles: ["Espanyol between the legs is the real selection test"],
        topTokens: ["espanyol", "pedri", "frenkie"],
        imageStatus: "review-needed-social-preview",
        imageLead: {
          src: "https://images.example.com/pedri-frenkie-training.jpg",
          alt: "Pedri and Frenkie de Jong in training before the derby.",
          href: "https://x.com/ESPNFC/status/123",
          source: "x:trusted-football-media",
          label: "ESPNFC training preview",
          note: "Internal review only until licensing is confirmed.",
          status: "review-needed-social-preview",
        },
        representativeEvidence: [
          {
            source: "x:trusted-football-media",
            label: "ESPNFC: Pedri and Frenkie shape Barcelona's derby plan.",
            excerpt: "Selection questions now define Barcelona's current week.",
            publishedAt: "2026-04-09T18:00:00.000Z",
            image: {
              src: "https://images.example.com/pedri-frenkie-training.jpg",
              alt: "Pedri and Frenkie de Jong in training before the derby.",
              href: "https://x.com/ESPNFC/status/123",
              source: "x:trusted-football-media",
              label: "ESPNFC training preview",
              note: "Internal review only until licensing is confirmed.",
              status: "review-needed-social-preview",
            },
          },
        ],
      },
    ],
    calibrationPrompts: [
      {
        id: "prompt-source-gap",
        kind: "source-quality-gap",
        priority: "medium",
        title: "Retune quiet source before the next scout run",
        summary: "One source fetched items but added no usable evidence to any candidate or cluster.",
        action: "If the source stays quiet next run, swap the query or cut it from the mix.",
        candidateIds: [],
        clusterIds: [],
        sourceIds: ["web:espn-standings"],
      },
    ],
    sourceExpansionSuggestions: [
      {
        id: "suggestion-femeni-depth",
        title: "Add another trusted Femení corroboration lane",
        summary: "Women's themes are visible, but the trusted bench can still be deeper.",
        rationale: "A second non-club corroboration lane reduces overreliance on Reddit when Femení chatter spikes.",
        suggestedSourceFamilies: ["x", "news"],
        exampleTargets: ["from:TheAthleticFC (Aitana OR Alexia OR Bayern OR Femeni)"],
        relatedPromptIds: ["prompt-source-gap"],
      },
    ],
    qualitySummary: {
      headline: "Most live themes are corroborated, but one source lane is quiet and Femení still wants deeper trusted backup.",
      evidenceCount: 8,
      sourceCount: 5,
      healthySourceCount: 5,
      candidateCount: 1,
      clusterCount: 1,
      crossPlatformClusterCount: 1,
      trustedBackedCandidateCount: 1,
      chatterHeavyCandidateCount: 0,
      womenCoverageGapCount: 1,
      weakSourceCount: 1,
    },
    coverageSummary: {
      tracks: [
        {
          id: "women",
          label: "Femení",
          candidateCount: 1,
          officialEvidenceCount: 1,
          trustedEvidenceCount: 0,
          chatterEvidenceCount: 1,
          note: "A Femení angle is live, but another trusted confirmation lane would help.",
        },
      ],
      weakSpots: ["One source lane produced context but no usable Barça evidence this run."],
    },
    imageSummary: {
      candidateLeadCount: 1,
      clusterLeadCount: 1,
      reviewNeededCount: 1,
      replacementNeededCount: 0,
      missingCount: 0,
    },
    feedbackSummary: {
      entryCount: 1,
      targetTypeCounts: {
        candidate: 1,
        cluster: 0,
        "source-lane": 0,
        "general-strategy-note": 0,
      },
      verdictCounts: {
        promising: 1,
      },
      recentEntries: [
        {
          id: "feedback-1",
          targetType: "candidate",
          targetId: "espanyol-between-the-legs",
          targetLabel: "Espanyol between the legs is the real selection test",
          verdict: "promising",
          note: "Keep the derby framing, but ground it in concrete lineup choices.",
          createdAt: "2026-04-09T19:05:00.000Z",
        },
      ],
    },
    sources: [],
  })),
}));

import NewsroomSignalsPage from "@/app/newsroom/signals/page";

describe("newsroom signals calibration page", () => {
  it("renders scout calibration sections for operators", async () => {
    const page = await NewsroomSignalsPage();
    render(page);

    expect(screen.getByRole("heading", { name: "Signals" })).toBeInTheDocument();
    expect(screen.getByText(/Most live themes are corroborated/i)).toBeInTheDocument();
    expect(screen.getAllByText("Espanyol between the legs is the real selection test").length).toBeGreaterThan(0);
    expect(screen.getByText("Ready to pitch")).toBeInTheDocument();
    expect(screen.getAllByText("Espanyol selection squeeze").length).toBeGreaterThan(0);
    expect(screen.getByText("Confirmed across lanes")).toBeInTheDocument();
    expect(screen.getByText("Retune quiet source before the next scout run")).toBeInTheDocument();
    expect(screen.getByText("Add another trusted Femení corroboration lane")).toBeInTheDocument();
    expect(screen.getByText("Operator Feedback")).toBeInTheDocument();
    expect(screen.getByText(/keep the derby framing, but ground it in concrete lineup choices/i)).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /pedri and frenkie de jong in training before the derby/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/review needed social preview/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/image leads available/i)).toBeInTheDocument();
  });
});
