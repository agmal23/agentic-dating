"use client";

import { useState } from "react";

type Analysis = {
  same_person: boolean;
  identity_confidence: "high" | "medium" | "low";
  identity_evidence: string[];
  name: string;
  summary: string;
  interests: string[];
  hobbies: string[];
  professional_interests: string[];
  skills: string[];
  lifestyle_signals: string[];
  personality_signals: string[];
  conversation_topics: string[];
  dating_preferences: string[];
  compatibility_factors: string[];
  unknowns: string[];
};

export default function HomePage() {
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [instagramData, setInstagramData] =
    useState<any>(null);

  const [linkedinData, setLinkedinData] =
    useState<any>(null);

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  async function buildAgent() {
    setError("");
    setAnalysis(null);
    setInstagramData(null);
    setLinkedinData(null);

    if (!instagramUrl.trim()) {
      setError("Please enter an Instagram profile URL.");
      return;
    }

    if (!linkedinUrl.trim()) {
      setError("Please enter a LinkedIn profile URL.");
      return;
    }

    if (!instagramUrl.includes("instagram.com")) {
      setError("Please enter a valid Instagram URL.");
      return;
    }

    if (!linkedinUrl.includes("linkedin.com/in/")) {
      setError(
        "Please enter a public LinkedIn profile URL."
      );
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------
      // 1. Scrape Instagram
      // -----------------------------------

      const instagramResponse = await fetch(
        "/api/scrape-instagram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: instagramUrl,
          }),
        }
      );

      const instagramResult =
        await instagramResponse.json();

      if (
        !instagramResponse.ok ||
        !instagramResult.success
      ) {
        throw new Error(
          instagramResult.error ||
            "Failed to read Instagram profile."
        );
      }

      setInstagramData(instagramResult.data);

      // -----------------------------------
      // 2. Scrape LinkedIn
      // -----------------------------------

      const linkedinResponse = await fetch(
        "/api/scrape-linkedin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: linkedinUrl,
          }),
        }
      );

      const linkedinResult =
        await linkedinResponse.json();

      if (
        !linkedinResponse.ok ||
        !linkedinResult.success
      ) {
        throw new Error(
          linkedinResult.error ||
            "Failed to read LinkedIn profile."
        );
      }

      setLinkedinData(linkedinResult.data);

      // -----------------------------------
      // 3. Create Person Agent
      // -----------------------------------

      const analysisResponse = await fetch(
        "/api/analyze-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  instagram: instagramResult.data,
  linkedin: linkedinResult.data,
  instagramUrl,
  linkedinUrl,
}),
        }
      );

      const analysisResult =
        await analysisResponse.json();

      if (
        !analysisResponse.ok ||
        !analysisResult.success
      ) {
        throw new Error(
          analysisResult.error ||
            "Failed to analyze the profile."
        );
      }

      const result: Analysis =
        analysisResult.analysis;

      // -----------------------------------
      // 4. Verify identity
      // -----------------------------------

      if (!result.same_person) {
        throw new Error(
          "The Instagram and LinkedIn profiles do not appear to belong to the same person."
        );
      }

     setAnalysis(result);

const newPerson = {
  id: Date.now(),
  name: result.name || "New Person",
  linkedin: linkedinUrl,
  instagram: instagramUrl,
  summary: result.summary,
  interests: result.interests,
  hobbies: result.hobbies,
  professional_interests: result.professional_interests,
  skills: result.skills,
  lifestyle_signals: result.lifestyle_signals,
  personality_signals: result.personality_signals,
  conversation_topics: result.conversation_topics,
  dating_preferences: result.dating_preferences,
  compatibility_factors: result.compatibility_factors,
};

const existingPeople = JSON.parse(
  localStorage.getItem("agentic_dating_people") || "[]"
);

const alreadyExists = existingPeople.some(
  (person: any) =>
    person.linkedin === linkedinUrl ||
    person.instagram === instagramUrl
);

if (!alreadyExists) {
  localStorage.setItem(
    "agentic_dating_people",
    JSON.stringify([
      ...existingPeople,
      newPerson,
    ])
  );
}
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Something went wrong while building the Person Agent."
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
        color: "#fff",
        padding: "30px 20px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Navigation */}

        <nav
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "55px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
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
              color: "#fff",
              textDecoration: "none",
              background: "#1b1b1b",
              border: "1px solid #333",
              padding: "10px 16px",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          >
            Watch Agents Date
          </a>
        </nav>

        {/* Hero */}

        <section
          style={{
            marginBottom: "45px",
          }}
        >
          <div
            style={{
              color: "#888",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Agentic Dating
          </div>

          <h1
            style={{
              fontSize: "clamp(44px, 7vw, 72px)",
              lineHeight: 1,
              margin: "15px 0",
              maxWidth: "800px",
            }}
          >
            Turn a person
            <br />
            into an agent.
          </h1>

          <p
            style={{
              color: "#999",
              fontSize: "18px",
              lineHeight: 1.7,
              maxWidth: "720px",
            }}
          >
            Give the system a person's public Instagram and
            LinkedIn profiles. The system reads the public
            information and creates an AI Person Agent that
            can understand interests, professional signals
            and conversation topics.
          </p>
        </section>

        {/* Input Card */}

        <section
          style={{
            background: "#111",
            border: "1px solid #292929",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              color: "#5eead4",
              fontSize: "12px",
              letterSpacing: "1.5px",
              marginBottom: "20px",
            }}
          >
            CREATE PERSON AGENT
          </div>

          {/* Instagram */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#ccc",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Public Instagram Profile
            </label>

            <input
              type="url"
              value={instagramUrl}
              onChange={(e) =>
                setInstagramUrl(e.target.value)
              }
              placeholder="https://www.instagram.com/username/"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#080808",
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "15px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* LinkedIn */}

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                color: "#ccc",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Public LinkedIn Profile
            </label>

            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) =>
                setLinkedinUrl(e.target.value)
              }
              placeholder="https://www.linkedin.com/in/username/"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#080808",
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "15px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          {/* Build button */}

          <button
            onClick={buildAgent}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              background: loading
                ? "#333"
                : "#5eead4",
              color: loading ? "#888" : "#000",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Building Person Agent..."
              : "Build Person Agent →"}
          </button>
        </section>

        {/* Error */}

        {error && (
          <div
            style={{
              background: "#241414",
              border: "1px solid #5c2929",
              color: "#ff8a8a",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "30px",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {/* Processing */}

        {loading && (
          <div
            style={{
              background: "#111",
              border: "1px solid #292929",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "center",
              color: "#999",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              🤖
            </div>

            Reading public profiles and creating your
            Person Agent...
          </div>
        )}

        {/* Person Agent Result */}

        {analysis && (
          <section>
            {/* Identity */}

            <div
              style={{
                background: "#111",
                border: "1px solid #5eead4",
                borderRadius: "20px",
                padding: "28px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  color: "#5eead4",
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                }}
              >
                🤖 PERSON AGENT
              </div>

              <h2
                style={{
                  fontSize: "32px",
                  margin: "0 0 10px",
                }}
              >
                {analysis.name || "Person Agent"}
              </h2>

              <div
                style={{
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                Identity confidence:{" "}
                {analysis.identity_confidence}
              </div>

              <p
                style={{
                  color: "#bbb",
                  lineHeight: 1.7,
                  fontSize: "16px",
                }}
              >
                {analysis.summary}
              </p>
            </div>

            {/* Profile Sources */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "14px",
                marginBottom: "18px",
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
                    color: "#f472b6",
                    fontSize: "12px",
                    letterSpacing: "1.5px",
                    marginBottom: "10px",
                  }}
                >
                  INSTAGRAM
                </div>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#f472b6",
                    textDecoration: "none",
                    wordBreak: "break-all",
                  }}
                >
                  Open Instagram ↗
                </a>
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
                    color: "#60a5fa",
                    fontSize: "12px",
                    letterSpacing: "1.5px",
                    marginBottom: "10px",
                  }}
                >
                  LINKEDIN
                </div>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#60a5fa",
                    textDecoration: "none",
                    wordBreak: "break-all",
                  }}
                >
                  Open LinkedIn ↗
                </a>
              </div>
            </div>

            {/* Analysis Grid */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "14px",
              }}
            >
              <AnalysisCard
                title="Interests"
                items={analysis.interests}
              />

              <AnalysisCard
                title="Hobbies"
                items={analysis.hobbies}
              />

              <AnalysisCard
                title="Professional Interests"
                items={analysis.professional_interests}
              />

              <AnalysisCard
                title="Skills"
                items={analysis.skills}
              />

              <AnalysisCard
                title="Lifestyle Signals"
                items={analysis.lifestyle_signals}
              />

              <AnalysisCard
                title="Personality Signals"
                items={analysis.personality_signals}
              />

              <AnalysisCard
                title="Conversation Topics"
                items={analysis.conversation_topics}
              />

              <AnalysisCard
                title="Compatibility Factors"
                items={analysis.compatibility_factors}
              />
            </div>

            {/* Continue */}

            <div
              style={{
                marginTop: "25px",
                background: "#10201e",
                border: "1px solid #28524d",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  color: "#5eead4",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Person Agent Ready
              </div>

              <p
                style={{
                  color: "#aaa",
                  lineHeight: 1.6,
                  margin: "0 0 18px",
                }}
              >
                This agent can now be compared against the
                other people in the dating-agent system.
              </p>

              <a
                href="/rankings"
                style={{
                  display: "inline-block",
                  background: "#5eead4",
                  color: "#000",
                  textDecoration: "none",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontWeight: 700,
                }}
              >
                View Agent Rankings →
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function AnalysisCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #292929",
        borderRadius: "16px",
        padding: "22px",
      }}
    >
      <h3
        style={{
          margin: "0 0 15px",
          fontSize: "17px",
        }}
      >
        {title}
      </h3>

      {items && items.length > 0 ? (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {items.map((item, index) => (
            <span
              key={index}
              style={{
                background: "#1b1b1b",
                border: "1px solid #333",
                borderRadius: "20px",
                padding: "8px 11px",
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span
          style={{
            color: "#666",
            fontSize: "13px",
          }}
        >
          No public information available
        </span>
      )}
    </div>
  );
}