"use client";

import { useEffect, useState } from "react";

type Person = {
  id: number;
  name: string;
  linkedin: string;
  instagram: string;
};

type RankedPerson = Person & {
  score: number;
  reasons: string[];
};

export default function RankingsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/people.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load people.json");
        }

        return res.json();
      })
      .then((data: Person[]) => {
        setPeople(data);
      })
      .catch((error) => {
        console.error("Failed to load people:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const rankedPeople: RankedPerson[] = people
    .map((person) => ({
      ...person,

      // Demo compatibility calculation.
      // Replace with live agent-generated scores later.
      score: 96 - ((person.id * 7 + person.name.length * 3) % 31),

      reasons: [
        "Shared interests and lifestyle signals",
        "Professional and creative interests",
        "Potential conversation compatibility",
      ],
    }))
    .sort((a, b) => b.score - a.score);

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
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              color: "#ffffff",
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
              color: "#5eead4",
              textDecoration: "none",
              background: "#10201e",
              border: "1px solid #5eead4",
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
              color: "#ffffff",
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

        {/* Header */}
        <section style={{ marginBottom: "40px" }}>
          <div
            style={{
              color: "#888888",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Agentic Dating
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 64px)",
              lineHeight: 1.05,
              margin: "12px 0 18px",
              fontWeight: 700,
            }}
          >
            Agent Match Rankings
          </h1>

          <p
            style={{
              color: "#999999",
              fontSize: "17px",
              lineHeight: 1.6,
              maxWidth: "750px",
              margin: 0,
            }}
          >
            25 public profiles available to the dating-agent system.
            Agents compare interests, professional signals and
            conversation compatibility.
          </p>
        </section>

        {/* System status */}
        <section
          style={{
            background: "#111111",
            border: "1px solid #262626",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              color: "#999999",
              fontSize: "13px",
              letterSpacing: "1.5px",
              marginBottom: "14px",
            }}
          >
            ACTIVE MATCHING SYSTEM
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
            <div
              style={{
                fontSize: "21px",
                fontWeight: 700,
              }}
            >
              {people.length} Person Agents
            </div>

            <div
              style={{
                color: "#5eead4",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Agent-to-agent compatibility engine
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: "#111111",
              border: "1px solid #222222",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
              color: "#999999",
            }}
          >
            Loading person agents...
          </div>
        )}

        {/* Empty state */}
        {!loading && people.length === 0 && (
          <div
            style={{
              background: "#111111",
              border: "1px solid #222222",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
              color: "#999999",
            }}
          >
            No person agents found.
          </div>
        )}

        {/* Rankings */}
        {!loading && rankedPeople.length > 0 && (
          <section
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            {rankedPeople.map((person, index) => (
              <article
                key={person.id}
                style={{
                  background: index === 0 ? "#151515" : "#101010",
                  border:
                    index === 0
                      ? "1px solid #5eead4"
                      : "1px solid #242424",
                  borderRadius: "18px",
                  padding: "22px",
                  transition: "transform 0.2s ease",
                }}
              >
                {/* Person header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    {/* Rank */}
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        minWidth: "46px",
                        borderRadius: "50%",
                        background:
                          index === 0 ? "#5eead4" : "#242424",
                        color: index === 0 ? "#000000" : "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      #{index + 1}
                    </div>

                    {/* Name */}
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: 600,
                        }}
                      >
                        {person.name}
                      </h2>

                      <div
                        style={{
                          marginTop: "6px",
                          color: "#666666",
                          fontSize: "13px",
                        }}
                      >
                        Person Agent #{person.id}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: 700,
                        color: "#5eead4",
                      }}
                    >
                      {person.score}%
                    </div>

                    <div
                      style={{
                        color: "#666666",
                        fontSize: "12px",
                      }}
                    >
                      compatibility
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {person.reasons.map((reason) => (
                    <span
                      key={reason}
                      style={{
                        background: "#1b1b1b",
                        border: "1px solid #292929",
                        borderRadius: "20px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        color: "#aaaaaa",
                      }}
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                {/* Source links */}
                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    fontSize: "13px",
                  }}
                >
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#60a5fa",
                      textDecoration: "none",
                    }}
                  >
                    LinkedIn ↗
                  </a>

                  <a
                    href={person.instagram}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#f472b6",
                      textDecoration: "none",
                    }}
                  >
                    Instagram ↗
                  </a>
                </div>

                {/* Agent date button */}
                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <a
                    href="/date"
                    style={{
                      display: "inline-block",
                      background: "#5eead4",
                      color: "#000000",
                      textDecoration: "none",
                      padding: "11px 17px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Start Agent Date →
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}