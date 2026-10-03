"use client";

import { useState } from "react";

const personA = {
  name: "Fadi Jiyad VC",
  summary:
    "Influencer marketing professional interested in cycling, MMA, boxing, football, cinema, acting, filmmaking and travel.",
  interests: [
    "Long-distance cycling",
    "MMA",
    "Boxing",
    "Brazil football",
    "Cinema",
    "Acting",
    "Filmmaking",
    "Travel",
  ],
  professional_interests: [
    "Influencer marketing",
    "Brand partnerships",
    "Creator marketing",
    "Campaigns",
    "Content creation",
  ],
  hobbies: [
    "Cycling",
    "Boxing",
    "Cinema",
    "Travel",
  ],
  compatibility_factors: [
    "Active lifestyle",
    "Creative interests",
    "Travel",
    "Content creation",
  ],
};

const personB = {
  name: "Alex",
  summary:
    "Creative and technology-oriented person interested in active lifestyle, travel, cinema and content creation.",
  interests: [
    "Fitness",
    "Travel",
    "Cinema",
    "Technology",
    "Content creation",
  ],
  professional_interests: [
    "Technology",
    "Creative projects",
    "Content creation",
  ],
  hobbies: [
    "Fitness",
    "Travel",
    "Movies",
  ],
  compatibility_factors: [
    "Active lifestyle",
    "Travel",
    "Creative interests",
    "Curiosity",
  ],
};

type ConversationMessage = {
  agent: string;
  message: string;
};

type DatingResult = {
  compatibility_score: number;
  decision: "continue" | "maybe" | "pass";
  shared_interests: string[];
  compatibility_reasons: string[];
  potential_challenges: string[];
  summary: string;
};

type DatingResponse = {
  conversation: ConversationMessage[];
  result: DatingResult;
};

export default function DatePage() {
  const [date, setDate] = useState<DatingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startDate() {
    setLoading(true);
    setError("");
    setDate(null);

    try {
      const response = await fetch("/api/date-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personA,
          personB,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Dating agents temporarily unavailable"
        );
      }

      setDate(data.date);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Something went wrong while starting the date."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#ffffff",
        padding: "30px 20px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          <a
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              background: "#1b1b1b",
              border: "1px solid #333",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          >
            Add Person
          </a>

          <a
            href="/rankings"
            style={{
              color: "#fff",
              textDecoration: "none",
              background: "#1b1b1b",
              border: "1px solid #333",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          >
            Rankings
          </a>

          <a
            href="/date"
            style={{
              color: "#5eead4",
              textDecoration: "none",
              background: "#10201e",
              border: "1px solid #5eead4",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          >
            Agent Date
          </a>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "35px" }}>
          <div
            style={{
              color: "#888",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Live Agent Interaction
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 60px)",
              margin: "12px 0",
              lineHeight: 1.05,
            }}
          >
            Agents Are Dating
          </h1>

          <p
            style={{
              color: "#999",
              fontSize: "17px",
              lineHeight: 1.6,
              maxWidth: "700px",
            }}
          >
            Two autonomous person agents analyze each other's profiles,
            start a conversation, discover shared interests and decide
            whether they would continue dating.
          </p>
        </div>

        {/* People */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #292929",
              borderRadius: "16px",
              padding: "22px",
            }}
          >
            <div
              style={{
                color: "#5eead4",
                fontSize: "12px",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              PERSON A
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              {personA.name}
            </h2>

            <div
              style={{
                color: "#888",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Person Agent
            </div>
          </div>

          <div
            style={{
              background: "#111",
              border: "1px solid #292929",
              borderRadius: "16px",
              padding: "22px",
            }}
          >
            <div
              style={{
                color: "#f472b6",
                fontSize: "12px",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              PERSON B
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              {personB.name}
            </h2>

            <div
              style={{
                color: "#888",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Person Agent
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={startDate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px 20px",
            border: "none",
            borderRadius: "12px",
            background: loading ? "#333" : "#5eead4",
            color: loading ? "#888" : "#000",
            fontWeight: 700,
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "30px",
          }}
        >
          {loading
            ? "Agents are talking..."
            : "Start Agent-to-Agent Date →"}
        </button>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#241414",
              border: "1px solid #5c2929",
              color: "#ff8a8a",
              padding: "18px",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#888",
              background: "#111",
              borderRadius: "16px",
              border: "1px solid #222",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              🤖 ↔ 🤖
            </div>

            <div>
              Person agents are analyzing each other and having a
              conversation...
            </div>
          </div>
        )}

        {/* Conversation */}
        {date && (
          <section>
            <h2
              style={{
                fontSize: "26px",
                marginBottom: "18px",
              }}
            >
              Agent Conversation
            </h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {date.conversation?.map((message, index) => {
                const isA =
                  message.agent.toLowerCase().includes("person a");

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: isA
                        ? "flex-start"
                        : "flex-end",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        background: isA ? "#151515" : "#10201e",
                        border: isA
                          ? "1px solid #292929"
                          : "1px solid #28524d",
                        borderRadius: "16px",
                        padding: "16px 18px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: isA
                            ? "#5eead4"
                            : "#f472b6",
                          marginBottom: "7px",
                          fontWeight: 600,
                        }}
                      >
                        {message.agent}
                      </div>

                      <div
                        style={{
                          color: "#ddd",
                          lineHeight: 1.6,
                          fontSize: "15px",
                        }}
                      >
                        {message.message}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result */}
            {date.result && (
              <div
                style={{
                  marginTop: "30px",
                  background: "#111",
                  border: "1px solid #292929",
                  borderRadius: "18px",
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    color: "#888",
                    fontSize: "12px",
                    letterSpacing: "1.5px",
                    marginBottom: "10px",
                  }}
                >
                  AGENT COMPATIBILITY RESULT
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "48px",
                        fontWeight: 700,
                        color: "#5eead4",
                      }}
                    >
                      {date.result.compatibility_score}%
                    </div>

                    <div
                      style={{
                        color: "#999",
                        marginTop: "4px",
                        textTransform: "capitalize",
                      }}
                    >
                      Decision: {date.result.decision}
                    </div>
                  </div>
                </div>

                {date.result.summary && (
                  <p
                    style={{
                      color: "#bbb",
                      lineHeight: 1.7,
                      marginTop: "22px",
                    }}
                  >
                    {date.result.summary}
                  </p>
                )}

                {date.result.shared_interests?.length > 0 && (
                  <div style={{ marginTop: "22px" }}>
                    <h3 style={{ fontSize: "16px" }}>
                      Shared Interests
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "10px",
                      }}
                    >
                      {date.result.shared_interests.map(
                        (interest, index) => (
                          <span
                            key={index}
                            style={{
                              background: "#1b1b1b",
                              border: "1px solid #333",
                              padding: "8px 12px",
                              borderRadius: "20px",
                              color: "#bbb",
                              fontSize: "13px",
                            }}
                          >
                            {interest}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {date.result.compatibility_reasons?.length > 0 && (
                  <div style={{ marginTop: "22px" }}>
                    <h3 style={{ fontSize: "16px" }}>
                      Compatibility Reasons
                    </h3>

                    <ul
                      style={{
                        color: "#aaa",
                        lineHeight: 1.7,
                        paddingLeft: "20px",
                      }}
                    >
                      {date.result.compatibility_reasons.map(
                        (reason, index) => (
                          <li key={index}>{reason}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {date.result.potential_challenges?.length > 0 && (
                  <div style={{ marginTop: "22px" }}>
                    <h3 style={{ fontSize: "16px" }}>
                      Potential Challenges
                    </h3>

                    <ul
                      style={{
                        color: "#888",
                        lineHeight: 1.7,
                        paddingLeft: "20px",
                      }}
                    >
                      {date.result.potential_challenges.map(
                        (challenge, index) => (
                          <li key={index}>{challenge}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}