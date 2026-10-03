"use client";

import { useEffect, useState } from "react";

type Person = {
  id: number;
  name: string;
  linkedin: string;
  instagram: string;
  summary?: string;
  interests?: string[];
  hobbies?: string[];
  professional_interests?: string[];
  skills?: string[];
  lifestyle_signals?: string[];
  personality_signals?: string[];
  conversation_topics?: string[];
  dating_preferences?: string[];
  compatibility_factors?: string[];
};

type DateResult = {
  conversation: {
    agent: string;
    message: string;
  }[];
  result: {
    compatibility_score: number;
    decision: string;
    shared_interests: string[];
    compatibility_reasons: string[];
    potential_challenges: string[];
    summary: string;
  };
};

export default function AgentDatePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [personA, setPersonA] = useState<Person | null>(null);
  const [personB, setPersonB] = useState<Person | null>(null);

  const [loading, setLoading] = useState(true);
  const [dating, setDating] = useState(false);
  const [result, setResult] = useState<DateResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPeople() {
      try {
       const response = await fetch("/people.json");
const seededPeople: Person[] = await response.json();

const savedPeople: Person[] = JSON.parse(
  localStorage.getItem("agentic_dating_people") || "[]"
);

const data: Person[] = [
  ...seededPeople,
  ...savedPeople.filter(
    (saved) =>
      !seededPeople.some(
        (seeded) =>
          seeded.linkedin === saved.linkedin ||
          seeded.instagram === saved.instagram
      )
  ),
];

setPeople(data);

        const params = new URLSearchParams(window.location.search);

        const personId = params.get("person");
        const matchId = params.get("match");

        let selectedA: Person | undefined;
        let selectedB: Person | undefined;

        if (personId) {
          selectedA = data.find(
            (person) => String(person.id) === String(personId)
          );
        }

        if (matchId) {
          selectedB = data.find(
            (person) => String(person.id) === String(matchId)
          );
        }

        if (!selectedA) {
          selectedA = data[0];
        }

        if (!selectedB) {
          selectedB = data.find(
            (person) => person.id !== selectedA?.id
          );
        }

        setPersonA(selectedA || null);
        setPersonB(selectedB || null);
      } catch (error) {
        console.error(error);
        setError("Failed to load agents.");
      } finally {
        setLoading(false);
      }
    }

    loadPeople();
  }, []);

  async function startAgentDate() {
    if (!personA || !personB) {
      setError("Please select two agents.");
      return;
    }

    if (personA.id === personB.id) {
      setError("Please select two different agents.");
      return;
    }

    setDating(true);
    setResult(null);
    setError("");

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
          data.error || "Agent date failed."
        );
      }

      setResult(data.date);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.message ||
          "The agents could not complete the date."
      );
    } finally {
      setDating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading agents...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* NAVIGATION */}

        <nav className="flex items-center justify-between mb-16">
          <a
            href="/"
            className="text-xl font-bold"
          >
            Agentic Dating
          </a>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="/"
              className="text-gray-400 hover:text-white"
            >
              Add Person
            </a>

            <a
              href="/date"
              className="text-white font-medium"
            >
              Agent Date
            </a>

            <a
              href="/rankings"
              className="text-gray-400 hover:text-white"
            >
              Rankings
            </a>
          </div>
        </nav>

        {/* HEADER */}

        <section className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] text-gray-500 mb-4">
            AGENT-TO-AGENT DATING
          </p>

          <h1 className="text-4xl md:text-6xl font-bold">
            Two agents. One date.
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mt-5">
            AI agents representing real people meet, talk,
            discover shared interests and evaluate compatibility.
          </p>
        </section>

        {/* TWO AGENTS */}

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

          {/* PERSON A */}

          <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950">

            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Agent A
            </p>

            <select
              value={personA?.id ?? ""}
              onChange={(event) => {
                const selected = people.find(
                  (person) =>
                    person.id === Number(event.target.value)
                );

                if (selected) {
                  setPersonA(selected);
                  setResult(null);
                }
              }}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white"
            >
              {people.map((person) => (
                <option
                  key={person.id}
                  value={person.id}
                >
                  {person.name}
                </option>
              ))}
            </select>

            {personA && (
              <div className="mt-6">

                <h2 className="text-2xl font-semibold">
                  {personA.name}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  AI agent representing {personA.name}
                </p>

                <div className="flex gap-4 mt-5 text-sm">

                  <a
                    href={personA.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    LinkedIn ↗
                  </a>

                  <a
                    href={personA.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-300"
                  >
                    Instagram ↗
                  </a>

                </div>
              </div>
            )}
          </div>

          {/* PERSON B */}

          <div className="border border-gray-800 rounded-2xl p-6 bg-gray-950">

            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Agent B
            </p>

            <select
              value={personB?.id ?? ""}
              onChange={(event) => {
                const selected = people.find(
                  (person) =>
                    person.id === Number(event.target.value)
                );

                if (selected) {
                  setPersonB(selected);
                  setResult(null);
                }
              }}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white"
            >
              {people.map((person) => (
                <option
                  key={person.id}
                  value={person.id}
                >
                  {person.name}
                </option>
              ))}
            </select>

            {personB && (
              <div className="mt-6">

                <h2 className="text-2xl font-semibold">
                  {personB.name}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  AI agent representing {personB.name}
                </p>

                <div className="flex gap-4 mt-5 text-sm">

                  <a
                    href={personB.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    LinkedIn ↗
                  </a>

                  <a
                    href={personB.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-300"
                  >
                    Instagram ↗
                  </a>

                </div>
              </div>
            )}
          </div>

        </div>

        {/* VS */}

        <div className="text-center my-8">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-700 text-gray-400 font-semibold">
            VS
          </span>
        </div>

        {/* START DATE */}

        <div className="text-center">

          <button
            onClick={startAgentDate}
            disabled={dating}
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
          >
            {dating
              ? "Agents are dating..."
              : "Start Agent Date →"}
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="max-w-3xl mx-auto mt-8 border border-red-900 bg-red-950/30 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        {/* DATE RESULT */}

        {result && personA && personB && (
          <section className="max-w-4xl mx-auto mt-16">

            {/* RESULT HEADER */}

            <div className="text-center mb-12">

              <p className="text-xs tracking-[0.2em] text-gray-500">
                AGENT DATE COMPLETE
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                {personA.name}
                <span className="text-gray-600 mx-3">
                  ×
                </span>
                {personB.name}
              </h2>

              <div className="mt-8">

                <div className="text-6xl font-bold">
                  {result.result.compatibility_score}%
                </div>

                <p className="text-gray-500 mt-2">
                  Agent compatibility
                </p>

              </div>
            </div>

            {/* CONVERSATION */}

            <div className="mb-12">

              <h3 className="text-2xl font-semibold mb-6">
                Agent Conversation
              </h3>

              <div className="space-y-4">

                {result.conversation.map(
                  (message, index) => {

                    const isAgentA =
                      message.agent
                        .toLowerCase()
                        .includes(
                          personA.name.toLowerCase()
                        );

                    return (
                      <div
                        key={index}
                        className={`border border-gray-800 rounded-2xl p-5 ${
                          isAgentA
                            ? "bg-gray-900 mr-8"
                            : "bg-gray-950 ml-8"
                        }`}
                      >

                        <p className="text-xs text-gray-500 mb-2">
                          {message.agent}
                        </p>

                        <p className="text-gray-200 leading-relaxed">
                          {message.message}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>
            </div>

            {/* ANALYSIS */}

            <div className="border border-gray-800 rounded-2xl p-6 md:p-8">

              <h3 className="text-2xl font-semibold mb-6">
                Compatibility Analysis
              </h3>

              <p className="text-gray-300 leading-relaxed mb-8">
                {result.result.summary}
              </p>

              {/* SHARED INTERESTS */}

              {result.result.shared_interests?.length > 0 && (
                <div className="mb-7">

                  <p className="text-sm text-gray-500 mb-3">
                    Shared interests
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {result.result.shared_interests.map(
                      (interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full border border-gray-800 bg-black text-sm text-gray-300"
                        >
                          {interest}
                        </span>
                      )
                    )}

                  </div>
                </div>
              )}

              {/* REASONS */}

              {result.result.compatibility_reasons?.length > 0 && (
                <div className="mb-7">

                  <p className="text-sm text-gray-500 mb-3">
                    Compatibility factors
                  </p>

                  <ul className="space-y-2 text-gray-300">

                    {result.result.compatibility_reasons.map(
                      (reason, index) => (
                        <li key={index}>
                          • {reason}
                        </li>
                      )
                    )}

                  </ul>
                </div>
              )}

              {/* CHALLENGES */}

              {result.result.potential_challenges?.length > 0 && (
                <div className="mb-7">

                  <p className="text-sm text-gray-500 mb-3">
                    Potential differences
                  </p>

                  <ul className="space-y-2 text-gray-400">

                    {result.result.potential_challenges.map(
                      (challenge, index) => (
                        <li key={index}>
                          • {challenge}
                        </li>
                      )
                    )}

                  </ul>
                </div>
              )}

              {/* DECISION */}

              <div className="border-t border-gray-800 pt-6">

                <p className="text-sm text-gray-500 mb-2">
                  Agent decision
                </p>

                <p className="text-xl font-semibold capitalize">
                  {result.result.decision}
                </p>

              </div>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}