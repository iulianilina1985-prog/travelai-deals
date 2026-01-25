import React from "react";
import { useParams } from "react-router-dom";
import { GUIDES_MONTH_2026 } from "../../data/guides";
import { GUIDES_CONTENT } from "../../data/guidesContent";

const TravelGuidePage = () => {
    const { slug } = useParams();

    // găsim ghidul după slug
    const guide = GUIDES_MONTH_2026.find(
        (g) => g.slug === slug
    );

    const content = GUIDES_CONTENT[slug];

    if (!guide || !content) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-2xl font-bold">Guide not found</h1>
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto px-6 py-16">
            {/* TITLU */}
            <h1 className="text-3xl font-bold mb-6 text-center">
                {guide.title}
            </h1>

            {/* IMAGINE */}
            <img
                src={guide.image}
                alt={guide.title}
                className="w-full rounded-xl mb-10"
            />

            {/* INTRO */}
            <p className="text-lg text-gray-700 mb-10">
                {content.intro}
            </p>

            {/* SECTIUNI */}
            {content.sections.map((section, index) => (
                <section key={index} className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">
                        {section.title}
                    </h2>

                    {section.text && (
                        <p className="text-gray-700 mb-3">
                            {section.text}
                        </p>
                    )}

                    {section.list && (
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            {section.list.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}

            {/* CONCLUZIE */}
            <p className="mt-10 font-medium text-gray-800">
                {content.conclusion}
            </p>
        </article>
    );
};

export default TravelGuidePage;
