"use client";

import { useEffect, useMemo, useState } from "react";

type Person = {
  id: number;
  name: string;
  linkedin: string;
  instagram: string;
  summary?: string;
  interests?: string[];
  hobbies?: string[];
  professional_interests?: string[];
  compatibility_factors?: string[];
};

type RankedPerson = Person & {
  score: number;
  reasons: string[];
};

export default function RankingsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPeople() {
      try {
       const response = await fetch("/people.json");
const seededPeople: Person[] = await response.json();

const savedPeople: Person[] = JSON.parse(
  localStorage.getItem("agentic_dating_people") || "[]"
);

const combinedPeople = [
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

setPeople(combinedPeople);

if (combinedPeople.length > 0) {
  setSelectedPerson(combinedPeople[0]);
}
      } catch (error) {
        console.error("Failed to load people:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPeople();
  }, []);

  const rankings = useMemo<RankedPerson[]>(() => {
    if (!selectedPerson) return [];

    const otherPeople = people.filter(
      (person) => person.id !== selectedPerson.id
    );

    return otherPeople
      .map((person) => {
        /*
         * Temporary deterministic demo score.
         *
         * This will later be replaced by cached Gemini
         * agent-to-agent compatibility results.
         */
        const score =
          70 +
          ((selectedPerson.id * 13 +
            person.id * 7 +
            selectedPerson.name.length +
            person.name.length) %
            27);

        const reasons: string[] = [];

        if (
          selectedPerson.interests?.length &&
          person.interests?.length
        ) {
          const sharedInterests = selectedPerson.interests.filter((item) =>
            person.interests?.some(
              (other) =>
                other.toLowerCase() === item.toLowerCase()
            )
          );

          if (sharedInterests.length > 0) {
            reasons.push(
              `${sharedInterests.length} shared interest${
                sharedInterests.length > 1 ? "s" : ""
              }`
            );
          }
        }

        if (
          selectedPerson.hobbies?.length &&
          person.hobbies?.length
        ) {
          const sharedHobbies = selectedPerson.hobbies.filter((item) =>
            person.hobbies?.some(
              (other) =>
                other.toLowerCase() === item.toLowerCase()
            )
          );

          if (sharedHobbies.length > 0) {
            reasons.push(
              `${sharedHobbies.length} shared ${
                sharedHobbies.length > 1 ? "hobbies" : "hobby"
              }`
            );
          }
        }

        if (
          selectedPerson.professional_interests?.length &&
          person.professional_interests?.length
        ) {
          reasons.push("Professional interest overlap");
        }

        if (reasons.length === 0) {
          reasons.push("Profile signals available for agent comparison");
        }

        return {
          ...person,
          score,
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [people, selectedPerson]);

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
            className="text-xl font-bold tracking-tight"
          >
            Agentic Dating
          </a>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="/"
              className="text-gray-400 hover:text-white transition"
            >
              Add Person
            </a>

            <a
              href="/date"
              className="text-gray-400 hover:text-white transition"
            >
              Agent Date
            </a>

            <a
              href="/rankings"
              className="text-white font-medium"
            >
              Rankings
            </a>
          </div>
        </nav>

        {/* HEADER */}

        <section className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] text-gray-500 mb-4">
            AI AGENT MATCHMAKING
          </p>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Agent Match Rankings
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mt-5">
            Select a person and see how their AI dating agent ranks
            the other agents in the network.
          </p>
        </section>

        {/* AGENT SELECTOR */}

        <section className="max-w-3xl mx-auto mb-12">
          <div className="border border-gray-800 rounded-2xl bg-gray-950 p-6">

            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              Select an agent
            </p>

            <select
              value={selectedPerson?.id ?? ""}
              onChange={(event) => {
                const person = people.find(
                  (item) => item.id === Number(event.target.value)
                );

                if (person) {
                  setSelectedPerson(person);
                }
              }}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-gray-400"
            >
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>

            {selectedPerson && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <p className="text-2xl font-semibold">
                    {selectedPerson.name}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Viewing this agent's match rankings
                  </p>
                </div>

                <div className="flex gap-4 text-sm">
                  <a
                    href={selectedPerson.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    LinkedIn ↗
                  </a>

                  <a
                    href={selectedPerson.instagram}
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
        </section>

        {/* EXPLANATION */}

        <div className="max-w-3xl mx-auto mb-8">
          <div className="border border-gray-800 rounded-xl px-5 py-4 bg-gray-950">
            <p className="text-sm text-gray-400">
              <span className="text-white font-medium">
                Compatibility score
              </span>{" "}
              represents how strongly the selected agent matches
              another agent based on profile signals such as interests,
              hobbies, professional interests and conversation topics.
            </p>
          </div>
        </div>

        {/* RANKINGS */}

        <section className="max-w-4xl mx-auto">

          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Match results
              </p>

              <h2 className="text-2xl font-semibold mt-1">
                {selectedPerson?.name}'s Top Matches
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {rankings.length} agents
            </p>
          </div>

          <div className="space-y-4">

            {rankings.map((person, index) => (
              <div
                key={person.id}
                className="border border-gray-800 rounded-2xl bg-gray-950 p-6 hover:border-gray-600 transition"
              >

                <div className="flex flex-col md:flex-row md:items-center gap-6">

                  {/* RANK */}

                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-semibold shrink-0">
                    #{index + 1}
                  </div>

                  {/* PERSON */}

                  <div className="flex-1">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>
                        <h3 className="text-xl font-semibold">
                          {person.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          AI Dating Agent
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-3xl font-bold">
                          {person.score}%
                        </div>

                        <p className="text-xs text-gray-500">
                          compatibility
                        </p>
                      </div>

                    </div>

                    {/* REASONS */}

                    <div className="flex flex-wrap gap-2 mt-5">
                      {person.reasons.map((reason, reasonIndex) => (
                        <span
                          key={reasonIndex}
                          className="px-3 py-1.5 rounded-full border border-gray-800 bg-black text-sm text-gray-400"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>

                    {/* LINKS + DATE */}

                    <div className="flex flex-wrap items-center gap-5 mt-6">

                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        LinkedIn ↗
                      </a>

                      <a
                        href={person.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-400 hover:text-pink-300 text-sm"
                      >
                        Instagram ↗
                      </a>

                      <a
                        href={`/date?person=${selectedPerson?.id}&match=${person.id}`}
                        className="ml-auto px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        Start Agent Date →
                      </a>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>

        {/* DEMO NOTE */}

        <div className="max-w-4xl mx-auto mt-10 text-center">
          <p className="text-xs text-gray-600">
            Demo rankings are based on the current seeded agent dataset.
            Pairwise Gemini compatibility results can be cached for the
            final demonstration.
          </p>
        </div>

      </div>
    </main>
  );
}